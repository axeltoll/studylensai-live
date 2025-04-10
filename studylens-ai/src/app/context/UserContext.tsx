import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Define the user context type
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  userTier: 'free' | 'pro';
  weeklyUsage: {
    chat: number;
    research: number;
    scan: number;
  };
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  userTier: 'free',
  weeklyUsage: {
    chat: 0,
    research: 0,
    scan: 0
  },
  signOut: async () => {},
  refreshUserData: async () => {}
});

// Hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [weeklyUsage, setWeeklyUsage] = useState({
    chat: 0,
    research: 0,
    scan: 0
  });

  // Initialize and listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await fetchUserData(user.uid);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore including subscription status and usage
  const fetchUserData = async (uid: string) => {
    try {
      // This would be implemented to fetch from Firebase
      // Example:
      // const userDoc = await getDoc(doc(db, 'users', uid));
      // const userData = userDoc.data();
      // 
      // setUserTier(userData?.subscriptionStatus === 'active' ? 'pro' : 'free');
      // setWeeklyUsage({
      //   chat: userData?.weeklyUsage?.chat || 0,
      //   research: userData?.weeklyUsage?.research || 0,
      //   scan: userData?.weeklyUsage?.scan || 0
      // });
      
      // For now, using mock data
      setUserTier('free');
      setWeeklyUsage({
        chat: 2,
        research: 1,
        scan: 0
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Refresh user data (called after operations that might change usage/subscription)
  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserTier('free');
      setWeeklyUsage({
        chat: 0,
        research: 0,
        scan: 0
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        userTier,
        weeklyUsage,
        signOut,
        refreshUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 