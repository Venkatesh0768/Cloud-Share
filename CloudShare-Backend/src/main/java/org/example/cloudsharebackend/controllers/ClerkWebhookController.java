package org.example.cloudsharebackend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.dtos.ProfileDto;
import org.example.cloudsharebackend.services.ProfileService;
import org.example.cloudsharebackend.services.UserCreditService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
public class ClerkWebhookController {

    @Value("${clerk.webhook.secret}")
    private String clerkWebhookSecret;

    private final ProfileService profileService;
    private final UserCreditService userCreditService;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(@RequestHeader("svix-id") String svixId,
                                                @RequestHeader("svix-timestamp") String svixTimestamp,
                                                @RequestHeader("svix-signature") String svixSignature,
                                                @RequestBody String payload) {
        try {
            boolean isValid = verifyWebhookSignature(svixId, svixTimestamp, svixSignature, payload);
            if (!isValid) {
                return ResponseEntity.status(403).body("Invalid signature");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode payloadNode = mapper.readTree(payload);
            String eventType = payloadNode.get("type").asText();

            switch (eventType) {
                case "user.created":
                    handleUserCreated(payloadNode.path("data"));
                    break;
                case "user.updated":
                    handleUserUpdated(payloadNode.path("data"));
                    break;
                case "user.deleted":
                    handleUserDeleted(payloadNode.path("data"));
                    break;
                default:
                    return ResponseEntity.status(400).body("Unsupported event type: " + eventType);
            }

            return ResponseEntity.ok("Webhook processed successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid webhook request: " + e.getMessage());
        }
    }

    private void handleUserDeleted(JsonNode data) {
        String clerkId = data.get("id").asText();
        profileService.deleteProfile(clerkId);
    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId = data.get("id").asText();
        String firstName = data.path("first_name").asText();
        String lastName = data.path("last_name").asText();
        String profileUrl = data.path("image_url").asText();
        String email = "";

        JsonNode emailNode = data.path("email_addresses").get(0);
        if (emailNode != null && emailNode.has("email_address")) {
            email = emailNode.get("email_address").asText();
        }

        // Extract role from public_metadata
        String role = "USER"; // Default role
        JsonNode publicMetadata = data.path("public_metadata");
        if (publicMetadata.has("role")) {
            role = publicMetadata.get("role").asText().toUpperCase();
        }

        ProfileDto updatedProfile = ProfileDto.builder()
                .clerkId(clerkId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .role(role)
                .profileUrl(profileUrl)
                .role(role)
                .build();

        profileService.updateProfile(updatedProfile);
    }

    private void handleUserCreated(JsonNode data) {
        String clerkId = data.get("id").asText();
        String firstName = data.path("first_name").asText();
        String lastName = data.path("last_name").asText();
        String profileUrl = data.path("image_url").asText();
        String email = "";

        JsonNode emailNode = data.path("email_addresses").get(0);
        if (emailNode != null && emailNode.has("email_address")) {
            email = emailNode.get("email_address").asText();
        }

        // Extract role from public_metadata
        String role = "USER"; // Default role
        JsonNode publicMetadata = data.path("public_metadata");
        if (publicMetadata.has("role")) {
            role = publicMetadata.get("role").asText().toUpperCase();
        }

        ProfileDto newProfile = ProfileDto.builder()
                .clerkId(clerkId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .profileUrl(profileUrl)
                .role(role)
                .build();

        profileService.createProfile(newProfile);
        userCreditService.createInitialCredits(clerkId);
    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
        // TODO: Implement real verification using Clerk’s SDK or HMAC with svix-secret
        return true;
    }
}
