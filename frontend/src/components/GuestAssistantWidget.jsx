import React, { useState } from 'react';
import { api } from '../services/api';
import { MessageSquare, Send, Sparkles, X, Globe, HelpCircle } from 'lucide-react';

export const GuestAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your StayRest Guest Assistant. How can I help you today? You can ask in English or தமிழ்.',
      suggestions: [
        'What are the check-in and check-out times?',
        'What is the refund policy for cancellations?',
        'What payment methods are supported?'
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    try {
      const res = await api.askGuestAssistant({ query: text, language });
      const assistantMsg = {
        sender: 'assistant',
        text: res.reply,
        suggestions: res.suggestedQuestions || []
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: 'Sorry, I am having trouble connecting right now. Standard Check-in is 12:00 PM and Check-out is 11:00 AM.',
        suggestions: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '0.85rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          <Sparkles size={20} color="#fbbf24" />
          <span>Guest Assistant / உதவி</span>
        </button>
      ) : (
        <div style={{
          width: '380px',
          height: '520px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            color: 'white',
            padding: '1rem 1.25rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: '#4f46e5', padding: '0.4rem', borderRadius: '10px' }}>
                <Sparkles size={18} color="#fbbf24" />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>StayRest Assistant</h4>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Tamil & English Support</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer'
                }}
              >
                <Globe size={14} /> {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#f8fafc' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}>
                <div style={{
                  background: m.sender === 'user' ? '#4f46e5' : 'white',
                  color: m.sender === 'user' ? 'white' : '#1e293b',
                  padding: '0.75rem 1rem',
                  borderRadius: '16px',
                  fontSize: '0.88rem',
                  lineHeight: '1.4',
                  boxShadow: m.sender === 'assistant' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  border: m.sender === 'assistant' ? '1px solid #e2e8f0' : 'none',
                  whiteSpace: 'pre-line'
                }}>
                  {m.text}
                </div>

                {/* Suggestions */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {m.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        style={{
                          background: '#eef2ff',
                          color: '#4f46e5',
                          border: '1px solid #c7d2fe',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <HelpCircle size={12} style={{ display: 'inline', marginRight: '4px' }} /> {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>Assistant is typing...</div>}
          </div>

          {/* Footer Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ padding: '0.75rem', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder={language === 'en' ? 'Ask any hotel or booking question...' : 'ஹோட்டல் அல்லது புக்கிங் கேள்வி கேட்கவும்...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
