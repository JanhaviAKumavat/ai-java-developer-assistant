package com.aidevassistant.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem("""
                        You are an expert Java developer assistant.
                        Explain code clearly, find bugs, explain exceptions,
                        and generate JUnit 5 tests. Use markdown code blocks.
                        Be concise and accurate.
                        """)
                .build();
    }
}