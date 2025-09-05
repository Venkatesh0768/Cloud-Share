package org.example.cloudsharebackend.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.documents.PaymentTransactions;
import org.example.cloudsharebackend.dtos.PaymentTransactionDto;
import org.example.cloudsharebackend.services.PaymentService;
import org.example.cloudsharebackend.services.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final PaymentService paymentService;
    private final ProfileService profileService;

    @GetMapping("/my")
    public ResponseEntity<?> getUserTransactions() {
        try {
            String clerkId = profileService.getCurrentProfile().getClerkId();
            List<PaymentTransactions> transactions = paymentService.getTransactionsByClerkId(clerkId);
            List<PaymentTransactionDto> transactionDtos = transactions.stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
            if (transactionDtos.isEmpty()) {
                return ResponseEntity.ok().body(new ApiResponse(true, "No transactions found", transactionDtos));
            }
            return ResponseEntity.ok(new ApiResponse(true, "Transactions retrieved successfully", transactionDtos));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error fetching transactions: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable String id) {
        try {
            String clerkId = profileService.getCurrentProfile().getClerkId();
            PaymentTransactions transaction = paymentService.getTransactionById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));
            if (!transaction.getClerkId().equals(clerkId)) {
                return ResponseEntity.status(403).body(new ApiResponse(false, "Unauthorized access to transaction", null));
            }
            return ResponseEntity.ok(new ApiResponse(true, "Transaction retrieved successfully", mapToDto(transaction)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error fetching transaction: " + e.getMessage(), null));
        }
    }

    private PaymentTransactionDto mapToDto(PaymentTransactions transaction) {
        return PaymentTransactionDto.builder()
                .id(transaction.getId())
                .clerkId(transaction.getClerkId())
                .orderId(transaction.getOrderId())
                .paymentId(transaction.getPaymentId())
                .planId(transaction.getPlanId())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .creditsAdded(transaction.getCreditsAdded())
                .status(transaction.getStatus())
                .transactionDate(transaction.getTransactionDate())
                .userEmail(transaction.getUserEmail())
                .userName(transaction.getUserName())
                .build();
    }

    // Standard response format for consistency
    private static class ApiResponse {
        private final boolean success;
        private final String message;
        private final Object data;

        public ApiResponse(boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }

        public Object getData() {
            return data;
        }
    }
}