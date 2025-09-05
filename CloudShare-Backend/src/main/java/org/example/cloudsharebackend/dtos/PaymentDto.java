package org.example.cloudsharebackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDto {
    private String planId;
    private Integer amount;
    private String currency;
    private Integer credits;
    private Boolean success;
    private String message;
    private String orderId;



}
