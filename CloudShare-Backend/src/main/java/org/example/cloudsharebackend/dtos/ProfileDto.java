package org.example.cloudsharebackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProfileDto {
    private String id;
    private String clerkId;
    private String firstName;
    private String lastName;
    private String email;
    private Integer credits;
    private String profileUrl;
    private String role; // Added role field
    private Instant createdAt;
    private Instant updatedAt;
}
