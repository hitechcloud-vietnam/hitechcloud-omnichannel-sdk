package vn.hitechcloud.omnichannel.resources;

import vn.hitechcloud.omnichannel.HttpClient;

import java.util.LinkedHashMap;
import java.util.Map;

public abstract class BaseResource {
    protected final HttpClient http;

    protected BaseResource(HttpClient http) {
        this.http = http;
    }

    /** Builder gọn cho query string / body, tự bỏ giá trị null. */
    public static final class Q {
        private final Map<String, String> map = new LinkedHashMap<>();

        public static Q of() {
            return new Q();
        }

        public Q p(String key, Object value) {
            if (value != null) {
                map.put(key, String.valueOf(value));
            }
            return this;
        }

        public Map<String, String> build() {
            return map;
        }
    }

    protected static Map<String, Object> clean(Map<String, Object> body) {
        Map<String, Object> out = new LinkedHashMap<>();
        for (Map.Entry<String, Object> e : body.entrySet()) {
            if (e.getValue() != null) {
                out.put(e.getKey(), e.getValue());
            }
        }
        return out;
    }
}
