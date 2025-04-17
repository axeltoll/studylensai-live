'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'personal' | 'business'>('personal');
  
  // Pricing plans with features
  const plans = [
    { 
      name: 'Free', 
      price: '$0', 
      monthlyPrice: '$0',
      popular: false,
      features: [
        'Access to GPT-4o mini',
        'Standard voice chats',
        'Limited access to GPT-4o',
        'Limited access to file uploads, advanced data analysis, web browsing, and image generation',
        'Use custom GPTs'
      ], 
      cta: 'Get Started',
      ctaVariant: 'outline' as const
    },
    { 
      name: 'Plus', 
      price: '$20', 
      monthlyPrice: '$20/month',
      popular: true,
      features: [
        'Everything in Free',
        'Extended limits on messaging, file uploads, advanced data analysis, and image generation',
        'Access to advanced voice and video inputs',
        'Limited access to o1 and o1-mini',
        'Opportunities to test new features',
        'Create and use projects and custom GPTs',
        'Limited access to Sora video generation'
      ], 
      cta: 'Get Plus',
      ctaVariant: 'default' as const
    },
    { 
      name: 'Pro', 
      price: '$200', 
      monthlyPrice: '$200/month',
      popular: false,
      features: [
        'Everything in Plus',
        'Unlimited access to o1, o1-mini, GPT-4o, and advanced voice (audio only)',
        'Higher limits for video and screensharing in advanced voice',
        'Access to o1 pro mode, which uses more compute for the best answers to the hardest questions',
        'Extended access to Sora video generation'
      ], 
      cta: 'Get Pro',
      ctaVariant: 'default' as const
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Upgrade your plan
        </h2>
        
        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
              className={`rounded-full px-6 py-2 text-sm font-medium ${
                billingPeriod === 'personal' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setBillingPeriod('personal')}
            >
              Personal
            </button>
            <button
              className={`rounded-full px-6 py-2 text-sm font-medium ${
                billingPeriod === 'business' ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              onClick={() => setBillingPeriod('business')}
            >
              Business
            </button>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative bg-white border rounded-xl overflow-hidden ${
              plan.popular ? 'ring-2 ring-blue-500' : 'border-gray-200'
            }`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 bg-blue-500 text-xs font-medium text-white text-center py-1">
                  POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">USD/month</span>
                </div>
                
                <p className="mt-1 text-sm text-gray-500">
                  {plan.name === 'Free' ? 'Explore how AI can help you with everyday tasks' : 
                   plan.name === 'Plus' ? 'Level up productivity and creativity with expanded access' :
                   'Get the best of OpenAI with the highest level of access'}
                </p>
                
                <Button 
                  className={`mt-6 w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} 
                  variant={plan.ctaVariant}
                >
                  {plan.cta}
                </Button>
              </div>
              
              <div className="px-6 pb-6">
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.name === 'Free' && (
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <span className="text-sm text-gray-500">Your current plan</span>
                  </div>
                )}
                
                {plan.name === 'Plus' && (
                  <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    Limits apply
                  </div>
                )}
                
                {plan.name === 'Pro' && (
                  <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                    Unlimited subject to abuse guardrails. <a href="#" className="text-blue-600 hover:underline">Learn more</a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Enterprise section */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-700">Need more capabilities for your business?</p>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
            See StudyLens Enterprise
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 