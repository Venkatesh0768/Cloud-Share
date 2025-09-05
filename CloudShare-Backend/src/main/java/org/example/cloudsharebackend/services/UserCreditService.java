package org.example.cloudsharebackend.services;

import org.example.cloudsharebackend.documents.UserCredits;
import org.example.cloudsharebackend.repositories.UserCreditsRepository;
import org.springframework.stereotype.Service;

@Service

public class UserCreditService {

    private final UserCreditsRepository userCreditsRepository;
    private  final  ProfileService profileService;

    public UserCreditService(UserCreditsRepository userCreditsRepository, ProfileService profileService) {
        this.userCreditsRepository = userCreditsRepository;
        this.profileService = profileService;
    }

    public UserCredits createInitialCredits(String clerkId) {
        UserCredits userCredits =  UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("BASIC")
                .build();

        return userCreditsRepository.save(userCredits);
    }


    public UserCredits getUserCredits(String clerkId) {
       return userCreditsRepository.findByClerkId(clerkId).orElseThrow(() -> new IllegalArgumentException("User credits not found for clerkId: " + clerkId));
    }

    public UserCredits getUserCredits(){
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserCredits(clerkId);
    }

    public Boolean hasEnoughCredits( int requiredCredits) {
        UserCredits userCredits = getUserCredits();
        return userCredits.getCredits() >= requiredCredits;
    }

    public  UserCredits consumeCredit(){
        UserCredits userCredits = getUserCredits();
        if (userCredits.getCredits() <= 0) {
            throw new RuntimeException("Not enough credits to perform this action");
        }
        userCredits.setCredits(userCredits.getCredits() - 1);
        return userCreditsRepository.save(userCredits);
    }

    public UserCredits addCredits(String clerkId , Integer creditsToAdd , String plan){
       UserCredits userCredits =  userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(()-> createInitialCredits(clerkId));
        userCredits.setCredits(userCredits.getCredits() + creditsToAdd);
        userCredits.setPlan(plan);
        return userCreditsRepository.save(userCredits);
    }
}
