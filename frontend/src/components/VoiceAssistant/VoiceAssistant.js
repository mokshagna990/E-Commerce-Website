import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { findCommand } from './commands';
import './VoiceAssistant.css';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState('');
  //const [showResponse, setShowResponse] = useState(false);
  const navigate = useNavigate();

  const recognition = useMemo(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return SpeechRecognition ? new SpeechRecognition() : null;
  }, []);

  const speak = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleCommand = useCallback((userInput) => {
    const command = findCommand(userInput);
    
    if (command.path) {
      navigate(command.path);
    }
    
    setResponse(command.response);
    speak(command.response);
     setTimeout(() => {
      setResponse('');
    }, 2000);
  }, [navigate, speak]);

  
  useEffect(() => {
    if (!recognition) {
      setResponse('Voice recognition is not supported in this browser');
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      handleCommand(command);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.abort();
    };
  }, [recognition, handleCommand]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
      setResponse('Listening...');
      setResponse('');
    }
  }, [recognition, isListening]);

  if (!recognition) {
    return null;
  }

  return (
    <div className="assistant-container">
      <button 
        className={`mic-button ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
        aria-label="Toggle voice assistant"
      >
        <i className="fas fa-microphone"></i>
      </button>
      {response && (
        <div className="response-container">
          <p className="response-text">{response}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
