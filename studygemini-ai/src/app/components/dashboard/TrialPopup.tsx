'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { X, CheckCircle } from 'lucide-react';

interface TrialPopupProps {
  onClose: () => void;
}

const TrialPopup = ({ onClose }: TrialPopupProps) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cashapp'>('card');
  const [address, setAddress] = useState({
    country: 'United States',
    addressLine1: '',
    state: '',
    city: '',
    zip: ''
  });

  const logoSrc = theme === 'light' 
    ? 'https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dac1e06ab0c18df6a034.png' 
    : 'https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/67f1dac9f10fee532eb38351.png';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, handle payment processing here
    console.log('Processing trial signup');
    onClose();
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">College Tools (Free Trial)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 p-3 border rounded-md flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className="text-sm">Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cashapp')}
                className={`flex-1 p-3 border rounded-md flex items-center justify-center ${
                  paymentMethod === 'cashapp' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <span className="text-sm">Cash App Pay</span>
              </button>
            </div>
          </div>
          
          {paymentMethod === 'card' && (
            <>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card number</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  placeholder="1234 1234 1234 1234"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration date</label>
                  <input
                    type="text"
                    id="expiry"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    placeholder="MM / YY"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Security code</label>
                  <input
                    type="text"
                    id="cvc"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    placeholder="CVC"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cardholder name</label>
                <input
                  type="text"
                  id="cardholderName"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  placeholder="John Smith"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
              </div>
            </>
          )}
          
          <div className="flex flex-col">
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-sm font-medium">$0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Every month</span>
              <span className="text-sm font-medium">$19.99</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">3 day trial</span>
              <span className="text-sm font-medium text-green-600">FREE</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full btn-gradient"
            >
              Start trial
            </Button>
          </div>
          
          <div className="mt-4 flex justify-center items-center space-x-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              <span>Satisfaction guaranteed</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </form>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-b-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 relative w-12 h-12 rounded-full overflow-hidden">
              <Image 
                src={logoSrc}
                alt="StudyGemini AI"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Join 250k+ Students improving their education</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialPopup;