package com.aidevassistant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {
    @NotBlank(message = "Question is required")
    private String question;

    private String code;

    // Optional: send these to save the chat in history
    private Long userId;
    private Long conversationId;
}