package com.aidevassistant.controller;

import com.aidevassistant.service.ConversationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public List<Map<String, Object>> list(@RequestParam Long userId) {
        return conversationService.list(userId);
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable Long id, @RequestParam Long userId) {
        return conversationService.get(id, userId);
    }
}