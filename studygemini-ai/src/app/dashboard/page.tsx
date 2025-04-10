'use client';

import React, { useState, useEffect } from 'react';
import withAuth from '@/app/components/auth/withAuth';
import { useAuth } from '@/lib/contexts/AuthContext';
import TrialPopup from '@/app/components/dashboard/TrialPopup';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Code, 
  PenTool, 
  Search, 
  Smartphone, 
  ExternalLink, 
  Users, 
  Share2,
  Clock,
  Lightbulb,
  FileText
} from 'lucide-react';

// Define main features
const mainFeatures = [
  {
    id: 'study',
    name: 'AI Study Assistant',
    description: 'Take a picture and get clear, step-by-step solutions instantly.',
    icon: BookOpen,
    color: 'from-blue-400 to-indigo-600',
    actionText: 'Try Now',
    href: '/dashboard/chat?type=study',
    bgColor: 'bg-blue-50',
    image: '/images/features/study-assistant.svg',
    badge: 'Popular'
  },
  {
    id: 'essay',
    name: 'AI Essay Writer',
    description: 'Ask questions and get instant answers on any quiz, homework, or test.',
    icon: PenTool,
    color: 'from-blue-500 to-purple-600',
    actionText: 'Try Now',
    href: '/dashboard/chat?type=essay',
    bgColor: 'bg-green-50',
    image: '/images/features/essay-writer.svg',
    badge: 'New'
  },
  {
    id: 'code',
    name: 'AI Code Assistant',
    description: 'Screenshot any question and get instant answers on any quiz or test.',
    icon: Code,
    color: 'from-cyan-400 to-teal-600', // light blue to turquoise
    actionText: 'Try Now',
    href: '/dashboard/chat?type=code',
    bgColor: 'bg-cyan-50',
    image: '/images/features/code-assistant.svg'
  },
  {
    id: 'research',
    name: 'AI Deep Topic Research',
    description: 'Research any topic deeply with AI assistance and generate study materials.',
    icon: Search,
    color: 'from-purple-400 to-pink-600',
    actionText: 'Try Now',
    href: '/dashboard/research',
    bgColor: 'bg-purple-50',
    image: '/images/features/notes.svg',
    badge: 'Beta'
  },
  {
    id: 'quiz',
    name: 'Quizzes & Flashcards',
    description: 'Create and practice with AI-generated quizzes and flashcards for effective learning.',
    icon: FileText,
    color: 'from-amber-400 to-orange-600',
    actionText: 'Try Now',
    href: '/dashboard/quiz',
    bgColor: 'bg-amber-50',
    image: '/images/features/quizzes-flashcards.svg',
    badge: 'New'
  }
];

