'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Send, 
  MessageSquare,
  Code, 
  FileText, 
  PenTool,
  Sparkles,
  Bot,
  Star,
  BookOpen,
  LucideIcon,
  History,
  Trash2,
  Plus,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  Globe,
  DownloadCloud,
  Brain,
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { usePromptLimit } from './PromptLimitWrapper';
import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface ChatProps {
  chatType?: 'code' | 'essay' | 'study' | 'research' | 'general';
  systemPrompt?: string;
  headerTitle?: string;
  headerGradient?: string;
  headerIcon?: LucideIcon;
  iconSrc?: string;
  featureColumns?: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[];
  showEssayOptions?: boolean;
  essayFormat?: string;
  internetAccess?: boolean;
  onEssayFormatChange?: (format: string) => void;
  onInternetAccessChange?: (access: boolean) => void;
  onDownloadPDF?: () => void;
}

// Function to detect if a message contains code blocks
const containsCodeBlock = (content: string): boolean => {
  // Check for code blocks with triple backticks
  const codeBlockRegex = /```[\s\S]*?```/;
  return codeBlockRegex.test(content);
};

// Direct code block component outside of markdown rendering
const StandaloneCodeBlock = ({ language, value }: { language: string, value: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 mb-4">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={copyToClipboard}
          className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      {language && (
        <div className="text-xs text-gray-400 px-4 py-1 border-b border-gray-700 bg-gray-800 rounded-t-md">
          {language}
        </div>
      )}
      <pre className={`p-4 ${language ? 'pt-4' : 'pt-10'} bg-gray-800 text-gray-100 rounded-md overflow-x-auto text-sm`}>
        <code>{value}</code>
      </pre>
    </div>
  );
};

