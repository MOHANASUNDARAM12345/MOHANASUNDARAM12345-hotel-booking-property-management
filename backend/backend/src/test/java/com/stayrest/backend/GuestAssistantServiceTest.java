package com.stayrest.backend;

import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.service.GuestAssistantService;
import com.stayrest.backend.service.GuestAssistantService.AssistantRequest;
import com.stayrest.backend.service.GuestAssistantService.AssistantResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class GuestAssistantServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @InjectMocks
    private GuestAssistantService guestAssistantService;

    @Test
    void testEnglishCheckInQuery() {
        AssistantRequest req = new AssistantRequest();
        req.setQuery("What is the checkin time?");
        req.setLanguage("en");

        AssistantResponse res = guestAssistantService.processQuery(req);

        assertNotNull(res);
        assertEquals("en", res.getLanguage());
        assertEquals("CHECK_IN_TIMING", res.getDetectedTopic());
        assertTrue(res.getReply().contains("12:00 PM"));
    }

    @Test
    void testTamilCancellationQuery() {
        AssistantRequest req = new AssistantRequest();
        req.setQuery("புக்கிங் ரத்து செய்வது எப்படி?");
        req.setLanguage("ta");

        AssistantResponse res = guestAssistantService.processQuery(req);

        assertNotNull(res);
        assertEquals("ta", res.getLanguage());
        assertEquals("CANCELLATION_POLICY", res.getDetectedTopic());
        assertTrue(res.getReply().contains("100%"));
    }
}
