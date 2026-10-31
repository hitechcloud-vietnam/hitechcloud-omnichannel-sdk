import { BaseResource } from "./base";
import { clean, Envelope } from "../httpClient";
import { SendMessageBody } from "./conversations";

/** Tin nhắn (messages) — tiện ích trỏ về /v1/conversations/{id}/messages. */
export class MessagesResource extends BaseResource {
  /** POST /v1/conversations/{id}/messages */
  send(conversationId: string, body: SendMessageBody): Promise<Envelope> {
    return this.http.post(`/v1/conversations/${conversationId}/messages`, clean(body as any));
  }

  sendText(conversationId: string, text: string, idempotencyKey?: string): Promise<Envelope> {
    return this.send(conversationId, { type: "text", text, idempotency_key: idempotencyKey });
  }

  sendImage(conversationId: string, attachmentIds: string[], idempotencyKey?: string): Promise<Envelope> {
    return this.send(conversationId, {
      type: "image",
      attachment_ids: attachmentIds,
      idempotency_key: idempotencyKey,
    });
  }

  replyComment(
    conversationId: string,
    replyToMessageId: string,
    text: string,
    mentions?: Array<Record<string, any>>,
  ): Promise<Envelope> {
    return this.send(conversationId, {
      type: "comment_reply",
      reply_to_message_id: replyToMessageId,
      text,
      mentions,
    });
  }

  privateReply(conversationId: string, replyToMessageId: string, text: string): Promise<Envelope> {
    return this.send(conversationId, {
      type: "private_reply",
      reply_to_message_id: replyToMessageId,
      text,
    });
  }

  sendTemplate(
    conversationId: string,
    templateId: string,
    templateParams?: Record<string, any>,
  ): Promise<Envelope> {
    return this.send(conversationId, {
      type: "template",
      template_id: templateId,
      template_params: templateParams,
    });
  }

  /** GET /v1/conversations/{id}/messages */
  history(conversationId: string, params: { before?: string; per_page?: number } = {}): Promise<Envelope> {
    return this.http.get(`/v1/conversations/${conversationId}/messages`, clean(params));
  }
}
