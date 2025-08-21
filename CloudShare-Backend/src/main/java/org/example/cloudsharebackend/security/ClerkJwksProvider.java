package org.example.cloudsharebackend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ClerkJwksProvider {

    @Value("${clerk.jwks.url}")
    private String jwksUrl;

    private final Map<String, PublicKey> keyCache = new ConcurrentHashMap<>();
    private long lastFetchTime = 0;
    private static final long CACHE_EXPIRY = 3600000; // 1 hour in ms

    public PublicKey getPublicKey(String kid) throws Exception {
        // Return from cache if still valid
        if (keyCache.containsKey(kid) && (System.currentTimeMillis() - lastFetchTime < CACHE_EXPIRY)) {
            return keyCache.get(kid);
        }

        // Refresh keys
        refreshKeys();

        PublicKey key = keyCache.get(kid);
        if (key == null) {
            throw new IllegalArgumentException("Public key with kid=" + kid + " not found in JWKS");
        }
        return key;
    }

    private synchronized void refreshKeys() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jwks = mapper.readTree(new URL(jwksUrl));
        JsonNode keys = jwks.get("keys");

        if (keys == null || !keys.isArray()) {
            throw new IllegalStateException("Invalid JWKS response from Clerk");
        }

        for (JsonNode key : keys) {
            String kid = key.get("kid").asText();
            String kty = key.get("kty").asText();
            String alg = key.get("alg").asText();

            if ("RSA".equals(kty) && "RS256".equals(alg)) {
                String n = key.get("n").asText();
                String e = key.get("e").asText();
                PublicKey publicKey = createPublicKey(n, e);
                keyCache.put(kid, publicKey);
            } else {
                // Unsupported key type / algorithm
                System.err.println("Skipping unsupported key type=" + kty + " alg=" + alg);
            }
        }
        lastFetchTime = System.currentTimeMillis();
    }

    private PublicKey createPublicKey(String modulus, String exponent) throws Exception {
        byte[] modulusBytes = Base64.getUrlDecoder().decode(modulus);
        byte[] exponentBytes = Base64.getUrlDecoder().decode(exponent);

        BigInteger modulusBigInt = new BigInteger(1, modulusBytes);
        BigInteger exponentBigInt = new BigInteger(1, exponentBytes);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(modulusBigInt, exponentBigInt);
        KeyFactory factory = KeyFactory.getInstance("RSA");
        return factory.generatePublic(spec);
    }
}
