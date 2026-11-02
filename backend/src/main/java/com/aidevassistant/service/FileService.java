package com.aidevassistant.service;

import com.aidevassistant.model.UploadedFile;
import com.aidevassistant.model.User;
import com.aidevassistant.repository.UploadedFileRepository;
import com.aidevassistant.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FileService {

    private static final List<String> ALLOWED = List.of("java", "txt", "md", "xml", "properties");
    private static final Path UPLOAD_DIR = Path.of("uploads");

    private final UploadedFileRepository fileRepository;
    private final UserRepository userRepository;

    public FileService(UploadedFileRepository fileRepository, UserRepository userRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> upload(MultipartFile file, Long userId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String original = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String ext = original.contains(".")
                ? original.substring(original.lastIndexOf('.') + 1).toLowerCase()
                : "";
        if (!ALLOWED.contains(ext)) {
            throw new IllegalArgumentException("Allowed file types: " + ALLOWED);
        }

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Files.createDirectories(UPLOAD_DIR);
        // Random stored name: the user-supplied name is never used as a path
        Path target = UPLOAD_DIR.resolve(UUID.randomUUID() + "." + ext);
        Files.write(target, file.getBytes());

        UploadedFile saved = fileRepository.save(UploadedFile.builder()
                .fileName(original)
                .fileType(ext)
                .storagePath(target.toString())
                .owner(owner)
                .build());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", saved.getId());
        result.put("fileName", saved.getFileName());
        result.put("content", new String(file.getBytes(), StandardCharsets.UTF_8));
        return result;
    }
}