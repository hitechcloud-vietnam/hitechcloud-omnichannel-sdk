"""Tài nguyên Media (upload)."""

from .base import BaseResource


class MediaResource(BaseResource):
    """Tải ảnh/video/tệp lên để lấy attachment_id."""

    def upload(self, file, filename=None, channel_id=None, content_type=None):
        """POST /v1/media — Tải lên một tệp media (multipart/form-data).

        `file` có thể là đường dẫn chuỗi hoặc một đối tượng file-like mở ở
        chế độ nhị phân. Trả về Envelope chứa attachment_id.
        """
        opened = None
        try:
            if isinstance(file, str):
                opened = open(file, "rb")
                fh = opened
                filename = filename or file.rsplit("/", 1)[-1]
            else:
                fh = file
            file_tuple = (filename or "upload", fh)
            if content_type:
                file_tuple = (filename or "upload", fh, content_type)
            files = {"file": file_tuple}
            data = {"channel_id": channel_id} if channel_id else None
            return self._http.post("/v1/media", files=files, data=data)
        finally:
            if opened is not None:
                opened.close()
