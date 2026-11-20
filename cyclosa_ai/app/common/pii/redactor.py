import re
import logging
from typing import Optional, Tuple
from app.core.exceptions import PiiRedactionError

logger = logging.getLogger("cyclosa_ai.pii")


class PiiRedactor:
    """
    Bộ khử định danh dữ liệu cá nhân nhạy cảm (PII Redaction)
    Tuân thủ quy chuẩn chống thiên vị (Fairness & Anti-Bias):
    Loại bỏ: Họ tên, Số điện thoại, Email, Số CCCD/CMND, Ngày sinh, Giới tính, Tình trạng hôn nhân.
    """

    # Regex nhận diện Số điện thoại VN
    PHONE_REGEX = re.compile(
        r"(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}\b",
        re.IGNORECASE
    )

    # Regex nhận diện Email
    EMAIL_REGEX = re.compile(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        re.IGNORECASE
    )

    # Regex nhận diện CMND (9 số) hoặc CCCD (12 số)
    NATIONAL_ID_REGEX = re.compile(
        r"\b(?:\d{9}|\d{12})\b"
    )

    # Regex nhận diện Ngày sinh (DOB)
    DOB_REGEX = re.compile(
        r"(?:ngày\s+sinh|dob|date\s+of\s+birth|sinh\s+ngày)[\s:]*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})",
        re.IGNORECASE
    )

    # Regex nhận diện Giới tính (Gender)
    GENDER_REGEX = re.compile(
        r"(?:giới\s+tính|gender|sex)[\s:]*(nam|nữ|female|male|khác|other)",
        re.IGNORECASE
    )

    # Regex nhận diện Tình trạng hôn nhân (Marital status)
    MARITAL_REGEX = re.compile(
        r"(?:tình\s+trạng\s+hôn\s+nhân|hôn\s+nhân|marital\s+status)[\s:]*(độc\s+thân|đã\s+kết\s+hôn|single|married|ly\s+hôn)",
        re.IGNORECASE
    )

    @classmethod
    def redact(cls, text: str, candidate_name: Optional[str] = None) -> Tuple[str, dict]:
        """
        Khử thông tin định danh cá nhân khỏi văn bản CV.
        Trả về: (văn bản đã ẩn danh, thống kê các trường đã ẩn)
        """
        if not text:
            return "", {}

        redaction_stats = {
            "name_redacted": False,
            "phone_count": 0,
            "email_count": 0,
            "national_id_count": 0,
            "gender_redacted": False,
            "dob_redacted": False,
            "marital_redacted": False,
        }

        try:
            redacted = text

            # 1. Ẩn Họ tên ứng viên nếu có cung cấp
            if candidate_name and candidate_name.strip():
                name_clean = candidate_name.strip()
                # Case insensitive match for name
                pattern = re.compile(re.escape(name_clean), re.IGNORECASE)
                if pattern.search(redacted):
                    redacted = pattern.sub("[ỨNG_VIÊN_NAME_REDACTED]", redacted)
                    redaction_stats["name_redacted"] = True

            # 2. Ẩn Giới tính
            if cls.GENDER_REGEX.search(redacted):
                redacted = cls.GENDER_REGEX.sub("[GIỚI_TÍNH_REDACTED]", redacted)
                redaction_stats["gender_redacted"] = True

            # 3. Ẩn Ngày sinh
            if cls.DOB_REGEX.search(redacted):
                redacted = cls.DOB_REGEX.sub("[NGÀY_SINH_REDACTED]", redacted)
                redaction_stats["dob_redacted"] = True

            # 4. Ẩn Tình trạng hôn nhân
            if cls.MARITAL_REGEX.search(redacted):
                redacted = cls.MARITAL_REGEX.sub("[HÔN_NHÂN_REDACTED]", redacted)
                redaction_stats["marital_redacted"] = True

            # 5. Ẩn Email
            email_matches = cls.EMAIL_REGEX.findall(redacted)
            if email_matches:
                redaction_stats["email_count"] = len(email_matches)
                redacted = cls.EMAIL_REGEX.sub("[EMAIL_REDACTED]", redacted)

            # 6. Ẩn Số điện thoại
            phone_matches = cls.PHONE_REGEX.findall(redacted)
            if phone_matches:
                redaction_stats["phone_count"] = len(phone_matches)
                redacted = cls.PHONE_REGEX.sub("[PHONE_REDACTED]", redacted)

            # 7. Ẩn Số định danh CCCD/CMND
            id_matches = cls.NATIONAL_ID_REGEX.findall(redacted)
            if id_matches:
                redaction_stats["national_id_count"] = len(id_matches)
                redacted = cls.NATIONAL_ID_REGEX.sub("[ID_NUMBER_REDACTED]", redacted)

            logger.info(f"PII Redaction completed successfully. Stats: {redaction_stats}")
            return redacted, redaction_stats

        except Exception as e:
            logger.error(f"PII Redaction failed: {str(e)}", exc_info=True)
            raise PiiRedactionError(f"Quá trình khử định danh dữ liệu cá nhân thất bại: {str(e)}")

