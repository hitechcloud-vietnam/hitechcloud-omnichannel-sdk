<?php

namespace HiTechCloud\Omnichannel\Resources;

/** Thống kê (statistics). */
class Stats extends BaseResource
{
    /** GET /v1/stats/ad-campaigns */
    public function adCampaigns(string $since, string $until, ?string $network = null): array
    {
        return $this->http->get('/v1/stats/ad-campaigns', self::clean([
            'since' => $since, 'until' => $until, 'network' => $network,
        ]));
    }

    /** GET /v1/stats/ads (group: by_id|by_time) */
    public function ads(string $since, string $until, string $group, ?string $network = null): array
    {
        return $this->http->get('/v1/stats/ads', self::clean([
            'since' => $since, 'until' => $until, 'group' => $group, 'network' => $network,
        ]));
    }

    /** GET /v1/ads — tra cứu theo ad_ids (tối đa 20). */
    public function lookupAds($adIds, ?string $network = null): array
    {
        $adIds = is_array($adIds) ? implode(',', $adIds) : $adIds;
        return $this->http->get('/v1/ads', self::clean(['ad_ids' => $adIds, 'network' => $network]));
    }

    /** GET /v1/stats/engagements */
    public function engagements(string $dateRange, ?bool $byHour = null, ?string $userIds = null): array
    {
        return $this->http->get('/v1/stats/engagements', self::clean([
            'date_range' => $dateRange,
            'by_hour' => $byHour === null ? null : ($byHour ? 'true' : 'false'),
            'user_ids' => $userIds,
        ]));
    }

    /** GET /v1/stats/feedbacks */
    public function feedbacks(string $since, string $until): array
    {
        return $this->http->get('/v1/stats/feedbacks', ['since' => $since, 'until' => $until]);
    }

    /** GET /v1/stats/channels */
    public function channels(string $since, string $until): array
    {
        return $this->http->get('/v1/stats/channels', ['since' => $since, 'until' => $until]);
    }

    /** GET /v1/stats/tags */
    public function tags(string $since, string $until): array
    {
        return $this->http->get('/v1/stats/tags', ['since' => $since, 'until' => $until]);
    }

    /** GET /v1/stats/users */
    public function users(string $dateRange): array
    {
        return $this->http->get('/v1/stats/users', ['date_range' => $dateRange]);
    }

    /** GET /v1/stats/new-customers (group_by: day|hour|channel_id) */
    public function newCustomers(string $dateRange, ?string $groupBy = null): array
    {
        return $this->http->get('/v1/stats/new-customers', self::clean([
            'date_range' => $dateRange, 'group_by' => $groupBy,
        ]));
    }
}
