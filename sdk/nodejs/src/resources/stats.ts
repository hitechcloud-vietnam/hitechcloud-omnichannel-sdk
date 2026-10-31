import { BaseResource } from "./base";
import { clean, Envelope } from "../httpClient";

/** Thống kê (statistics). */
export class StatsResource extends BaseResource {
  /** GET /v1/stats/ad-campaigns */
  adCampaigns(since: string, until: string, network?: string): Promise<Envelope> {
    return this.http.get("/v1/stats/ad-campaigns", clean({ since, until, network }));
  }

  /** GET /v1/stats/ads (group: by_id | by_time) */
  ads(since: string, until: string, group: string, network?: string): Promise<Envelope> {
    return this.http.get("/v1/stats/ads", clean({ since, until, group, network }));
  }

  /** GET /v1/ads — tra cứu theo ad_ids (tối đa 20). */
  lookupAds(adIds: string | string[], network?: string): Promise<Envelope> {
    const ad_ids = Array.isArray(adIds) ? adIds.join(",") : adIds;
    return this.http.get("/v1/ads", clean({ ad_ids, network }));
  }

  /** GET /v1/stats/engagements */
  engagements(dateRange: string, byHour?: boolean, userIds?: string): Promise<Envelope> {
    return this.http.get("/v1/stats/engagements", clean({ date_range: dateRange, by_hour: byHour, user_ids: userIds }));
  }

  /** GET /v1/stats/feedbacks */
  feedbacks(since: string, until: string): Promise<Envelope> {
    return this.http.get("/v1/stats/feedbacks", { since, until });
  }

  /** GET /v1/stats/channels */
  channels(since: string, until: string): Promise<Envelope> {
    return this.http.get("/v1/stats/channels", { since, until });
  }

  /** GET /v1/stats/tags */
  tags(since: string, until: string): Promise<Envelope> {
    return this.http.get("/v1/stats/tags", { since, until });
  }

  /** GET /v1/stats/users */
  users(dateRange: string): Promise<Envelope> {
    return this.http.get("/v1/stats/users", { date_range: dateRange });
  }

  /** GET /v1/stats/new-customers (group_by: day | hour | channel_id) */
  newCustomers(dateRange: string, groupBy?: string): Promise<Envelope> {
    return this.http.get("/v1/stats/new-customers", clean({ date_range: dateRange, group_by: groupBy }));
  }
}
