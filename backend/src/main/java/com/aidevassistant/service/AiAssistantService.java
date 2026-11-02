package com.aidevassistant.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiAssistantService {

    private static final int MAX_ATTEMPTS = 3;

    private final ChatClient chatClient;

    public AiAssistantService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String ask(String question, String code) {
        String prompt = (code == null || code.isBlank())
                ? question
                : "Code:\n```java\n" + code + "\n```\n\nQuestion: " + question;
        return callWithRetry(prompt);
    }

    public String explainError(String error, String code) {
        String prompt = "Explain this Java error, its likely cause, and how to fix it.\n\nError:\n"
                + error
                + (code == null || code.isBlank() ? "" : "\n\nRelated code:\n```java\n" + code + "\n```");
        return callWithRetry(prompt);
    }

    /** Sends the prompt to the model, retrying a few times if Gemini is overloaded. */
    public String callWithRetry(String prompt) {
        for (int attempt = 1; ; attempt++) {
            try {
                return chatClient.prompt().user(prompt).call().content();
            } catch (RuntimeException e) {
                if (attempt >= MAX_ATTEMPTS || !isTemporary(e)) {
                    throw e;
                }
                try {
                    Thread.sleep(2000L * attempt); // wait 2s, then 4s
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw e;
                }
            }
        }
    }

    private boolean isTemporary(Throwable e) {
        while (e != null) {
            String msg = e.getMessage();
            if (msg != null && (msg.contains("503") || msg.contains("429") || msg.contains("high demand"))) {
                return true;
            }
            e = e.getCause();
        }
        return false;
    }
}