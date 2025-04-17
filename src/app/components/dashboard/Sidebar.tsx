'use client';

import React from 'react';
import Link from 'next/link';
import LinkComponent from '@/components/ui/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
    HiOutlineHome, 
    HiOutlineChatAlt2, 
    HiOutlineDocumentText, 
    HiOutlineQuestionMarkCircle, 
    HiOutlineSparkles,
    HiOutlineLogout,
    HiOutlineLibrary,
    HiOutlineUserGroup,
    HiOutlineCog,
    HiOutlineSupport,
    HiOutlineLightBulb,
    HiOutlineChartBar,
    HiOutlineCalendar,
    HiOutlineSearch,
    HiOutlineClock,
    HiOutlineCollection,
    HiOutlineViewGrid,
    HiX,
    HiOutlinePencil,
    HiOutlineCode,
    HiOutlineGlobe
} from 'react-icons/hi';
import { useAuth } from '@/lib/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useUpgradePopup } from '@/app/dashboard/layout';
import PomodoroWidget from './PomodoroWidget';

interface SidebarProps {
  onClose?: () => void;
}

// Main features navigation
const mainFeatures = [
  { name: 'Dashboard', href: '/dashboard', icon: HiOutlineHome },
];

// AI Chatbot submenu items
const chatbotFeatures = [
  { name: 'Study Assistant', href: '/dashboard/chat?type=study', icon: HiOutlineChatAlt2 },
  { name: 'Expert Essay Writer', href: '/dashboard/chat?type=essay', icon: HiOutlinePencil },
  { name: 'Code Assistant', href: '/dashboard/chat?type=code', icon: HiOutlineCode },
];

// Other main features
const otherMainFeatures = [
  { name: 'AI Deep Topic Research', href: '/dashboard/research', icon: HiOutlineGlobe },
  { name: 'Quizzes & Flashcards', href: '/dashboard/quiz', icon: HiOutlineQuestionMarkCircle },
];

// Tools & Resources
const toolsResources = [
  { name: 'Activity & All Resources', href: '/dashboard/resources', icon: HiOutlineClock },
  { name: 'Feature Overview', href: '/dashboard/features', icon: HiOutlineViewGrid },
];

// Support & Feedback
const supportNavigation = [
  { name: 'Account Settings', href: '/dashboard/settings', icon: HiOutlineCog },
  { name: 'Help Docs & Support', href: '/dashboard/support', icon: HiOutlineSupport },
  { name: 'Suggest a Feature', href: '/dashboard/feedback', icon: HiOutlineLightBulb },
];

