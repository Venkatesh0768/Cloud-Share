package org.example.cloudsharebackend.services;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.documents.PaymentTransactions;
import org.example.cloudsharebackend.documents.ProfileDocument;
import org.example.cloudsharebackend.dtos.PaymentDto;
import org.example.cloudsharebackend.dtos.PaymentVerificationDto;
import org.example.cloudsharebackend.repositories.PaymentTransactionRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final ProfileService profileService;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserCreditService userCreditService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentDto createOrder(PaymentDto paymentDto) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", paymentDto.getAmount());
            orderRequest.put("currency", paymentDto.getCurrency());
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());
            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");
            PaymentTransactions transaction = PaymentTransactions.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDto.getPlanId())
                    .amount(paymentDto.getAmount())
                    .currency(paymentDto.getCurrency())
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currentProfile.getEmail())
                    .userName(currentProfile.getFirstName() + " " + currentProfile.getLastName())
                    .build();
            paymentTransactionRepository.save(transaction);
            return PaymentDto.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("Order Created Successfully")
                    .build();
        } catch (RazorpayException e) {
            return PaymentDto.builder()
                    .success(false)
                    .message("Error Creating Order: " + e.getMessage())
                    .build();
        }
    }

    public PaymentDto verifyPayment(PaymentVerificationDto request) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            String clerkId = currentProfile.getClerkId();
            String data = request.getRazorpay_order_id() + "|" + request.getRazorpay_payment_id();
            String generatedSignature = generateHmacSha256Signature(data, razorpayKeySecret);
            if (!generatedSignature.equals(request.getRazorpay_signature())) {
                updateTransactionStatus(request.getRazorpay_order_id(), "FAILED", request.getRazorpay_payment_id(), null);
                return PaymentDto.builder()
                        .success(false)
                        .message("Payment signature verification failed.")
                        .build();
            }
            int creditsToAdd = 0;
            String plan = "BASIC";
            switch (request.getPlanId()) {
                case "premium":
                    creditsToAdd = 500;
                    plan = "PREMIUM";
                    break;
                case "ultimate":
                    creditsToAdd = 5000;
                    plan = "ULTIMATE";
                    break;
            }
            if (creditsToAdd > 0) {
                userCreditService.addCredits(clerkId, creditsToAdd, plan);
                updateTransactionStatus(request.getRazorpay_order_id(), "SUCCESS", request.getRazorpay_payment_id(), creditsToAdd);
                return PaymentDto.builder()
                        .success(true)
                        .message("Payment verified and credits added successfully.")
                        .credits(userCreditService.getUserCredits(clerkId).getCredits())
                        .build();
            } else {
                updateTransactionStatus(request.getRazorpay_order_id(), "FAILED", request.getRazorpay_payment_id(), null);
                return PaymentDto.builder()
                        .success(false)
                        .message("Invalid plan selected.")
                        .build();
            }
        } catch (Exception e) {
            try {
                updateTransactionStatus(request.getRazorpay_order_id(), "ERROR", request.getRazorpay_payment_id(), null);
            } catch (Exception ex) {
                // Log secondary issue
            }
            return PaymentDto.builder()
                    .success(false)
                    .message("Error verifying the payment: " + e.getMessage())
                    .build();
        }
    }

    public List<PaymentTransactions> getTransactionsByClerkId(String clerkId) {
        return paymentTransactionRepository.findByClerkId(clerkId);
    }

    public Optional<PaymentTransactions> getTransactionById(String id) {
        return paymentTransactionRepository.findById(id);
    }

    public List<PaymentTransactions> getAllTransactions() {
        return paymentTransactionRepository.findAll();
    }

    public void updateTransactionStatus(String transactionId, String status) {
        paymentTransactionRepository.findById(transactionId)
                .ifPresent(transaction -> {
                    transaction.setStatus(status);
                    paymentTransactionRepository.save(transaction);
                });
    }

    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Integer creditsToAdd) {
        paymentTransactionRepository.findByOrderId(razorpayOrderId)
                .ifPresent(transaction -> {
                    transaction.setStatus(status);
                    transaction.setPaymentId(razorpayPaymentId);
                    if (creditsToAdd != null) {
                        transaction.setCreditsAdded(creditsToAdd);
                    }
                    paymentTransactionRepository.save(transaction);
                });
    }

    private String generateHmacSha256Signature(String data, String secret) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secretKey);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Error while generating HMAC SHA256 signature", e);
        }
    }
}