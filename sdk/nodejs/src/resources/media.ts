import { BaseResource } from "./base";
import { Envelope } from "../httpClient";

export interface UploadOptions {
  filename?: string;
  channelId?: string;
  contentType?: string;
}

/** Media (upload). */
export class MediaResource extends BaseResource {
  /**
   * POST /v1/media — Tải lên một tệp media (multipart/form-data).
   * `file` là Blob/Buffer/Uint8Array; trả về Envelope chứa attachment_id.
   */
  upload(file: Blob | Buffer | Uint8Array, opts: UploadOptions = {}): Promise<Envelope> {
    const form = new FormData();
    let blob: Blob;
    if (typeof Blob !== "undefined" && file instanceof Blob) {
      blob = file;
    } else {
      const bytes = file as unknown as BlobPart;
      blob = new Blob([bytes], opts.contentType ? { type: opts.contentType } : undefined);
    }
    form.append("file", blob, opts.filename || "upload");
    if (opts.channelId) form.append("channel_id", opts.channelId);
    return this.http.postForm("/v1/media", form);
  }
}
