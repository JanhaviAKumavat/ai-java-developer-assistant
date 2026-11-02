package com.aidevassistant.controller;

import com.aidevassistant.dto.ChatRequest;
import com.aidevassistant.dto.ChatResponse;
import com.aidevassistant.service.AiAssistantService;
import com.aidevassistant.service.ConversationService;
import com.aidevassistant.service.TestGenerationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AiAssistantService aiService;
    private final TestGenerationService testService;
    private final ConversationService conversationService;

    public AssistantController(AiAssistantService aiService,
                               TestGenerationService testService,
                               ConversationService conversationService) {
        this.aiService = aiService;
        this.testService = testService;
        this.conversationService = conversationService;
    }

    @PostMapping("/ask")
    public ChatResponse ask(@Valid @RequestBody ChatRequest request) {
        String answer = aiService.ask(request.getQuestion(), request.getCode());
        return respond(request, userText(request.getQuestion(), request.getCode()), answer);
    }

    @PostMapping("/explain-error")
    public ChatResponse explainError(@Valid @RequestBody ChatRequest request) {
        String answer = aiService.explainError(request.getQuestion(), request.getCode());
        return respond(request,
                userText("Explain this error:\n" + request.getQuestion(), request.getCode()), answer);
    }

    @PostMapping("/generate-tests")
    public ChatResponse generateTests(@Valid @RequestBody ChatRequest request) {
        String answer = testService.generateTests(request.getCode(), request.getQuestion());
        return respond(request,
                userText("Generate JUnit tests. " + request.getQuestion(), request.getCode()), answer);
    }

    private ChatResponse respond(ChatRequest request, String userText, String answer) {
        Long conversationId = request.getConversationId();
        if (request.getUserId() != null) {
            conversationId = conversationService.saveExchange(
                    request.getUserId(), request.getConversationId(), userText, answer);
        }
        return new ChatResponse(answer, conversationId);
    }

    private String userText(String question, String code) {
        return (code == null || code.isBlank())
                ? question
                : question + "\n\n```java\n" + code + "\n```";
    }
}