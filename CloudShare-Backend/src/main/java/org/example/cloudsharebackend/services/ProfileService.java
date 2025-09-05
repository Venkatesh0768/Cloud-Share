package org.example.cloudsharebackend.services;

import org.example.cloudsharebackend.documents.ProfileDocument;
import org.example.cloudsharebackend.dtos.ProfileDto;
import org.example.cloudsharebackend.repositories.ProfileRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public ProfileDto findProfileByEmail(String email) {
        Optional<ProfileDocument> profileDocument = profileRepository.findByEmail(email);
        return profileDocument.map(this::convertToDto).orElse(null);
    }

    public Optional<ProfileDto> findProfileByClerkId(String clerkId) {
        return profileRepository.findByClerkId(clerkId).map(this::convertToDto);
    }

    public List<ProfileDto> getAllProfiles() {
        return profileRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProfileDto createProfile(ProfileDto profileDto) {
        if (profileRepository.existsByClerkId(profileDto.getClerkId())) {
            throw new IllegalArgumentException("Profile already exists for clerkId: " + profileDto.getClerkId());
        }
        profileRepository.findByEmail(profileDto.getEmail())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Profile already exists for email: " + profileDto.getEmail());
                });
        ProfileDocument profileDocument = ProfileDocument.builder()
                .clerkId(profileDto.getClerkId())
                .firstName(profileDto.getFirstName())
                .lastName(profileDto.getLastName())
                .email(profileDto.getEmail())
                .role(profileDto.getRole())
                .credits(profileDto.getCredits() != null ? profileDto.getCredits() : 0)
                .profileUrl(profileDto.getProfileUrl())
                .role(profileDto.getRole() != null ? profileDto.getRole() : "USER")
                .createdAt(profileDto.getCreatedAt())
                .updatedAt(profileDto.getUpdatedAt())
                .build();
        ProfileDocument savedDocument = profileRepository.save(profileDocument);
        return convertToDto(savedDocument);
    }

    public ProfileDto updateProfile(ProfileDto profileDto) {
        ProfileDocument existingDocument = profileRepository.findByClerkId(profileDto.getClerkId())
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for clerkId: " + profileDto.getClerkId()));
        existingDocument.setFirstName(profileDto.getFirstName());
        existingDocument.setLastName(profileDto.getLastName());
        existingDocument.setEmail(profileDto.getEmail());

        existingDocument.setCredits(profileDto.getCredits());
        existingDocument.setProfileUrl(profileDto.getProfileUrl());
        existingDocument.setRole(profileDto.getRole() != null ? profileDto.getRole() : existingDocument.getRole());
        existingDocument.setUpdatedAt(profileDto.getUpdatedAt());
        ProfileDocument updatedDocument = profileRepository.save(existingDocument);
        return convertToDto(updatedDocument);
    }

    private ProfileDto convertToDto(ProfileDocument document) {
        return ProfileDto.builder()
                .id(document.getId())
                .clerkId(document.getClerkId())
                .firstName(document.getFirstName())
                .lastName(document.getLastName())
                .email(document.getEmail())
                .credits(document.getCredits())
                .profileUrl(document.getProfileUrl())
                .role(document.getRole())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }

    public boolean existsByClerkId(String clerkId) {
        return profileRepository.existsByClerkId(clerkId);
    }

    public void deleteProfile(String clerkId) {
        ProfileDocument profileDocument = profileRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for clerkId: " + clerkId));
        profileRepository.delete(profileDocument);
    }

    public ProfileDocument getCurrentProfile() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new UsernameNotFoundException("User not authenticated");
        }
        String clerkId = SecurityContextHolder.getContext().getAuthentication().getName();
        return profileRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException("Profile not found for clerkId: " + clerkId));
    }

    public int updateAllUsersWithoutRole() {
        List<ProfileDocument> usersWithoutRole = profileRepository.findAll().stream()
                .filter(user -> user.getRole() == null || user.getRole().isEmpty())
                .collect(Collectors.toList());
        
        for (ProfileDocument user : usersWithoutRole) {
            user.setRole("USER");
            profileRepository.save(user);
        }
        
        return usersWithoutRole.size();
    }
}