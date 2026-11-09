import type { TemplateKind } from "../types/contract.types";

export interface TemplatePreset {
  kind: TemplateKind;
  defaultTitle: string;
  defaultCodePrefix: string;
  html: string;
  sampleData: Record<string, unknown>;
}

export const TEMPLATE_PRESETS: Record<TemplateKind, TemplatePreset> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. HỢP ĐỒNG LAO ĐỘNG CHÍNH THỨC
  // ═══════════════════════════════════════════════════════════════════════════
  LABOR_CONTRACT: {
    kind: "LABOR_CONTRACT",
    defaultTitle: "Hợp đồng lao động chính thức",
    defaultCodePrefix: "HDLD-CHINHTHUC",
    sampleData: {
      company_name: "TẬP ĐOÀN CÔNG NGHỆ CYCLOSA",
      company_address: "Tầng 12 & 14, Tòa nhà Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội",
      company_tax_code: "0108999888",
      representative_name: "Ông Lê Hoàng Nam",
      representative_title: "Tổng Giám Đốc",
      employee_name: "NGUYỄN VĂN AN",
      employee_code: "NV00125",
      dob: "15/08/1996",
      gender: "Nam",
      id_card_no: "001096001234",
      id_card_date: "10/05/2021",
      id_card_place: "Cục CSQLHC về TTXH",
      permanent_address: "Số 18, Ngõ 42 Phố Triều Khúc, Quận Thanh Xuân, TP. Hà Nội",
      current_address: "Phòng 1002, Tòa Roman Plaza, Tố Hữu, Nam Từ Liêm, Hà Nội",
      phone: "0901 234 567",
      email: "an.nguyen@cyclosa.vn",
      contract_number: "HĐLĐ-2026-00125",
      job_title: "Kỹ sư giải pháp đám mây cao cấp (Cloud Solution Architect)",
      department_name: "Trung tâm Nghiên cứu & Phát triển Sản phẩm (R&D)",
      start_date: "01/11/2026",
      end_date: "31/10/2028",
      sign_date: "25/10/2026",
      base_salary: "35,000,000 VNĐ",
      salary_in_words: "Ba mươi lăm triệu đồng chẵn",
      allowance_amount: "3,000,000 VNĐ",
      work_location: "Trụ sở chính CYCLOSA, Keangnam Landmark 72, Hà Nội",
      working_time_description: "Từ Thứ Hai đến Thứ Sáu (8h30 - 17h30), nghỉ Thứ Bảy và Chủ Nhật",
    },
    html: `
<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #111; max-width: 780px; margin: 0 auto; padding: 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h4 style="margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
    <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</p>
    <p style="margin: 0; font-size: 12px;">-----------------------</p>
    <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic;">Số: {{contract_number}} / CYCLOSA-HR</p>
    <h2 style="margin-top: 24px; margin-bottom: 4px; text-transform: uppercase; font-size: 20px; font-weight: bold; color: #1e3a8a;">HỢP ĐỒNG LAO ĐỘNG</h2>
    <p style="margin: 0; font-size: 12px; font-style: italic;">(Ban hành theo Bộ luật Lao động số 45/2019/QH14)</p>
  </div>

  <p style="font-size: 13px;">Hôm nay, ngày {{sign_date}}, tại trụ sở Công ty, chúng tôi gồm các bên:</p>

  <div style="background-color: #f8fafc; border-left: 3px solid #1e3a8a; padding: 12px; margin-bottom: 16px;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #1e3a8a; font-weight: bold;">BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG</h4>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Tên doanh nghiệp:</strong> {{company_name}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Địa chỉ trụ sở:</strong> {{company_address}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Mã số doanh nghiệp / MST:</strong> {{company_tax_code}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Đại diện bởi:</strong> {{representative_name}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Chức vụ:</strong> {{representative_title}}</p>
  </div>

  <div style="background-color: #f8fafc; border-left: 3px solid #1e3a8a; padding: 12px; margin-bottom: 20px;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #1e3a8a; font-weight: bold;">BÊN B: NGƯỜI LAO ĐỘNG</h4>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Họ và tên:</strong> {{employee_name}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Mã nhân viên:</strong> {{employee_code}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Ngày sinh:</strong> {{dob}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Giới tính:</strong> {{gender}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Số CCCD:</strong> {{id_card_no}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Cấp ngày:</strong> {{id_card_date}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Nơi cấp:</strong> {{id_card_place}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Địa chỉ thường trú:</strong> {{permanent_address}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Nơi ở hiện tại:</strong> {{current_address}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Điện thoại:</strong> {{phone}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Email cá nhân:</strong> {{email}}</p>
  </div>

  <h4 style="font-size: 14px; color: #1e3a8a; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 1: THỜI HẠN VÀ CÔNG VIỆC HỢP ĐỒNG</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Loại hợp đồng lao động: Theo thỏa thuận quy định.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Thời hạn hợp đồng: Từ ngày <strong>{{start_date}}</strong> đến ngày <strong>{{end_date}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">3. Bộ phận làm việc: {{department_name}}.</p>
  <p style="font-size: 13px; margin: 4px 0;">4. Chức danh chuyên môn: <strong>{{job_title}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">5. Địa điểm làm việc: {{work_location}}.</p>

  <h4 style="font-size: 14px; color: #1e3a8a; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 2: CHẾ ĐỘ LƯƠNG VÀ ĐÃI NGỘ</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Mức lương cơ bản thỏa thuận: <strong>{{base_salary}}</strong> / tháng (Bằng chữ: <em>{{salary_in_words}}</em>).</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Phụ cấp công việc thỏa thuận: <strong>{{allowance_amount}}</strong> / tháng.</p>
  <p style="font-size: 13px; margin: 4px 0;">3. Thời giờ làm việc: {{working_time_description}}.</p>
  <p style="font-size: 13px; margin: 4px 0;">4. Hình thức trả lương: Chuyển khoản qua tài khoản ngân hàng định kỳ vào ngày 05 hàng tháng.</p>

  <h4 style="font-size: 14px; color: #1e3a8a; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 3: HIỆU LỰC THI HÀNH & KÝ KẾT</h4>
  <p style="font-size: 13px; margin: 4px 0;">Hợp đồng được lập dưới dạng chứng từ điện tử có giá trị pháp lý tương đương bản giấy theo Luật Giao dịch Điện tử số 20/2023/QH15.</p>

  <div style="margin-top: 45px; display: flex; justify-content: space-between; page-break-inside: avoid;">
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN NGƯỜI LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Ký tên)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{employee_name}}</p>
    </div>
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN BÊN SỬ DỤNG LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Đóng dấu)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{representative_name}}</p>
      <p style="margin: 2px 0 0 0; font-size: 12px; font-style: italic;">{{representative_title}}</p>
    </div>
  </div>
</div>
`.trim(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HỢP ĐỒNG THỬ VIỆC
  // ═══════════════════════════════════════════════════════════════════════════
  PROBATION_CONTRACT: {
    kind: "PROBATION_CONTRACT",
    defaultTitle: "Hợp đồng thử việc",
    defaultCodePrefix: "HDLD-THUVIEC",
    sampleData: {
      company_name: "TẬP ĐOÀN CÔNG NGHỆ CYCLOSA",
      company_address: "Tầng 12 & 14, Tòa nhà Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội",
      company_tax_code: "0108999888",
      representative_name: "Ông Lê Hoàng Nam",
      representative_title: "Tổng Giám Đốc",
      employee_name: "TRẦN THỊ MAI",
      employee_code: "NV00188",
      dob: "20/04/1998",
      gender: "Nữ",
      id_card_no: "034198005678",
      id_card_date: "15/09/2022",
      id_card_place: "Cục CSQLHC về TTXH",
      permanent_address: "Số 25 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, TP. Hà Nội",
      current_address: "Số 12 Ngõ 80 Chùa Láng, Đống Đa, Hà Nội",
      phone: "0912 345 678",
      email: "mai.tran@cyclosa.vn",
      contract_number: "HĐTV-2026-00045",
      job_title: "Chuyên viên Phân tích Nghiệp vụ (Business Analyst)",
      department_name: "Khối Phát triển Giải pháp Doanh nghiệp",
      probation_period: "60 ngày (02 tháng)",
      start_date: "15/11/2026",
      end_date: "14/01/2027",
      sign_date: "10/11/2026",
      official_salary: "20,000,000 VNĐ",
      probation_salary_rate: "85%",
      probation_salary: "17,000,000 VNĐ",
      probation_salary_words: "Mười bảy triệu đồng chẵn",
      work_location: "Trụ sở chính CYCLOSA, Hà Nội",
    },
    html: `
<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #111; max-width: 780px; margin: 0 auto; padding: 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h4 style="margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
    <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</p>
    <p style="margin: 0; font-size: 12px;">-----------------------</p>
    <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic;">Số: {{contract_number}} / CYCLOSA-TV</p>
    <h2 style="margin-top: 24px; margin-bottom: 4px; text-transform: uppercase; font-size: 20px; font-weight: bold; color: #b45309;">HỢP ĐỒNG THỬ VIỆC</h2>
    <p style="margin: 0; font-size: 12px; font-style: italic;">(Căn cứ theo Điều 24, Điều 25 & 26 Bộ luật Lao động số 45/2019/QH14)</p>
  </div>

  <p style="font-size: 13px;">Hôm nay, ngày {{sign_date}}, chúng tôi gồm có:</p>

  <div style="background-color: #fffbeb; border-left: 3px solid #b45309; padding: 12px; margin-bottom: 16px;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #b45309; font-weight: bold;">BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG</h4>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Tên doanh nghiệp:</strong> {{company_name}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Địa chỉ:</strong> {{company_address}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Đại diện bởi:</strong> {{representative_name}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Chức danh:</strong> {{representative_title}}</p>
  </div>

  <div style="background-color: #fffbeb; border-left: 3px solid #b45309; padding: 12px; margin-bottom: 20px;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #b45309; font-weight: bold;">BÊN B: NGƯỜI LAO ĐỘNG</h4>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Họ và tên:</strong> {{employee_name}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Mã nhân viên:</strong> {{employee_code}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Ngày sinh:</strong> {{dob}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Số CCCD:</strong> {{id_card_no}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Địa chỉ thường trú:</strong> {{permanent_address}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Điện thoại:</strong> {{phone}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Email:</strong> {{email}}</p>
  </div>

  <h4 style="font-size: 14px; color: #b45309; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 1: CÔNG VIỆC VÀ THỜI GIAN THỬ VIỆC</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Chức danh công việc: <strong>{{job_title}}</strong> tại bộ phận: <strong>{{department_name}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Thời gian thử việc: <strong>{{probation_period}}</strong>, bắt đầu từ ngày <strong>{{start_date}}</strong> đến hết ngày <strong>{{end_date}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">3. Địa điểm làm việc: {{work_location}}.</p>

  <h4 style="font-size: 14px; color: #b45309; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 2: TIỀN LƯƠNG TRONG THỜI GIAN THỬ VIỆC</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Mức lương áp dụng cho vị trí khi chính thức là: <strong>{{official_salary}}</strong> / tháng.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Tiền lương thử việc: Bên B được hưởng <strong>{{probation_salary_rate}}</strong> mức lương chính thức, tương đương: <strong>{{probation_salary}}</strong> / tháng (Bằng chữ: <em>{{probation_salary_words}}</em>).</p>

  <h4 style="font-size: 14px; color: #b45309; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 3: KẾT THÚC THỜI GIAN THỬ VIỆC</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Khi hết thời hạn thử việc, nếu Bên B hoàn thành đạt yêu cầu công việc thì Bên A có trách nhiệm ký kết Hợp đồng lao động chính thức.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Trong thời gian thử việc, mỗi bên đều có quyền hủy bỏ thỏa thuận thử việc mà không cần báo trước và không phải bồi thường nếu công việc làm thử không đạt yêu cầu đã thỏa thuận.</p>

  <div style="margin-top: 45px; display: flex; justify-content: space-between; page-break-inside: avoid;">
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">NGƯỜI THỬ VIỆC</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Ký tên)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{employee_name}}</p>
    </div>
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Đóng dấu)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{representative_name}}</p>
    </div>
  </div>
</div>
`.trim(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. PHỤ LỤC ĐIỀU CHỈNH HỢP ĐỒNG (TĂNG LƯƠNG / ĐỔI VỊ TRÍ)
  // ═══════════════════════════════════════════════════════════════════════════
  APPENDIX_ADJUSTMENT: {
    kind: "APPENDIX_ADJUSTMENT",
    defaultTitle: "Phụ lục điều chỉnh hợp đồng",
    defaultCodePrefix: "PLHD-DIEUCHINH",
    sampleData: {
      company_name: "TẬP ĐOÀN CÔNG NGHỆ CYCLOSA",
      representative_name: "Ông Lê Hoàng Nam",
      representative_title: "Tổng Giám Đốc",
      employee_name: "NGUYỄN VĂN AN",
      employee_code: "NV00125",
      id_card_no: "001096001234",
      appendix_number: "PLHĐ-2027-01",
      original_contract_no: "HĐLĐ-2026-00125",
      original_contract_date: "25/10/2026",
      adjustment_reason: "Thăng chức lên Trưởng nhóm Giải pháp Cloud và xét tăng lương định kỳ năm 2027",
      effective_date: "01/01/2027",
      old_job_title: "Kỹ sư giải pháp đám mây cao cấp",
      new_job_title: "Trưởng nhóm Giải pháp Đám mây (Cloud Solutions Lead)",
      old_salary: "35,000,000 VNĐ",
      new_salary: "42,000,000 VNĐ",
      new_salary_words: "Bốn mươi hai triệu đồng chẵn",
      sign_date: "20/12/2026",
    },
    html: `
<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #111; max-width: 780px; margin: 0 auto; padding: 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h4 style="margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
    <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</p>
    <p style="margin: 0; font-size: 12px;">-----------------------</p>
    <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic;">Số: {{appendix_number}} / PLHĐ-CYCLOSA</p>
    <h2 style="margin-top: 24px; margin-bottom: 4px; text-transform: uppercase; font-size: 20px; font-weight: bold; color: #4338ca;">PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG</h2>
    <p style="margin: 0; font-size: 12px; font-style: italic;">(Kèm theo Hợp đồng lao động số: {{original_contract_no}} ký ngày {{original_contract_date}})</p>
  </div>

  <p style="font-size: 13px;">Hôm nay, ngày {{sign_date}}, chúng tôi gồm có:</p>
  <p style="font-size: 13px; margin: 4px 0;"><strong>BÊN A: {{company_name}}</strong> - Đại diện: {{representative_name}} ({{representative_title}})</p>
  <p style="font-size: 13px; margin: 4px 0;"><strong>BÊN B: Ông/Bà {{employee_name}}</strong> - Mã NV: {{employee_code}} - Số CCCD: {{id_card_no}}</p>

  <p style="font-size: 13px; margin: 12px 0 8px 0;">Căn cứ nhu cầu sản xuất kinh doanh và sự thỏa thuận của hai bên, chúng tôi thống nhất ký kết Phụ lục Hợp đồng lao động với các nội dung sau:</p>

  <div style="background-color: #eef2ff; border-left: 3px solid #4338ca; padding: 12px; margin-bottom: 16px;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #4338ca; font-weight: bold;">ĐIỀU 1: NỘI DUNG ĐIỀU CHỈNH</h4>
    <p style="font-size: 13px; margin: 4px 0;"><strong>Lý do điều chỉnh:</strong> {{adjustment_reason}}.</p>
    <p style="font-size: 13px; margin: 4px 0;"><strong>1. Về chức danh công việc:</strong></p>
    <p style="font-size: 13px; margin: 2px 0 2px 16px;">- Cũ: {{old_job_title}}</p>
    <p style="font-size: 13px; margin: 2px 0 6px 16px;">- Mới: <strong>{{new_job_title}}</strong></p>
    <p style="font-size: 13px; margin: 4px 0;"><strong>2. Về mức lương cơ bản:</strong></p>
    <p style="font-size: 13px; margin: 2px 0 2px 16px;">- Cũ: {{old_salary}} / tháng</p>
    <p style="font-size: 13px; margin: 2px 0 6px 16px;">- Mới: <strong>{{new_salary}}</strong> / tháng (Bằng chữ: <em>{{new_salary_words}}</em>)</p>
  </div>

  <h4 style="font-size: 14px; color: #4338ca; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 2: HIỆU LỰC THI HÀNH</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Phụ lục này có hiệu lực áp dụng kể từ ngày <strong>{{effective_date}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Phụ lục này là một bộ phận không thể tách rời của Hợp đồng lao động số {{original_contract_no}}. Các điều khoản khác trong Hợp đồng gốc không bị sửa đổi bởi Phụ lục này vẫn giữ nguyên giá trị pháp lý.</p>

  <div style="margin-top: 45px; display: flex; justify-content: space-between; page-break-inside: avoid;">
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN NGƯỜI LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Ký tên)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{employee_name}}</p>
    </div>
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN BÊN SỬ DỤNG LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Đóng dấu)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{representative_name}}</p>
    </div>
  </div>
</div>
`.trim(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. THỎA THUẬN CỘNG TÁC VIÊN (DỊCH VỤ / KHOÁN VIỆC)
  // ═══════════════════════════════════════════════════════════════════════════
  COLLABORATOR_AGREEMENT: {
    kind: "COLLABORATOR_AGREEMENT",
    defaultTitle: "Thỏa thuận cộng tác viên",
    defaultCodePrefix: "TTH-CTV",
    sampleData: {
      company_name: "TẬP ĐOÀN CÔNG NGHỆ CYCLOSA",
      company_address: "Keangnam Landmark 72, Mễ Trì, Hà Nội",
      representative_name: "Ông Lê Hoàng Nam",
      collaborator_name: "PHẠM MINH ĐỨC",
      dob: "12/10/1993",
      id_card_no: "001093009988",
      tax_code: "8392100234",
      phone: "0988 777 666",
      email: "duc.pham@external.vn",
      contract_number: "TTH-CTV-2026-089",
      collaboration_scope: "Cung cấp dịch vụ tư vấn kỹ thuật kiến trúc Microservices và kiểm thử tải hệ thống Core HRM",
      start_date: "01/11/2026",
      end_date: "31/01/2027",
      remuneration_amount: "15,000,000 VNĐ",
      remuneration_words: "Mười lăm triệu đồng chẵn",
      bank_account_no: "19034567890012",
      bank_name: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)",
      sign_date: "28/10/2026",
    },
    html: `
<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #111; max-width: 780px; margin: 0 auto; padding: 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h4 style="margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
    <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</p>
    <p style="margin: 0; font-size: 12px;">-----------------------</p>
    <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic;">Số: {{contract_number}} / TTH-CTV</p>
    <h2 style="margin-top: 24px; margin-bottom: 4px; text-transform: uppercase; font-size: 20px; font-weight: bold; color: #047857;">THỎA THUẬN CỘNG TÁC VIÊN</h2>
    <p style="margin: 0; font-size: 12px; font-style: italic;">(Căn cứ theo quy định của Bộ luật Dân sự số 91/2015/QH13)</p>
  </div>

  <p style="font-size: 13px;">Hôm nay, ngày {{sign_date}}, chúng tôi gồm các bên:</p>
  <p style="font-size: 13px; margin: 4px 0;"><strong>BÊN GIAO VIỆC (BÊN A): {{company_name}}</strong> - Đại diện: {{representative_name}}</p>
  <p style="font-size: 13px; margin: 4px 0;"><strong>BÊN CỘNG TÁC (BÊN B): Ông/Bà {{collaborator_name}}</strong> - CCCD: {{id_card_no}} - MST: {{tax_code}}</p>

  <h4 style="font-size: 14px; color: #047857; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 1: PHẠM VI CỘNG TÁC & THỜI HẠN</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Nội dung dịch vụ khoán việc: <strong>{{collaboration_scope}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Thời hạn cộng tác: Từ ngày <strong>{{start_date}}</strong> đến ngày <strong>{{end_date}}</strong>.</p>

  <h4 style="font-size: 14px; color: #047857; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 2: THÙ LAO VÀ PHƯƠNG THỨC THANH TOÁN</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Mức thù lao cộng tác thỏa thuận: <strong>{{remuneration_amount}}</strong> / tháng (Bằng chữ: <em>{{remuneration_words}}</em>).</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Bên A có trách nhiệm khấu trừ 10% thuế TNCN trước khi chi trả theo Luật Thuế Thu nhập cá nhân hiện hành.</p>
  <p style="font-size: 13px; margin: 4px 0;">3. Hình thức chuyển khoản: STK <strong>{{bank_account_no}}</strong> tại <strong>{{bank_name}}</strong>.</p>

  <h4 style="font-size: 14px; color: #047857; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 3: BẢN CHẤT QUAN HỆ HỢP TÁC</h4>
  <p style="font-size: 13px; margin: 4px 0;">Hai bên thống nhất đây là quan hệ hợp đồng dịch vụ dân sự độc lập, không cấu thành quan hệ lao động trực thuộc và không thuộc diện áp dụng bảo hiểm xã hội bắt buộc.</p>

  <div style="margin-top: 45px; display: flex; justify-content: space-between; page-break-inside: avoid;">
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">CỘNG TÁC VIÊN</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Ký tên)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{collaborator_name}}</p>
    </div>
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN BÊN GIAO VIỆC</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Đóng dấu)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{representative_name}}</p>
    </div>
  </div>
</div>
`.trim(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. BIÊN BẢN THANH LÝ HỢP ĐỒNG LAO ĐỘNG
  // ═══════════════════════════════════════════════════════════════════════════
  TERMINATION_AGREEMENT: {
    kind: "TERMINATION_AGREEMENT",
    defaultTitle: "Biên bản thanh lý hợp đồng",
    defaultCodePrefix: "BBTL-CHAMDUT",
    sampleData: {
      company_name: "TẬP ĐOÀN CÔNG NGHỆ CYCLOSA",
      representative_name: "Ông Lê Hoàng Nam",
      representative_title: "Tổng Giám Đốc",
      employee_name: "LÊ VĂN BÌNH",
      employee_code: "NV00072",
      id_card_no: "025095001122",
      original_contract_no: "HĐLĐ-2025-00072",
      termination_decision_no: "QĐ-2026/045-HR",
      termination_date: "30/11/2026",
      remaining_salary_amount: "18,500,000 VNĐ",
      unused_leave_days: "3.5 ngày",
      unused_leave_pay: "2,700,000 VNĐ",
      total_settlement_amount: "21,200,000 VNĐ",
      total_settlement_words: "Hai mươi mốt triệu hai trăm nghìn đồng chẵn",
      settlement_deadline: "10/12/2026",
      sign_date: "30/11/2026",
    },
    html: `
<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #111; max-width: 780px; margin: 0 auto; padding: 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h4 style="margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
    <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</p>
    <p style="margin: 0; font-size: 12px;">-----------------------</p>
    <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic;">Số: BBTL-{{employee_code}} / CYCLOSA</p>
    <h2 style="margin-top: 24px; margin-bottom: 4px; text-transform: uppercase; font-size: 20px; font-weight: bold; color: #be123c;">BIÊN BẢN THANH LÝ HỢP ĐỒNG LAO ĐỘNG</h2>
    <p style="margin: 0; font-size: 12px; font-style: italic;">(Căn cứ HĐLĐ số: {{original_contract_no}} và Quyết định chấm dứt số: {{termination_decision_no}})</p>
  </div>

  <p style="font-size: 13px;">Hôm nay, ngày {{sign_date}}, tại trụ sở Công ty, chúng tôi gồm các bên:</p>
  <p style="font-size: 13px; margin: 4px 0;"><strong>BÊN A (NGƯỜI SỬ DỤNG LĐ): {{company_name}}</strong> - Đại diện: {{representative_name}} ({{representative_title}})</p>
  <p style="font-size: 13px; margin: 4px 0;"><strong>BÊN B (NGƯỜI LAO ĐỘNG): Ông/Bà {{employee_name}}</strong> - Mã NV: {{employee_code}} - CCCD: {{id_card_no}}</p>

  <p style="font-size: 13px; margin: 12px 0 8px 0;">Hai bên cùng nhau tiến hành lập biên bản thanh lý Hợp đồng lao động với các nội dung sau:</p>

  <h4 style="font-size: 14px; color: #be123c; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 1: CHẤM DỨT QUAN HỆ LAO ĐỘNG</h4>
  <p style="font-size: 13px; margin: 4px 0;">Hai bên nhất trí chấm dứt Hợp đồng lao động số {{original_contract_no}} kể từ ngày <strong>{{termination_date}}</strong>.</p>

  <h4 style="font-size: 14px; color: #be123c; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 2: BÀN GIAO CÔNG VIỆC VÀ TÀI SẢN</h4>
  <p style="font-size: 13px; margin: 4px 0;">Bên B đã hoàn thành bàn giao toàn bộ máy tính làm việc, thẻ nhân viên, tài liệu mật và các tài sản được công ty cấp phát theo Biên bản bàn giao nội bộ.</p>

  <div style="background-color: #fff1f2; border-left: 3px solid #be123c; padding: 12px; margin-bottom: 16px;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #be123c; font-weight: bold;">ĐIỀU 3: QUYẾT TOÁN CÔNG NỢ & CHẾ ĐỘ</h4>
    <p style="font-size: 13px; margin: 3px 0;">1. Tiền lương làm việc thực tế còn lại: <strong>{{remaining_salary_amount}}</strong>.</p>
    <p style="font-size: 13px; margin: 3px 0;">2. Tiền phép năm chưa nghỉ ({{unused_leave_days}}): <strong>{{unused_leave_pay}}</strong>.</p>
    <p style="font-size: 13px; margin: 3px 0;">3. Tổng số tiền Bên A thanh toán cho Bên B: <strong>{{total_settlement_amount}}</strong> (Bằng chữ: <em>{{total_settlement_words}}</em>).</p>
    <p style="font-size: 13px; margin: 3px 0;">4. Hạn thanh toán: Chuyển khoản trước ngày {{settlement_deadline}}.</p>
  </div>

  <h4 style="font-size: 14px; color: #be123c; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 4: CAM KẾT</h4>
  <p style="font-size: 13px; margin: 4px 0;">Sau khi ký biên bản này và nhận đủ số tiền quyết toán, hai bên cam kết không còn bất kỳ khiếu nại, khiếu kiện nào đối với nhau. Bên A có trách nhiệm chốt và trả sổ BHXH cho Bên B đúng thời hạn quy định.</p>

  <div style="margin-top: 45px; display: flex; justify-content: space-between; page-break-inside: avoid;">
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN NGƯỜI LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Ký tên)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{employee_name}}</p>
    </div>
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN BÊN SỬ DỤNG LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Đóng dấu)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{representative_name}}</p>
    </div>
  </div>
</div>
`.trim(),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. HỢP ĐỒNG MÙA VỤ / THỜI VỤ
  // ═══════════════════════════════════════════════════════════════════════════
  SEASONAL_CONTRACT: {
    kind: "SEASONAL_CONTRACT",
    defaultTitle: "Hợp đồng mùa vụ / thời vụ",
    defaultCodePrefix: "HDLD-MUAVU",
    sampleData: {
      company_name: "TẬP ĐOÀN CÔNG NGHỆ CYCLOSA",
      representative_name: "Ông Lê Hoàng Nam",
      employee_name: "VŨ VĂN HÙNG",
      employee_code: "NV-MV012",
      id_card_no: "031090004567",
      phone: "0977 123 456",
      contract_number: "HĐMV-2026-012",
      seasonal_job: "Nhân viên hỗ trợ triển khai hạ tầng mạng và bàn giao thiết bị điểm bán",
      start_date: "01/12/2026",
      end_date: "28/02/2027",
      wage_rate: "500,000 VNĐ / ngày công",
      estimated_monthly_wage: "12,000,000 VNĐ",
      sign_date: "25/11/2026",
    },
    html: `
<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #111; max-width: 780px; margin: 0 auto; padding: 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h4 style="margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
    <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</p>
    <p style="margin: 0; font-size: 12px;">-----------------------</p>
    <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic;">Số: {{contract_number}} / CYCLOSA-MV</p>
    <h2 style="margin-top: 24px; margin-bottom: 4px; text-transform: uppercase; font-size: 20px; font-weight: bold; color: #0284c7;">HỢP ĐỒNG LAO ĐỘNG THỜI VỤ</h2>
    <p style="margin: 0; font-size: 12px; font-style: italic;">(Công việc theo mùa vụ / Công việc nhất định có thời hạn dưới 12 tháng)</p>
  </div>

  <p style="font-size: 13px;">Hôm nay, ngày {{sign_date}}, chúng tôi gồm có:</p>
  <p style="font-size: 13px; margin: 4px 0;"><strong>BÊN A (NGƯỜI SỬ DỤNG LĐ): {{company_name}}</strong> - Đại diện: {{representative_name}}</p>
  <p style="font-size: 13px; margin: 4px 0;"><strong>BÊN B (NGƯỜI LAO ĐỘNG): Ông/Bà {{employee_name}}</strong> - Mã NV: {{employee_code}} - CCCD: {{id_card_no}}</p>

  <h4 style="font-size: 14px; color: #0284c7; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 1: CÔNG VIỆC THỜI VỤ VÀ THỜI HẠN</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Công việc đảm nhiệm: <strong>{{seasonal_job}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Thời hạn hợp đồng: Từ ngày <strong>{{start_date}}</strong> đến ngày <strong>{{end_date}}</strong>.</p>

  <h4 style="font-size: 14px; color: #0284c7; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 2: TIỀN CÔNG VÀ THANH TOÁN</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Mức tiền công: <strong>{{wage_rate}}</strong> thực tế theo bảng chấm công.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Tiền công ước tính: Khoảng {{estimated_monthly_wage}} / tháng.</p>
  <p style="font-size: 13px; margin: 4px 0;">3. Thanh toán bằng tiền mặt hoặc chuyển khoản vào các đợt định kỳ của công ty.</p>

  <div style="margin-top: 45px; display: flex; justify-content: space-between; page-break-inside: avoid;">
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">NGƯỜI LAO ĐỘNG THỜI VỤ</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Ký tên)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{employee_name}}</p>
    </div>
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN BÊN SỬ DỤNG LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Đóng dấu)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{representative_name}}</p>
    </div>
  </div>
</div>
`.trim(),
  },
};

