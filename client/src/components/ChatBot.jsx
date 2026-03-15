import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatBot.css';

// ─────────────────────────────────────────────
//  KNOWLEDGE BASE — Aspirant-Saathi platform
// ─────────────────────────────────────────────
const KB = [
    // Greetings
    {
        match: ['hi', 'hello', 'hey', 'hii', 'helo', 'namaste', 'sup', 'yo', 'greetings'],
        reply: "Hey hey! 👋 Welcome to Aspirant-Saathi! I'm your platform guide. Ask me anything about evaluating answers, pricing, login — I got you! 🚀"
    },

    // What is Aspirant-Saathi
    {
        match: ['what is aspirant saathi', 'what is this', 'about this platform', 'tell me about', 'what does this do', 'what is aspirant-saathi'],
        reply: "Aspirant-Saathi is an AI-powered answer evaluation platform built for competitive exam aspirants — UPSC, State PSC, CAPF, IB, and more 🎯\n\nYou write your answer → our AI evaluates it like a real examiner → you get instant, structured feedback with scores, strengths, weaknesses & a model answer.\n\nBasically your 24/7 AI mentor that never sleeps! 🤖✨"
    },

    // How to get started / sign up
    {
        match: ['sign up', 'signup', 'register', 'create account', 'get started', 'join', 'new account', 'how to start', 'start'],
        reply: "Getting started is super easy! 🎉\n\n1️⃣ Go to 👉 /register to create your account\n2️⃣ Verify your email with OTP\n3️⃣ Complete your profile\n4️⃣ Head to /submit and drop your first answer!\n\nOr sign up with Google in one click! 🔐"
    },

    // Login
    {
        match: ['login', 'log in', 'signin', 'sign in', 'cant login', "can't login", 'unable to login', 'forgot password'],
        reply: "You can log in here 👉 /login\n\nSupports:\n• Email + Password (with OTP verification)\n• Google Sign-In (one-click! 🚀)\n\nForgot password? Use the OTP option on the login page to verify your identity and get back in! 💪"
    },

    // Evaluate / Submit answer
    {
        match: ['evaluate', 'submit answer', 'submit', 'upload answer', 'how to evaluate', 'check my answer', 'get feedback', 'evaluation'],
        reply: "To evaluate your answer:\n\n1️⃣ Login → go to 👉 /submit\n2️⃣ Type or paste your answer (or upload a handwritten image 📸)\n3️⃣ Add the question & marks\n4️⃣ Hit Evaluate!\n\nWithin ~60 seconds your AI report is ready with: Score, Structure analysis, Strengths, Weaknesses, Keyword check & a Model Answer 🔥"
    },

    // Dashboard
    {
        match: ['dashboard', 'my attempts', 'history', 'past attempts', 'previous answers', 'my evaluations'],
        reply: "Your dashboard at 👉 /dashboard shows all your past attempts!\n\nYou can:\n• View all your evaluated answers\n• Track your score trends over time 📈\n• Click any attempt for a full detailed report\n• Compare progress across sessions\n\nYour personal improvement hub! 💡"
    },

    // Pricing / Plans
    {
        match: ['pricing', 'price', 'cost', 'plan', 'free', 'paid', 'subscription', 'how much', 'tokens', 'token'],
        reply: "Check out all pricing details at 👉 /pricing 💰\n\nHere's a quick overview:\n• **Free Plan** — Limited evaluations to get started\n• **Premium Plans** — More tokens, priority evaluation & advanced analytics\n\nTokens are used per evaluation. Premium users get batch studio access + detailed reports! 🏆\n\nWant me to take you to the pricing page? Head to 👉 /pricing"
    },

    // Premium / Upgrade
    {
        match: ['premium', 'upgrade', 'pro', 'get premium', 'buy premium', 'premium features', 'batch studio'],
        reply: "Go Premium to unlock the full power of Aspirant-Saathi! ⚡\n\n🌟 Premium Features:\n• More evaluation tokens\n• Batch Studio — analyse multiple answers together\n• Deep analytics & score trends\n• Priority support\n\nUpgrade here 👉 /pricing\nOr check feature details at 👉 /premium-details"
    },

    // Batch Studio
    {
        match: ['batch studio', 'batch', 'multiple answers', 'bulk evaluate'],
        reply: "Batch Studio 🎬 is a premium feature that lets you evaluate multiple answers in one go!\n\nPerfect for:\n• Full test simulations\n• Daily practice sessions\n• Tracking improvement across a topic\n\nGo Premium to unlock it → /pricing 🚀\nAccess it at 👉 /batch-studio (premium users only)"
    },

    // Feedback / Reviews
    {
        match: ['feedback', 'review', 'testimonial', 'write review', 'community', 'what do others say'],
        reply: "Want to see what other aspirants say about us? 👀\n\nCheck our Community Reviews page 👉 /feedbacks\n\nLoving the platform? Drop your review there and help other aspirants discover Aspirant-Saathi! ✍️ We show real reviews from real people — no fake stuff 💯"
    },

    // Refund
    {
        match: ['refund', 'money back', 'cancel', 'refund policy'],
        reply: "We have a fair refund policy! 📋\n\nYou can read all the details at 👉 /refund-policy\n\nFor refund requests, contact us at 👉 /contact and we'll sort it out ASAP! ⚡"
    },

    // Contact / Support
    {
        match: ['contact', 'support', 'help', 'email', 'reach out', 'talk to human', 'customer care', 'customer support', 'issue', 'problem'],
        reply: "Need human help? We gotchu! 🤝\n\n📬 Contact us at 👉 /contact\n📧 Email: aspirantsaathisuppport@gmail.com\n💬 Or use the WhatsApp bot for quick queries!\n\nWe typically respond within a few hours. You're not alone in this journey! 💙"
    },

    // Profile
    {
        match: ['profile', 'my profile', 'edit profile', 'account settings', 'my account', 'settings'],
        reply: "Your profile is at 👉 /profile 👤\n\nHere you can:\n• Update your name & info\n• View your exam category\n• Share feedback about the platform\n• Manage your account\n\nKeep your profile updated for a personalised experience! ✨"
    },

    // Exams supported
    {
        match: ['upsc', 'state psc', 'capf', 'ib', 'acio', 'pcs', 'mains', 'exam', 'which exam', 'supported exam'],
        reply: "Aspirant-Saathi supports evaluation for:\n\n🏛️ UPSC Civil Services Mains\n🗺️ State PSCs (UP, Bihar, Rajasthan & more)\n🛡️ CAPF (AC) Written\n🕵️ IB ACIO Descriptive\n📋 Other descriptive/essay-type exams\n\nIf it's a written answer exam, our AI can help you ace it! 💪\n\nReady? Head to 👉 /submit"
    },

    // Scores / marks
    {
        match: ['score', 'marks', 'rating', 'how is score', 'how scoring works', 'how marks', 'out of'],
        reply: "Our AI scores your answer holistically like a real UPSC examiner! 📝\n\nYou get marks based on:\n• Introduction quality\n• Content coverage & keyword usage\n• Structure & flow\n• Presentation & formatting\n• Conclusion strength\n\nPlus a detailed breakdown of what to fix + a model answer to compare! 🔥\n\nTry it → /submit"
    },

    // AI / Technology
    {
        match: ['ai', 'artificial intelligence', 'how does ai work', 'technology', 'how does it work', 'model', 'gpt', 'gemini'],
        reply: "We use advanced AI models trained to think like competitive exam evaluators 🤖\n\nOur AI understands:\n• UPSC/PSC marking schemes\n• Keyword relevance & contextual analysis\n• Answer structure patterns\n• Writing quality & tone\n\nIt's like having an IAS officer evaluate your answer at 3 AM — only nicer! 😄\n\nExperience it yourself → /submit"
    },

    // Privacy / Terms
    {
        match: ['privacy', 'privacy policy', 'data', 'safe', 'secure', 'terms', 'terms of service'],
        reply: "Your data is safe with us! 🔒\n\nRead our:\n📄 Privacy Policy → /privacy\n📋 Terms of Service → /terms\n\nWe never share your answers or personal data with third parties. Your prep is yours! 💙"
    },

    // About us
    {
        match: ['about', 'about us', 'team', 'who made this', 'who built', 'founders'],
        reply: "Aspirant-Saathi was built with ❤️ for the aspirant community!\n\nOur mission: Make quality answer evaluation accessible to every aspirant — not just those who can afford expensive coaching.\n\nLearn more at 👉 /about\n\nWe're on a mission to democratise UPSC prep! 🇮🇳✊"
    },

    // Handwritten / Image upload
    {
        match: ['handwritten', 'image', 'photo', 'scan', 'upload image', 'picture', 'handwrite'],
        reply: "Yes! We support handwritten answer uploads too! 📸\n\nJust take a clear photo of your handwritten answer and upload it on 👉 /submit\n\nOur AI reads and evaluates it just like a typed answer. Make sure the image is well-lit and legible for best results! 💡"
    },

    // OTP / Verification
    {
        match: ['otp', 'verification', 'verify', 'not received otp', 'otp not received', 'resend otp'],
        reply: "OTP not arriving? 📭 Here's what to do:\n\n1️⃣ Check your spam/junk folder\n2️⃣ Make sure the email is correct\n3️⃣ Hit 'Resend OTP' on the verify page → /verify-otp\n4️⃣ Still stuck? Contact us → /contact\n\nWe'll get you in! 🔑"
    },

    // Thanks / Bye
    {
        match: ['thank', 'thanks', 'thankyou', 'thank you', 'bye', 'goodbye', 'ok bye', 'great', 'awesome', 'perfect'],
        reply: "Absolute pleasure! 🙏✨ Best of luck with your preparation! Remember — consistent practice + smart feedback = rank list! 💪🏆\n\nCome back anytime. We're always here! 🤖💙"
    },
];

