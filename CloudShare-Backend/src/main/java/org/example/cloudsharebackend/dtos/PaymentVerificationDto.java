package org.example.cloudsharebackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentVerificationDto {

    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
    private String planId;
}
