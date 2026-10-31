<?php

namespace HiTechCloud\Omnichannel\Resources;

use HiTechCloud\Omnichannel\HttpClient;

abstract class BaseResource
{
    protected HttpClient $http;

    public function __construct(HttpClient $http)
    {
        $this->http = $http;
    }

    /** Bỏ các khoá có giá trị null. */
    protected static function clean(array $params): array
    {
        return array_filter($params, static fn ($v) => $v !== null);
    }
}
