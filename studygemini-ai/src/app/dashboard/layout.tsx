'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import Providers from '@/app/components/Providers';
import UpgradePopup from '@/app/components/dashboard/UpgradePopup';
import { useUser } from '@/app/context/UserContext';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Create context for upgrade popup
interface UpgradePopupContextType {
  showUpgradePopup: boolean;
  setShowUpgradePopup: (show: boolean) => void;
}

export const UpgradePopupContext = createContext<UpgradePopupContextType>({
  showUpgradePopup: false,
  setShowUpgradePopup: () => {},
});

export const useUpgradePopup = () => useContext(UpgradePopupContext);

// Main layout that provides the theme context
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const pathname = usePathname();
  
  // Get user data from context
  const { user, userTier, isLoading } = useUser();
  
  // Fix menu item layout issues
  useEffect(() => {
    const fixMenuItemLayout = () => {
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        if (item instanceof HTMLElement) {
          item.style.display = 'flex';
          item.style.flexDirection = 'row';
          item.style.alignItems = 'center';
          
          // Fix icon alignment
          const icon = item.querySelector('svg');
          if (icon instanceof SVGElement) {
            icon.style.marginRight = '0.75rem';
            icon.style.display = 'inline-block';
            icon.style.flexShrink = '0';
          }
        }
      });
    };
    
    // Run immediately and after a short delay to catch any dynamic elements
    fixMenuItemLayout();
    const timer = setTimeout(fixMenuItemLayout, 500);
    
    return () => clearTimeout(timer);
  }, [pathname]); // Re-run when pathname changes (navigation)

  // Function to determine page title based on pathname
  const getPageTitle = () => {
    if (pathname.includes('/dashboard/chat')) {
      // Safe client-side check
      let type = '';
      if (typeof window !== 'undefined') {
        type = new URL(window.location.href).searchParams.get('type') || '';
      }
      
      if (type === 'essay') {
        return 'Expert Essay Writer';
      } else if (type === 'code') {
        return 'Code Assistant';
      } else {
        return 'Study Assistant';
      }
    } else if (pathname.includes('/dashboard/study-center')) {
      return 'AI Study Center';
    } else if (pathname.includes('/dashboard/research')) {
      return 'AI Deep Topic Research';
    } else if (pathname.includes('/dashboard/quiz')) {
      return 'Quizzes & Flashcards';
    } else {
      return 'Dashboard';
    }
  };

  // Function to determine if back button should be shown
  const shouldShowBackButton = () => {
    return pathname.includes('/dashboard/chat');
  };

  // Function to determine the back link based on pathname
  const getBackLink = () => {
    if (pathname.includes('/dashboard/chat')) {
      return '/dashboard/study-center';
    }
    return '/dashboard';
  };
  
  // Check if user needs to see the upgrade popup
  useEffect(() => {
    // Skip checking during loading state
    if (isLoading) return;
    
    // Check URL parameters to see if user just completed checkout
    const url = new URL(window.location.href);
    const checkoutSuccess = url.searchParams.get('checkout_success') === 'true';
    
    // Redirect to thank you page if checkout was successful
    if (checkoutSuccess && window.location.pathname === '/dashboard') {
      window.location.href = '/dashboard/thank-you' + window.location.search;
      return;
    }
    
    // Show popup if user is logged in, not a pro user, and hasn't just completed checkout
    const shouldShowPopup = user && userTier === 'free' && !checkoutSuccess;
    
    // Check if the user has already dismissed the popup in this session
    const popupDismissed = sessionStorage.getItem('upgradePopupDismissed') === 'true';
    
    if (shouldShowPopup && !popupDismissed) {
      // Give a slight delay for better UX
      const timeoutId = setTimeout(() => {
        setShowUpgradePopup(true);
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [user, userTier, isLoading]);
  
  // Handle close popup
  const handleClosePopup = () => {
    setShowUpgradePopup(false);
    // Store in session storage so it doesn't appear again in this session
    sessionStorage.setItem('upgradePopupDismissed', 'true');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <Providers>
      <UpgradePopupContext.Provider value={{ showUpgradePopup, setShowUpgradePopup }}>
        <div className="flex h-screen bg-gray-100 text-gray-900 dashboard-layout" suppressHydrationWarning>
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              suppressHydrationWarning
            />
          )}
          
          {/* Sidebar */}
          <div className={`fixed lg:relative z-20 h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`} suppressHydrationWarning>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden" suppressHydrationWarning>
            {/* Header */}
            <Header 
              pageTitle={getPageTitle()} 
              backLink={getBackLink()}
              showBackButton={shouldShowBackButton()}
            />
            
            {/* Mobile Header - Only visible on small screens */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4" suppressHydrationWarning>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                suppressHydrationWarning
              >
                <Menu size={24} />
              </button>
            </div>
            
            {/* Content */}
            <main className={`flex-1 overflow-y-auto ${
              pathname.includes('/dashboard/chat') ? 'p-0' : 'p-4 md:p-8'
            }`} suppressHydrationWarning>
              {children}
            </main>
          </div>
          
          {/* Upgrade Popup */}
          {showUpgradePopup && <UpgradePopup onClose={handleClosePopup} />}
        </div>
      </UpgradePopupContext.Provider>
    </Providers>
  );
} 