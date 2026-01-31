import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const MessageBubble = ({ message }) => (
  <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
    <div className="message-content">
      <p>{message.text}</p>
      <small className="message-timestamp">{message.timestamp}</small>
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="message bot-message">
    <div className="typing-indicator">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  </div>
);

const WelcomeMessage = ({ setInputMessage }) => (
  <div className="welcome-message">
    <p>👋 Hi! How can I help you today?</p>
    <p className="suggestions">Try asking about:</p>
    <div className="suggestion-chips">
      <button onClick={() => setInputMessage("What's on sale?")}>What's on sale?</button>
      <button onClick={() => setInputMessage("Track my order")}>Track my order</button>
      <button onClick={() => setInputMessage("Help")}>Help</button>
    </div>
  </div>
);

const ChatInput = ({ inputMessage, setInputMessage, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="chatbot-input">
    <input
      type="text"
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      placeholder="Type a message..."
    />
    <button type="submit">
      <i className="fas fa-paper-plane"></i>
    </button>
  </form>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          text: "I'm here to help! How can I assist you today?",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'}`}></i>
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Shopping Assistant</h3>
          </div>

          <div className="messages-container">
            <WelcomeMessage setInputMessage={setInputMessage} />
            
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            
            {isTyping && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          <ChatInput 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
