'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userTier: 'free' | 'pro' | 'founder';
  trialInfo: {
    isInTrial: boolean;
    trialStartDate: Date | null;
    trialEndDate: Date | null;
    daysLeft: number;
  };
  promptUsage: {
    used: number;
    limit: number;
    resetDate: Date | null;
    unlimited: boolean;
  };
  subscription: {
    status: 'inactive' | 'active' | 'trial' | 'expired' | 'founder';
    paymentFailedAt: Date | null;
    paymentGracePeriodEnd: Date | null;
  };
  updatePromptUsage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  userTier: 'free',
  trialInfo: {
    isInTrial: false,
    trialStartDate: null,
    trialEndDate: null,
    daysLeft: 0
  },
  promptUsage: {
    used: 0,
    limit: 20,
    resetDate: null,
    unlimited: false
  },
  subscription: {
    status: 'inactive',
    paymentFailedAt: null,
    paymentGracePeriodEnd: null
  },
  updatePromptUsage: async () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'founder'>('free');
  const [trialInfo, setTrialInfo] = useState({
    isInTrial: false,
    trialStartDate: null as Date | null,
    trialEndDate: null as Date | null,
    daysLeft: 0
  });
  const [promptUsage, setPromptUsage] = useState({
    used: 0,
    limit: 20, // Default for free users
    resetDate: null as Date | null,
    unlimited: false
  });
  const [subscription, setSubscription] = useState({
    status: 'inactive' as 'inactive' | 'active' | 'trial' | 'expired' | 'founder',
    paymentFailedAt: null as Date | null,
    paymentGracePeriodEnd: null as Date | null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user subscription and trial status
        await checkUserSubscription(currentUser.uid);
        // Fetch prompt usage
        await fetchPromptUsage(currentUser.uid);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Calculate days left in trial
  const calculateDaysLeft = (endDate: Date | null): number => {
    if (!endDate) return 0;
    
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };
  
  // Function to check user's subscription status
  const checkUserSubscription = async (uid: string) => {
    try {
      // Special handling for founder account
      if (user && user.email === 'axel@funnel-profits.com') {
        console.log('Founder account detected:', user.email);
        setUserTier('founder');
        setTrialInfo({
          isInTrial: false,
          trialStartDate: null,
          trialEndDate: null,
          daysLeft: 0
        });
        setSubscription({
          status: 'founder',
          paymentFailedAt: null,
          paymentGracePeriodEnd: null
        });
        setPromptUsage(prev => ({
          ...prev,
          unlimited: true,
          limit: Infinity
        }));
        return; // Skip the rest of the function
      }
      
      // In a real app, you would call your backend API or Firestore
      // For this example, we're simulating the subscription status
      
      // Check local storage for previous trials to prevent multiple trials
      const hasHadTrial = localStorage.getItem(`${uid}_hadTrial`) === 'true';
      
      // Get stored trial dates from localStorage (if any)
      const storedTrialStart = localStorage.getItem(`${uid}_trialStart`);
      const storedTrialEnd = localStorage.getItem(`${uid}_trialEnd`);
      
      // Check if user is in a paid subscription
      const isPro = localStorage.getItem(`${uid}_isPro`) === 'true';
      
      if (isPro) {
        setUserTier('pro');
        setTrialInfo({
          isInTrial: false,
          trialStartDate: null,
          trialEndDate: null,
          daysLeft: 0
        });
        setSubscription({
          status: 'active',
          paymentFailedAt: null,
          paymentGracePeriodEnd: null
        });
      } 
      else if (storedTrialStart && storedTrialEnd) {
        // User has an existing trial
        const trialStart = new Date(storedTrialStart);
        const trialEnd = new Date(storedTrialEnd);
        const now = new Date();
        
        if (now > trialEnd) {
          // Trial has ended
          setUserTier('free');
          setTrialInfo({
            isInTrial: false,
            trialStartDate: trialStart,
            trialEndDate: trialEnd,
            daysLeft: 0
          });
          setSubscription({
            status: 'expired',
            paymentFailedAt: trialEnd,
            paymentGracePeriodEnd: new Date(trialEnd.getTime() + 24 * 60 * 60 * 1000) // 24 hours grace period
          });
        } else {
          // Still in trial
          setUserTier('free');
          const daysLeft = calculateDaysLeft(trialEnd);
          setTrialInfo({
            isInTrial: true,
            trialStartDate: trialStart,
            trialEndDate: trialEnd,
            daysLeft
          });
          setSubscription({
            status: 'trial',
            paymentFailedAt: null,
            paymentGracePeriodEnd: null
          });
        }
      } 
      else if (!hasHadTrial) {
        // Start a new trial
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days trial
        
        localStorage.setItem(`${uid}_trialStart`, now.toISOString());
        localStorage.setItem(`${uid}_trialEnd`, trialEnd.toISOString());
        localStorage.setItem(`${uid}_hadTrial`, 'true');
        
        setUserTier('free');
        setTrialInfo({
          isInTrial: true,
          trialStartDate: now,
          trialEndDate: trialEnd,
          daysLeft: 3
        });
        setSubscription({
          status: 'trial',
          paymentFailedAt: null,
          paymentGracePeriodEnd: null
        });
      } 
      else {
        // No trial, no pro - just a free user
        setUserTier('free');
        setTrialInfo({
          isInTrial: false,
          trialStartDate: null,
          trialEndDate: null,
          daysLeft: 0
        });
        setSubscription({
          status: 'inactive',
          paymentFailedAt: null,
          paymentGracePeriodEnd: null
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setUserTier('free');
    }
  };
  
  // Function to fetch user's prompt usage
  const fetchPromptUsage = async (uid: string) => {
    try {
      // Check if the user is a founder with unlimited prompts
      if (user && (user.email === 'axel@funnel-profits.com' || userTier === 'founder')) {
        setPromptUsage({
          used: 0,
          limit: Infinity,
          resetDate: null,
          unlimited: true
        });
        
        // Ensure user has founder tier if they have the founder email
        if (user.email === 'axel@funnel-profits.com' && userTier !== 'founder') {
          setUserTier('founder');
          setSubscription({
            status: 'founder',
            paymentFailedAt: null,
            paymentGracePeriodEnd: null
          });
        }
        
        return; // Skip the rest of the processing
      }

      // In a real app, fetch from backend
      // For now, use localStorage to simulate
      
      const now = new Date();
      const storedResetDate = localStorage.getItem(`${uid}_promptResetDate`);
      const resetDate = storedResetDate ? new Date(storedResetDate) : null;
      
      // Determine the prompt limit based on user tier
      const getPromptLimit = () => {
        if (userTier === 'founder') {
          return Infinity; // Founder gets unlimited prompts
        } else if (userTier === 'pro') {
          return 50; // Pro users get 50 prompts daily
        } else {
          return 20; // Free/trial users get 20 prompts daily
        }
      };
      
      // Check if we need to reset the counter (daily)
      if (!resetDate || now > resetDate) {
        // Set next reset date to 1 day from now
        const nextReset = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
        localStorage.setItem(`${uid}_promptResetDate`, nextReset.toISOString());
        localStorage.setItem(`${uid}_promptsUsed`, '0');
        
        setPromptUsage({
          used: 0,
          limit: getPromptLimit(),
          resetDate: nextReset,
          unlimited: userTier === 'founder'
        });
      } else {
        // Get current usage
        const used = parseInt(localStorage.getItem(`${uid}_promptsUsed`) || '0', 10);
        
        setPromptUsage({
          used,
          limit: getPromptLimit(),
          resetDate,
          unlimited: userTier === 'founder'
        });
      }
    } catch (error) {
      console.error('Error fetching prompt usage:', error);
    }
  };
  
  // Function to update prompt usage after the user sends a prompt
  const updatePromptUsage = async () => {
    if (!user) return;
    
    try {
      // If user has unlimited prompts (founder), don't update the count
      if (promptUsage.unlimited) {
        return;
      }
      
      const currentUsed = promptUsage.used + 1;
      localStorage.setItem(`${user.uid}_promptsUsed`, currentUsed.toString());
      
      setPromptUsage({
        ...promptUsage,
        used: currentUsed
      });
    } catch (error) {
      console.error('Error updating prompt usage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      userTier, 
      trialInfo, 
      promptUsage, 
      subscription,
      updatePromptUsage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 