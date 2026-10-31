#!/usr/bin/env node
/**
 * HiTechCloud Omnichannel MCP Server
 *
 * Model Context Protocol server cho HiTechCloud Omnichannel API.
 * Cho phép trợ lý AI đọc hội thoại, gửi tin nhắn, gắn nhãn, phân công,
 * quản lý khách hàng và đơn hàng qua các "tool" chuẩn MCP.
 *
 * Cấu hình:
 *   OMNI_ACCESS_TOKEN  Access token (bắt buộc)
 *   OMNI_BASE_URL      Base URL (mặc định https://omni.hitechcloud.vn)
 */
"use strict";

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");

const BASE_URL = (process.env.OMNI_BASE_URL || "https://omni.hitechcloud.vn").replace(/\/+$/, "");
const ACCESS_TOKEN = process.env.OMNI_ACCESS_TOKEN;

async function apiCall(method, path, { query, body } = {}) {
  let url = BASE_URL + path;
  if (query) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") qs.append(k, String(v));
    }
    const s = qs.toString();
    if (s) url += "?" + s;
  }

  const headers = {
    Accept: "application/json",
    "User-Agent": "HiTechCloud-Omnichannel-MCP/1.0",
  };
  if (ACCESS_TOKEN) headers["Authorization"] = `Bearer ${ACCESS_TOKEN}`;

  const opts = { method, headers };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { status: res.ok ? "success" : "error", raw: text };
  }
}

const TOOLS = [
  {
    name: "list_channels",
    description: "Liệt kê các kênh đã kết nối (Facebook, Instagram, Zalo, TikTok, Web).",
    inputSchema: {
      type: "object",
      properties: {
        platform: { type: "string", description: "facebook|instagram|zalo|tiktok|web" },
        connected: { type: "boolean" },
      },
    },
  },
  {
    name: "list_conversations",
    description: "Liệt kê hội thoại của một kênh, có thể lọc theo nhãn/người phụ trách/chưa đọc.",
    inputSchema: {
      type: "object",
      properties: {
        channel_id: { type: "string" },
        type: { type: "string", description: "inbox|comment|all" },
        unread_first: { type: "boolean" },
        per_page: { type: "number" },
      },
    },
  },
  {
    name: "get_conversation",
    description: "Lấy chi tiết một hội thoại theo id.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "list_messages",
    description: "Đọc lịch sử tin nhắn của một hội thoại.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" }, per_page: { type: "number" } },
      required: ["id"],
    },
  },
  {
    name: "send_message",
    description: "Gửi tin nhắn văn bản trả lời khách trong một hội thoại.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "id hội thoại" },
        text: { type: "string" },
      },
      required: ["id", "text"],
    },
  },
  {
    name: "tag_conversation",
    description: "Gắn hoặc gỡ nhãn cho một hội thoại.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        action: { type: "string", description: "add|remove" },
        tags: { type: "array", items: { type: "string" } },
      },
      required: ["id", "action", "tags"],
    },
  },
  {
    name: "assign_conversation",
    description: "Phân công hội thoại cho một hoặc nhiều nhân viên.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        assignee_ids: { type: "array", items: { type: "string" } },
      },
      required: ["id", "assignee_ids"],
    },
  },
  {
    name: "list_customers",
    description: "Liệt kê / tìm kiếm khách hàng.",
    inputSchema: {
      type: "object",
      properties: { q: { type: "string" }, channel_id: { type: "string" } },
    },
  },
  {
    name: "create_order",
    description: "Tạo đơn hàng từ một hội thoại.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: { type: "string" },
        items: { type: "array", items: { type: "object" } },
        note: { type: "string" },
      },
      required: ["conversation_id", "items"],
    },
  },
  {
    name: "get_statistics",
    description: "Thống kê theo kênh trong khoảng thời gian (since, until).",
    inputSchema: {
      type: "object",
      properties: {
        since: { type: "string" },
        until: { type: "string" },
      },
      required: ["since", "until"],
    },
  },
];

const HANDLERS = {
  list_channels: (a) =>
    apiCall("GET", "/v1/channels", { query: { platform: a.platform, connected: a.connected } }),
  list_conversations: (a) => apiCall("GET", "/v1/conversations", { query: a }),
  get_conversation: (a) => apiCall("GET", `/v1/conversations/${a.id}`),
  list_messages: (a) =>
    apiCall("GET", `/v1/conversations/${a.id}/messages`, { query: { per_page: a.per_page } }),
  send_message: (a) =>
    apiCall("POST", `/v1/conversations/${a.id}/messages`, { body: { type: "text", text: a.text } }),
  tag_conversation: (a) =>
    apiCall("POST", `/v1/conversations/${a.id}/tags`, { body: { action: a.action, tags: a.tags } }),
  assign_conversation: (a) =>
    apiCall("POST", `/v1/conversations/${a.id}/assign`, { body: { assignee_ids: a.assignee_ids } }),
  list_customers: (a) => apiCall("GET", "/v1/customers", { query: a }),
  create_order: (a) =>
    apiCall("POST", "/v1/orders", {
      body: { conversation_id: a.conversation_id, items: a.items, note: a.note },
    }),
  get_statistics: (a) =>
    apiCall("GET", "/v1/stats/channels", { query: { since: a.since, until: a.until } }),
};

async function main() {
  const server = new Server(
    { name: "hitechcloud-omnichannel", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const handler = HANDLERS[name];
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }
    const result = await handler(args || {});
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("HiTechCloud Omnichannel MCP server running on stdio");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
