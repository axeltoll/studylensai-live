import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, setUserClaims } from '@/lib/firebase/admin';
import { updateUserSubscription } from '@/lib/firebase/firestore';

/**
 * Admin API endpoint to set user roles
 * Only accessible to users with admin claim
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const decodedToken = await verifyAuthToken(authHeader);
    
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to access this function' },
        { status: 401 }
      );
    }
    
    // Verify admin role
    if (!decodedToken.admin && decodedToken.email !== 'axel@funnel-profits.com') {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to access this function' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const { userId, role, tier } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!role || !['inactive', 'active', 'trial', 'expired', 'founder'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role is required (inactive, active, trial, expired, founder)' },
        { status: 400 }
      );
    }
    
    if (!tier || !['free', 'pro', 'founder'].includes(tier)) {
      return NextResponse.json(
        { error: 'Valid tier is required (free, pro, founder)' },
        { status: 400 }
      );
    }
    
    // Set custom claims in Firebase Auth
    await setUserClaims(userId, { 
      role,
      tier,
      updatedAt: Date.now(),
      updatedBy: decodedToken.uid
    });
    
    // Update user subscription in Firestore
    await updateUserSubscription(userId, role, tier);
    
    return NextResponse.json({
      success: true,
      message: `User ${userId} role updated to ${role} (${tier})`
    });
  } catch (error) {
    console.error('Error setting user role:', error);
    return NextResponse.json(
      { error: 'Failed to set user role' },
      { status: 500 }
    );
  }
} 