export default function Chat({
  chatType = 'general',
  systemPrompt = 'You are StudyLens AI, a helpful and encouraging AI tutor. Assist the student with their questions clearly and concisely. Focus on educational value.',
  headerTitle = 'AI Assistant',
  headerGradient = 'from-blue-500 to-purple-600',
  headerIcon: HeaderIcon = Bot,
  iconSrc,
  featureColumns = [],
  showEssayOptions = false,
  essayFormat = 'standard',
  internetAccess = false,
  onEssayFormatChange = () => {},
  onInternetAccessChange = () => {},
  onDownloadPDF = () => {}
}: ChatProps) {
  const [showTools, setShowTools] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<{id: string, title: string, preview: string, timestamp: number, type: string}[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'claude-3.7' | 'gpt-4o' | 'gemini-pro-2.5'>('claude-3.7');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { checkPromptLimit } = usePromptLimit();

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = () => {
      try {
        // First try to load from chat type specific history
        const savedTypeHistory = localStorage.getItem(`studylens_chat_history_${chatType}`);
        
        if (savedTypeHistory) {
          const parsedTypeHistory = JSON.parse(savedTypeHistory);
          setChatHistory(parsedTypeHistory);
        } else {
          // If no type-specific history, try global history
          const globalHistory = localStorage.getItem(`studylens_chat_history_global`);
          if (globalHistory) {
            const parsedGlobalHistory = JSON.parse(globalHistory);
            const filteredHistory = parsedGlobalHistory.filter((chat: any) => chat.type === chatType);
            setChatHistory(filteredHistory);
          } else {
            setChatHistory([]);
          }
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
        setChatHistory([]);
      }
    };
    
    loadChatHistory();
  }, [chatType]);

  // Load messages for current chat
  useEffect(() => {
    const loadMessages = () => {
      if (currentChatId) {
        try {
          const savedMessages = localStorage.getItem(`studylens_chat_${currentChatId}`);
          if (savedMessages) {
            const parsedData = JSON.parse(savedMessages);
            
            // Handle both formats - direct array or object with messages property
            if (Array.isArray(parsedData)) {
              setMessages(parsedData);
            } else if (parsedData.messages && Array.isArray(parsedData.messages)) {
              setMessages(parsedData.messages);
            } else {
              setMessages([]);
            }
          } else {
            setMessages([]);
          }
        } catch (err) {
          console.error('Error loading messages:', err);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };
    
    loadMessages();
  }, [currentChatId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const saveMessages = (chatId: string, messageList: Message[]) => {
    try {
      // Save messages directly as an array
      localStorage.setItem(`studylens_chat_${chatId}`, JSON.stringify(messageList));
    } catch (err) {
      console.error('Error saving messages:', err);
    }
  };

  const updateChatHistory = (chatId: string, title: string, preview: string) => {
    const newChat = {
      id: chatId,
      title,
      preview,
      timestamp: Date.now(),
      type: chatType
    };
    
    // Update local chat history state
    const updatedHistory = [newChat, ...chatHistory.filter(chat => chat.id !== chatId)];
    setChatHistory(updatedHistory);
    
    try {
      // Save to type-specific history
      localStorage.setItem(`studylens_chat_history_${chatType}`, JSON.stringify(updatedHistory));
      
      // Also update the global history
      let globalHistory: any[] = [];
      const savedGlobalHistory = localStorage.getItem('studylens_chat_history_global');
      
      if (savedGlobalHistory) {
        const parsedGlobalHistory = JSON.parse(savedGlobalHistory);
        globalHistory = [newChat, ...parsedGlobalHistory.filter((chat: any) => chat.id !== chatId)];
      } else {
        globalHistory = [newChat];
      }
      
      localStorage.setItem('studylens_chat_history_global', JSON.stringify(globalHistory));
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setError(null);
    setInput('');
  };

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering selectChat
    
    try {
      // Remove from type-specific history
      const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
      setChatHistory(updatedHistory);
      localStorage.setItem(`studylens_chat_history_${chatType}`, JSON.stringify(updatedHistory));
      
      // Remove from global history
      const globalHistoryStr = localStorage.getItem('studylens_chat_history_global');
      if (globalHistoryStr) {
        const globalHistory = JSON.parse(globalHistoryStr);
        const updatedGlobalHistory = globalHistory.filter((chat: any) => chat.id !== chatId);
        localStorage.setItem('studylens_chat_history_global', JSON.stringify(updatedGlobalHistory));
      }
      
      // Remove chat messages
      localStorage.removeItem(`studylens_chat_${chatId}`);
      
      // If this was the current chat, start a new chat
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
      setError('Failed to delete chat');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Check if the user has reached their prompt limit
    const canSubmit = await checkPromptLimit();
    if (!canSubmit) return;
    
    // Create new chat if none exists
    if (!currentChatId) {
      startNewChat();
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Save messages
    if (currentChatId) {
      saveMessages(currentChatId, updatedMessages);
    }
    
    setIsLoading(true);
    setError(null);
    setInput('');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...updatedMessages.filter(m => m.role !== 'system'),
          ].map(({ role, content }) => ({ role, content })),
          chatType: chatType,
          model: selectedModel,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }
      
      const data = await response.json();
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message.content,
        timestamp: Date.now()
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Save messages
      if (currentChatId) {
        saveMessages(currentChatId, finalMessages);
        
        // Update chat history
        const chatTitle = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
        const chatPreview = assistantMessage.content.slice(0, 40) + (assistantMessage.content.length > 40 ? '...' : '');
        updateChatHistory(currentChatId, chatTitle, chatPreview);
      }
    } catch (err) {
      console.error('Error in chat:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Get quick prompts based on chat type
  const getQuickPrompts = () => {
    switch(chatType) {
      case 'code':
        return [
          "Write a Python function to calculate standard deviation for a dataset",
          "Help me create a React component for a to-do list application",
          "Debug this JavaScript code that's causing an infinite loop",
          "Explain how to implement a binary search tree in Java"
        ];
      case 'essay':
        return [
          "Write a 5-paragraph essay about the impact of social media on youth mental health",
          "Create an outline for my research paper on climate change solutions",
          "Help me revise this paragraph to improve clarity and flow",
          "Provide counterarguments for my thesis on universal basic income"
        ];
      case 'study':
      default:
        return [
          "Explain the difference between mitosis and meiosis in cell division",
          "Create a study guide for calculus covering derivatives and integrals",
          "Summarize key concepts from organic chemistry for my upcoming exam",
          "Help me understand the causes and effects of the French Revolution"
        ];
    }
  };

  // Get icon for chat type
  const getChatIcon = () => {
    switch(chatType) {
      case 'code':
        return Code;
      case 'essay':
        return PenTool;
      case 'study':
        return BookOpen;
      default:
        return Star;
    }
  };

  // Get icon source for chat type
  const getChatIconSrc = () => {
    switch(chatType) {
      case 'code':
        return '/images/features/code-assistant.svg';
      case 'essay':
        return '/images/features/essay-writer.svg';
      case 'study':
        return '/images/features/study-assistant.svg';
      default:
        return '';
    }
  };

  const ChatIcon = getChatIcon();
  const chatIconSrc = iconSrc || getChatIconSrc();
  const quickPrompts = getQuickPrompts();

  // Custom renderer for markdown code blocks
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      // For inline code, render a simple code tag
      if (inline) {
        return (
          <code className="px-1.5 py-0.5 bg-gray-800 text-gray-100 rounded font-mono text-sm" {...props}>
            {children}
          </code>
        );
      }
      
      // For block code, return the text content for later processing
      // This helps avoid nesting issues by not rendering complex elements inside paragraphs
      return (
        <span className="code-block-placeholder" data-language={language} data-content={String(children).replace(/\n$/, '')}>
          {String(children).replace(/\n$/, '')}
        </span>
      );
    },
    // For paragraphs, we'll handle them simply
    p({ children }: any) {
      return <p className="mb-4 last:mb-0">{children}</p>;
    },
    ul({ children }: any) {
      return <ul className="list-disc pl-5 mb-4 last:mb-0">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal pl-5 mb-4 last:mb-0">{children}</ol>;
    }
  };

  // Parse markdown content to properly handle code blocks
  const renderMessageContent = (content: string) => {
    // First, render the markdown to JSX
    const markdownContent = (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={renderers}
      >
        {content}
      </ReactMarkdown>
    );
    
    // Then extract code blocks and render them separately
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);
    
    if (parts.length <= 1) {
      // No code blocks found, return the regular markdown
      return markdownContent;
    }
    
    // If we have code blocks, render each part separately
    const result = [];
    let i = 0;
    
    for (let idx = 0; idx < parts.length; idx++) {
      if (idx % 2 === 0) {
        // Text content
        if (parts[idx].trim()) {
          result.push(
            <ReactMarkdown key={`text-${i}`} remarkPlugins={[remarkGfm]} components={renderers}>
              {parts[idx]}
            </ReactMarkdown>
          );
        }
      } else {
        // Code block
        const codeContent = parts[idx];
        const languageMatch = codeContent.match(/^([a-zA-Z0-9_-]+)?\n/);
        const language = languageMatch ? languageMatch[1] : '';
        const code = languageMatch ? codeContent.substring(languageMatch[0].length) : codeContent;
        
        result.push(
          <StandaloneCodeBlock key={`code-${i}`} language={language} value={code} />
        );
        i++;
      }
    }
    
    return <div className="markdown-content">{result}</div>;
  };

  return (
    <div className="flex h-full w-full bg-white">
      {/* Chat History Sidebar */}
      {showSidebar && (
        <div className="w-80 border-r border-gray-200 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center w-full">
              {chatIconSrc ? (
                <div className="w-[30%] flex justify-center mr-2">
                  <div className="h-10 w-10 relative">
                    <Image src={chatIconSrc} alt={headerTitle} width={40} height={40} className="object-contain" />
                  </div>
                </div>
              ) : (
                <div className="w-[30%] flex justify-center mr-2">
                  <ChatIcon className="h-10 w-10 text-gray-600" />
                </div>
              )}
              <h2 className="font-medium flex-1">{headerTitle} tutor</h2>
            </div>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" 
              onClick={() => setShowSidebar(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {/* New Chat Button */}
            <div className="p-3">
              <button
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">New Chat</span>
              </button>
            </div>
            
            {/* Conversations Heading */}
            <div className="px-4 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Conversations</h3>
            </div>
            
            {/* Chat History List */}
            <div className="px-3 space-y-1">
              {chatHistory.length > 0 ? (
                chatHistory.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => selectChat(chat.id)}
                    className={`p-3 rounded-lg cursor-pointer group hover:bg-gray-100 relative ${
                      currentChatId === chat.id 
                        ? 'bg-blue-50 border-blue-100' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {new Date(chat.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded"
                        aria-label="Delete chat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-sm text-gray-500">
                  No chat history yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header if sidebar is hidden */}
        {!showSidebar && (
          <div className="border-b border-gray-200 p-4 flex items-center flex-shrink-0">
            <button 
              className="mr-3 p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" 
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center">
              {chatIconSrc ? (
                <div className="h-5 w-5 mr-2 relative">
                  <Image src={chatIconSrc} alt={headerTitle} width={20} height={20} className="object-contain" />
                </div>
              ) : (
                <ChatIcon className="h-5 w-5 text-gray-600 mr-2" />
              )}
              <h2 className="font-medium">{headerTitle}</h2>
            </div>
          </div>
        )}
        
        {/* Single scrollable container for messages */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 overflow-auto" id="chat-scroll-container">
            {messages.length > 0 ? (
              <div className="min-h-full px-4 py-4">
                <div className="space-y-4 pb-4">
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[90%] sm:max-w-[85%] rounded-lg px-3 sm:px-4 py-2 ${
                          m.role === 'user' 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : containsCodeBlock(m.content) && chatType === 'code'
                              ? 'bg-gray-50 text-gray-900 rounded-bl-none border border-gray-200'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        {m.role === 'assistant' ? (
                          <div className={`prose max-w-none prose-sm prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0 ${
                            containsCodeBlock(m.content) && chatType === 'code' ? 'prose-headings:text-blue-600' : ''
                          }`}>
                            {renderMessageContent(m.content)}
                          </div>
                        ) : (
                          m.content
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </div>
            ) : (
              <div className="min-h-full flex flex-col items-center justify-center py-10 px-4">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  {chatIconSrc ? (
                    <div className="h-8 w-8 relative">
                      <Image src={chatIconSrc} alt={headerTitle} width={32} height={32} className="object-contain" />
                    </div>
                  ) : (
                    <ChatIcon className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-800">{headerTitle}</h3>
                <p className="text-gray-500 max-w-md mb-8 text-center">
                  Your personal {headerTitle.toLowerCase()} companion. Ask a question to get started.
                </p>
                
                {/* Feature Columns - Display if provided */}
                {featureColumns.length > 0 && (
                  <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {featureColumns.map((feature, index) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-2 mx-auto">
                            <FeatureIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 className="text-center font-medium mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-600 text-center">
                            {feature.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Quick Prompt Suggestions */}
                <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4" id="quick-prompts">
                  {quickPrompts.map((prompt, index) => {
                    // Define a color for each prompt based on index
                    const colors = [
                      { bg: "bg-blue-50 hover:bg-blue-100", icon: "text-blue-500" },
                      { bg: "bg-purple-50 hover:bg-purple-100", icon: "text-purple-500" },
                      { bg: "bg-green-50 hover:bg-green-100", icon: "text-green-500" },
                      { bg: "bg-orange-50 hover:bg-orange-100", icon: "text-orange-500" }
                    ];
                    const color = colors[index % colors.length];
                    
                    // Define an icon for each prompt based on type and index
                    let Icon;
                    if (chatType === 'code') {
                      const icons = [Code, FileText, HelpCircle, Sparkles];
                      Icon = icons[index % icons.length];
                    } else if (chatType === 'essay') {
                      const icons = [PenTool, FileText, BookOpen, Star];
                      Icon = icons[index % icons.length];
                    } else {
                      const icons = [BookOpen, HelpCircle, Star, Sparkles];
                      Icon = icons[index % icons.length];
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setInput(prompt)}
                        className={`text-left p-4 text-sm ${color.bg} rounded-lg border border-gray-200 flex items-center text-gray-700 transition-colors`}
                      >
                        <div className="w-8 flex-shrink-0 flex justify-center">
                          <Icon className={`h-5 w-5 ${color.icon}`} />
                        </div>
                        <span>{prompt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="border-t border-red-200 bg-red-50 p-3 text-red-700 text-sm">
            <p>Error: {error}</p>
          </div>
        )}
        
        {/* Input Form - Fixed at bottom and better centered */}
        <div className="border-t border-gray-200 bg-white pt-4 pb-6 px-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex">
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={isLoading ? "AI is thinking..." : "Ask tutor a question..."}
                  className="pr-12 py-3 bg-gray-50 border-gray-300 rounded-lg text-gray-800 shadow-sm"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()} 
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${
                    isLoading || !input.trim() 
                      ? 'text-gray-400' 
                      : 'text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          
            {/* AI Model Selection Bar */}
            <div className="border-t border-gray-200 pt-3 mt-3 flex flex-wrap items-center justify-between gap-2 bg-gray-50 text-xs rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium">AI Model:</span>
                <select 
                  className="bg-gray-50 border border-gray-300 rounded text-xs py-1 pl-2 pr-6"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as 'claude-3.7' | 'gpt-4o' | 'gemini-pro-2.5')}
                >
                  <option value="claude-3.7">Claude 3.7</option>
                  <option value="gpt-4o">ChatGPT 4o</option>
                  <option value="gemini-pro-2.5">Gemini Pro 2.5</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-1">
                <input 
                  type="checkbox" 
                  id="internet-access" 
                  checked={internetAccess}
                  onChange={() => onInternetAccessChange(!internetAccess)}
                  className="h-3 w-3" 
                />
                <label htmlFor="internet-access" className="flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Internet
                </label>
              </div>
              
              <div className="flex items-center space-x-1">
                <input type="checkbox" id="deep-thinking" className="h-3 w-3" />
                <label htmlFor="deep-thinking" className="flex items-center">
                  <Brain className="h-3 w-3 mr-1" />
                  Deep Thinking
                </label>
              </div>
              
              {/* Essay Format Option */}
              {showEssayOptions && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Essay Format:</span>
                  <div className="flex rounded-md overflow-hidden border border-gray-300">
                    <button
                      className={`px-2 py-1 text-xs ${
                        essayFormat === 'standard' 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => onEssayFormatChange('standard')}
                    >
                      Standard
                    </button>
                    <button
                      className={`px-2 py-1 text-xs border-l border-r border-gray-300 ${
                        essayFormat === 'academic' 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => onEssayFormatChange('academic')}
                    >
                      Academic
                    </button>
                    <button
                      className={`px-2 py-1 text-xs ${
                        essayFormat === 'creative' 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => onEssayFormatChange('creative')}
                    >
                      Creative
                    </button>
                  </div>
                </div>
              )}
              
              {/* Download PDF Option */}
              {showEssayOptions && (
                <div className="flex items-center">
                  <button 
                    onClick={onDownloadPDF}
                    className="flex items-center text-gray-600 hover:text-gray-800 text-xs font-medium"
                  >
                    <DownloadCloud className="h-3 w-3 mr-1" />
                    Download PDF
                  </button>
                </div>
              )}
              
              <div className="ml-auto text-xs text-gray-500">Powered by StudyLens AI</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
