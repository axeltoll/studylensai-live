'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthModal from '@/app/components/auth/AuthModal';
import { useAuth } from '@/lib/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="white-box-header flex justify-between items-center px-4 border border-gray-100">
          <div className="flex items-center h-full">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logos/StudyLens-Ai-Logo-V1-Black-Text.png"
                alt="StudyLens AI"
                width={180}
                height={40}
                className="animate-fade-in-right"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-16 mx-auto">
            <Link href="#features" className="text-gray-700 hover:text-gray-900 text-sm font-medium animate-fade-in-up animation-delay-100">Features</Link>
            <Link href="#pricing" className="text-gray-700 hover:text-gray-900 text-sm font-medium animate-fade-in-up animation-delay-200">Pricing</Link>
            <Link href="#faq" className="text-gray-700 hover:text-gray-900 text-sm font-medium animate-fade-in-up animation-delay-300">FAQ</Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium animate-fade-in-up animation-delay-400">Chrome Extension (Coming Soon)</Link>
          </div>
          
          <div className="hidden md:flex items-center">
            {!loading && (
              user ? (
                <>
                  <Link href="/dashboard" passHref>
                    <Button variant="outline" className="animate-fade-in-up animation-delay-200 px-6 bg-white text-gradient-blue-purple border border-black hover:bg-gray-50">Dashboard</Button>
                  </Link>
                  <Button onClick={handleSignOut} className="btn-gradient animate-fade-in-up animation-delay-300 px-6 ml-4">Sign Out</Button>
                </>
              ) : (
                <>
                  <Link href="/dashboard" passHref>
                    <Button variant="outline" className="mr-4 animate-fade-in-up animation-delay-200 px-6 bg-white text-gradient-blue-purple border border-black hover:bg-gray-50">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => setIsAuthModalOpen(true)} 
                    className="btn-gradient animate-fade-in-up animation-delay-300 px-6"
                  >
                    Get Started
                  </Button>
                </>
              )
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white p-4 shadow-lg rounded-b-lg mt-2 mx-4">
          <div className="flex flex-col space-y-2">
            <Link 
              href="#features" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="#faq" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chrome Extension (Coming Soon)
            </Link>
            {!loading && (
              user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Link 
                    href="/dashboard" 
                    className="bg-white text-gradient-blue-purple border border-black px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-gradient text-left text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Link 
                    href="/dashboard" 
                    className="block text-gradient-blue-purple px-3 py-2 rounded-md text-sm font-medium bg-white border border-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full btn-gradient"
                  >
                    Get Started
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      )}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navbar;