package org.example.cloudsharebackend.controllers;

import org.example.cloudsharebackend.dtos.ProfileDto;
import org.example.cloudsharebackend.services.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    @GetMapping("/{email}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable String email) {
        return ResponseEntity.ok(service.findProfileByEmail(email));
    }

    @GetMapping("/current")
    public ResponseEntity<ProfileDto> getCurrentProfile() {
        try {
            ProfileDto profile = service.findProfileByClerkId(service.getCurrentProfile().getClerkId()).orElse(null);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerProfile(@RequestBody ProfileDto profileDto) {
        ProfileDto savedProfile = service.createProfile(profileDto);
        if (savedProfile == null) {
            return ResponseEntity.badRequest().body("Profile creation failed. Email might already exist.");
        }
        return ResponseEntity.ok(profileDto);

    }
}
