package org.example.cloudsharebackend.repositories;

import org.example.cloudsharebackend.documents.ProfileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends MongoRepository<ProfileDocument, String> {
     Optional<ProfileDocument> findByEmail(String email);
     Optional<ProfileDocument> findByClerkId(String clerkId);
     Boolean existsByClerkId(String clerkId);
}
