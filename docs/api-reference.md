# Tham chiếu API

Host: `https://omni.hitechcloud.vn` · Base path: `/v1` · Xác thực: Bearer token · Định danh: ULID.

Phản hồi theo Envelope thống nhất:

```json
{ "status": "success", "data": [], "meta": { "pagination": { "has_more": false } } }
```

Bảng dưới liệt kê toàn bộ endpoint và phương thức SDK tương ứng (Python; các ngôn ngữ khác đặt tên tương đương: camelCase cho Node/Java/Go, `->` cho PHP).

## Account

| Method | Endpoint | SDK |
|---|---|---|
| GET | `/v1/me` | `account.me()` |

## Channels

| Method | Endpoint | SDK |
|---|---|---|
| GET | `/v1/channels` | `channels.list(...)` |
| GET | `/v1/channels/{id}` | `channels.get(id)` |
| POST | `/v1/channels/{id}/access-token` | `channels.create_access_token(id, scopes)` |
| GET | `/v1/channels/{id}/posts` | `channels.list_posts(id, since, until, ...)` |
| GET | `/v1/channels/{id}/avatar/{psid}` | `channels.avatar_url(id, psid)` (301) |
| GET | `/v1/channels/{id}/round-robin` | `channels.get_round_robin(id)` |
| PUT | `/v1/channels/{id}/round-robin` | `channels.update_round_robin(id, inbox, comment)` |
| GET | `/v1/channels/{id}/export` | `channels.export_conversations(id, since, until, ...)` |
| GET | `/v1/channels/{id}/call-logs` | `channels.call_logs(id, ...)` |

## Conversations

| Method | Endpoint | SDK |
|---|---|---|
| GET | `/v1/conversations` | `conversations.list(...)` |
| GET | `/v1/conversations/{id}` | `conversations.get(id)` |
| GET | `/v1/conversations/{id}/messages` | `conversations.list_messages(id, ...)` |
| POST | `/v1/conversations/{id}/messages` | `conversations.send_message(id, ...)` |
| POST | `/v1/conversations/{id}/tags` | `conversations.tag(id, action, tags)` |
| POST | `/v1/conversations/{id}/assign` | `conversations.assign(id, assignee_ids, strategy)` |
| POST | `/v1/conversations/{id}/read` | `conversations.mark_read(id)` |
| POST | `/v1/conversations/{id}/unread` | `conversations.mark_unread(id)` |

## Messages (tiện ích)

| Phương thức | Mô tả |
|---|---|
| `messages.send_text(id, text)` | Gửi văn bản |
| `messages.send_image(id, attachment_ids)` | Gửi ảnh đã upload |
| `messages.reply_comment(id, reply_to_message_id, text)` | Trả lời bình luận công khai |
| `messages.private_reply(id, reply_to_message_id, text)` | Trả lời riêng |
| `messages.send_template(id, template_id, params)` | Gửi tin theo mẫu |
| `messages.history(id, ...)` | Lịch sử tin nhắn |

Loại tin (`type`): `text`, `image`, `file`, `comment_reply`, `private_reply`, `template`.

## Media

| Method | Endpoint | SDK |
|---|---|---|
| POST | `/v1/media` | `media.upload(file, channel_id=...)` |

## Customers

| Method | Endpoint | SDK |
|---|---|---|
| GET | `/v1/customers` | `customers.list(...)` |
| GET | `/v1/customers/{id}` | `customers.get(id)` |
| PUT | `/v1/customers/{id}` | `customers.update(id, ...)` |
| POST | `/v1/customers/{id}/notes` | `customers.add_note(id, message)` |
| PUT | `/v1/customers/{id}/notes/{note_id}` | `customers.update_note(id, note_id, message)` |
| DELETE | `/v1/customers/{id}/notes/{note_id}` | `customers.delete_note(id, note_id)` |

## Tags / Users

| Method | Endpoint | SDK |
|---|---|---|
| GET | `/v1/tags` | `tags.list()` |
| GET | `/v1/users` | `users.list()` |

## Orders

| Method | Endpoint | SDK |
|---|---|---|
| GET | `/v1/orders` | `orders.list(...)` |
| POST | `/v1/orders` | `orders.create(conversation_id, items, ...)` |
| GET | `/v1/orders/{id}` | `orders.get(id)` |
| PUT | `/v1/orders/{id}` | `orders.update(id, ...)` |

## Webhooks

| Method | Endpoint | SDK |
|---|---|---|
| GET | `/v1/webhooks` | `webhooks.list()` |
| POST | `/v1/webhooks` | `webhooks.create(url, events, channel_ids)` |
| DELETE | `/v1/webhooks/{id}` | `webhooks.delete(id)` |

## Widget (live chat website)

| Method | Endpoint | SDK |
|---|---|---|
| POST | `/v1/widget/messages` | `widget.send_message(...)` |
| GET | `/v1/widget/messages` | `widget.list_messages(channel_id, conversation_id)` |

## Statistics

| Method | Endpoint | SDK |
|---|---|---|
| GET | `/v1/stats/ad-campaigns` | `stats.ad_campaigns(since, until, network)` |
| GET | `/v1/stats/ads` | `stats.ads(since, until, group, network)` |
| GET | `/v1/ads` | `stats.lookup_ads(ad_ids, network)` |
| GET | `/v1/stats/engagements` | `stats.engagements(date_range, by_hour, user_ids)` |
| GET | `/v1/stats/feedbacks` | `stats.feedbacks(since, until)` |
| GET | `/v1/stats/channels` | `stats.channels(since, until)` |
| GET | `/v1/stats/tags` | `stats.tags(since, until)` |
| GET | `/v1/stats/users` | `stats.users(date_range)` |
| GET | `/v1/stats/new-customers` | `stats.new_customers(date_range, group_by)` |

## Sandbox

| Method | Endpoint | SDK |
|---|---|---|
| POST | `/v1/sandbox/simulate/incoming-message` | `sandbox.simulate_incoming_message(channel_id, text, ...)` |

Chi tiết tham số và schema: xem [openapi.json](../openapi.json).
