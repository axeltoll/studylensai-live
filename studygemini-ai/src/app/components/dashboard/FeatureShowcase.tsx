'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define feature data structure
interface Feature {
  name: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

// Feature data array
const features: Feature[] = [
  {
    name: 'Study Sessions',
    description: 'Create optimized study sessions with AI guidance',
    icon: '/images/features/study.svg',
    href: '/dashboard/study',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-300'
  },
  {
    name: 'AI Assistant',
    description: 'Get intelligent answers to your study questions',
    icon: '/images/features/ai.svg',
    href: '/dashboard/chat',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
  },
  {
    name: 'Dashboard',
    description: 'Track your progress and study activity',
    icon: '/images/features/dashboard.svg',
    href: '/dashboard',
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
  },
  {
    name: 'Notifications',
    description: 'Stay updated with timely reminders',
    icon: '/images/features/notification.svg',
    href: '/dashboard/notifications',
    color: 'bg-red-50 border-red-200 hover:border-red-300'
  },
  {
    name: 'Quizzes',
    description: 'Test your knowledge with AI-generated quizzes',
    icon: '/images/features/quiz.svg',
    href: '/dashboard/quiz',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-300'
  },
  {
    name: 'Flashcards',
    description: 'Create and study with digital flashcards',
    icon: '/images/features/flashcards.svg',
    href: '/dashboard/flashcards',
    color: 'bg-amber-50 border-amber-200 hover:border-amber-300'
  },
  {
    name: 'Pomodoro Timer',
    description: 'Use timed study sessions to maximize focus',
    icon: '/images/features/timer.svg',
    href: '/dashboard/timer',
    color: 'bg-rose-50 border-rose-200 hover:border-rose-300'
  },
  {
    name: 'Calendar',
    description: 'Schedule and organize your study timetable',
    icon: '/images/features/calendar.svg',
    href: '/dashboard/calendar',
    color: 'bg-sky-50 border-sky-200 hover:border-sky-300'
  },
  {
    name: 'Progress Tracking',
    description: 'Monitor your learning achievements',
    icon: '/images/features/progress.svg',
    href: '/dashboard/progress',
    color: 'bg-lime-50 border-lime-200 hover:border-lime-300'
  },
  {
    name: 'Community',
    description: 'Connect with other learners in the community',
    icon: '/images/features/community.svg',
    href: '/dashboard/community',
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300'
  },
  {
    name: 'Gamification',
    description: 'Earn rewards and compete on leaderboards',
    icon: '/images/features/gamification.svg',
    href: '/dashboard/gamification',
    color: 'bg-pink-50 border-pink-200 hover:border-pink-300'
  },
  {
    name: 'Notes',
    description: 'Create and organize your study notes',
    icon: '/images/features/notes.svg',
    href: '/dashboard/notes',
    color: 'bg-violet-50 border-violet-200 hover:border-violet-300'
  },
  {
    name: 'Resources',
    description: 'Access a library of helpful study materials',
    icon: '/images/features/resources.svg',
    href: '/dashboard/resources',
    color: 'bg-green-50 border-green-200 hover:border-green-300'
  },
  {
    name: 'Search',
    description: 'Find what you need across your study content',
    icon: '/images/features/search.svg',
    href: '/dashboard/search',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
  },
  {
    name: 'Settings',
    description: 'Customize your study experience',
    icon: '/images/features/settings.svg',
    href: '/dashboard/settings',
    color: 'bg-gray-50 border-gray-200 hover:border-gray-300'
  }
];

const FeatureShowcase = ({ maxFeatures = 12 }: { maxFeatures?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'grid' | 'carousel'>('grid');
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const featuresSubset = features.slice(0, maxFeatures);

  // Handle window resize and set initial screen size
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // For mobile carousel
  const showNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= featuresSubset.length ? 0 : prevIndex + 1
    );
  };

  const showPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? featuresSubset.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full">
      {/* View toggle for smaller screens */}
      <div className="flex justify-center mb-6 lg:hidden">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setView('grid')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              view === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('carousel')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              view === 'carousel' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Carousel
          </button>
        </div>
      </div>

      {/* Grid View (default for larger screens, optional for smaller) */}
      {(view === 'grid' || isLargeScreen) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuresSubset.map((feature, index) => (
            <Link 
              key={index} 
              href={feature.href}
              className={`flex flex-col items-center p-4 rounded-lg border ${feature.color} transition-all duration-300 hover:shadow-md`}
            >
              <div className="relative w-16 h-16 mb-3">
                <Image
                  src={feature.icon}
                  alt={feature.name}
                  width={64}
                  height={64}
                  className="object-contain"
                  priority={index < 4}
                />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">{feature.name}</h3>
              <p className="text-sm text-gray-500 text-center">{feature.description}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Carousel View (only for smaller screens when selected) */}
      {view === 'carousel' && !isLargeScreen && (
        <div className="relative px-12">
          <button 
            onClick={showPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
            aria-label="Previous"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuresSubset.map((feature, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <Link 
                    href={feature.href}
                    className={`flex flex-col items-center p-6 rounded-lg border ${feature.color} transition-all duration-300 hover:shadow-md`}
                  >
                    <div className="relative w-24 h-24 mb-4">
                      <Image
                        src={feature.icon}
                        alt={feature.name}
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.name}</h3>
                    <p className="text-sm text-gray-500 text-center">{feature.description}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={showNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
            aria-label="Next"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
          
          {/* Pagination indicators */}
          <div className="flex justify-center mt-4">
            {featuresSubset.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 mx-1 rounded-full ${
                  currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureShowcase; 