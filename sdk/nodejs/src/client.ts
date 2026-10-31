import { HttpClient } from "./httpClient";
import { ChannelsResource } from "./resources/channels";
import { ConversationsResource } from "./resources/conversations";
import { MessagesResource } from "./resources/messages";
import { MediaResource } from "./resources/media";
import { CustomersResource } from "./resources/customers";
import { StatsResource } from "./resources/stats";
import {
  AccountResource,
  TagsResource,
  UsersResource,
  OrdersResource,
  WebhooksResource,
  WidgetResource,
  SandboxResource,
} from "./resources/misc";

export const PRODUCTION_URL = "https://omni.hitechcloud.vn";
export const SANDBOX_URL = "https://omni-sandbox.hitechcloud.vn";

export interface OmnichannelOptions {
  accessToken?: string;
  baseUrl?: string;
  sandbox?: boolean;
  timeout?: number;
  maxRetries?: number;
}

/**
 * Client cho HiTechCloud Omnichannel API.
 *
 * @example
 * const omni = new Omnichannel({ accessToken: process.env.OMNI_ACCESS_TOKEN });
 * const channels = await omni.channels.list({ platform: "facebook" });
 * await omni.messages.sendText("cnv_01HZABCDEF", "Chào anh/chị!");
 */
export class Omnichannel {
  private http: HttpClient;

  account: AccountResource;
  channels: ChannelsResource;
  conversations: ConversationsResource;
  messages: MessagesResource;
  media: MediaResource;
  customers: CustomersResource;
  tags: TagsResource;
  users: UsersResource;
  orders: OrdersResource;
  webhooks: WebhooksResource;
  widget: WidgetResource;
  stats: StatsResource;
  sandbox: SandboxResource;

  constructor(options: OmnichannelOptions = {}) {
    const baseUrl =
      options.baseUrl || (options.sandbox ? SANDBOX_URL : PRODUCTION_URL);
    this.http = new HttpClient({
      baseUrl,
      accessToken: options.accessToken,
      timeout: options.timeout,
      maxRetries: options.maxRetries,
    });

    this.account = new AccountResource(this.http);
    this.channels = new ChannelsResource(this.http);
    this.conversations = new ConversationsResource(this.http);
    this.messages = new MessagesResource(this.http);
    this.media = new MediaResource(this.http);
    this.customers = new CustomersResource(this.http);
    this.tags = new TagsResource(this.http);
    this.users = new UsersResource(this.http);
    this.orders = new OrdersResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
    this.widget = new WidgetResource(this.http);
    this.stats = new StatsResource(this.http);
    this.sandbox = new SandboxResource(this.http);
  }

  setAccessToken(token: string): void {
    this.http.setToken(token);
  }

  /** GET /v1/me (tiện ích). */
  me() {
    return this.account.me();
  }

  get baseUrl(): string {
    return this.http.baseUrl;
  }
}
