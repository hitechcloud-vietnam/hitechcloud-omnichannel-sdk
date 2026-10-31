"""Lớp cơ sở cho các nhóm tài nguyên."""


class BaseResource:
    def __init__(self, http_client):
        self._http = http_client

    @staticmethod
    def _clean(params):
        """Bỏ các tham số có giá trị None."""
        if not params:
            return None
        return {k: v for k, v in params.items() if v is not None}