// Out-of-scope Gen Z responses — picked randomly
const OUT_OF_SCOPE = [
    "Bestie, I'm just a humble platform guide, not your personal GPT 💀 Ask me something about Aspirant-Saathi and I'll slay! 🔥",
    "Sweetie 🍬 I'm trained to talk Aspirant-Saathi, not answer random queries. I'm not your ChatGPT!! Ask me about evaluations, pricing, login etc 👀✨",
    "Girlie, that's giving... off-topic energy 💅 I only know Aspirant-Saathi stuff. Try asking about pricing, how to evaluate, or how to login! 🚪",
    "Oof, that's outside my pay grade bestie 😭 I'm your Aspirant-Saathi guide, not Google! Ask me about the platform and I'll cook 👨‍🍳🔥",
    "Okay but like... that's not my department? 🫠 I'm literally here only for Aspirant-Saathi queries. Slide me a platform-related question and watch me go! 💨",
    "No cap I have absolutely zero clue about that 💀 I'm your platform bot, not a genius! Try asking about answer evaluation, plans, or anything Aspirant-Saathi 🎯",
    "Periodt. That's not in my knowledge base babe 😭✋ Ask me something about Aspirant-Saathi — I promise I'll be helpful then! 🤖💙",
];

const getBotResponse = (userText) => {
    const text = userText.toLowerCase().trim();

    // Check each knowledge base entry
    for (const entry of KB) {
        if (entry.match.some(kw => text.includes(kw))) {
            return entry.reply;
        }
    }

    // Out of scope — Gen Z roast 😂
    return OUT_OF_SCOPE[Math.floor(Math.random() * OUT_OF_SCOPE.length)];
};

