package org.example.cloudsharebackend.services;

import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.documents.UserCredits;
import org.example.cloudsharebackend.repositories.UserCreditsRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditService {

    private final UserCreditsRepository userCreditsRepository;

    public UserCredits createInitialCredits(String clerkId) {
        UserCredits userCredits =  UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("BASIC")
                .build();

        return userCreditsRepository.save(userCredits);
    }
}
