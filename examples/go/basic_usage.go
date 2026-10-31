// Ví dụ cơ bản — HiTechCloud Omnichannel Go SDK
//
//	export OMNI_ACCESS_TOKEN=your-access-token
//	go run basic_usage.go
package main

import (
	"fmt"
	"os"

	omnichannel "github.com/hitechcloud-vietnam/hitechcloud-omnichannel-sdk/go"
)

func main() {
	c := omnichannel.NewClient(
		omnichannel.WithAccessToken(os.Getenv("OMNI_ACCESS_TOKEN")),
	)

	// 1) Liệt kê kênh Facebook đã kết nối
	env, err := c.Channels.List(omnichannel.Params(map[string]string{
		"platform":  "facebook",
		"connected": "true",
	}))
	if err != nil {
		fmt.Println("Lỗi:", err)
		os.Exit(1)
	}

	var channels []map[string]interface{}
	_ = env.DecodeData(&channels)
	if len(channels) == 0 {
		return
	}

	channelID, _ := channels[0]["id"].(string)
	fmt.Println("Kênh đầu tiên:", channelID)

	// 2) Trả lời một hội thoại
	_, err = c.Messages.SendText("cnv_01HZABCDEF", "Chào anh/chị!", "reply-001")
	if err != nil {
		if apiErr, ok := err.(*omnichannel.APIError); ok && apiErr.Kind() == omnichannel.KindMessagingWindow {
			fmt.Println("Ngoài cửa sổ 24h — cần gửi theo mẫu (template).")
		} else {
			fmt.Println("Lỗi gửi:", err)
		}
	}

	// 3) Thống kê theo kênh
	stats, err := c.Stats.Channels("2026-10-01", "2026-10-31")
	if err == nil {
		fmt.Printf("Thống kê: %s\n", string(stats.Data))
	}
}
