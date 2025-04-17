'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LinkComponent from '@/components/ui/link';
import { Search, Bell, ChevronDown, MessageSquare, Settings, LogOut, CreditCard, User, HelpCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  pageTitle?: string;
  backLink?: string;
  showBackButton?: boolean;
}

export default function Header({ pageTitle, backLink, showBackButton = false }: HeaderProps) {
  const { user, userTier, promptUsage, subscription } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const isOnChatPage = pathname.includes('/dashboard/chat');

  // Safely handle client-side operations with useEffect
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Set profile URL only on client side after component mounts
    if (user?.photoURL) {
      setProfileUrl(user.photoURL);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully signed out');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  // Mock notifications - would be fetched from backend in real implementation
  const notifications = [
    { id: 1, title: 'New feature', message: 'Check out our new Quizzes & Flashcards feature', time: '1h ago', read: false },
    { id: 2, title: 'Prompt usage', message: 'You have used 2 out of 5 prompts this week', time: '3h ago', read: true },
    { id: 3, title: 'Saved notes', message: 'Your study notes have been saved successfully', time: '1d ago', read: true },
  ];

  return (
    <header className={`w-full bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between ${isOnChatPage ? 'z-10' : ''}`}>
      {/* Logo - Small version for header */}
      <div className="lg:hidden">
        <LinkComponent href="/" className="flex items-center" prefetch={false}>
          <div className="relative w-10 h-10">
            <Image 
              src="/images/logos/StudyLens-Ai-Logo-V1-Icon-Only.png" 
              alt="StudyLens AI" 
              width={40} 
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </LinkComponent>
      </div>

      {/* Page Title Section */}
      <div className="hidden md:flex flex-col mr-4">
        {pageTitle && <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>}
        {showBackButton && backLink && (
          <LinkComponent href={backLink} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Return to AI Study Center
          </LinkComponent>
        )}
      </div>

      {/* Center Search Bar - Hide on chat page */}
      {!isOnChatPage && (
        <div className="flex-1 max-w-xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations, help articles, resources..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}
      
      {/* Center spacing for chat page */}
      {isOnChatPage && <div className="flex-1"></div>}

      {/* Right Side Controls */}
      <div className="flex items-center space-x-4">
        {/* Prompt Usage Counter */}
        <div className="flex items-center px-2 py-1 bg-gray-100 rounded text-sm">
          <MessageSquare className="h-4 w-4 text-gray-500 mr-1" />
          <span>{promptUsage.used}/{promptUsage.limit}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
              <div className="py-2 px-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
              <div className="py-2 px-4 bg-gray-50 text-center border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            className="flex items-center space-x-1 focus:outline-none"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profileUrl ? (
                <Image 
                  src={profileUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover"
                  suppressHydrationWarning
                />
              ) : (
                <User className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20">
              <div className="py-3 px-4 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.displayName || user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {userTier === 'pro' ? 'Pro Account' : 
                   subscription.status === 'trial' ? 'Pro Trial' : 
                   'Free Account'}
                </p>
              </div>
              <div className="py-1">
                <LinkComponent href="/dashboard/settings" className="dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" prefetch={false}>
                  <Settings className="mr-3 h-4 w-4 text-gray-400" />
                  Settings
                </LinkComponent>
                <LinkComponent href="/dashboard/subscription" className="dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" prefetch={false}>
                  <CreditCard className="mr-3 h-4 w-4 text-gray-400" />
                  Manage Subscription
                </LinkComponent>
                <LinkComponent href="/dashboard/support" className="dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" prefetch={false}>
                  <HelpCircle className="mr-3 h-4 w-4 text-gray-400" />
                  Help & Support
                </LinkComponent>
              </div>
              <div className="py-1 border-t border-gray-100">
                <button 
                  onClick={handleSignOut}
                  className="dropdown-item flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 