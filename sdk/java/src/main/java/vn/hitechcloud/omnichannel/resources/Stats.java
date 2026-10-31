package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.List;
import java.util.Map;

/** Thống kê (statistics). */
public class Stats extends BaseResource {
    public Stats(HttpClient http) {
        super(http);
    }

    /** GET /v1/stats/ad-campaigns */
    public Map<String, Object> adCampaigns(String since, String until, String network) {
        return http.get("/v1/stats/ad-campaigns",
                Q.of().p("since", since).p("until", until).p("network", network).build());
    }

    /** GET /v1/stats/ads (group: by_id|by_time) */
    public Map<String, Object> ads(String since, String until, String group, String network) {
        return http.get("/v1/stats/ads",
                Q.of().p("since", since).p("until", until).p("group", group).p("network", network).build());
    }

    /** GET /v1/ads — tra cứu theo ad_ids (tối đa 20). */
    public Map<String, Object> lookupAds(List<String> adIds, String network) {
        return http.get("/v1/ads",
                Q.of().p("ad_ids", String.join(",", adIds)).p("network", network).build());
    }

    /** GET /v1/stats/engagements */
    public Map<String, Object> engagements(String dateRange, Boolean byHour, String userIds) {
        return http.get("/v1/stats/engagements",
                Q.of().p("date_range", dateRange).p("by_hour", byHour).p("user_ids", userIds).build());
    }

    /** GET /v1/stats/feedbacks */
    public Map<String, Object> feedbacks(String since, String until) {
        return http.get("/v1/stats/feedbacks", Q.of().p("since", since).p("until", until).build());
    }

    /** GET /v1/stats/channels */
    public Map<String, Object> channels(String since, String until) {
        return http.get("/v1/stats/channels", Q.of().p("since", since).p("until", until).build());
    }

    /** GET /v1/stats/tags */
    public Map<String, Object> tags(String since, String until) {
        return http.get("/v1/stats/tags", Q.of().p("since", since).p("until", until).build());
    }

    /** GET /v1/stats/users */
    public Map<String, Object> users(String dateRange) {
        return http.get("/v1/stats/users", Q.of().p("date_range", dateRange).build());
    }

    /** GET /v1/stats/new-customers (group_by: day|hour|channel_id) */
    public Map<String, Object> newCustomers(String dateRange, String groupBy) {
        return http.get("/v1/stats/new-customers",
                Q.of().p("date_range", dateRange).p("group_by", groupBy).build());
    }
}
