package org.example.cloudsharebackend.repositories;

import org.example.cloudsharebackend.documents.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCreditsRepository  extends MongoRepository<UserCredits ,String> {

    Optional<UserCredits> findByClerkId(String clerkId);

    Boolean existsByClerkId(String clerkId);

    void deleteByClerkId(String clerkId);
}
