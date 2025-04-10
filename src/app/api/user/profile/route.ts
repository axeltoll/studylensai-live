import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase/admin';
import { getUserData, getUserUsage } from '@/lib/firebase/firestore';

/**
 * Secure API endpoint to fetch user profile and usage data
 * Only returns data for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const decodedToken = await verifyAuthToken(authHeader);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to access this data' },
        { status: 401 }
      );
    }
    
    // Get the user's data
    const userData = await getUserData(decodedToken.uid);
    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }
    
    // Get the user's usage data
    const usageData = await getUserUsage(decodedToken.uid);
    
    // Remove sensitive fields
    const { email, displayName, photoURL, subscriptionStatus, subscriptionTier, trialStart, trialEnd } = userData;
    
    // Calculate days left in trial if applicable
    let daysLeftInTrial = 0;
    if (trialEnd && subscriptionStatus === 'trial') {
      const now = new Date();
      const trialEndDate = trialEnd.toDate();
      const diffTime = trialEndDate.getTime() - now.getTime();
      daysLeftInTrial = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    
    // Return the user's data
    return NextResponse.json({
      user: {
        email,
        displayName,
        photoURL,
        subscriptionStatus,
        subscriptionTier,
        trial: {
          isInTrial: subscriptionStatus === 'trial',
          daysLeft: daysLeftInTrial,
          trialStartDate: trialStart ? trialStart.toDate() : null,
          trialEndDate: trialEnd ? trialEnd.toDate() : null,
        }
      },
      usage: usageData ? {
        used: usageData.promptsUsed,
        limit: usageData.promptLimit,
        resetDate: usageData.resetDate.toDate(),
        unlimited: subscriptionTier === 'founder'
      } : null
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile data' },
      { status: 500 }
    );
  }
} 