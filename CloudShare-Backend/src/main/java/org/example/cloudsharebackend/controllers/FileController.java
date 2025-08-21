package org.example.cloudsharebackend.controllers;


import lombok.RequiredArgsConstructor;
import org.example.cloudsharebackend.documents.UserCredits;
import org.example.cloudsharebackend.dtos.FileMetadataDto;
import org.example.cloudsharebackend.services.FileMetadataService;
import org.example.cloudsharebackend.services.UserCreditService;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {
    private final FileMetadataService fileMetadataService;
    private final UserCreditService userCreditService;


    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestPart("files") MultipartFile[] files) throws Exception {
        Map<String, Object> response = new HashMap<>();
        List<FileMetadataDto> list = fileMetadataService.uploadedFiles(files);
        UserCredits finalCredits = userCreditService.getUserCredits();

        response.put("files", list);
        response.put("remainingCredits", finalCredits.getCredits());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getAllFilesForCurrentUser() {
        List<FileMetadataDto> files = fileMetadataService.getAllFiles();
        if (files.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(files);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?> getPublicFile(@PathVariable String id) {
       FileMetadataDto fileMetadata = fileMetadataService.getPublicFile(id);
       return ResponseEntity.ok(fileMetadata);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable String id) throws MalformedURLException {
        FileMetadataDto fileMetadata = fileMetadataService.getDownloadableFile(id);
        Path path = Paths.get(fileMetadata.getFileLocation());

        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(fileMetadata.getType() != null
                        ? MediaType.parseMediaType(fileMetadata.getType())
                        : MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(fileMetadata.getName(), StandardCharsets.UTF_8)
                                .build()
                                .toString())
                .contentLength(fileMetadata.getSize())
                .cacheControl(org.springframework.http.CacheControl.noCache())
                .eTag(fileMetadata.getId())
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        fileMetadataService.deleteFile(id);
        return ResponseEntity.ok("File deleted successfully");
    }

    @PatchMapping("/{id}/toggle-public")
    public ResponseEntity<?> togglePublic(@PathVariable String id) {
        FileMetadataDto updatedFile = fileMetadataService.togglePublic(id);
        return ResponseEntity.ok(updatedFile);
    }

}
