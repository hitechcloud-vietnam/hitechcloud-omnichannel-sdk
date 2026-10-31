package vn.hitechcloud.omnichannel;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** HTTP client cấp thấp cho Omnichannel API. */
public class HttpClient {
    static final String VERSION = "1.0.0";
    private static final Type MAP_TYPE = new TypeToken<Map<String, Object>>() {}.getType();

    private final String baseUrl;
    private final int maxRetries;
    private final Gson gson = new Gson();
    private final java.net.http.HttpClient client;
    private String accessToken;

    public HttpClient(String baseUrl, String accessToken, int timeoutSeconds, int maxRetries) {
        this.baseUrl = baseUrl.replaceAll("/+$", "");
        this.accessToken = accessToken;
        this.maxRetries = maxRetries;
        this.client = java.net.http.HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(timeoutSeconds))
                .build();
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setToken(String accessToken) {
        this.accessToken = accessToken;
    }

    private HttpRequest.Builder baseRequest(String path, Map<String, String> params) {
        StringBuilder url = new StringBuilder(baseUrl).append(path);
        if (params != null && !params.isEmpty()) {
            StringBuilder qs = new StringBuilder();
            for (Map.Entry<String, String> e : params.entrySet()) {
                if (e.getValue() == null) continue;
                if (qs.length() > 0) qs.append("&");
                qs.append(URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8))
                  .append("=")
                  .append(URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8));
            }
            if (qs.length() > 0) url.append("?").append(qs);
        }
        HttpRequest.Builder b = HttpRequest.newBuilder()
                .uri(URI.create(url.toString()))
                .header("Accept", "application/json")
                .header("User-Agent", "HiTechCloud-Omnichannel-Java/" + VERSION);
        if (accessToken != null) {
            b.header("Authorization", "Bearer " + accessToken);
        }
        return b;
    }

    public Map<String, Object> request(String method, String path, Map<String, String> params, Object body) {
        Exception lastError = null;

        for (int attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                HttpRequest.Builder b = baseRequest(path, params);
                if (body != null) {
                    b.header("Content-Type", "application/json");
                    b.method(method, HttpRequest.BodyPublishers.ofString(gson.toJson(body), StandardCharsets.UTF_8));
                } else {
                    b.method(method, HttpRequest.BodyPublishers.noBody());
                }

                HttpResponse<String> resp = client.send(b.build(), HttpResponse.BodyHandlers.ofString());
                int status = resp.statusCode();
                Integer retryAfter = parseRetryAfter(resp);

                if (status == 429 && attempt < maxRetries) {
                    Thread.sleep((retryAfter != null ? retryAfter : (1L << attempt)) * 1000L);
                    continue;
                }
                if (status >= 500 && attempt < maxRetries) {
                    Thread.sleep((1L << attempt) * 1000L);
                    continue;
                }

                return parse(status, resp.body(), retryAfter);
            } catch (OmnichannelException e) {
                throw e;
            } catch (Exception e) {
                lastError = e;
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep((1L << attempt) * 1000L);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                    continue;
                }
            }
        }
        throw new OmnichannelException("Yêu cầu thất bại: "
                + (lastError != null ? lastError.getMessage() : "unknown"));
    }

    private Map<String, Object> parse(int status, String raw, Integer retryAfter) {
        Map<String, Object> body = null;
        if (raw != null && !raw.isEmpty()) {
            body = gson.fromJson(raw, MAP_TYPE);
        }
        boolean envelopeError = body != null && "error".equals(body.get("status"));
        if (status >= 400 || envelopeError) {
            throw ErrorFactory.make(status, body, retryAfter);
        }
        return body;
    }

    private Integer parseRetryAfter(HttpResponse<String> resp) {
        return resp.headers().firstValue("Retry-After")
                .map(v -> {
                    try {
                        return Integer.parseInt(v);
                    } catch (NumberFormatException ex) {
                        return null;
                    }
                })
                .orElse(null);
    }

    public Map<String, Object> get(String path, Map<String, String> params) {
        return request("GET", path, params, null);
    }

    public Map<String, Object> get(String path) {
        return request("GET", path, null, null);
    }

    public Map<String, Object> post(String path, Object body) {
        return request("POST", path, null, body);
    }

    public Map<String, Object> put(String path, Object body) {
        return request("PUT", path, null, body);
    }

    public Map<String, Object> delete(String path) {
        return request("DELETE", path, null, null);
    }

    /** POST multipart/form-data (dùng cho upload media). Không retry. */
    public Map<String, Object> postMultipart(String path, byte[] fileBytes, String filename, String channelId) {
        String boundary = "----htcomni" + System.currentTimeMillis();
        List<byte[]> parts = new ArrayList<>();
        String nl = "\r\n";

        StringBuilder head = new StringBuilder();
        head.append("--").append(boundary).append(nl);
        head.append("Content-Disposition: form-data; name=\"file\"; filename=\"")
            .append(filename).append("\"").append(nl);
        head.append("Content-Type: application/octet-stream").append(nl).append(nl);
        parts.add(head.toString().getBytes(StandardCharsets.UTF_8));
        parts.add(fileBytes);
        parts.add(nl.getBytes(StandardCharsets.UTF_8));

        if (channelId != null) {
            StringBuilder field = new StringBuilder();
            field.append("--").append(boundary).append(nl);
            field.append("Content-Disposition: form-data; name=\"channel_id\"").append(nl).append(nl);
            field.append(channelId).append(nl);
            parts.add(field.toString().getBytes(StandardCharsets.UTF_8));
        }
        parts.add(("--" + boundary + "--" + nl).getBytes(StandardCharsets.UTF_8));

        int total = 0;
        for (byte[] p : parts) total += p.length;
        byte[] payload = new byte[total];
        int pos = 0;
        for (byte[] p : parts) {
            System.arraycopy(p, 0, payload, pos, p.length);
            pos += p.length;
        }

        try {
            HttpRequest.Builder b = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + path))
                    .header("Accept", "application/json")
                    .header("User-Agent", "HiTechCloud-Omnichannel-Java/" + VERSION)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary);
            if (accessToken != null) {
                b.header("Authorization", "Bearer " + accessToken);
            }
            b.POST(HttpRequest.BodyPublishers.ofByteArray(payload));
            HttpResponse<String> resp = client.send(b.build(), HttpResponse.BodyHandlers.ofString());
            return parse(resp.statusCode(), resp.body(), parseRetryAfter(resp));
        } catch (OmnichannelException e) {
            throw e;
        } catch (Exception e) {
            throw new OmnichannelException("Upload thất bại: " + e.getMessage());
        }
    }
}
