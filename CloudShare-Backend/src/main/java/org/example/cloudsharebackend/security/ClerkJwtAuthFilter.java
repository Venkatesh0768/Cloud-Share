package org.example.cloudsharebackend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.services.ProfileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.PublicKey;
import java.util.Base64;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ClerkJwtAuthFilter extends OncePerRequestFilter {

    @Value("${clerk.issuer}")
    private String clerkIssuer;

    private final ClerkJwksProvider jwksProvider;
    private final ProfileService profileService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (request.getRequestURI().contains("/webhook")
                || request.getRequestURI().contains("/files/public")
                || request.getRequestURI().contains("/files/download")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
            return;
        }

        try {
            String jwtToken = authorizationHeader.substring(7);

            // Extract kid
            String[] chunks = jwtToken.split("\\.");
            String headerJson = new String(Base64.getUrlDecoder().decode(chunks[0]));
            ObjectMapper mapper = new ObjectMapper();
            JsonNode headerNode = mapper.readTree(headerJson);
            String kid = headerNode.get("kid").asText();

            PublicKey publicKey = jwksProvider.getPublicKey(kid);

            Claims claims = Jwts.parser()
                    .setSigningKey(publicKey)
                    .requireIssuer(clerkIssuer)
                    .build()
                    .parseSignedClaims(jwtToken)
                    .getPayload();

            String clerkId = claims.getSubject();
            
            // Get role from database instead of JWT token
            String role = "USER"; // Default role
            try {
                var profile = profileService.findProfileByClerkId(clerkId);
                if (profile.isPresent() && profile.get().getRole() != null) {
                    role = profile.get().getRole().toUpperCase();
                }
            } catch (Exception e) {
                // If profile not found, use default role
                role = "USER";
            }

            List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())
            );

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(clerkId, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token: " + e.getMessage());
        }
    }
}