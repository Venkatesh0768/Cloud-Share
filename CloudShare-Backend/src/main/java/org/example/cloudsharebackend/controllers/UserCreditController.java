package org.example.cloudsharebackend.controllers;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.documents.UserCredits;
import org.example.cloudsharebackend.dtos.UserCreditsDto;
import org.example.cloudsharebackend.services.UserCreditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserCreditController {

    private final UserCreditService userCreditService;

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits() {
        UserCredits userCredits = userCreditService.getUserCredits();
        UserCreditsDto response = UserCreditsDto.builder()
                .credits(userCredits.getCredits())
                .plan(userCredits.getPlan())
                .build();
        return ResponseEntity.ok(response);
    }
}