// Render message text — convert \n to <br> and **bold** to <strong>
function MessageText({ text }) {
    const parts = text.split('\n');
    return (
        <span>
            {parts.map((line, i) => {
                // Handle **bold**
                const boldParts = line.split(/\*\*(.*?)\*\*/g);
                return (
                    <React.Fragment key={i}>
                        {boldParts.map((part, j) =>
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                        {i < parts.length - 1 && <br />}
                    </React.Fragment>
                );
            })}
        </span>
    );
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Hey! 👋 I'm your Aspirant-Saathi guide bot!\n\nAsk me about:\n• How to evaluate answers 📝\n• Pricing & plans 💰\n• Login / Sign up 🔐\n• Features & more ✨" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: getBotResponse(userMessage) }]);
        }, 1000 + Math.random() * 500);
    };

    // Quick suggestion chips
    const SUGGESTIONS = ['How to evaluate?', 'Pricing', 'Sign Up', 'Contact Support'];

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
                                <h3>Aspirant-Saathi Bot</h3>
                                <p><span className="status-dot"></span> Online</p>
                            </div>
                        </div>
                        <div className="header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                                className="close-btn"
                                onClick={toggleChat}
                                title="Close Chat"
                                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '8px', padding: 0, transition: 'background-color 0.2s' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-wrapper ${msg.type === 'bot' ? 'bot-wrapper' : 'user-wrapper'}`}>
                                {msg.type === 'bot' && <div className="bot-avatar-mini">🤖</div>}
                                <div className={`message ${msg.type}`}>
                                    <MessageText text={msg.text} />
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-wrapper bot-wrapper">
                                <div className="bot-avatar-mini">🤖</div>
                                <div className="typing-indicator">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestion chips — shown only at start */}
                    {messages.length <= 2 && (
                        <div className="chat-suggestions">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setMessages(prev => [...prev, { type: 'user', text: s }]);
                                        setIsTyping(true);
                                        setTimeout(() => {
                                            setIsTyping(false);
                                            setMessages(prev => [...prev, { type: 'bot', text: getBotResponse(s) }]);
                                        }, 900);
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="chat-input-area">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Ask me about the platform..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
