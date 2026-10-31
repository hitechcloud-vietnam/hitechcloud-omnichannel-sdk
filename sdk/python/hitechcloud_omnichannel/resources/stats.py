"""Tài nguyên Thống kê (statistics)."""

from .base import BaseResource


class StatsResource(BaseResource):
    """Số liệu tổng hợp: quảng cáo, tương tác, kênh, nhãn, nhân viên, khách mới."""

    def ad_campaigns(self, since, until, network=None):
        """GET /v1/stats/ad-campaigns — Thống kê chiến dịch quảng cáo."""
        return self._http.get("/v1/stats/ad-campaigns", self._clean({
            "since": since, "until": until, "network": network,
        }))

    def ads(self, since, until, group, network=None):
        """GET /v1/stats/ads — Thống kê theo quảng cáo (group: by_id|by_time)."""
        return self._http.get("/v1/stats/ads", self._clean({
            "since": since, "until": until, "group": group, "network": network,
        }))

    def lookup_ads(self, ad_ids, network=None):
        """GET /v1/ads — Tra cứu quảng cáo theo ad_ids (tối đa 20)."""
        if isinstance(ad_ids, (list, tuple)):
            ad_ids = ",".join(str(a) for a in ad_ids)
        return self._http.get("/v1/ads", self._clean({
            "ad_ids": ad_ids, "network": network,
        }))

    def engagements(self, date_range, by_hour=None, user_ids=None):
        """GET /v1/stats/engagements — Mức độ tương tác khách."""
        return self._http.get("/v1/stats/engagements", self._clean({
            "date_range": date_range, "by_hour": by_hour, "user_ids": user_ids,
        }))

    def feedbacks(self, since, until):
        """GET /v1/stats/feedbacks — Phản hồi của khách."""
        return self._http.get("/v1/stats/feedbacks", {"since": since, "until": until})

    def channels(self, since, until):
        """GET /v1/stats/channels — Thống kê theo kênh."""
        return self._http.get("/v1/stats/channels", {"since": since, "until": until})

    def tags(self, since, until):
        """GET /v1/stats/tags — Thống kê theo nhãn."""
        return self._http.get("/v1/stats/tags", {"since": since, "until": until})

    def users(self, date_range):
        """GET /v1/stats/users — Năng suất nhân viên."""
        return self._http.get("/v1/stats/users", {"date_range": date_range})

    def new_customers(self, date_range, group_by=None):
        """GET /v1/stats/new-customers — Khách hàng mới (group_by: day|hour|channel_id)."""
        return self._http.get("/v1/stats/new-customers", self._clean({
            "date_range": date_range, "group_by": group_by,
        }))
