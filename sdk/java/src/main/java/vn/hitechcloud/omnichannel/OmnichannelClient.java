package vn.hitechcloud.omnichannel;

import vn.hitechcloud.omnichannel.resources.Account;
import vn.hitechcloud.omnichannel.resources.Channels;
import vn.hitechcloud.omnichannel.resources.Conversations;
import vn.hitechcloud.omnichannel.resources.Customers;
import vn.hitechcloud.omnichannel.resources.Media;
import vn.hitechcloud.omnichannel.resources.Messages;
import vn.hitechcloud.omnichannel.resources.Orders;
import vn.hitechcloud.omnichannel.resources.Sandbox;
import vn.hitechcloud.omnichannel.resources.Stats;
import vn.hitechcloud.omnichannel.resources.Tags;
import vn.hitechcloud.omnichannel.resources.Users;
import vn.hitechcloud.omnichannel.resources.Webhooks;
import vn.hitechcloud.omnichannel.resources.Widget;

import java.util.Map;

/**
 * Client cho HiTechCloud Omnichannel API.
 *
 * <pre>{@code
 * OmnichannelClient omni = new OmnichannelClient("YOUR_ACCESS_TOKEN");
 * Map<String, Object> channels = omni.channels().list(null);
 * omni.messages().sendText("cnv_01HZABCDEF", "Chào anh/chị!", null);
 * }</pre>
 */
public class OmnichannelClient {
    public static final String PRODUCTION_URL = "https://omni.hitechcloud.vn";
    public static final String SANDBOX_URL = "https://omni-sandbox.hitechcloud.vn";
    public static final String VERSION = HttpClient.VERSION;

    private final HttpClient http;

    private final Account account;
    private final Channels channels;
    private final Conversations conversations;
    private final Messages messages;
    private final Media media;
    private final Customers customers;
    private final Tags tags;
    private final Users users;
    private final Orders orders;
    private final Webhooks webhooks;
    private final Widget widget;
    private final Stats stats;
    private final Sandbox sandbox;

    public OmnichannelClient(String accessToken) {
        this(accessToken, PRODUCTION_URL, 30, 3);
    }

    public OmnichannelClient(String accessToken, boolean sandbox) {
        this(accessToken, sandbox ? SANDBOX_URL : PRODUCTION_URL, 30, 3);
    }

    public OmnichannelClient(String accessToken, String baseUrl, int timeoutSeconds, int maxRetries) {
        this.http = new HttpClient(baseUrl, accessToken, timeoutSeconds, maxRetries);
        this.account = new Account(http);
        this.channels = new Channels(http);
        this.conversations = new Conversations(http);
        this.messages = new Messages(http);
        this.media = new Media(http);
        this.customers = new Customers(http);
        this.tags = new Tags(http);
        this.users = new Users(http);
        this.orders = new Orders(http);
        this.webhooks = new Webhooks(http);
        this.widget = new Widget(http);
        this.stats = new Stats(http);
        this.sandbox = new Sandbox(http);
    }

    public void setAccessToken(String accessToken) {
        http.setToken(accessToken);
    }

    public Account account() { return account; }
    public Channels channels() { return channels; }
    public Conversations conversations() { return conversations; }
    public Messages messages() { return messages; }
    public Media media() { return media; }
    public Customers customers() { return customers; }
    public Tags tags() { return tags; }
    public Users users() { return users; }
    public Orders orders() { return orders; }
    public Webhooks webhooks() { return webhooks; }
    public Widget widget() { return widget; }
    public Stats stats() { return stats; }
    public Sandbox sandbox() { return sandbox; }

    /** GET /v1/me (tiện ích). */
    public Map<String, Object> me() {
        return account.me();
    }
}
