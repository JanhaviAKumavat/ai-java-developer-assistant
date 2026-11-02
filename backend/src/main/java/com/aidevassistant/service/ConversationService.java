package com.aidevassistant.service;

import com.aidevassistant.model.Conversation;
import com.aidevassistant.model.Message;
import com.aidevassistant.model.User;
import com.aidevassistant.repository.ConversationRepository;
import com.aidevassistant.repository.MessageRepository;
import com.aidevassistant.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public ConversationService(ConversationRepository conversationRepository,
                               MessageRepository messageRepository,
                               UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Long saveExchange(Long userId, Long conversationId, String userText, String answer) {
        Conversation conversation;

        if (conversationId == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            conversation = conversationRepository.save(
                    Conversation.builder().title(makeTitle(userText)).user(user).build());
        } else {
            conversation = conversationRepository.findByIdAndUserId(conversationId, userId)
                    .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        }

        messageRepository.save(Message.builder()
                .conversation(conversation).role("USER").content(userText).build());
        messageRepository.save(Message.builder()
                .conversation(conversation).role("ASSISTANT").content(answer).build());

        return conversation.getId();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> list(Long userId) {
        return conversationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(c -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", c.getId());
                    m.put("title", c.getTitle());
                    m.put("createdAt", c.getCreatedAt());
                    return m;
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> get(Long id, Long userId) {
        Conversation c = conversationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        List<Map<String, Object>> messages = messageRepository
                .findByConversationIdOrderByCreatedAtAsc(c.getId()).stream()
                .sorted(Comparator.comparing(Message::getId))
                .map(msg -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", msg.getId());
                    m.put("role", msg.getRole());
                    m.put("content", msg.getContent());
                    m.put("createdAt", msg.getCreatedAt());
                    return m;
                })
                .toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", c.getId());
        result.put("title", c.getTitle());
        result.put("messages", messages);
        return result;
    }

    private String makeTitle(String text) {
        String clean = text.replaceAll("\\s+", " ").trim();
        return clean.length() > 60 ? clean.substring(0, 60) + "..." : clean;
    }
}