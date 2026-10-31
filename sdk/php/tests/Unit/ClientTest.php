<?php

namespace HiTechCloud\Omnichannel\Tests\Unit;

use HiTechCloud\Omnichannel\Client;
use HiTechCloud\Omnichannel\Webhook;
use PHPUnit\Framework\TestCase;

class ClientTest extends TestCase
{
    public function testClientInitialisesResources(): void
    {
        $omni = new Client('tok');
        $this->assertInstanceOf(\HiTechCloud\Omnichannel\Resources\Channels::class, $omni->channels());
        $this->assertInstanceOf(\HiTechCloud\Omnichannel\Resources\Conversations::class, $omni->conversations());
        $this->assertInstanceOf(\HiTechCloud\Omnichannel\Resources\Messages::class, $omni->messages());
        $this->assertInstanceOf(\HiTechCloud\Omnichannel\Resources\Webhooks::class, $omni->webhooks());
    }

    public function testSandboxFlag(): void
    {
        $omni = new Client('tok', null, true);
        $this->assertInstanceOf(Client::class, $omni);
    }

    public function testWebhookSignatureRoundtrip(): void
    {
        $secret = 'whsec_test';
        $body = '{"event_type":"message.created"}';
        $sig = hash_hmac('sha256', $body, $secret);

        $this->assertTrue(Webhook::verifySignature($body, $sig, $secret));
        $this->assertTrue(Webhook::verifySignature($body, 'sha256=' . $sig, $secret));
        $this->assertFalse(Webhook::verifySignature($body, 'deadbeef', $secret));
        $this->assertFalse(Webhook::verifySignature($body, null, $secret));
    }
}
