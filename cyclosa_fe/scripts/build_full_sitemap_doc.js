const fs = require('fs');
const path = require('path');

const pageListContent = fs.readFileSync(path.join(__dirname, '../../ba/page-list.md'), 'utf8');
const lines = pageListContent.split('\n');

const modules = {};
let currentModule = '5.0. XÁC THỰC (AUTH)';

for (const line of lines) {
  const modHeader = line.match(/^###\s+(5\.\d+\..+)/);
  if (modHeader) {
    currentModule = modHeader[1].trim();
    if (!modules[currentModule]) modules[currentModule] = [];
    continue;
  }
  const parts = line.split('|').map(p => p.trim());
  if (parts.length >= 7 && /^[A-Z]+-\d+[a-z]?$/.test(parts[1])) {
    const id = parts[1];
    let route = parts[2].replace(/`/g, '').trim();
    let title = parts[3].replace(/`/g, '').trim();
    let desc = parts[4].replace(/`/g, '').trim();
    let api = parts[5].replace(/`/g, '').trim();
    let permission = parts[6].replace(/`/g, '').trim();
    
    if (!modules[currentModule]) modules[currentModule] = [];
    modules[currentModule].push({ id, route, title, desc, api, permission });
  }
}

let totalScreens = 0;
for (const m in modules) {
  totalScreens += modules[m].length;
}

let md = `# SƠ ĐỒ ĐIỀU HƯỚNG TOÀN DIỆN — CYCLOSA ENTERPRISE HRM
> **Phiên bản:** 1.0 (Tháng 10/2026)  
> **Phạm vi:** Toàn bộ ${totalScreens}/${totalScreens} màn hình nghiệp vụ chuẩn hóa 100% theo tài liệu \`ba/page-list.md\`.

---

## 1. Kiến Trúc Điều Hướng Tổng Thể (Architecture Overview)

Hệ thống CYCLOSA được thiết kế theo mô hình **Unified Workspace with Role-Based Routing**, trong đó tất cả người dùng truy cập chung một ứng dụng, nhưng cây menu và sơ đồ điều hướng được thích ứng theo vai trò (\`GET /auth/me/permissions\`).

\`\`\`mermaid
graph TD
    Root["CYCLOSA Platform (Port 3000)"] --> PublicPortal["1. Cổng Công Khai (Public Portal)"]
    Root --> ESSPortal["2. Cổng Nhân Viên Tự Phục Vụ (ESS Portal - /me/*)"]
    Root --> CoreHR["3. Cổng Nghiệp Vụ Nhân Sự (Core HR Portal)"]
    Root --> AdminPortal["4. Cổng Quản Trị Hệ Thống (System Admin Portal)"]

    PublicPortal --> Login["Đăng nhập /auth/login"]
    PublicPortal --> Careers["Cổng việc làm /careers"]
    PublicPortal --> JobDetail["Ứng tuyển /careers/:slug"]
    PublicPortal --> Activate["Kích hoạt tài khoản /auth/activate"]
    PublicPortal --> ErrorPages["Trang trạng thái /403, /404, /session-expired"]

    ESSPortal --> MeProfile["Hồ sơ & Khuôn mặt /me/profile, /me/face-enrollment"]
    ESSPortal --> MeAttendance["Chấm công GPS & Giải trình /me/attendance/*"]
    ESSPortal --> MeLeave["Quỹ phép & Đơn nghỉ /me/leave/*"]
    ESSPortal --> MePayroll["Phiếu lương & Tạm ứng /me/payslips, /me/salary-advances"]
    ESSPortal --> MeContract["Ký hợp đồng số /me/contracts, /me/contracts/sign/:id"]
    ESSPortal --> MeWorkplace["Bàn làm việc & Phòng họp /me/workplace"]

    CoreHR --> Org["Cơ cấu & Mô phỏng /organization/*, /org-simulations/*"]
    CoreHR --> Rec["Tuyển dụng ATS & Phỏng vấn /recruitment/*"]
    CoreHR --> Emp["Quản lý Nhân sự & Hồ sơ /employees/*"]
    CoreHR --> Onb["Kế hoạch Hội nhập /onboarding/*"]
    CoreHR --> Con["Quản trị Hợp đồng /contracts/*"]
    CoreHR --> Att["Chấm công & Ca kíp /attendance/*"]
    CoreHR --> Pay["Tính lương & Chi trả /payroll/*"]
    CoreHR --> Perf["Đánh giá KPI & Hiệu suất /performance/*"]
    CoreHR --> Wp["Không gian làm việc & Bản đồ /workplace/*"]

    AdminPortal --> Rbac["Tài khoản & Phân quyền /admin/users, /admin/roles"]
    AdminPortal --> WfDef["Thiết kế Quy trình duyệt /admin/workflow-definitions"]
    AdminPortal --> SysCfg["Cấu hình tham số /admin/system-configs"]
    AdminPortal --> Audit["Nhật ký kiểm toán /audit-logs"]
\`\`\`

---

## 2. Sơ Đồ Luồng Nghiệp Vụ Xuyên Suốt (End-to-End Workflows)

### 2.1. Luồng Tuyển Dụng — Hội Nhập — Ký Hợp Đồng (Recruitment to Onboarding Flow)

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor U as Ứng viên (Public)
    actor HR as Chuyên viên Tuyển dụng
    actor M as Quản lý bộ phận
    actor NV as Nhân viên mới (ESS)

    U->>U: Xem việc làm tại /careers
    U->>U: Nộp hồ sơ tại /careers/:slug
    HR->>HR: Tiếp nhận & Phân loại tại /recruitment/candidates
    HR->>HR: Quản lý Kanban Pipeline tại /recruitment/openings/:id/pipeline
    HR->>M: Điều phối lịch phỏng vấn tại /recruitment/interviews
    M->>M: Chấm điểm phỏng vấn tại /interviews/:id/scorecard
    HR->>HR: Lập thư mời nhận việc tại /recruitment/offers/new
    HR->>HR: Chuyển ứng viên thành nhân viên tại /employees/new
    HR->>HR: Gán kế hoạch hội nhập tại /onboarding/plans
    NV->>NV: Đăng nhập & xem lộ trình hội nhập tại /me/onboarding
    HR->>HR: Xuất hợp đồng từ mẫu tại /contracts/new
    NV->>NV: Nhận thông báo & ký số OTP tại /me/contracts/sign/:id
\`\`\`

---

### 2.2. Luồng Chấm Công — Nghỉ Phép — Tính Lương (Time & Payroll Lifecycle)

\`\`\`mermaid
graph LR
    subgraph ESS["Cổng Nhân Viên (/me)"]
        CheckIn["Chấm công Camera AI<br>/me/attendance/check-in"]
        LeaveReq["Gửi đơn xin nghỉ phép<br>/me/leave/new"]
        PayslipView["Xem phiếu lương mật<br>/me/payslips"]
    end

    subgraph HR_ATT["Bộ phận Chấm công"]
        AttTimesheet["Tổng hợp Bảng công<br>/attendance/timesheets"]
        AttExplain["Duyệt giải trình công<br>/attendance/logs"]
    end

    subgraph HR_PAY["Bộ phận Tiền lương"]
        PayrollRun["Tính bảng lương kỳ<br>/payroll/sheets/:periodId"]
        PayrollDisb["Chi trả & Phát hành phiếu<br>/payroll/advances"]
    end

    CheckIn --> AttTimesheet
    LeaveReq --> AttTimesheet
    AttExplain --> AttTimesheet
    AttTimesheet --> PayrollRun
    PayrollRun --> PayrollDisb
    PayrollDisb --> PayslipView
\`\`\`

---

## 3. Danh Mục Chi Tiết Toàn Bộ ${totalScreens} Màn Hình Chuẩn Hóa Theo 22 Phân Hệ
`;

let sectionIndex = 1;
for (const modTitle in modules) {
  const screenList = modules[modTitle];
  md += `\n### 3.${sectionIndex}. ${modTitle} (${screenList.length} màn hình)\n\n`;
  md += `| ID | Route | Tên màn hình (Loại) | Chức năng chính | Quyền hạn |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;
  for (const s of screenList) {
    md += `| **${s.id}** | \`${s.route}\` | ${s.title} | ${s.desc} | \`${s.permission}\` |\n`;
  }
  sectionIndex++;
}

md += `\n---

## 4. Cấu Trúc Menu Sidebar Phân Cấp (Hierarchical Sidebar Tree)

\`\`\`text
Trang chủ (/dashboard)
├── Hộp thư phê duyệt (/workflows/pending)
├── Yêu cầu đã gửi (/workflows/submitted)
└── Thông báo hệ thống (/notifications)

CÁ NHÂN (ESS)
├── Hồ sơ của tôi (/me/profile)
├── Đăng ký khuôn mặt AI (/me/face-enrollment)
├── Chấm công trực tuyến (/me/attendance/check-in)
├── Lịch sử chấm công (/me/attendance)
├── Nghỉ phép cá nhân (/me/leave)
├── Phiếu lương điện tử (/me/payslips)
├── Hợp đồng lao động (/me/contracts)
├── Lộ trình hội nhập (/me/onboarding)
├── Không gian làm việc (/me/workplace)
└── Tài sản được cấp (/me/assets)

QUẢN LÝ NHÂN SỰ
├── Cơ cấu tổ chức (/organization/departments)
│   ├── Công ty thành viên (/organization/companies)
│   ├── Vùng & Chi nhánh (/organization/regions-branches)
│   ├── Chức danh & Cấp bậc (/organization/job-titles)
│   └── Trung tâm chi phí (/organization/cost-centers)
├── Mô phỏng tái cơ cấu (/org-simulations)
├── Hồ sơ nhân viên (/employees)
├── Tuyển dụng & ATS (/recruitment/openings)
│   ├── Đề xuất tuyển dụng (/recruitment/requests)
│   ├── Quản lý ứng viên (/recruitment/candidates)
│   ├── Lịch phỏng vấn (/recruitment/interviews)
│   └── Ngân hàng tài năng (/recruitment/talent-pool)
├── Kế hoạch hội nhập (/onboarding/plans)
└── Hợp đồng lao động (/contracts)

CÔNG & LƯƠNG
├── Bảng tổng hợp công (/attendance/timesheets)
│   ├── Tổng quan điểm danh (/attendance/overview)
│   ├── Quản lý ca làm việc (/attendance/shifts)
│   └── Lịch làm việc (/attendance/logs)
├── Quản lý nghỉ phép (/leave/requests)
└── Quản lý tiền lương (/payroll/dashboard)
    ├── Bảng lương định kỳ (/payroll/periods)
    ├── Cấu phần lương (/payroll/components)
    └── Quản lý tạm ứng (/payroll/advances)

HIỆU SUẤT & PHÁT TRIỂN
├── Đánh giá hiệu suất (/performance/cycles)
│   └── Hiệu chuẩn Bell-curve (/performance/calibration)
├── Khung năng lực & Kỹ năng (/career/skills-matrix)
├── Quy hoạch kế cận (/career/succession)
├── Khen thưởng & Kỷ luật (/rewards)
└── Thủ tục thôi việc (/offboarding)

TIỆN ÍCH & VĂN PHÒNG
├── Quản lý không gian (/workplace/dashboard)
├── Bản đồ chỗ ngồi (/workplace/map)
└── Quản trị tài sản (/assets)

HỆ THỐNG & PHÁP CHẾ
├── Tuân thủ pháp lý (/compliance/dashboard)
├── Trợ lý trí tuệ nhân tạo (/ai/chat)
├── Quản lý người dùng (/admin/users)
├── Ma trận phân quyền (/admin/roles)
├── Thiết kế quy trình duyệt (/admin/workflow-definitions)
└── Nhật ký kiểm toán (/audit-logs)
\`\`\`
`;

fs.writeFileSync(path.join(__dirname, '../docs/navigation-sitemap.md'), md, 'utf8');
console.log('Successfully wrote full navigation-sitemap.md with', totalScreens, 'screens!');
