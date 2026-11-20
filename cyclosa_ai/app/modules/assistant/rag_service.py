import re
import math
from typing import List, Dict, Any, Tuple
from app.modules.assistant.schemas import Citation


class RagKnowledgeBase:
    """
    Cơ sở tri thức RAG nội bộ về Quy chế, Chính sách Nhân sự và Pháp luật Lao động.
    Hỗ trợ tìm kiếm ngữ nghĩa (Semantic search) và trích xuất nguồn tham chiếu (Citations).
    """

    DOCUMENTS = [
        {
            "id": "QC-01-TIME",
            "title": "Quy chế Quản lý Thời giờ làm việc và Nghỉ ngơi CYCLOSA (QC-HR-2026/01)",
            "section": "Điều 4 & 5: Giờ làm việc tiêu chuẩn và Chấm công",
            "content": (
                "Thời gian làm việc tiêu chuẩn: Từ 08h00 đến 17h30 các ngày từ Thứ Hai đến Thứ Sáu (nghỉ trưa từ 12h00 đến 13h30). "
                "Nhân viên được phép linh hoạt đi làm trong khoảng 08h00 - 08h30 và về tương ứng 17h30 - 18h00. "
                "Mọi trường hợp đến sau 08h30 được tính là đi muộn. Đi muộn quá 3 lần trong tháng mà không có lý do chính đáng sẽ bị trừ điểm chuyên cần."
            ),
            "keywords": ["giờ làm việc", "thời gian làm việc", "nghỉ trưa", "chấm công", "đi muộn", "về sớm", "linh hoạt"]
        },
        {
            "id": "QC-02-LEAVE",
            "title": "Quy chế Chế độ Nghỉ phép và Nghỉ việc riêng CYCLOSA (QC-HR-2026/02)",
            "section": "Điều 7: Nghỉ việc riêng có hưởng lương (Căn cứ Điều 115 BLLĐ 2019)",
            "content": (
                "Người lao động được nghỉ việc riêng mà vẫn hưởng nguyên lương trong các trường hợp sau: "
                "1. Kết hôn: nghỉ 03 ngày. "
                "2. Con đẻ, con nuôi kết hôn: nghỉ 01 ngày. "
                "3. Cha đẻ, mẹ đẻ, cha nuôi, mẹ nuôi; cha đẻ, mẹ đẻ của vợ hoặc chồng; vợ hoặc chồng; con đẻ, con nuôi chết: nghỉ 03 ngày. "
                "Đơn xin nghỉ việc riêng phải được gửi trên phần mềm CYCLOSA trước tối thiểu 24 giờ kèm giấy tờ minh chứng."
            ),
            "keywords": ["kết hôn", "ma chay", "việc riêng", "nghỉ việc riêng", "đám cưới", "tang", "hưởng nguyên lương", "điều 115"]
        },
        {
            "id": "QC-03-MATERNITY",
            "title": "Chính sách Chăm sóc Sức khỏe & Chế độ Thai sản (CS-HR-2026/03)",
            "section": "Điều 9: Quyền lợi thai sản cho lao động nữ và nam",
            "content": (
                "Lao động nữ sinh con được nghỉ thai sản 06 tháng theo luật BHXH, công ty hỗ trợ thêm 01 tháng lương cơ bản tiền tã sữa. "
                "Lao động nam có vợ sinh con được nghỉ: 05 ngày làm việc khi sinh thường; 07 ngày làm việc khi sinh mổ/dưới 32 tuần; "
                "10 ngày làm việc khi sinh đôi (thêm 03 ngày cho mỗi con từ con thứ 3). "
                "Lao động nữ nuôi con dưới 12 tháng tuổi được rút ngắn 60 phút làm việc mỗi ngày mà vẫn hưởng đủ lương."
            ),
            "keywords": ["thai sản", "sinh con", "nuôi con nhỏ", "lao động nữ", "vợ sinh", "bỉm sữa", "nghỉ sinh"]
        },
        {
            "id": "QC-04-REMOTE",
            "title": "Quy định Mô hình Làm việc Linh hoạt & Từ xa (Hybrid / Remote Work)",
            "section": "Điều 3: Tiêu chuẩn phê duyệt làm việc tại nhà",
            "content": (
                "Nhân sự chính thức (đã qua thử việc) được đăng ký làm việc từ xa tối đa 02 ngày/tuần sau khi có sự đồng ý của Quản lý trực tiếp. "
                "Trong ngày làm việc từ xa, nhân sự phải đảm bảo trực tuyến trên hệ thống Slack/CYCLOSA Chat trong khung giờ làm việc và sẵn sàng họp trực tuyến."
            ),
            "keywords": ["remote", "làm việc từ xa", "làm việc tại nhà", "hybrid", "wfh", "work from home"]
        },
        {
            "id": "QC-05-DIGITIZATION",
            "title": "Quy chế Quản lý & Lưu trữ Hồ sơ Số hóa Nhân sự (Tuân thủ Thông tư 05/2025/TT-BNV)",
            "section": "Điều 2 & 6: Tiêu chuẩn kỹ thuật số hóa và bảo quản vĩnh viễn",
            "content": (
                "Hồ sơ nhân sự số hóa có giá trị pháp lý tương đương văn bản giấy khi đáp ứng tiêu chuẩn Thông tư 05/2025/TT-BNV: "
                "1. Độ phân giải tối thiểu 300 DPI với hồ sơ bảo quản vĩnh viễn/lâu năm. "
                "2. Định dạng tệp bảo quản là PDF/A chuẩn quốc tế, gắn siêu dữ liệu (Metadata) và chứng thư số của doanh nghiệp. "
                "3. Kiểm tra tính toàn vẹn (Checksum SHA-256) trước khi nhập kho và định kỳ sao lưu tại 2 vùng địa lý độc lập."
            ),
            "keywords": ["thông tư 05", "thông tư 05/2025", "số hóa", "lưu trữ", "300 dpi", "pdf/a", "bảo quản vĩnh viễn", "tiêu chuẩn số hóa"]
        },
        {
            "id": "QC-06-INSURANCE",
            "title": "Chính sách Phúc lợi & Bảo hiểm Sức khỏe Cao cấp CYCLOSA Care",
            "section": "Điều 11: Bảo hiểm sức khỏe PVI/Bảo Việt và Khám sức khỏe định kỳ",
            "content": (
                "Ngoài BHXH bắt buộc theo luật, 100% nhân viên ký HĐLĐ chính thức được cấp thẻ bảo hiểm sức khỏe CYCLOSA Care với hạn mức nội trú lên đến 150 triệu VNĐ/năm, "
                "hạn mức ngoại trú 15 triệu VNĐ/năm. Công ty tổ chức khám sức khỏe định kỳ vào Quý 3 hàng năm tại các bệnh viện quốc tế uy tín."
            ),
            "keywords": ["bảo hiểm sức khỏe", "khám sức khỏe", "phúc lợi", "bảo hiểm pvi", "bảo việt", "nội trú", "ngoại trú"]
        }
    ]

    @classmethod
    def search(cls, query: str, top_k: int = 2) -> List[Tuple[Dict[str, Any], float]]:
        """
        Tìm kiếm các đoạn tài liệu quy chế phù hợp nhất với câu hỏi người dùng
        sử dụng thuật toán so khớp ngữ nghĩa và tần suất từ khóa.
        """
        query_tokens = set(re.findall(r'\w+', query.lower()))
        results = []

        for doc in cls.DOCUMENTS:
            score = 0.0
            doc_text = (doc["title"] + " " + doc["section"] + " " + doc["content"]).lower()

            # 1. So khớp từ khóa định danh đặc thù
            for kw in doc["keywords"]:
                if kw in query.lower():
                    score += 3.0

            # 2. So khớp từ đơn (Jaccard / Token overlap)
            content_tokens = set(re.findall(r'\w+', doc_text))
            intersection = query_tokens.intersection(content_tokens)
            if query_tokens:
                score += (len(intersection) / len(query_tokens)) * 2.0

            if score > 0.5:
                results.append((doc, score))

        # Sắp xếp điểm giảm dần
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

    @classmethod
    def get_citations(cls, query: str, top_k: int = 2) -> List[Citation]:
        """Lấy danh sách các Citation chính thức cho câu hỏi"""
        search_hits = cls.search(query, top_k=top_k)
        citations = []
        for doc, score in search_hits:
            citations.append(Citation(
                document_title=doc["title"],
                section=doc["section"],
                content_snippet=doc["content"]
            ))
        return citations
