'use client';

import React, { useState, createContext, useContext } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useUpgradePopup } from '@/app/dashboard/layout';

interface PromptLimitContextType {
  checkPromptLimit: () => Promise<boolean>;
}

const PromptLimitContext = createContext<PromptLimitContextType>({
  checkPromptLimit: async () => true,
});

export const usePromptLimit = () => useContext(PromptLimitContext);

interface PromptLimitWrapperProps {
  children: React.ReactNode;
  onPromptSend?: () => Promise<void>; // Optional callback when a prompt is sent
}

const PromptLimitWrapper: React.FC<PromptLimitWrapperProps> = ({ 
  children, 
  onPromptSend 
}) => {
  const { userTier, promptUsage, updatePromptUsage } = useAuth();
  const { setShowUpgradePopup } = useUpgradePopup();
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  
  // Function to check if the user can submit a prompt
  const checkPromptLimit = async (): Promise<boolean> => {
    // If user has unlimited prompts, allow submission without incrementing
    if (promptUsage.unlimited) {
      // Call the original callback if provided
      if (onPromptSend) {
        await onPromptSend();
      }
      return true;
    }

    // Check if user has reached their prompt limit
    if (userTier !== 'pro' && promptUsage.used >= promptUsage.limit) {
      setShowLimitMessage(true);
      setTimeout(() => setShowLimitMessage(false), 5000); // Hide message after 5 seconds
      return false;
    }
    
    // If not at limit, increment usage
    await updatePromptUsage();
    
    // Call the original callback if provided
    if (onPromptSend) {
      await onPromptSend();
    }
    
    return true;
  };
  
  return (
    <PromptLimitContext.Provider value={{ checkPromptLimit }}>
      <div className="relative">
        {children}
        
        {showLimitMessage && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md mb-4 flex justify-between items-center">
            <div>
              <p className="font-bold">Prompt limit reached!</p>
              <p className="text-sm">You've used all your {promptUsage.limit} daily prompts.</p>
            </div>
            <button 
              onClick={() => setShowUpgradePopup(true)}
              className="bg-gradient-blue-purple text-white px-4 py-2 rounded-md text-sm font-medium ml-4"
            >
              Upgrade to Pro
            </button>
          </div>
        )}
      </div>
    </PromptLimitContext.Provider>
  );
};

export default PromptLimitWrapper; 