import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Briefcase, Plus, Sparkles } from "lucide-react";

interface VariableCategory {
  title: string;
  icon: React.ReactNode;
  variables: { key: string; label: string }[];
}

const VARIABLE_CATEGORIES: VariableCategory[] = [
  {
    title: "Người lao động",
    icon: <User className="w-3.5 h-3.5 text-blue-500" />,
    variables: [
      { key: "employee_name", label: "Họ và tên" },
      { key: "employee_code", label: "Mã nhân viên" },
      { key: "dob", label: "Ngày sinh" },
      { key: "gender", label: "Giới tính" },
      { key: "id_card_no", label: "Số CCCD/CMND" },
      { key: "id_card_date", label: "Ngày cấp CCCD" },
      { key: "id_card_place", label: "Nơi cấp CCCD" },
      { key: "permanent_address", label: "Đ/c thường trú" },
      { key: "current_address", label: "Nơi ở hiện tại" },
      { key: "phone", label: "Số điện thoại" },
      { key: "email", label: "Email cá nhân" },
      { key: "bank_account_no", label: "Số tài khoản" },
      { key: "bank_name", label: "Ngân hàng" },
    ],
  },
  {
    title: "Người sử dụng LĐ",
    icon: <Building2 className="w-3.5 h-3.5 text-emerald-500" />,
    variables: [
      { key: "company_name", label: "Tên doanh nghiệp" },
      { key: "company_address", label: "Địa chỉ trụ sở" },
      { key: "company_tax_code", label: "Mã số thuế DN" },
      { key: "representative_name", label: "Người đại diện" },
      { key: "representative_title", label: "Chức vụ đại diện" },
      { key: "work_location", label: "Địa điểm làm việc" },
    ],
  },
  {
    title: "Hợp đồng & Đãi ngộ",
    icon: <Briefcase className="w-3.5 h-3.5 text-purple-500" />,
    variables: [
      { key: "contract_number", label: "Số hợp đồng" },
      { key: "start_date", label: "Ngày bắt đầu" },
      { key: "end_date", label: "Ngày kết thúc" },
      { key: "sign_date", label: "Ngày ký kết" },
      { key: "job_title", label: "Chức danh công việc" },
      { key: "department_name", label: "Phòng ban" },
      { key: "base_salary", label: "Mức lương cơ bản" },
      { key: "salary_in_words", label: "Lương bằng chữ" },
      { key: "probation_salary_rate", label: "Tỷ lệ lương thử việc" },
      { key: "working_time_description", label: "Thời giờ làm việc" },
    ],
  },
];

interface TemplateVariablePickerProps {
  onInsert: (token: string) => void;
}

export function TemplateVariablePicker({ onInsert }: TemplateVariablePickerProps) {
  return (
    <div className="bg-muted/40 border border-border/80 rounded-lg p-3 space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Chèn nhanh biến động Handlebars (Bấm để chèn vào vị trí con trỏ)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {VARIABLE_CATEGORIES.map((category) => (
          <div key={category.title} className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              {category.icon}
              <span>{category.title}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {category.variables.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => onInsert(`{{${v.key}}}`)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-background hover:bg-primary/10 hover:text-primary border border-border/60 hover:border-primary/40 transition-colors group font-mono"
                  title={`Chèn {{${v.key}}}`}
                >
                  <Plus className="w-2.5 h-2.5 text-muted-foreground group-hover:text-primary" />
                  <span className="font-sans text-[11px] text-foreground group-hover:text-primary">
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

