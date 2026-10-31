# HiTechCloud Omnichannel — MCP Server

Máy chủ [Model Context Protocol](https://modelcontextprotocol.io) cho HiTechCloud Omnichannel API. Cho phép trợ lý AI (Claude, v.v.) đọc hội thoại, gửi tin nhắn, gắn nhãn, phân công, quản lý khách hàng/đơn hàng và xem thống kê.

## Cài đặt

```bash
cd mcp
npm install
```

## Cấu hình

| Biến môi trường | Mô tả |
|---|---|
| `OMNI_ACCESS_TOKEN` | Access token (bắt buộc) |
| `OMNI_BASE_URL` | Base URL (mặc định `https://omni.hitechcloud.vn`) |

## Chạy

```bash
OMNI_ACCESS_TOKEN=YOUR_TOKEN node server.js
```

## Khai báo trong Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "hitechcloud-omnichannel": {
      "command": "node",
      "args": ["/duong-dan/den/mcp/server.js"],
      "env": {
        "OMNI_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN"
      }
    }
  }
}
```

## Tools

`list_channels`, `list_conversations`, `get_conversation`, `list_messages`, `send_message`, `tag_conversation`, `assign_conversation`, `list_customers`, `create_order`, `get_statistics`.

## License

MIT
