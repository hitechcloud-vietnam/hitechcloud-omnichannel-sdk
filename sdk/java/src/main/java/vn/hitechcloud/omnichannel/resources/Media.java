package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;
import vn.hitechcloud.omnichannel.OmnichannelException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

/** Media (upload). */
public class Media extends BaseResource {
    public Media(HttpClient http) {
        super(http);
    }

    /** POST /v1/media — Tải lên bytes (multipart/form-data). */
    public Map<String, Object> upload(byte[] data, String filename, String channelId) {
        return http.postMultipart("/v1/media", data, filename == null ? "upload" : filename, channelId);
    }

    /** POST /v1/media — Tải lên theo đường dẫn tệp. */
    public Map<String, Object> uploadFile(Path path, String channelId) {
        try {
            byte[] data = Files.readAllBytes(path);
            return upload(data, path.getFileName().toString(), channelId);
        } catch (IOException e) {
            throw new OmnichannelException("Không đọc được tệp: " + e.getMessage());
        }
    }
}
