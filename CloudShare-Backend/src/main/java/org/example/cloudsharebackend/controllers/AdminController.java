package org.example.cloudsharebackend.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.documents.PaymentTransactions;
import org.example.cloudsharebackend.dtos.FileMetadataDto;
import org.example.cloudsharebackend.dtos.PaymentTransactionDto;
import org.example.cloudsharebackend.dtos.ProfileDto;
import org.example.cloudsharebackend.services.FileMetadataService;
import org.example.cloudsharebackend.services.PaymentService;
import org.example.cloudsharebackend.services.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final ProfileService profileService;
    private final FileMetadataService fileMetadataService;
    private final PaymentService paymentService;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<ProfileDto> users = profileService.getAllProfiles();
            return ResponseEntity.ok(new ApiResponse(true, "Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error fetching users: " + e.getMessage(), null));
        }
    }

    @GetMapping("/users/{clerkId}")
    public ResponseEntity<?> getUserByClerkId(@PathVariable String clerkId) {
        try {
            ProfileDto profile = profileService.findProfileByClerkId(clerkId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with clerkId: " + clerkId));
            return ResponseEntity.ok(new ApiResponse(true, "User retrieved successfully", profile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error fetching user: " + e.getMessage(), null));
        }
    }

    @PutMapping("/users/{clerkId}")
    public ResponseEntity<?> updateUser(@PathVariable String clerkId, @RequestBody ProfileDto profileDto) {
        try {
            profileDto.setClerkId(clerkId);
            ProfileDto updatedProfile = profileService.updateProfile(profileDto);
            return ResponseEntity.ok(new ApiResponse(true, "User updated successfully", updatedProfile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error updating user: " + e.getMessage(), null));
        }
    }

    @PutMapping("/users/{clerkId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String clerkId, @RequestBody RoleUpdateDto roleDto) {
        try {
            ProfileDto profile = profileService.findProfileByClerkId(clerkId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with clerkId: " + clerkId));
            
            profile.setRole(roleDto.getRole());
            ProfileDto updatedProfile = profileService.updateProfile(profile);
            return ResponseEntity.ok(new ApiResponse(true, "User role updated successfully", updatedProfile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error updating user role: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/users/{clerkId}")
    public ResponseEntity<?> deleteUser(@PathVariable String clerkId) {
        try {
            profileService.deleteProfile(clerkId);
            return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error deleting user: " + e.getMessage(), null));
        }
    }

    // File Management
    @GetMapping("/files")
    public ResponseEntity<?> getAllFiles() {
        try {
            List<FileMetadataDto> files = fileMetadataService.getAllFilesAdmin();
            return ResponseEntity.ok(new ApiResponse(true, "Files retrieved successfully", files));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error fetching files: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileId) {
        try {
            fileMetadataService.deleteFileAdmin(fileId);
            return ResponseEntity.ok(new ApiResponse(true, "File deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error deleting file: " + e.getMessage(), null));
        }
    }

    @PatchMapping("/files/{fileId}/toggle-public")
    public ResponseEntity<?> toggleFilePublic(@PathVariable String fileId) {
        try {
            FileMetadataDto updatedFile = fileMetadataService.togglePublic(fileId);
            return ResponseEntity.ok(new ApiResponse(true, "File visibility updated", updatedFile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error updating file visibility: " + e.getMessage(), null));
        }
    }

    // Transaction Management
    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions() {
        try {
            List<PaymentTransactionDto> transactions = paymentService.getAllTransactions().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse(true, "Transactions retrieved successfully", transactions));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error fetching transactions: " + e.getMessage(), null));
        }
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable String id) {
        try {
            PaymentTransactions transaction = paymentService.getTransactionById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Transaction not found with id: " + id));
            return ResponseEntity.ok(new ApiResponse(true, "Transaction retrieved successfully", mapToDto(transaction)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error fetching transaction: " + e.getMessage(), null));
        }
    }

    @PutMapping("/transactions/{id}/status")
    public ResponseEntity<?> updateTransactionStatus(@PathVariable String id, @RequestBody UpdateStatusDto statusDto) {
        try {
            paymentService.updateTransactionStatus(id, statusDto.getStatus());
            return ResponseEntity.ok(new ApiResponse(true, "Transaction status updated", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error updating transaction status: " + e.getMessage(), null));
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

    // Standard response format
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

    // DTO for updating transaction status
    private static class UpdateStatusDto {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    // DTO for updating user role
    private static class RoleUpdateDto {
        private String role;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}