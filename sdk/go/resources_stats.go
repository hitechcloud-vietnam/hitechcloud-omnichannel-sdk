package omnichannel

import "strings"

// StatsResource xử lý nhóm endpoint thống kê.
type StatsResource struct {
	client *httpClient
}

// AdCampaigns - GET /v1/stats/ad-campaigns
func (r *StatsResource) AdCampaigns(since, until, network string) (*Envelope, error) {
	return r.client.get("/v1/stats/ad-campaigns", Params(map[string]string{
		"since": since, "until": until, "network": network,
	}))
}

// Ads - GET /v1/stats/ads (group: by_id|by_time)
func (r *StatsResource) Ads(since, until, group, network string) (*Envelope, error) {
	return r.client.get("/v1/stats/ads", Params(map[string]string{
		"since": since, "until": until, "group": group, "network": network,
	}))
}

// LookupAds - GET /v1/ads (adIDs tối đa 20)
func (r *StatsResource) LookupAds(adIDs []string, network string) (*Envelope, error) {
	return r.client.get("/v1/ads", Params(map[string]string{
		"ad_ids": strings.Join(adIDs, ","), "network": network,
	}))
}

// Engagements - GET /v1/stats/engagements
func (r *StatsResource) Engagements(dateRange, byHour, userIDs string) (*Envelope, error) {
	return r.client.get("/v1/stats/engagements", Params(map[string]string{
		"date_range": dateRange, "by_hour": byHour, "user_ids": userIDs,
	}))
}

// Feedbacks - GET /v1/stats/feedbacks
func (r *StatsResource) Feedbacks(since, until string) (*Envelope, error) {
	return r.client.get("/v1/stats/feedbacks", Params(map[string]string{"since": since, "until": until}))
}

// Channels - GET /v1/stats/channels
func (r *StatsResource) Channels(since, until string) (*Envelope, error) {
	return r.client.get("/v1/stats/channels", Params(map[string]string{"since": since, "until": until}))
}

// Tags - GET /v1/stats/tags
func (r *StatsResource) Tags(since, until string) (*Envelope, error) {
	return r.client.get("/v1/stats/tags", Params(map[string]string{"since": since, "until": until}))
}

// Users - GET /v1/stats/users
func (r *StatsResource) Users(dateRange string) (*Envelope, error) {
	return r.client.get("/v1/stats/users", Params(map[string]string{"date_range": dateRange}))
}

// NewCustomers - GET /v1/stats/new-customers (groupBy: day|hour|channel_id)
func (r *StatsResource) NewCustomers(dateRange, groupBy string) (*Envelope, error) {
	return r.client.get("/v1/stats/new-customers", Params(map[string]string{
		"date_range": dateRange, "group_by": groupBy,
	}))
}
