import { BaseResource } from "./base";
import { clean, Envelope } from "../httpClient";

export interface ListChannelsParams {
  platform?: string;
  connected?: boolean;
  page?: number;
  per_page?: number;
}

export interface ListPostsParams {
  since: string;
  until: string;
  type?: string;
  page?: number;
  per_page?: number;
}

export interface ExportParams {
  since: string;
  until: string;
  action?: string;
  offset?: number;
}

export interface CallLogsParams {
  page?: number;
  per_page?: number;
  since?: string;
  until?: string;
}

/** Kênh (channels): Facebook, Instagram, Zalo, TikTok, Web. */
export class ChannelsResource extends BaseResource {
  /** GET /v1/channels */
  list(params: ListChannelsParams = {}): Promise<Envelope> {
    return this.http.get("/v1/channels", clean(params));
  }

  /** GET /v1/channels/{id} */
  get(id: string): Promise<Envelope> {
    return this.http.get(`/v1/channels/${id}`);
  }

  /** POST /v1/channels/{id}/access-token */
  createAccessToken(id: string, scopes?: string[]): Promise<Envelope> {
    return this.http.post(`/v1/channels/${id}/access-token`, clean({ scopes }));
  }

  /** GET /v1/channels/{id}/posts */
  listPosts(id: string, params: ListPostsParams): Promise<Envelope> {
    return this.http.get(`/v1/channels/${id}/posts`, clean(params));
  }

  /** URL ảnh đại diện (endpoint trả 301 redirect tới ảnh). */
  avatarUrl(id: string, psid: string): string {
    return `${this.http.baseUrl}/v1/channels/${id}/avatar/${psid}`;
  }

  /** GET /v1/channels/{id}/round-robin */
  getRoundRobin(id: string): Promise<Envelope> {
    return this.http.get(`/v1/channels/${id}/round-robin`);
  }

  /** PUT /v1/channels/{id}/round-robin */
  updateRoundRobin(
    id: string,
    body: { inbox?: string[]; comment?: string[] },
  ): Promise<Envelope> {
    return this.http.put(`/v1/channels/${id}/round-robin`, clean(body));
  }

  /** GET /v1/channels/{id}/export */
  exportConversations(id: string, params: ExportParams): Promise<Envelope> {
    const p = { action: "conversations_from_ads", ...params };
    return this.http.get(`/v1/channels/${id}/export`, clean(p));
  }

  /** GET /v1/channels/{id}/call-logs */
  callLogs(id: string, params: CallLogsParams = {}): Promise<Envelope> {
    const p = { page: 1, ...params };
    return this.http.get(`/v1/channels/${id}/call-logs`, clean(p));
  }
}