function DashboardPage() {
  const { user, userTier, loading, trialInfo } = useAuth();
  const [showTrialPopup, setShowTrialPopup] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  // Fetch recent activity when component mounts
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user?.uid) return;
      
      try {
        setIsLoadingActivity(true);
        
        // In a production app, this would be an API call to fetch actual chat history
        // For now, we'll simulate with mock data
        const mockActivity = [
          {
            id: '1',
            type: 'chat',
            chatType: 'study',
            title: 'Solving Quadratic Equations',
            preview: 'How do I solve x² + 5x + 6 = 0?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          },
          {
            id: '2',
            type: 'chat',
            chatType: 'essay',
            title: 'Essay on Climate Change',
            preview: 'What are the main causes of climate change?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          },
          {
            id: '3',
            type: 'research',
            title: 'History of the Roman Empire',
            preview: 'Comprehensive research on the rise and fall of the Roman Empire',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          },
          {
            id: '4',
            type: 'quiz',
            title: 'Biology Flashcards',
            cardCount: 24,
            preview: 'Cell structure, photosynthesis, and genetics',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          }
        ];
        
        // Sort by most recent first
        mockActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setRecentActivity(mockActivity);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setIsLoadingActivity(false);
      }
    };
    
    if (user?.uid) {
      fetchRecentActivity();
    }
  }, [user?.uid]);

  // Determine button text based on user tier
  const getUpgradeButtonText = () => {
    if (userTier === 'pro') {
      return 'Pro Paid Plan';
    } else {
      // Check if in trial period
      return trialInfo.isInTrial ? 'Trial in Progress' : 'Upgrade to Pro';
    }
  };

  // Show trial popup when user first loads dashboard
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenTrialPopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowTrialPopup(true);
        localStorage.setItem('hasSeenTrialPopup', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, <span className="text-gradient-blue-purple">{user?.displayName || user?.email?.split('@')[0] || 'Student'}</span>
        </h1>
        <div className="flex items-center space-x-2">
          {userTier !== 'pro' && trialInfo.isInTrial && <span className="text-sm text-gray-500">{trialInfo.daysLeft} {trialInfo.daysLeft === 1 ? 'day' : 'days'} left in trial</span>}
          <button 
            className={`px-3 py-1 ${
              userTier === 'pro' 
                ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                : 'bg-gradient-blue-purple'
            } text-white text-sm rounded-full`}
            disabled={userTier === 'pro'}
          >
            {getUpgradeButtonText()}
          </button>
        </div>
      </div>
      
      {/* Action Required Card */}
      {userTier !== 'pro' && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">{trialInfo.isInTrial ? 'Trial in Progress' : 'Get the full experience!'}</h2>
                <p className="mb-4 opacity-90">Unlock unlimited AI answers and premium features to ace your studies</p>
                <button className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg">
                  {trialInfo.isInTrial ? 'Upgrade to Pro' : 'Upgrade to Pro'}
                </button>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/images/graphics/StudyLens-Software-Graphic-Example-Hero-v3.png"
                  alt="Premium features"
                  width={180}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Features */}
      <h2 className="text-xl font-semibold mb-4">Main Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {mainFeatures.map((feature) => (
          <div 
            key={feature.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`${feature.bgColor} p-4 h-40 flex items-center justify-center relative`}>
              <Image
                src={feature.image}
                alt={feature.name}
                width={120}
                height={120}
                className="object-contain z-10"
              />
              {feature.badge && (
                <span className="absolute top-3 right-3 bg-white text-xs font-medium px-2 py-1 rounded-full">
                  {feature.badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <feature.icon className="h-5 w-5 mr-2 text-gray-600" />
                <h3 className="font-medium text-sm">{feature.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{feature.description}</p>
              <Link 
                href={feature.href}
                className={`inline-block w-full text-center bg-gradient-to-r ${feature.color} text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity`}
              >
                {feature.actionText}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Benefits Section */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Use Our AI Study Tools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Image 
                src="/images/features/instant-answers.svg"
                alt="Instant Answers"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold mb-2">Instant Answers</h3>
            <p className="text-sm text-gray-600">Get immediate assistance and answers to your questions without waiting</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Image 
                src="/images/features/personalized-learning.svg"
                alt="Personalized Learning"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold mb-2">Personalized Learning</h3>
            <p className="text-sm text-gray-600">Adaptive responses that match your specific questions and learning style</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Image 
                src="/images/features/versatile-tools.svg"
                alt="Versatile Tools"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold mb-2">Versatile Tools</h3>
            <p className="text-sm text-gray-600">Multiple specialized assistants designed for different academic needs</p>
          </div>
        </div>
      </div>
      
      {/* Ambassador and Free Week Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Get a FREE week */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 text-white flex items-center">
            <div className="w-16 h-16 mr-4 flex-shrink-0">
              <Image 
                src="/images/features/free-week.svg"
                alt="Get a FREE Week"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Get a FREE Week</h3>
              <p className="mb-4 opacity-90">Invite friends to try StudyGemini AI and earn free days of premium access</p>
              <div className="flex items-center">
                <button className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Invite Friends
                </button>
                <span className="ml-3 text-sm opacity-90">
                  4 invites = 7 days free
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ambassador Program */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 text-white flex items-center">
            <div className="w-16 h-16 mr-4 flex-shrink-0">
              <Image 
                src="/images/features/ambassador-program.svg"
                alt="Ambassador Program"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Ambassador Program</h3>
              <p className="mb-4 opacity-90">Represent StudyGemini at your school and earn rewards while helping others</p>
              <div className="flex items-center">
                <button className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Apply Now
                </button>
                <span className="ml-3 text-sm opacity-90">
                  Limited positions available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Coming Soon Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mobile App */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center mr-4">
                <Image
                  src="/images/features/mobile-app.svg"
                  alt="Mobile App"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">Mobile App</h3>
                <p className="text-sm text-gray-600">Study on the go with our upcoming mobile app</p>
              </div>
            </div>
          </div>
          
          {/* Image Uploading */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center mr-4">
                <Image
                  src="/images/features/image-upload.svg"
                  alt="Image Upload"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">Image Uploading</h3>
                <p className="text-sm text-gray-600">Get answers by uploading images of your questions</p>
              </div>
            </div>
          </div>
          
          {/* Collaborative Study */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center mr-4">
                <Image
                  src="/images/features/collaborative-study.svg"
                  alt="Collaborative Study"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">Collaborative Study</h3>
                <p className="text-sm text-gray-600">Study with friends in real-time collaborative sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Recent Activity Widget */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-medium">Recent Activity</h3>
            <Link href="/dashboard/search" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="p-4">
            {isLoadingActivity ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="flex justify-center items-center py-8 text-gray-500">
                <p>No recent activity found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <Link 
                    key={activity.id} 
                    href={
                      activity.type === 'chat' 
                        ? `/dashboard/chat?type=${activity.chatType}` 
                        : activity.type === 'research'
                          ? '/dashboard/research'
                          : '/dashboard/quiz'
                    }
                    className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === 'chat' && activity.chatType === 'study' && (
                          <BookOpen className="h-5 w-5 text-blue-500" />
                        )}
                        {activity.type === 'chat' && activity.chatType === 'essay' && (
                          <PenTool className="h-5 w-5 text-purple-500" />
                        )}
                        {activity.type === 'chat' && activity.chatType === 'code' && (
                          <Code className="h-5 w-5 text-teal-500" />
                        )}
                        {activity.type === 'research' && (
                          <Search className="h-5 w-5 text-pink-500" />
                        )}
                        {activity.type === 'quiz' && (
                          <FileText className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString(undefined, { 
                              weekday: 'short',
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">{activity.preview}</p>
                        {activity.type === 'quiz' && (
                          <span className="text-xs text-gray-500 mt-0.5">{activity.cardCount} flashcards</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showTrialPopup && <TrialPopup onClose={() => setShowTrialPopup(false)} />}
    </div>
  );
}

export default withAuth(DashboardPage); 