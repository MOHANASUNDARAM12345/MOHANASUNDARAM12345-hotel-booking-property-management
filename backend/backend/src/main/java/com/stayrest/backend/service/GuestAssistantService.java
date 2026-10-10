package com.stayrest.backend.service;

import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GuestAssistantService {

    private final HotelRepository hotelRepository;

    public GuestAssistantService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public static class AssistantRequest {
        private String query;
        private String language = "en"; // "en" or "ta"
        private Integer userId;

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
    }

    public static class AssistantResponse {
        private String reply;
        private String detectedTopic;
        private String language;
        private List<String> suggestedQuestions;

        public String getReply() { return reply; }
        public void setReply(String reply) { this.reply = reply; }

        public String getDetectedTopic() { return detectedTopic; }
        public void setDetectedTopic(String detectedTopic) { this.detectedTopic = detectedTopic; }

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }

        public List<String> getSuggestedQuestions() { return suggestedQuestions; }
        public void setSuggestedQuestions(List<String> suggestedQuestions) { this.suggestedQuestions = suggestedQuestions; }
    }

    public AssistantResponse processQuery(AssistantRequest req) {
        String query = req.getQuery() != null ? req.getQuery().trim().toLowerCase() : "";
        boolean isTamil = "ta".equalsIgnoreCase(req.getLanguage()) || containsTamilCharacters(query);

        AssistantResponse response = new AssistantResponse();
        response.setLanguage(isTamil ? "ta" : "en");
        List<String> suggestions = new ArrayList<>();

        if (query.isEmpty()) {
            if (isTamil) {
                response.setReply("வணக்கம்! StayRest விருந்தினர் உதவிக்கு வரவேற்கிறோம். செக்-இன் நேரம், ரத்துசெய்தல் கொள்கை அல்லது ஹோட்டல் தகவல்களை பற்றி கேளுங்கள்.");
                suggestions.add("செக்-இன் மற்றும் செக்-அவுட் நேரம் என்ன?");
                suggestions.add("புக்கிங் ரத்து செய்தல் மற்றும் பணத்தை திரும்பப்பெறும் முறை என்ன?");
                suggestions.add("எந்தெந்த செலுத்தும் முறைகள் ஏற்றுக்கொள்ளப்படுகின்றன?");
            } else {
                response.setReply("Hello! Welcome to StayRest Guest Assistant. Ask me about check-in timing, cancellation policies, or available hotels.");
                suggestions.add("What are the standard check-in and check-out times?");
                suggestions.add("What is the cancellation and refund policy?");
                suggestions.add("What payment methods are supported?");
            }
            response.setDetectedTopic("GREETING");
            response.setSuggestedQuestions(suggestions);
            return response;
        }

        // Topic 1: Check-in / Check-out timing
        if (query.contains("checkin") || query.contains("check-in") || query.contains("checkout") ||
            query.contains("check-out") || query.contains("timing") || query.contains("time") ||
            query.contains("நேரம்") || query.contains("செக்")) {

            response.setDetectedTopic("CHECK_IN_TIMING");
            if (isTamil) {
                response.setReply("எங்கள் ஹோட்டல்களில் நிலையான செக்-இன் நேரம் மதியம் 12:00 மணி மற்றும் செக்-அவுட் நேரம் காலை 11:00 மணி ஆகும். ஆரம்பக்கால செக்-இன் செய்ய விரும்பினால் ஹோட்டல் மேலாளரை தொடர்புகொள்ளலாம்.");
                suggestions.add("ஹோட்டல் சேவைகள் என்னென்ன உள்ளன?");
                suggestions.add("புக்கிங் ரத்து செய்வது எப்படி?");
            } else {
                response.setReply("Standard Check-in time is 12:00 PM and Check-out time is 11:00 AM across all StayRest properties. Early check-in is subject to availability.");
                suggestions.add("What add-on services are available?");
                suggestions.add("How do I cancel my reservation?");
            }
        }
        // Topic 2: Cancellation & Refund Policy
        else if (query.contains("cancel") || query.contains("refund") || query.contains("policy") ||
                 query.contains("ரத்து") || query.contains("பணம்") || query.contains("திரும்ப")) {

            response.setDetectedTopic("CANCELLATION_POLICY");
            if (isTamil) {
                response.setReply("StayRest ரத்துசெய்தல் கொள்கை:\n1. செக்-இன் நாளுக்கு 7 நாட்களுக்கு முன் ரத்து செய்தால் 100% கட்டணம் திரும்பப் பெறலாம்.\n2. 3-7 நாட்களுக்குள் 75% ரீஃபண்ட்.\n3. 1-2 நாட்களுக்குள் 50% ரீஃபண்ட்.\n4. 24 மணி நேரத்திற்குள் ரத்து செய்தால் ரீஃபண்ட் வழங்கப்படாது.");
                suggestions.add("எனது புக்கிங் நிலையை சரிபார்ப்பது எப்படி?");
                suggestions.add("கார்டு மூலமாக பணம் செலுத்தலாமா?");
            } else {
                response.setReply("StayRest Cancellation Policy:\n• Cancel 7+ days prior to check-in: 100% full refund.\n• Cancel 3-7 days prior: 75% refund.\n• Cancel 1-2 days prior: 50% refund.\n• Cancel within 24 hours: Non-refundable.");
                suggestions.add("How do I check my payment status?");
                suggestions.add("Can I pay via UPI or Credit Card?");
            }
        }
        // Topic 3: Payment Methods
        else if (query.contains("payment") || query.contains("upi") || query.contains("card") ||
                 query.contains("pay") || query.contains("செலுத்து") || query.contains("வங்கி")) {

            response.setDetectedTopic("PAYMENT_METHODS");
            if (isTamil) {
                response.setReply("StayRest யுபிஐ (UPI), கிரெடிட் / டெபிட் கார்டுகள் மற்றும் நெட் பேங்கிங் மூலமாக பாதுகாப்பான கட்டண முறையை ஆதரிக்கிறது. உங்கள் கார்டு விவரங்கள் பாதுகாப்பாக மறைக்கப்படும் (PCI-Compliant).");
                suggestions.add("பணம் செலுத்திய பின் இன்வாய்ஸ் கிடைக்குமா?");
                suggestions.add("ஹோட்டல் சலுகை கூப்பன்கள் எவ்வாறு பயன்படுத்துவது?");
            } else {
                response.setReply("StayRest supports instant secure payments via UPI, Credit/Debit Card, and Net Banking. All transaction data is masked securely for PCI compliance.");
                suggestions.add("Will I get an automatic PDF invoice after payment?");
                suggestions.add("How do I apply discount coupons?");
            }
        }
        // Topic 4: Hotel Information / Count
        else if (query.contains("hotel") || query.contains("room") || query.contains("stay") ||
                 query.contains("ஹோட்டல்") || query.contains("அறை")) {

            response.setDetectedTopic("HOTEL_INFO");
            long hotelCount = hotelRepository.count();
            if (isTamil) {
                response.setReply("தற்போது StayRest அமைப்பில் " + hotelCount + " க்கும் மேற்பட்ட சொகுசு ஹோட்டல்கள் மற்றும் ரிசார்ட்டுகள் உள்ளன. நீங்கள் உங்கள் வரவுசெலவு மற்றும் இருப்பிடத்தின் அடிப்படையில் தேடலாம்.");
                suggestions.add("StayWise Smart Stay பரிந்துரையை பயன்படுத்துவது எப்படி?");
                suggestions.add("சென்னையில் உள்ள ஹோட்டல்கள் எவை?");
            } else {
                response.setReply("StayRest currently offers " + hotelCount + " verified luxury hotels and homestays. You can filter by price, rating, category, and city location.");
                suggestions.add("How does StayWise Smart Stay Engine rank hotels?");
                suggestions.add("Show available hotels in Chennai or Mumbai");
            }
        }
        // Default fallback
        else {
            response.setDetectedTopic("GENERAL");
            if (isTamil) {
                response.setReply("உங்களின் கேள்வி பதிவு செய்யப்பட்டது. StayRest மூலம் உங்கள் தங்குதலை எளிதாகவும் பாதுகாப்பாகவும் முன்பதிவு செய்யலாம். உதவிக்கு 1800-STAY-REST என்ற எண்ணை தொடர்புகொள்ளவும்.");
                suggestions.add("செக்-இன் மற்றும் செக்-அவுட் நேரம் என்ன?");
                suggestions.add("ரத்துசெய்தல் கொள்கை என்ன?");
            } else {
                response.setReply("I'm here to help with all your stay queries! StayRest lets you easily search hotels, book rooms, make secure payments, and download official invoices.");
                suggestions.add("What are the check-in times?");
                suggestions.add("What is the refund policy?");
            }
        }

        response.setSuggestedQuestions(suggestions);
        return response;
    }

    private boolean containsTamilCharacters(String s) {
        if (s == null) return false;
        for (char c : s.toCharArray()) {
            if (Character.UnicodeBlock.of(c) == Character.UnicodeBlock.TAMIL) {
                return true;
            }
        }
        return false;
    }
}
