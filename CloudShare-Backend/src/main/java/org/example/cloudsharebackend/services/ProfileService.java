package org.example.cloudsharebackend.services;

import org.example.cloudsharebackend.documents.ProfileDocument;
import org.example.cloudsharebackend.dtos.ProfileDto;
import org.example.cloudsharebackend.repositories.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public ProfileDto createProfile(ProfileDto profileDto) {

        if(profileRepository.existsByClerkId(profileDto.getClerkId())) {
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
                .credits(profileDto.getCredits() != null ? profileDto.getCredits() : 0)
                .profileUrl(profileDto.getProfileUrl())
                .createdAt(profileDto.getCreatedAt())
                .updatedAt(profileDto.getUpdatedAt())
                .build();

        ProfileDocument savedDocument = profileRepository.save(profileDocument);
        return convertToDto(savedDocument);
    }

    public ProfileDto updateProfile(ProfileDto profileDto) {
        ProfileDocument existingDocument = profileRepository.findByClerkId(profileDto.getClerkId())
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for id: " + profileDto.getId()));

        existingDocument.setClerkId(profileDto.getClerkId());
        existingDocument.setFirstName(profileDto.getFirstName());
        existingDocument.setLastName(profileDto.getLastName());
        existingDocument.setEmail(profileDto.getEmail());
        existingDocument.setCredits(profileDto.getCredits());
        existingDocument.setProfileUrl(profileDto.getProfileUrl());
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
                .createdAt(document.getCreatedAt())
                .build();
    }

    public boolean existsByClerkId(String clerkId) {
        return profileRepository.existsByClerkId(clerkId);
    }


    public void  deleteProfile(String clerkId) {
        ProfileDocument profileDocument = profileRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for clerkId: " + clerkId));
        profileRepository.delete(profileDocument);
    }
}
