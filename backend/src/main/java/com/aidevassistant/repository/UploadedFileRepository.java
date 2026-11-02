package com.aidevassistant.repository;

import com.aidevassistant.model.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
    List<UploadedFile> findByOwnerIdOrderByUploadedAtDesc(Long userId);
}