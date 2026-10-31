# HiTechCloud Omnichannel — PHP SDK

SDK PHP chính thức cho [HiTechCloud Omnichannel API](https://developers.hitechcloud.vn). PHP 8+, dùng Guzzle.

## Cài đặt

```bash
composer require hitechcloud-vietnam/omnichannel-sdk
```

## Khởi tạo

```php
<?php
require 'vendor/autoload.php';

use HiTechCloud\Omnichannel\Client;

$omni = new Client(getenv('OMNI_ACCESS_TOKEN'));
// Sandbox: new Client(getenv('OMNI_ACCESS_TOKEN'), null, true);
```

## Ví dụ nhanh

```php
// Danh sách kênh
$channels = $omni->channels()->list(['platform' => 'facebook', 'connected' => true]);

// Hội thoại chưa đọc
$convs = $omni->conversations()->list([
    'channel_id' => 'chn_01HZX8QWERTY',
    'unread_first' => true,
]);

// Gửi tin nhắn
$omni->messages()->sendText('cnv_01HZABCDEF', 'Chào anh/chị!');

// Gắn nhãn + phân công
$omni->conversations()->addTags('cnv_01HZABCDEF', ['da-chot-don']);
$omni->conversations()->assign('cnv_01HZABCDEF', ['usr_01HZNV01']);

// Tạo đơn hàng
$omni->orders()->create('cnv_01HZABCDEF', [
    ['name' => 'Ao thun', 'quantity' => 2, 'price' => 150000],
]);
```

## Webhook (HMAC-SHA256, header `X-HTC-Signature`)

```php
use HiTechCloud\Omnichannel\Webhook;

$raw = file_get_contents('php://input');
$sig = $_SERVER['HTTP_X_HTC_SIGNATURE'] ?? null;

if (!Webhook::verifySignature($raw, $sig, getenv('SIGNING_SECRET'))) {
    http_response_code(400);
    exit('invalid signature');
}
$event = json_decode($raw, true);
// xử lý idempotent theo $event['event_id']
http_response_code(200);
```

## Xử lý lỗi

```php
use HiTechCloud\Omnichannel\RateLimitException;
use HiTechCloud\Omnichannel\MessagingWindowClosedException;

try {
    $omni->messages()->sendText('cnv_01HZABCDEF', '...');
} catch (MessagingWindowClosedException $e) {
    // ngoài cửa sổ 24h -> dùng template
} catch (RateLimitException $e) {
    sleep($e->getRetryAfter() ?? 5);
}
```

## License

MIT
