
import React, { useState, useRef, useEffect } from 'react';
import { getMotivationalMessage } from '../services/geminiService';
import type { ChallengeData } from '../types';
import { ChatIcon, SendIcon, CloseIcon, SparklesIcon } from './Icons';

interface ChatAssistantProps {
  challengeData: ChallengeData;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ challengeData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if(isOpen) {
        setMessages([{
            sender: 'ai',
            text: `Hello! I'm your 75 Hard assistant. You're on Day ${challengeData.currentDay}. How can I help you stay on track today? Ask for motivation, tips, or rule clarifications.`
        }]);
    }
  }, [isOpen, challengeData.currentDay]);


  const handleSend = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getMotivationalMessage(challengeData, userInput);
      setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-28 right-4 sm:bottom-6 sm:right-6 bg-brand-secondary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform z-20"
        aria-label="Open Chat Assistant"
      >
        {isOpen ? <CloseIcon className="w-8 h-8" /> : <ChatIcon className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-24 sm:right-6 w-[calc(100%-2rem)] max-w-sm h-[60vh] max-h-[500px] bg-dark-card rounded-lg shadow-2xl flex flex-col z-20 overflow-hidden border border-dark-border">
          <header className="p-4 bg-dark-bg flex items-center space-x-2 border-b border-dark-border">
            <SparklesIcon className="w-6 h-6 text-brand-secondary"/>
            <h3 className="text-lg font-bold">AI Assistant</h3>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-secondary text-white' : 'bg-dark-bg'}`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-dark-bg flex items-center space-x-2">
                        <div className="w-2 h-2 bg-medium-text rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-medium-text rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-medium-text rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 border-t border-dark-border">
            <div className="flex items-center bg-dark-bg rounded-lg">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for motivation..."
                className="flex-1 bg-transparent p-3 text-light-text focus:outline-none"
              />
              <button onClick={handleSend} className="p-3 text-brand-secondary disabled:text-gray-500" disabled={isLoading}>
                <SendIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
