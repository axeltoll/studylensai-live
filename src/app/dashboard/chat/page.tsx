'use client';

import React, { useState, useEffect } from 'react';
import { Bot, BookOpen, Code, PenTool, Search, Globe, Download, DownloadCloud, FileCode, Lightbulb } from 'lucide-react';
import withAuth from '@/app/components/auth/withAuth';
import Chat from '@/app/components/dashboard/Chat';
import Header from '@/app/components/dashboard/Header';
import PromptLimitWrapper from '@/app/components/dashboard/PromptLimitWrapper';
import { useSearchParams } from 'next/navigation';
import LinkComponent from '@/app/components/ui/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import Image from 'next/image';

const chatTypes = [
  { 
    id: 'study' as const, 
    name: 'Study Assistant', 
    icon: BookOpen,
    iconSrc: '/images/features/study-assistant.svg',
    description: 'Get help with homework, study questions, and academic explanations',
    color: 'from-blue-400 to-indigo-600' // Blue to Purple gradient
  },
  { 
    id: 'essay' as const, 
    name: 'Expert Essay Writer', 
    icon: PenTool,
    iconSrc: '/images/features/essay-writer.svg',
    description: 'Plan, draft, and polish essays with AI-powered writing assistance',
    color: 'from-green-400 to-emerald-600' // Green gradient
  },
  { 
    id: 'code' as const, 
    name: 'Code Assistant', 
    icon: Code,
    iconSrc: '/images/features/code-assistant.svg',
    description: 'Write, debug, and optimize code with expert programming guidance',
    color: 'from-cyan-400 to-teal-500' // Light Blue to Turquoise
  }
];

function ChatbotDashboard() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  
  // Set active chat type based on URL parameter or default to 'study'
  const [activeChatType, setActiveChatType] = useState(
    chatTypes.find(type => type.id === typeParam) || chatTypes[0]
  );
  
  const [key, setKey] = useState(Date.now());
  const [internetAccess, setInternetAccess] = useState(false);
  const [showEssayExportOptions, setShowEssayExportOptions] = useState(false);
  const [essayFormat, setEssayFormat] = useState('standard');

  // Update when URL parameters change
  useEffect(() => {
    const matchedType = chatTypes.find(type => type.id === typeParam);
    if (matchedType && matchedType.id !== activeChatType.id) {
      setActiveChatType(matchedType);
      setKey(Date.now()); // Force remount of Chat component
      
      // If switching to essay type, show export options
      if (matchedType.id === 'essay') {
        setShowEssayExportOptions(true);
      } else {
        setShowEssayExportOptions(false);
      }
    }
  }, [typeParam, activeChatType.id]);

  // Function to get system prompt based on chat type
  const getChatSystemPrompt = (chatType: typeof chatTypes[0]) => {
    const internetAccessPrompt = internetAccess ? 
      'You have access to current information from the internet. Use this to provide up-to-date information and facts in your responses.' : '';

    switch (chatType.id) {
      case 'study':
        return `You are StudyLens AI Study Assistant, a helpful and encouraging AI tutor. Assist students with their academic questions, provide explanations on various subjects, and help with homework problems. ${internetAccessPrompt}`;
      case 'essay':
        return `You are StudyLens AI Essay Writer. Help students plan, structure, and write essays. 
        You should format properly with Heading 1, Heading 2, Heading 3, paragraphs, etc.
        
        When creating essays, consider:
        - Create a proper title as Heading 1
        - Include an introduction, body paragraphs, and conclusion
        - Use Heading 2 for main sections and Heading 3 for subsections
        - Create a table of contents if requested
        - Format citations properly in the requested style (MLA, APA, Chicago)
        
        ${essayFormat === 'academic' ? 
          'Use formal academic language, structured arguments, and proper citations.' : 
          essayFormat === 'creative' ? 
          'Use vibrant language, narrative structures, and creative elements.' : 
          'Use clear, concise language with a standard essay structure.'}
        
        ${internetAccessPrompt}`;
      case 'code':
        return `You are StudyLens AI Code Assistant. Assist with programming problems, explain code concepts, help debug issues, and teach coding best practices. Support multiple programming languages and provide useful code examples. ${internetAccessPrompt}`;
      default:
        return `You are StudyLens AI, a helpful AI assistant. ${internetAccessPrompt}`;
    }
  };
  
  // Download essay as PDF
  const downloadEssayAsPDF = () => {
    alert('PDF download functionality would be implemented with jsPDF or similar library');
    // In a real implementation, we would generate a PDF from the chat content
  };

  // Function to get gradient color for each type
  const getGradientColor = (type: string) => {
    switch (type) {
      case 'study':
        return 'from-blue-500 to-purple-600';
      case 'essay':
        return 'from-green-500 to-emerald-600';
      case 'code':
        return 'from-cyan-500 to-teal-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Chatbot Type Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-center z-10">
        <div className="flex space-x-2 max-w-3xl mx-auto w-full">
          {chatTypes.map(chatType => {
            const isActive = activeChatType.id === chatType.id;
            const gradientColor = getGradientColor(chatType.id);
            
            return (
              <button
                key={chatType.id}
                className={`flex-1 py-3 px-8 text-sm font-medium rounded-md transition-colors flex items-center justify-center whitespace-nowrap ${
                  isActive 
                    ? `bg-gradient-to-r ${gradientColor} text-white` 
                    : 'bg-white text-gray-700 hover:bg-gray-50 relative'
                }`}
                onClick={() => {
                  setActiveChatType(chatType);
                  setKey(Date.now());
                  
                  // Show essay export options if switching to essay type
                  if (chatType.id === 'essay') {
                    setShowEssayExportOptions(true);
                  } else {
                    setShowEssayExportOptions(false);
                  }
                  
                  // Update URL without refreshing page
                  const url = new URL(window.location.href);
                  url.searchParams.set('type', chatType.id);
                  window.history.pushState({}, '', url);
                }}
              >
                {/* Use Lucide icons instead of SVG images */}
                <chatType.icon className="h-5 w-5 mr-2" />
                {chatType.name}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Chat Interface - Full height container */}
      <div className="flex-1 h-full overflow-hidden">
        <PromptLimitWrapper>
          <Chat 
            key={key}
            chatType={activeChatType.id}
            systemPrompt={getChatSystemPrompt(activeChatType)}
            headerTitle={activeChatType.name}
            headerGradient={getGradientColor(activeChatType.id)}
            headerIcon={activeChatType.icon}
            iconSrc={activeChatType.iconSrc}
            featureColumns={[]}
            showEssayOptions={showEssayExportOptions && activeChatType.id === 'essay'}
            essayFormat={essayFormat}
            internetAccess={internetAccess}
            onEssayFormatChange={setEssayFormat}
            onInternetAccessChange={setInternetAccess}
            onDownloadPDF={downloadEssayAsPDF}
          />
        </PromptLimitWrapper>
      </div>
    </div>
  );
}

export default withAuth(ChatbotDashboard); 