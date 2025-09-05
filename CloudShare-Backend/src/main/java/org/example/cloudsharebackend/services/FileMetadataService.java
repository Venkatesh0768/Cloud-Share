package org.example.cloudsharebackend.services;

import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.documents.FileMetadataDocument;
import org.example.cloudsharebackend.documents.ProfileDocument;
import org.example.cloudsharebackend.dtos.FileMetadataDto;
import org.example.cloudsharebackend.repositories.FileMetadataRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetadataService {
    private final ProfileService profileService;
    private final UserCreditService userCreditService;
    private final FileMetadataRepository fileMetadataRepository;

    public List<FileMetadataDto> uploadedFiles(MultipartFile[] files) throws IOException {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> savedFiles = new ArrayList<>();
        if (!userCreditService.hasEnoughCredits(files.length)) {
            throw new RuntimeException("Not enough credits to upload files");
        }
        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        for (MultipartFile file : files) {
            String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID() + (extension != null ? "." + extension : "");
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            FileMetadataDocument fileMetaData = FileMetadataDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .type(file.getContentType())
                    .size(file.getSize())
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();
            userCreditService.consumeCredit();
            savedFiles.add(fileMetadataRepository.save(fileMetaData));
        }
        return savedFiles.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public FileMetadataDto mapToDto(FileMetadataDocument fileMetadataDocument) {
        return FileMetadataDto.builder()
                .id(fileMetadataDocument.getId())
                .name(fileMetadataDocument.getName())
                .type(fileMetadataDocument.getType())
                .size(fileMetadataDocument.getSize())
                .clerkId(fileMetadataDocument.getClerkId())
                .isPublic(fileMetadataDocument.isPublic())
                .fileLocation(fileMetadataDocument.getFileLocation())
                .uploadedAt(fileMetadataDocument.getUploadedAt())
                .build();
    }

    public List<FileMetadataDto> getAllFiles() {
        ProfileDocument currentProfile = profileService.getCurrentProfile();
        List<FileMetadataDocument> files = fileMetadataRepository.findByClerkId(currentProfile.getClerkId());
        return files.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<FileMetadataDto> getAllFilesAdmin() {
        return fileMetadataRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public FileMetadataDto getPublicFile(String fileId) {
        Optional<FileMetadataDocument> fileOptional = fileMetadataRepository.findById(fileId);
        if (fileOptional.isEmpty() || !fileOptional.get().isPublic()) {
            throw new IllegalArgumentException("File not found or not public with id: " + fileId);
        }
        return mapToDto(fileOptional.get());
    }

    public FileMetadataDto getDownloadableFile(String fileId) {
        Optional<FileMetadataDocument> fileOptional = fileMetadataRepository.findById(fileId);
        if (fileOptional.isEmpty()) {
            throw new IllegalArgumentException("File not found with id: " + fileId);
        }
        FileMetadataDocument document = fileOptional.get();
        if (!document.isPublic() && !document.getClerkId().equals(profileService.getCurrentProfile().getClerkId())) {
            throw new IllegalArgumentException("File is not public and does not belong to the current user");
        }
        return mapToDto(document);
    }

    public void deleteFile(String fileId) {
        try {
            ProfileDocument currentProfile = profileService.getCurrentProfile();
            FileMetadataDocument file = fileMetadataRepository.findById(fileId)
                    .orElseThrow(() -> new IllegalArgumentException("File not found with id: " + fileId));
            if (!file.getClerkId().equals(currentProfile.getClerkId())) {
                throw new IllegalArgumentException("You do not have permission to delete this file");
            }
            Path filePath = Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);
            fileMetadataRepository.deleteById(fileId);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from storage", e);
        }
    }

    public void deleteFileAdmin(String fileId) {
        try {
            FileMetadataDocument file = fileMetadataRepository.findById(fileId)
                    .orElseThrow(() -> new IllegalArgumentException("File not found with id: " + fileId));
            Path filePath = Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);
            fileMetadataRepository.deleteById(fileId);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from storage", e);
        }
    }

    public FileMetadataDto togglePublic(String fileId) {
        FileMetadataDocument file = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found with id: " + fileId));
        file.setPublic(!file.isPublic());
        FileMetadataDocument updatedFile = fileMetadataRepository.save(file);
        return mapToDto(updatedFile);
    }
}