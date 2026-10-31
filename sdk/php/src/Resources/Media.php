<?php

namespace HiTechCloud\Omnichannel\Resources;

/** Media (upload). */
class Media extends BaseResource
{
    /**
     * POST /v1/media — Tải lên một tệp media (multipart/form-data).
     *
     * @param string|resource $file Đường dẫn tệp hoặc resource đã mở.
     */
    public function upload($file, ?string $filename = null, ?string $channelId = null): array
    {
        $stream = is_string($file) ? fopen($file, 'rb') : $file;
        if ($filename === null && is_string($file)) {
            $filename = basename($file);
        }

        $multipart = [[
            'name' => 'file',
            'contents' => $stream,
            'filename' => $filename ?? 'upload',
        ]];
        if ($channelId !== null) {
            $multipart[] = ['name' => 'channel_id', 'contents' => $channelId];
        }

        return $this->http->postMultipart('/v1/media', $multipart);
    }
}