const Sidebar = ({ onClose }: SidebarProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, userTier, loading, trialInfo, promptUsage, subscription } = useAuth();
    const { setShowUpgradePopup } = useUpgradePopup();

    // Helper function to check if a chat link is active
    const isChatActive = (href: string) => {
      if (!pathname.startsWith('/dashboard/chat')) return false;
      
      // Extract type from href
      const match = href.match(/type=([^&]*)/);
      if (!match) return false;
      
      const typeFromHref = match[1];
      
      // Use searchParams to safely check the current type
      const currentType = searchParams.get('type');
      
      return currentType === typeFromHref;
    };

    // Determine button text based on user tier and subscription status
    const getUpgradeButtonText = () => {
      if (userTier === 'founder') {
        return 'Founder Account';
      } else if (userTier === 'pro') {
        return 'Pro User';
      } else if (trialInfo.isInTrial) {
        return `Trial in Progress`;
      } else {
        return 'Upgrade to Pro';
      }
    };

    const getTrialStatusText = () => {
      if (userTier === 'founder' || userTier === 'pro') {
        return null; // No trial status for pro/founder users
      } else if (trialInfo.isInTrial) {
        const daysText = trialInfo.daysLeft === 1 ? 'day' : 'days';
        return `${trialInfo.daysLeft} ${daysText} left in trial`;
      } else if (subscription.status === 'expired' && subscription.paymentGracePeriodEnd && new Date() < subscription.paymentGracePeriodEnd) {
        return 'Trial ended - Account access expires soon';
      } else {
        return null;
      }
    };

    const getPromptLimitText = () => {
      if (promptUsage.unlimited) {
        return 'Unlimited prompts';
      }
      const limit = promptUsage.limit;
      const used = promptUsage.used;
      return `${used}/${limit} prompts used today`;
    };

    const handleSignOut = async () => {
        try {
          await signOut(auth);
          toast.success('Successfully signed out');
        } catch (error) {
          toast.error('Error signing out');
        }
      };

    // Use a static string for logo path to avoid hydration issues
    const logoSrc = '/images/logos/StudyLens-Ai-Logo-V1-Black-Text.png';

    return (
        <div className="w-[18rem] h-full bg-white border-r border-gray-200 flex flex-col">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 flex-shrink-0 px-4">
                <LinkComponent href="/" className="flex items-center" prefetch={false}>
                    <div className="relative w-full h-10">
                        <Image 
                            src={logoSrc} 
                            alt="StudyLens AI" 
                            width={160} 
                            height={40}
                            className="object-contain"
                            priority
                        />
                    </div>
                </LinkComponent>
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                    >
                        <HiX className="h-5 w-5" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="px-2 py-4">
                    {/* Main Features */}
                    <div className="px-3 pb-2">
                        <p className="text-xs font-semibold text-gray-500 tracking-wider">
                            Main Features
                        </p>
                    </div>
                    <nav className="space-y-1 mb-4">
                        {mainFeatures.map((item) => (
                            <LinkComponent
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                className={cn(
                                    'menu-item group inline-flex flex-row items-center px-2 py-2 text-sm font-medium rounded-md w-full',
                                    pathname === item.href
                                        ? 'bg-gradient-blue-purple text-white'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                                onClick={onClose}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 flex-shrink-0 h-5 w-5 inline-block',
                                        pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="whitespace-nowrap inline-block">{item.name}</span>
                            </LinkComponent>
                        ))}
                    </nav>
                    
                    {/* AI Study Center Section */}
                    <div className="px-3 mb-1">
                        <LinkComponent
                            href="/dashboard/study-center"
                            prefetch={false}
                            className={cn(
                                'menu-item group inline-flex flex-row items-center px-2 py-2 text-sm font-medium rounded-md w-full',
                                pathname === '/dashboard/study-center' || pathname.startsWith('/dashboard/chat')
                                    ? 'bg-gradient-blue-purple text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                            onClick={onClose}
                        >
                            <HiOutlineChatAlt2
                                className={cn(
                                    'mr-3 flex-shrink-0 h-5 w-5 inline-block',
                                    pathname === '/dashboard/study-center' || pathname.startsWith('/dashboard/chat') ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                )}
                                aria-hidden="true"
                            />
                            <span className="whitespace-nowrap inline-block">AI Study Center</span>
                        </LinkComponent>
                        
                        <div className="pl-8 space-y-1 mt-1 w-full">
                            {chatbotFeatures.map((item) => (
                                <LinkComponent
                                    key={item.name}
                                    href={item.href}
                                    prefetch={false}
                                    className={cn(
                                        'menu-item group inline-flex flex-row items-center px-2 py-1.5 text-sm font-medium rounded-md w-full',
                                        isChatActive(item.href)
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    )}
                                    onClick={onClose}
                                >
                                    <item.icon
                                        className={cn(
                                            'mr-2 flex-shrink-0 h-5 w-5 inline-block',
                                            isChatActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span className="whitespace-nowrap inline-block">{item.name}</span>
                                </LinkComponent>
                            ))}
                        </div>
                    </div>
                    
                    {/* Other Main Features */}
                    <nav className="space-y-1 mb-6 mt-2">
                        {otherMainFeatures.map((item) => (
                            <LinkComponent
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                className={cn(
                                    'menu-item group inline-flex flex-row items-center px-2 py-2 text-sm font-medium rounded-md w-full',
                                    pathname.startsWith(item.href)
                                        ? 'bg-gradient-blue-purple text-white'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                                onClick={onClose}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 flex-shrink-0 h-5 w-5 inline-block',
                                        pathname.startsWith(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="whitespace-nowrap inline-block">{item.name}</span>
                            </LinkComponent>
                        ))}
                    </nav>
                    
                    {/* Tools & Resources Section */}
                    <div className="pt-4 pb-2">
                        <p className="px-3 text-xs font-semibold text-gray-500 tracking-wider">
                            Tools & Resources
                        </p>
                    </div>
                    <nav className="space-y-1 mb-6">
                        {toolsResources.map((item) => (
                            <LinkComponent
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                className={cn(
                                    'menu-item group inline-flex flex-row items-center px-2 py-2 text-sm font-medium rounded-md w-full',
                                    pathname === item.href
                                        ? 'bg-gradient-blue-purple text-white'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                                onClick={onClose}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 flex-shrink-0 h-5 w-5 inline-block',
                                        pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="whitespace-nowrap inline-block">{item.name}</span>
                            </LinkComponent>
                        ))}
                    </nav>
                    
                    {/* Support & Feedback */}
                    <div className="pt-4 pb-2 mt-6">
                        <p className="px-3 text-xs font-semibold text-gray-500 tracking-wider">
                            Support & Feedback
                        </p>
                    </div>
                    <nav className="space-y-1 mb-6">
                        {supportNavigation.map((item) => (
                            <LinkComponent
                                key={item.name}
                                href={item.href}
                                prefetch={false}
                                className={cn(
                                    'menu-item group inline-flex flex-row items-center px-2 py-2 text-sm font-medium rounded-md w-full',
                                    pathname === item.href
                                        ? 'bg-gradient-blue-purple text-white'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                                onClick={onClose}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 flex-shrink-0 h-5 w-5 inline-block',
                                        pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="whitespace-nowrap inline-block">{item.name}</span>
                            </LinkComponent>
                        ))}
                    </nav>
                </div>
            </div>
            
            {/* Pomodoro Timer Widget */}
            <div className="px-3 py-2 border-t border-gray-200">
                <PomodoroWidget />
            </div>
            
            {/* Upgrade Button */}
            <div className="px-3 py-2 border-t border-gray-200">
                {userTier === 'founder' ? (
                    <div className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium text-center">
                        Founder Account
                    </div>
                ) : userTier === 'pro' ? (
                    <div className="w-full py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium text-center">
                        Pro User
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={() => setShowUpgradePopup(true)}
                            className="w-full py-2 bg-gradient-blue-purple text-white rounded-lg font-medium text-center">
                            {getUpgradeButtonText()}
                        </button>
                        
                        {getTrialStatusText() && (
                            <div className="mt-2 text-center text-sm text-gray-600 font-medium">
                                {getTrialStatusText()}
                            </div>
                        )}
                        
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-600">Daily Prompt Usage</span>
                                <span className="text-xs font-medium text-gray-600">{getPromptLimitText()}</span>
                            </div>
                            {!promptUsage.unlimited && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-gradient-blue-purple h-2.5 rounded-full" 
                                        style={{ width: `${Math.min(100, (promptUsage.used / promptUsage.limit) * 100)}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar; 

