package org.example.cloudsharebackend.repositories;

import org.example.cloudsharebackend.documents.PaymentTransactions;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends MongoRepository<PaymentTransactions, String> {
    List<PaymentTransactions> findByClerkId(String clerkId);

    List<PaymentTransactions> findByClerkIdOrderByTransactionDateDesc(String clerkId);

    List<PaymentTransactions> findByClerkIdAndStatusOrderByTransactionDateDesc(String clerkId, String status);
    Optional<PaymentTransactions> findByOrderId(String orderId);
}
