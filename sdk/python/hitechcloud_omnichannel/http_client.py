"""HTTP client cấp thấp cho Omnichannel API"""

import json as _json
import time
from urllib.parse import urljoin

import requests

from .exceptions import OmnichannelError, RateLimitError, error_from_response

__version__ = "1.0.0"


class HTTPClient:
    """Bọc requests.Session: gắn Bearer token, retry 429/5xx, bóc Envelope."""

    def __init__(self, base_url, access_token=None, timeout=30, max_retries=3):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.max_retries = max_retries
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/json",
            "User-Agent": "HiTechCloud-Omnichannel-Python/%s" % __version__,
        })
        if access_token:
            self.set_token(access_token)

    def set_token(self, access_token):
        self.session.headers["Authorization"] = "Bearer %s" % access_token

    def clear_token(self):
        self.session.headers.pop("Authorization", None)

    def request(self, method, path, params=None, json=None, files=None, data=None):
        url = urljoin(self.base_url + "/", path.lstrip("/"))
        headers = {}
        if json is not None and files is None:
            headers["Content-Type"] = "application/json"

        last_error = None
        for attempt in range(self.max_retries + 1):
            try:
                resp = self.session.request(
                    method=method,
                    url=url,
                    params=params,
                    json=json if files is None else None,
                    data=data,
                    files=files,
                    headers=headers,
                    timeout=self.timeout,
                )
            except requests.exceptions.RequestException as exc:
                last_error = exc
                if attempt < self.max_retries:
                    time.sleep(2 ** attempt)
                    continue
                raise OmnichannelError("Kết nối thất bại: %s" % exc)

            if resp.status_code == 429 and attempt < self.max_retries:
                retry_after = int(resp.headers.get("Retry-After", 2 ** attempt))
                time.sleep(retry_after)
                continue
            if resp.status_code >= 500 and attempt < self.max_retries:
                time.sleep(2 ** attempt)
                continue

            return self._parse(resp)

        if last_error:
            raise OmnichannelError("Thất bại sau %d lần thử: %s" % (self.max_retries, last_error))

    def _parse(self, resp):
        retry_after = resp.headers.get("Retry-After")
        retry_after = int(retry_after) if retry_after else None

        if resp.status_code == 204 or not resp.content:
            if resp.status_code >= 400:
                raise error_from_response(resp.status_code, {}, retry_after)
            return None

        try:
            body = resp.json()
        except (ValueError, _json.JSONDecodeError):
            if resp.status_code >= 400:
                raise error_from_response(resp.status_code, {"message": resp.text[:200]}, retry_after)
            raise OmnichannelError("Phản hồi không phải JSON hợp lệ")

        # Lỗi theo HTTP status hoặc theo Envelope (status == "error").
        if resp.status_code >= 400 or (isinstance(body, dict) and body.get("status") == "error"):
            raise error_from_response(resp.status_code, body, retry_after)

        return body

    def get(self, path, params=None):
        return self.request("GET", path, params=params)

    def post(self, path, json=None, files=None, data=None):
        return self.request("POST", path, json=json, files=files, data=data)

    def put(self, path, json=None):
        return self.request("PUT", path, json=json)

    def delete(self, path):
        return self.request("DELETE", path)

    def close(self):
        self.session.close()
