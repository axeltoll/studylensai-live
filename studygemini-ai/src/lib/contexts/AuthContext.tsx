'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

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
  refreshUserData: () => Promise<void>;
  getAuthToken: () => Promise<string>;
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
  updatePromptUsage: async () => {},
  refreshUserData: async () => {},
  getAuthToken: async () => ''
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

  // Helper function to get the current user's auth token
  const getAuthToken = async (): Promise<string> => {
    if (!user) return '';
    try {
      return await getIdToken(user);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return '';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch user data from server
        await fetchUserData();
      } else {
        // Reset state to defaults when logged out
        setUserTier('free');
        setTrialInfo({
          isInTrial: false,
          trialStartDate: null,
          trialEndDate: null,
          daysLeft: 0
        });
        setPromptUsage({
          used: 0,
          limit: 20,
          resetDate: null,
          unlimited: false
        });
        setSubscription({
          status: 'inactive',
          paymentFailedAt: null,
          paymentGracePeriodEnd: null
        });
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Function to fetch user data from the server
  const fetchUserData = async () => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      
      // Handle temporary founder account until server implementation is complete
      if (user.email === 'axel@funnel-profits.com') {
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
        setPromptUsage({
          used: 0,
          limit: Infinity,
          resetDate: null,
          unlimited: true
        });
        return;
      }
      
      // Call the server API to get user profile data
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      
      // Update state with data from server
      if (data.user) {
        setUserTier(data.user.subscriptionTier || 'free');
        setTrialInfo({
          isInTrial: data.user.trial.isInTrial || false,
          trialStartDate: data.user.trial.trialStartDate ? new Date(data.user.trial.trialStartDate) : null,
          trialEndDate: data.user.trial.trialEndDate ? new Date(data.user.trial.trialEndDate) : null,
          daysLeft: data.user.trial.daysLeft || 0
        });
        setSubscription({
          status: data.user.subscriptionStatus || 'inactive',
          paymentFailedAt: null, // Add if you have this data from server
          paymentGracePeriodEnd: null // Add if you have this data from server
        });
      }
      
      if (data.usage) {
        setPromptUsage({
          used: data.usage.used || 0,
          limit: data.usage.limit || 20,
          resetDate: data.usage.resetDate ? new Date(data.usage.resetDate) : null,
          unlimited: data.usage.unlimited || false
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Fall back to defaults in case of error
      setUserTier('free');
      setTrialInfo({
        isInTrial: false,
        trialStartDate: null,
        trialEndDate: null,
        daysLeft: 0
      });
      setPromptUsage({
        used: 0,
        limit: 20,
        resetDate: null,
        unlimited: false
      });
      setSubscription({
        status: 'inactive',
        paymentFailedAt: null,
        paymentGracePeriodEnd: null
      });
    }
  };
  
  // Function to refresh user data (called after actions that change user state)
  const refreshUserData = async () => {
    await fetchUserData();
  };
  
  // Function to update prompt usage after the user sends a prompt
  const updatePromptUsage = async () => {
    if (!user || promptUsage.unlimited) return;
    
    try {
      // Update local state optimistically
      setPromptUsage(prev => ({
        ...prev,
        used: prev.used + 1
      }));
      
      // The actual increment happens on the server side when API calls are made
      // This just updates the UI to stay in sync
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
      updatePromptUsage,
      refreshUserData,
      getAuthToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 