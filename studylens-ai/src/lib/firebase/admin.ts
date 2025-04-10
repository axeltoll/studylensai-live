import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Initializes the Firebase Admin SDK if it hasn't been initialized already.
 * This should only be used in server-side contexts.
 */
export const initAdmin = () => {
  if (getApps().length === 0) {
    // Check if we have the required environment variables
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error(
        'Firebase Admin environment variables are missing. Check your .env file.'
      );
    }

    // Initialize the app with credentials
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key needs to be properly formatted
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      // If you're using other Firebase services like Storage, you'd configure them here
    });
  }

  // Return the auth and firestore instances
  return {
    auth: getAuth(),
    db: getFirestore(),
  };
};

// Helper function to verify an auth token
export const verifyAuthToken = async (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    // Initialize Firebase Admin if not already initialized
    const { auth } = initAdmin();
    
    // Extract the token
    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token
    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
};

/**
 * Sets custom claims for a user
 * @param uid User ID
 * @param claims Claims to set
 */
export const setUserClaims = async (uid: string, claims: object) => {
  const { auth } = initAdmin();
  await auth.setCustomUserClaims(uid, claims);
};

/**
 * Gets a user by their UID
 * @param uid User ID
 */
export const getUserByUid = async (uid: string) => {
  const { auth } = initAdmin();
  return await auth.getUser(uid);
}; 