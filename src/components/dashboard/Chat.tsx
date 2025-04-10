'use client';

import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface ChatProps {
  chatType: string;
  systemPrompt: string;
  headerTitle: string;
  headerGradient: string;
  headerIcon: React.ElementType;
  iconSrc?: string;
  featureColumns: any[];
  showEssayOptions?: boolean;
  essayFormat?: string;
  internetAccess?: boolean;
  onEssayFormatChange?: (format: string) => void;
  onInternetAccessChange?: (enabled: boolean) => void;
  onDownloadPDF?: () => void;
}

const Chat: React.FC<ChatProps> = ({
  chatType,
  systemPrompt,
  headerTitle,
  headerGradient,
  headerIcon: HeaderIcon,
  iconSrc,
  featureColumns,
  showEssayOptions = false,
  essayFormat = 'standard',
  internetAccess = false,
  onEssayFormatChange,
  onInternetAccessChange,
  onDownloadPDF,
}) => {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `This is a simulated response to your query: "${userMessage}"\n\nThe system prompt used was: "${systemPrompt}"` 
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={`p-4 bg-gradient-to-r ${headerGradient} text-white`}>
        <div className="flex items-center">
          <HeaderIcon className="w-5 h-5 mr-2" />
          <h2 className="text-lg font-medium">{headerTitle}</h2>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <HeaderIcon className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Welcome to {headerTitle}</h3>
            <p className="text-gray-600 max-w-md">
              Type your message below to get started. I'm here to help you with your questions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat; 