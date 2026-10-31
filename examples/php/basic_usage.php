<?php

/**
 * Ví dụ cơ bản — HiTechCloud Omnichannel PHP SDK
 *
 *   export OMNI_ACCESS_TOKEN=your-access-token
 *   php basic_usage.php
 */

require __DIR__ . '/../../vendor/autoload.php';

use HiTechCloud\Omnichannel\Client;
use HiTechCloud\Omnichannel\MessagingWindowClosedException;

$omni = new Client(getenv('OMNI_ACCESS_TOKEN'));

// 1) Liệt kê kênh Facebook đã kết nối
$channels = $omni->channels()->list(['platform' => 'facebook', 'connected' => 'true']);
foreach ($channels['data'] ?? [] as $chn) {
    echo $chn['id'] . ' | ' . $chn['platform'] . ' | ' . ($chn['name'] ?? '') . PHP_EOL;
}

$data = $channels['data'] ?? [];
if (empty($data)) {
    exit(0);
}
$channelId = $data[0]['id'];

// 2) Đọc hội thoại chưa đọc
$convs = $omni->conversations()->list([
    'channel_id' => $channelId,
    'unread_first' => 'true',
    'per_page' => 20,
]);

// 3) Trả lời hội thoại đầu tiên
$convList = $convs['data'] ?? [];
if (!empty($convList)) {
    $convId = $convList[0]['id'];
    try {
        $sent = $omni->messages()->sendText($convId, 'Chào anh/chị, HiTechCloud hỗ trợ gì cho mình ạ?');
        echo 'Đã gửi: ' . $sent['data']['id'] . PHP_EOL;
        $omni->conversations()->addTags($convId, ['da-tra-loi']);
    } catch (MessagingWindowClosedException $e) {
        echo 'Ngoài cửa sổ 24h — cần gửi theo mẫu (template).' . PHP_EOL;
    }
}

// 4) Thống kê theo kênh
$stats = $omni->stats()->channels('2026-10-01', '2026-10-31');
echo 'Thống kê: ' . json_encode($stats['data'] ?? []) . PHP_EOL;
