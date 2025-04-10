import React from 'react';
import Link from 'next/link';
import { Menu, User, Bell, X } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';

interface MobileNavProps {
  onOpenSidebar: () => void;
}

const MobileNav = ({ onOpenSidebar }: MobileNavProps) => {
  const { user } = useUser();
  
  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onOpenSidebar}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/dashboard" className="flex items-center">
          <img 
            src="/images/logo.png" 
            alt="StudyLens AI" 
            className="h-8 w-auto"
          />
          <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">StudyLens AI</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Bell className="h-5 w-5" />
        </button>
        <Link 
          href="/dashboard/profile" 
          className="flex items-center text-sm text-gray-700 dark:text-gray-300"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav; 