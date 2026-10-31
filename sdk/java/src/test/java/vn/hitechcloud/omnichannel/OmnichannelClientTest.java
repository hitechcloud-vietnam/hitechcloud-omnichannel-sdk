package vn.hitechcloud.omnichannel;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OmnichannelClientTest {

    @Test
    void initialisesResources() {
        OmnichannelClient omni = new OmnichannelClient("tok");
        assertNotNull(omni.channels());
        assertNotNull(omni.conversations());
        assertNotNull(omni.messages());
        assertNotNull(omni.webhooks());
        assertNotNull(omni.stats());
    }

    @Test
    void webhookSignatureRoundtrip() {
        String secret = "whsec_test";
        String body = "{\"event_type\":\"message.created\"}";
        String sig = Webhook.computeSignature(body, secret);

        assertTrue(Webhook.verifySignature(body, sig, secret));
        assertTrue(Webhook.verifySignature(body, "sha256=" + sig, secret));
        assertFalse(Webhook.verifySignature(body, "deadbeef", secret));
        assertFalse(Webhook.verifySignature(body, null, secret));
    }

    @Test
    void errorFactoryMapsCode() {
        OmnichannelException e = ErrorFactory.make(
                422, java.util.Map.of("code", "MESSAGING_WINDOW_CLOSED", "message", "closed"), null);
        assertTrue(e instanceof MessagingWindowClosedException);
        assertEquals("MESSAGING_WINDOW_CLOSED", e.getCode());
    }
}
