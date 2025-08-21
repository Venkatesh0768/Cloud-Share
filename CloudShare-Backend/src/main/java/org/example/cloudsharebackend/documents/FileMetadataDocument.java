package org.example.cloudsharebackend.documents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "files")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileMetadataDocument {

    @Id
    private String id;
    private String name;
    private String type;
    private Long size;
    private String clerkId;
    private boolean isPublic;
    private String fileLocation;
    private LocalDateTime uploadedAt;

}
