'use client';

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineMail, HiOutlineLockClosed, HiX } from 'react-icons/hi';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!isLogin && !agreeToTerms) {
      toast.error('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setLoading(true);
    const action = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
    const successMessage = isLogin ? 'Logged in successfully' : 'Account created successfully';
    const errorMessage = isLogin ? 'Login failed' : 'Signup failed';

    try {
      await action(auth, email, password);
      toast.success(successMessage);
      onClose(); // Close modal on success
    } catch (error: any) {
      console.error(`${errorMessage}: `, error);
      toast.error(`${errorMessage}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use Firebase's sendPasswordResetEmail function
      await import('firebase/auth').then(({ sendPasswordResetEmail }) => 
        sendPasswordResetEmail(auth, resetEmail)
      );
      setResetEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset failed: ', error);
      toast.error(`Failed to send reset email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logged in with Google successfully');
      onClose(); // Close modal on success
    } catch (error: any) {
      console.error('Google Sign-in failed: ', error);
      toast.error(`Google Sign-in failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <HiX className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                
                {isForgotPassword ? (
                  // Forgot Password Screen
                  <>
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-18 h-18 mb-2">
                        <Image 
                          src="/images/logos/StudyLens-Ai-Logo-V1-Square-396-349-Black.png"
                          alt="StudyLens AI"
                          width={73}
                          height={73}
                        />
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-medium text-center text-gray-900"
                      >
                        Reset your password
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 mt-1 text-center">
                        We'll send you an email with a link to reset your password
                      </p>
                    </div>
                    
                    {resetEmailSent ? (
                      <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          We've sent a password reset link to <span className="font-medium">{resetEmail}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(false);
                            setResetEmailSent(false);
                            setResetEmail('');
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Back to login
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword}>
                        <div className="mb-4">
                          <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
                          <div className="mt-1 relative rounded-lg">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiOutlineMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              id="resetEmail"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={loading} 
                          className="w-full btn-gradient py-2 rounded-lg mb-4"
                        >
                          {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                        
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setIsForgotPassword(false)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                          >
                            Back to login
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  // Login/Signup Screens
                  <>
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-18 h-18 mb-2">
                        <Image 
                          src="/images/logos/StudyLens-Ai-Logo-V1-Square-396-349-Black.png"
                          alt="StudyLens AI"
                          width={73}
                          height={73}
                        />
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-medium text-center text-gray-900"
                      >
                        {isLogin ? 'Welcome back' : 'Create your account'}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 mt-1 text-center">
                        {isLogin ? 'Log in to your account' : 'Get started with your free account'}
                      </p>
                    </div>
                    
                    {/* Login/Signup Tabs */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setIsLogin(true)}
                        className={`w-1/2 py-2 text-sm font-medium rounded-md ${
                          isLogin ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => setIsLogin(false)}
                        className={`w-1/2 py-2 text-sm font-medium rounded-md ${
                          !isLogin ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                    
                    {/* Social Sign-in */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mb-4"
                    >
                      <FcGoogle className="h-5 w-5" />
                      <span>{isLogin ? 'Log in with Google' : 'Sign up with Google'}</span>
                    </button>
                    
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or continue with email</span>
                      </div>
                    </div>

                    <form onSubmit={handleAuthAction}>
                      {!isLogin && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                              type="text"
                              id="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required={!isLogin}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="John"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                              type="text"
                              id="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required={!isLogin}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="mt-1 relative rounded-lg">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineMail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1 relative rounded-md">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="••••••••"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              {showPassword ? (
                                <HiOutlineEyeOff className="h-5 w-5" />
                              ) : (
                                <HiOutlineEye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {!isLogin && (
                        <div className="mb-4">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                          <div className="mt-1 relative rounded-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required={!isLogin}
                              minLength={6}
                              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="••••••••"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                {showConfirmPassword ? (
                                  <HiOutlineEyeOff className="h-5 w-5" />
                                ) : (
                                  <HiOutlineEye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!isLogin && (
                        <div className="mb-6 flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="terms"
                              type="checkbox"
                              checked={agreeToTerms}
                              onChange={(e) => setAgreeToTerms(e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-gray-500">
                              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </label>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full btn-gradient py-2 rounded-lg"
                      >
                        {loading ? 'Processing...' : (isLogin ? 'Log in' : 'Create account')}
                      </Button>
                      
                      {isLogin && (
                        <div className="mt-2 text-center">
                          <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                          >
                            Forgot your password? Reset it here!
                          </button>
                        </div>
                      )}
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {isLogin ? 'Sign up' : 'Log in'}
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal; 