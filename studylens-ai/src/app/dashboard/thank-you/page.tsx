'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Check, CreditCard, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import withAuth from '@/components/auth/withAuth';
import Image from 'next/image';
import toast from 'react-hot-toast';

function ThankYouPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showYearlyUpsell, setShowYearlyUpsell] = useState(true);
  const [acceptedUpsell, setAcceptedUpsell] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if the user arrived here after purchasing a yearly plan
    const yearly = new URLSearchParams(window.location.search).get('yearly');
    if (yearly === 'true') {
      setIsYearly(true);
      setShowYearlyUpsell(false);
    }
  }, []);
  
  // Calculate trial end date (3 days from now)
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 3);
  
  // Format the date as Month Day, Year
  const formattedDate = trialEndDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Handle accepting the yearly upsell
  const handleAcceptYearlyUpsell = async () => {
    try {
      // Show loading indicator
      setIsLoading(true);

      // Make API call to Stripe to process yearly subscription
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          email: user?.email,
          priceId: 'yearly_pro_subscription', // Uses the lookup_key we defined
          yearlyUpsell: true
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error || 'Failed to process yearly upgrade');
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error processing yearly upgrade:', error);
      toast.error('Failed to process yearly upgrade. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Handle declining the yearly upsell
  const handleDeclineYearlyUpsell = () => {
    setShowYearlyUpsell(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Subscription!</h1>
        <p className="text-gray-600">
          Welcome to StudyLens Pro! Your account has been successfully upgraded.
        </p>
      </div>
      
      {/* Subscription Details Card */}
      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center">
            <Check className="mr-2 h-6 w-6" /> 
            Subscription Confirmed
          </CardTitle>
          <CardDescription className="text-blue-100">
            Your subscription has been successfully processed
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {!isYearly && (
              <div className="flex items-start">
                <CalendarCheck className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Trial Period</h3>
                  <p className="text-gray-600">
                    Your 3-day free trial is now active. You won't be charged until <span className="font-semibold">{formattedDate}</span>.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Billing Information</h3>
                <p className="text-gray-600">
                  {isYearly 
                    ? "Your yearly subscription is now active. You've been charged $59.99 for one full year of StudyLens Pro access."
                    : "After your trial ends, you'll be billed $9.99 per month for the StudyLens Pro plan."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between">
          <Link href="/dashboard/settings" className="text-sm text-blue-600 hover:text-blue-800">
            Manage your subscription
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-800">
            Return to dashboard
          </Link>
        </CardFooter>
      </Card>
      
      {/* Yearly Upsell Section */}
      {showYearlyUpsell && (
        <Card className="border-2 border-amber-300 shadow-lg animate-pulse">
          <CardHeader className="bg-gradient-to-r from-amber-400 to-amber-600 text-white">
            <div className="absolute right-3 top-3">
              <span className="inline-block bg-white text-amber-600 text-xs font-bold px-2 py-1 rounded-full">
                Limited Time Offer!
              </span>
            </div>
            <CardTitle>Special Yearly Offer - 50% OFF!</CardTitle>
            <CardDescription className="text-white">
              Only available for the first 100 Early Supporters!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Upgrade to Yearly Plan & Save</h3>
                <p className="text-gray-600 mb-4">
                  Get a full year of StudyLens Pro for just <span className="line-through">$119.88</span> 
                  <span className="text-amber-600 font-bold text-xl ml-2">$59.99!</span>
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Save over $60 compared to monthly plan</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Lock in the discount for a full year</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>No further payments for 12 months</span>
                  </li>
                </ul>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <div className="text-amber-800 font-bold">50% Discount</div>
                  <div className="text-3xl font-bold">$59.99</div>
                  <div className="text-gray-500 line-through text-sm">$119.88</div>
                  <div className="text-xs text-gray-600 mt-1">For 12 months</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto"
              onClick={handleAcceptYearlyUpsell}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Yes! I Accept The $59.99 Yearly Upgrade"
              )}
            </Button>
            <Button 
              variant="outline"
              className="text-gray-600 w-full sm:w-auto"
              onClick={handleDeclineYearlyUpsell}
              disabled={isLoading}
            >
              No thanks, I'll stick with my free trial
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Confirmation after user makes a choice on upsell */}
      {!showYearlyUpsell && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {acceptedUpsell ? 
                'Thank You for Upgrading to Yearly!' : 
                'You\'re All Set with Your Monthly Plan'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {acceptedUpsell ? (
              <div className="flex items-start">
                <Check className="h-5 w-5 mr-3 text-green-500 mt-0.5" />
                <div>
                  <p className="text-gray-600">
                    Your account has been upgraded to the yearly plan for $59.99. Your card will be charged, and your subscription will be valid for a full year.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <Check className="h-5 w-5 mr-3 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-gray-600">
                    You're all set with your monthly plan. You can enjoy your 3-day trial, and then your subscription will continue at $9.99 per month.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push('/dashboard')}
            >
              Continue to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default withAuth(ThankYouPage); 