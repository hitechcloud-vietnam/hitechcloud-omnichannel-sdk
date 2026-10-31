/** HTTP client cấp thấp cho Omnichannel API. */

import { OmnichannelError, errorFromResponse } from "./errors";

export const SDK_VERSION = "1.0.0";

export interface HttpClientOptions {
  baseUrl: string;
  accessToken?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface Envelope<T = any> {
  status: string;
  data?: T;
  meta?: { pagination?: Record<string, any> } & Record<string, any>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class HttpClient {
  baseUrl: string;
  private accessToken?: string;
  private timeout: number;
  private maxRetries: number;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.accessToken = options.accessToken;
    this.timeout = options.timeout ?? 30000;
    this.maxRetries = options.maxRetries ?? 3;
  }

  setToken(token: string): void {
    this.accessToken = token;
  }

  clearToken(): void {
    this.accessToken = undefined;
  }

  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(this.baseUrl + path);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null) continue;
        url.searchParams.append(k, String(v));
      }
    }
    return url.toString();
  }

  async request<T = any>(
    method: string,
    path: string,
    opts: { params?: Record<string, any>; body?: any; form?: any } = {},
  ): Promise<Envelope<T>> {
    const url = this.buildUrl(path, opts.params);
    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": `HiTechCloud-Omnichannel-Node/${SDK_VERSION}`,
    };
    if (this.accessToken) headers["Authorization"] = `Bearer ${this.accessToken}`;

    let payload: any;
    if (opts.form !== undefined) {
      payload = opts.form; // FormData — fetch sẽ tự set Content-Type/boundary
    } else if (opts.body !== undefined) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(opts.body);
    }

    let lastError: any;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);
      try {
        const resp = await fetch(url, {
          method,
          headers,
          body: payload,
          signal: controller.signal,
        });
        clearTimeout(timer);

        const retryHeader = resp.headers.get("Retry-After");
        const retryAfter = retryHeader ? parseInt(retryHeader, 10) : null;

        if (resp.status === 429 && attempt < this.maxRetries) {
          await sleep((retryAfter ?? Math.pow(2, attempt)) * 1000);
          continue;
        }
        if (resp.status >= 500 && attempt < this.maxRetries) {
          await sleep(Math.pow(2, attempt) * 1000);
          continue;
        }

        const text = await resp.text();
        let body: any = null;
        if (text) {
          try {
            body = JSON.parse(text);
          } catch {
            if (resp.status >= 400) {
              throw errorFromResponse(resp.status, { message: text.slice(0, 200) }, retryAfter);
            }
            throw new OmnichannelError("Phản hồi không phải JSON hợp lệ");
          }
        }

        if (resp.status >= 400 || (body && body.status === "error")) {
          throw errorFromResponse(resp.status, body || {}, retryAfter);
        }
        return body as Envelope<T>;
      } catch (err: any) {
        clearTimeout(timer);
        if (err instanceof OmnichannelError) throw err;
        lastError = err;
        if (attempt < this.maxRetries) {
          await sleep(Math.pow(2, attempt) * 1000);
          continue;
        }
      }
    }
    throw new OmnichannelError(
      `Yêu cầu thất bại sau ${this.maxRetries} lần thử: ${lastError?.message ?? "unknown"}`,
    );
  }

  get<T = any>(path: string, params?: Record<string, any>): Promise<Envelope<T>> {
    return this.request<T>("GET", path, { params });
  }

  post<T = any>(path: string, body?: any): Promise<Envelope<T>> {
    return this.request<T>("POST", path, { body });
  }

  postForm<T = any>(path: string, form: any): Promise<Envelope<T>> {
    return this.request<T>("POST", path, { form });
  }

  put<T = any>(path: string, body?: any): Promise<Envelope<T>> {
    return this.request<T>("PUT", path, { body });
  }

  delete<T = any>(path: string): Promise<Envelope<T>> {
    return this.request<T>("DELETE", path);
  }
}

/** Bỏ các khoá có giá trị undefined/null. */
export function clean<T extends Record<string, any>>(obj: T): Partial<T> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out as Partial<T>;
}
