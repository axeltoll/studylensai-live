import { db } from './client';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';

// User data types
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: any;
  lastLoginAt: any;
  subscriptionStatus?: 'inactive' | 'active' | 'trial' | 'expired' | 'founder';
  subscriptionTier?: 'free' | 'pro' | 'founder';
  trialStart?: any;
  trialEnd?: any;
  paymentFailedAt?: any;
  paymentGracePeriodEnd?: any;
}

export interface UsageData {
  uid: string;
  promptsUsed: number;
  promptLimit: number;
  resetDate: any;
  lastUpdated: any;
}

// === User Management Functions ===

/**
 * Creates or updates a user document in Firestore
 */
export const createOrUpdateUser = async (userData: Partial<UserData>) => {
  if (!userData.uid) {
    throw new Error('User ID is required');
  }

  const userRef = doc(db, 'users', userData.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create new user
    await setDoc(userRef, {
      ...userData,
      createdAt: userData.createdAt || serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      subscriptionStatus: userData.subscriptionStatus || 'inactive',
      subscriptionTier: userData.subscriptionTier || 'free',
    });
  } else {
    // Update existing user
    await updateDoc(userRef, {
      ...userData,
      lastLoginAt: serverTimestamp(),
    });
  }

  return userRef;
};

/**
 * Gets a user document from Firestore
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data() as UserData;
};

/**
 * Sets or updates a user's subscription status
 */
export const updateUserSubscription = async (
  uid: string,
  status: 'inactive' | 'active' | 'trial' | 'expired' | 'founder',
  tier: 'free' | 'pro' | 'founder'
) => {
  const userRef = doc(db, 'users', uid);
  
  const updateData: any = {
    subscriptionStatus: status,
    subscriptionTier: tier,
  };

  // Add trial-specific data if user is starting a trial
  if (status === 'trial') {
    const now = Timestamp.now();
    const trialEnd = new Date(now.toDate().getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days trial
    
    updateData.trialStart = now;
    updateData.trialEnd = Timestamp.fromDate(trialEnd);
  }

  await updateDoc(userRef, updateData);
};

// === Usage Tracking Functions ===

/**
 * Gets the current usage data for a user
 */
export const getUserUsage = async (uid: string): Promise<UsageData | null> => {
  const usageRef = doc(db, 'usage', uid);
  const usageDoc = await getDoc(usageRef);

  if (!usageDoc.exists()) {
    return null;
  }

  return usageDoc.data() as UsageData;
};

/**
 * Initializes or resets usage data for a user
 */
export const initializeOrResetUsage = async (uid: string, tier: 'free' | 'pro' | 'founder') => {
  const usageRef = doc(db, 'usage', uid);
  
  // Calculate reset date (24 hours from now)
  const now = new Date();
  const resetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  // Determine the prompt limit based on tier
  let promptLimit = 20; // Default for free users
  if (tier === 'pro') promptLimit = 50;
  if (tier === 'founder') promptLimit = 1000; // Large number for "unlimited"
  
  await setDoc(usageRef, {
    uid,
    promptsUsed: 0,
    promptLimit,
    resetDate: Timestamp.fromDate(resetDate),
    lastUpdated: serverTimestamp()
  });
  
  return {
    uid,
    promptsUsed: 0,
    promptLimit,
    resetDate: Timestamp.fromDate(resetDate),
    lastUpdated: Timestamp.now()
  };
};

/**
 * Increments the prompt usage counter for a user
 * Returns true if the operation was successful, false if the user has reached their limit
 */
export const incrementPromptUsage = async (uid: string): Promise<boolean> => {
  // Get current usage
  let usage = await getUserUsage(uid);
  
  // If no usage record exists or reset date has passed, initialize/reset it
  if (!usage || new Date() > usage.resetDate.toDate()) {
    // Get user data to determine tier
    const userData = await getUserData(uid);
    if (!userData) throw new Error('User not found');
    
    usage = await initializeOrResetUsage(uid, userData.subscriptionTier || 'free');
  }
  
  // Check if user has reached their limit
  if (usage.promptsUsed >= usage.promptLimit) {
    return false; // User has reached their limit
  }
  
  // Increment the usage counter
  const usageRef = doc(db, 'usage', uid);
  await updateDoc(usageRef, {
    promptsUsed: increment(1),
    lastUpdated: serverTimestamp()
  });
  
  return true; // Operation successful
}; 