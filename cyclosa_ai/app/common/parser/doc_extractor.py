import io
import logging
import requests
from typing import Union
from app.core.exceptions import InvalidFileForAiError

logger = logging.getLogger("cyclosa_ai.parser")


class DocumentExtractor:
    """
    Trích xuất nội dung văn bản thuần từ các nguồn tài liệu (PDF, DOCX, TXT hoặc File URL)
    Hỗ trợ linh hoạt PyMuPDF (fitz), pypdf, PyPDF2 hoặc python-docx.
    """

    @classmethod
    def extract_from_url(cls, url: str) -> str:
        """Tải tệp từ URL (Cloudinary, S3...) và trích xuất text"""
        if not url or not url.strip():
            raise InvalidFileForAiError("URL tệp tài liệu trống.")

        try:
            response = requests.get(url, timeout=20.0, allow_redirects=True)
            if response.status_code != 200:
                raise InvalidFileForAiError(f"Không thể tải tệp từ URL: HTTP {response.status_code}")
            content = response.content

            url_lower = url.lower()
            if url_lower.endswith(".pdf") or b"%PDF" in content[:10]:
                return cls.extract_from_pdf_bytes(content)
            elif url_lower.endswith(".docx") or url_lower.endswith(".doc"):
                return cls.extract_from_docx_bytes(content)
            else:
                try:
                    return content.decode("utf-8")
                except UnicodeDecodeError:
                    return cls.extract_from_pdf_bytes(content)

        except InvalidFileForAiError:
            raise
        except Exception as e:
            logger.error(f"Error fetching/extracting file from {url}: {str(e)}", exc_info=True)
            raise InvalidFileForAiError(f"Lỗi khi đọc tệp từ đường dẫn: {str(e)}")

    @classmethod
    def extract_from_pdf_bytes(cls, data: bytes) -> str:
        """Đọc text từ bytes của tệp PDF (ưu tiên PyMuPDF -> pypdf -> PyPDF2)"""
        # 1. Thử PyMuPDF (fitz)
        try:
            import fitz
            doc = fitz.open(stream=data, filetype="pdf")
            text_parts = [page.get_text() for page in doc if page.get_text().strip()]
            full_text = "\n\n".join(text_parts).strip()
            if full_text:
                return full_text
        except ImportError:
            pass
        except Exception as e:
            logger.debug(f"fitz extraction failed, falling back: {e}")

        # 2. Thử pypdf
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(data))
            text_parts = [page.extract_text() for page in reader.pages if page.extract_text()]
            full_text = "\n\n".join(text_parts).strip()
            if full_text:
                return full_text
        except ImportError:
            pass
        except Exception as e:
            logger.debug(f"pypdf extraction failed, falling back: {e}")

        # 3. Thử PyPDF2
        try:
            import PyPDF2
            reader = PyPDF2.PdfReader(io.BytesIO(data))
            text_parts = [page.extract_text() for page in reader.pages if page.extract_text()]
            full_text = "\n\n".join(text_parts).strip()
            if full_text:
                return full_text
        except ImportError:
            pass
        except Exception as e:
            logger.debug(f"PyPDF2 extraction failed: {e}")

        raise InvalidFileForAiError("Tệp PDF rỗng, hỏng hoặc không có thư viện đọc PDF tương thích.")

    @classmethod
    def extract_from_docx_bytes(cls, data: bytes) -> str:
        """Đọc text từ bytes của tệp DOCX"""
        try:
            import docx
            doc = docx.Document(io.BytesIO(data))
            text_parts = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        text_parts.append(row_text)
            full_text = "\n".join(text_parts).strip()
            if full_text:
                return full_text
        except ImportError:
            logger.warning("Thư viện python-docx chưa được cài đặt.")
        except Exception as e:
            logger.error(f"DOCX extraction error: {str(e)}")

        raise InvalidFileForAiError("Không thể trích xuất văn bản từ tệp DOCX.")
