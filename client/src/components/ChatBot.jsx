import React, { useState } from 'react';
import '../styles/ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const [isTyping, setIsTyping] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleRefresh = () => {
        setMessages([{ type: 'bot', text: 'Hello! How can I help you today?' }]);
        setInput('');
        setIsTyping(false);
    };

    const getBotResponse = (userText) => {
        const text = userText.toLowerCase();
        if (text.includes('hi') || text.includes('hello') || text.includes('hey')) return 'Hi there! How can I assist you today?';
        if (text.includes('help') || text.includes('how to use') || text.includes('how to')) return 'Aspirant-Saathi helps you evaluate your answers. Simply log in, head over to the Dashboard, and upload your answers to get them evaluated by our AI!';
        if (text.includes('evaluate') || text.includes('answer')) return 'You can upload your answers on the Dashboard to get them evaluated by AI.';
        if (text.includes('pricing') || text.includes('cost')) return 'Please check our Pricing page for detailed information on our plans.';
        if (text.includes('refund')) return 'We offer refunds under certain conditions. Please check our Refund Policy page at /refund-policy for detailed information.';
        return 'Thanks for reaching out! We will get back to you soon. Can you please provide more details?';
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: getBotResponse(userMessage) }]);
        }, 1200);
    };

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <div className="chatbot-toggle" onClick={toggleChat}>
                    <span className="bot-icon">💬</span>
                </div>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="header-avatar">🤖</div>
                            <div className="header-text">
                                <h3>Support Bot</h3>
                                <p><span className="status-dot"></span> Online</p>
                            </div>
                        </div>
                        <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
                            <button className="refresh-btn" onClick={handleRefresh} title="Restart Chat" style={{ background: 'none', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', opacity: '0.8' }}>↻</button>
                            <button className="close-btn" onClick={toggleChat} title="Close Chat">&times;</button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.type}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="typing-indicator">
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                            </div>
                        )}
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
