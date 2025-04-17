import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useUser } from '@/app/context/UserContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface UpgradePopupProps {
  onClose: () => void;
}

const UpgradePopup = ({ onClose }: UpgradePopupProps) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { trialInfo, promptUsage } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasHadTrial, setHasHadTrial] = useState(false);

  useEffect(() => {
    // Set email from user context if available
    if (user?.email) {
      setEmail(user.email);
    }
    
    // Check if the user already had a trial
    if (user) {
      const hadTrial = localStorage.getItem(`${user.uid}_hadTrial`) === 'true';
      setHasHadTrial(hadTrial && !trialInfo.isInTrial);
    }
    
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [user, trialInfo.isInTrial]);

  const handleStartTrial = async () => {
    // Prevent starting another trial with the same account
    if (hasHadTrial) {
      setError('You have already used your free trial. Please subscribe to the Pro plan.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch price ID from our API
      const configResponse = await fetch('/api/stripe/create-checkout', {
        method: 'GET',
      });
      
      const { priceId } = await configResponse.json();
      
      if (!priceId) {
        throw new Error('Could not retrieve subscription plan information');
      }
      
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user?.uid,
          email: email,
        }),
      });
      
      const { url, error: checkoutError } = await response.json();
      
      if (checkoutError) {
        throw new Error(checkoutError);
      }
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Error starting trial:', err);
      setError(err instanceof Error ? err.message : 'Failed to start trial');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
          <p className="opacity-90">
            Get unlimited access to advanced features with a 3-day free trial
          </p>
          <div className="absolute -bottom-8 right-10 bg-white dark:bg-gray-800 rounded-full p-4 border-4 border-blue-500">
            <CreditCard className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 pt-10">
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mt-0.5">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                {trialInfo.isInTrial ? (
                  <>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">Trial in Progress</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      You have {trialInfo.daysLeft} {trialInfo.daysLeft === 1 ? 'day' : 'days'} left in your free trial.
                      You're currently limited to {promptUsage.limit} AI generations per day.
                    </p>
                  </>
                ) : hasHadTrial ? (
                  <>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">Trial Expired</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Your free trial has ended. Upgrade to Pro for unlimited access to all features.
                      Free accounts are limited to {promptUsage.limit} AI generations per day.
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">Limited Free Plan</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      You're using StudyLens AI with our free plan, which is limited to {promptUsage.limit} AI generations per day.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Pro Plan Features:</h3>
          
          <ul className="space-y-3 mb-6">
            {[
              '50 AI generations daily',
              'Advanced Deep Research function',
              'Priority support',
              'Early access to new features'
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 mr-3">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col">
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly subscription</span>
              <span className="text-sm font-medium">$9.99/month</span>
            </div>
            {!hasHadTrial && !trialInfo.isInTrial && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">3-day trial</span>
                <span className="text-sm font-medium text-green-600">FREE</span>
              </div>
            )}
          </div>
          
          {/* Email input - only show if starting a new trial */}
          {!hasHadTrial && !trialInfo.isInTrial && (
            <div className="mt-4 mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Maybe Later
            </Button>
            
            <Button
              onClick={handleStartTrial}
              className="flex-1 btn-gradient"
              disabled={isLoading || (!email && !hasHadTrial && !trialInfo.isInTrial)}
            >
              {isLoading ? 'Processing...' : (
                hasHadTrial || trialInfo.isInTrial ? 'Upgrade to Pro' : 'Start Free Trial'
              )}
            </Button>
          </div>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            {hasHadTrial || trialInfo.isInTrial 
              ? 'By upgrading, you agree to our Terms of Service and Privacy Policy. You can cancel your subscription at any time.'
              : 'By starting a trial, you agree to our Terms of Service and Privacy Policy. You won\'t be charged until your trial ends.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePopup; 