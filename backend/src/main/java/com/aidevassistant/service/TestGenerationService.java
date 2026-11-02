package com.aidevassistant.service;

import org.springframework.stereotype.Service;

@Service
public class TestGenerationService {

    private final AiAssistantService aiService;

    public TestGenerationService(AiAssistantService aiService) {
        this.aiService = aiService;
    }

    public String generateTests(String code, String instructions) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Code is required to generate tests");
        }

        String prompt = """
                Generate JUnit 5 tests for the following Java code.
                Include normal inputs, boundary cases, and expected exceptions.
                Return one complete test class in a single java code block,
                then a short list of what each test covers.

                %s

                Code:
                ```java
                %s
                ```
                """.formatted(
                instructions == null || instructions.isBlank() ? "" : "Extra instructions: " + instructions,
                code);

        return aiService.callWithRetry(prompt);
    }
}