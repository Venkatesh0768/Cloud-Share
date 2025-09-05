package org.example.cloudsharebackend.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.dtos.PaymentDto;
import org.example.cloudsharebackend.dtos.PaymentVerificationDto;
import org.example.cloudsharebackend.services.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentDto paymentDto) {
        PaymentDto response = paymentService.createOrder(paymentDto);
        if (response.getSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationDto paymentVerificationDto) {
        PaymentDto respose = paymentService.verifyPayment(paymentVerificationDto);
        if (respose.getSuccess()) {
            return ResponseEntity.ok(respose);
        } else {
            return ResponseEntity.badRequest().body(respose);
        }
    }
}
