'use client';

import React, { useState, useEffect } from 'react';
import withAuth from '@/components/auth/withAuth';
import { useAuth } from '@/lib/contexts/AuthContext';
import { BookOpen, PenTool, Code, Search, FileText, Clock, Calendar, Filter, SortDesc, List, Grid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function ActivityPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Fetch activity data
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // In a production app, we would fetch from a database/API
        // For now, we'll simulate with mock data
        const mockActivities = [
          {
            id: '1',
            type: 'chat',
            chatType: 'study',
            title: 'Solving Complex Math Problems',
            preview: 'How do I solve quadratic equations with complex roots?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            tags: ['math', 'algebra']
          },
          {
            id: '2',
            type: 'chat',
            chatType: 'essay',
            title: 'Essay on Climate Change',
            preview: 'I need help writing an argumentative essay about climate change policy.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            tags: ['essay', 'environment']
          },
          {
            id: '3',
            type: 'chat',
            chatType: 'code',
            title: 'React Hooks Tutorial',
            preview: 'Can you explain how to use useState and useEffect in React?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            tags: ['programming', 'javascript']
          },
          {
            id: '4',
            type: 'research',
            title: 'History of Ancient Rome',
            preview: 'Comprehensive research on the rise and fall of the Roman Empire.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            tags: ['history', 'research']
          },
          {
            id: '5',
            type: 'chat',
            chatType: 'study',
            title: 'Chemistry: Organic Compounds',
            preview: 'What are the differences between alkanes, alkenes, and alkynes?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
            tags: ['chemistry', 'science']
          },
          {
            id: '6',
            type: 'quiz',
            title: 'Biology Flashcards',
            cardCount: 24,
            preview: 'Cell structure, photosynthesis, and genetics',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
            tags: ['biology', 'quiz']
          },
          {
            id: '7',
            type: 'chat',
            chatType: 'essay',
            title: 'Literary Analysis: Hamlet',
            preview: 'Write an analysis of the theme of indecision in Shakespeare\'s Hamlet.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
            tags: ['literature', 'essay']
          }
        ];
        
        setActivities(mockActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [user]);
  
  // Filter and sort activities
  const filteredActivities = activities
    .filter(activity => {
      // Filter by type
      if (filterType !== 'all' && (
        filterType === 'chat-study' && !(activity.type === 'chat' && activity.chatType === 'study') ||
        filterType === 'chat-essay' && !(activity.type === 'chat' && activity.chatType === 'essay') ||
        filterType === 'chat-code' && !(activity.type === 'chat' && activity.chatType === 'code') ||
        filterType === 'research' && activity.type !== 'research' ||
        filterType === 'quiz' && activity.type !== 'quiz'
      )) {
        return false;
      }
      
      // Search by title and preview
      if (searchQuery && !(
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activity.tags && activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by timestamp
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  
  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };
  
  // Helper function to get activity icon
  const getActivityIcon = (activity: any) => {
    if (activity.type === 'chat') {
      switch (activity.chatType) {
        case 'study':
          return <BookOpen className="h-5 w-5 text-blue-500" />;
        case 'essay':
          return <PenTool className="h-5 w-5 text-green-500" />;
        case 'code':
          return <Code className="h-5 w-5 text-teal-500" />;
        default:
          return <BookOpen className="h-5 w-5 text-blue-500" />;
      }
    } else if (activity.type === 'research') {
      return <Search className="h-5 w-5 text-purple-500" />;
    } else if (activity.type === 'quiz') {
      return <FileText className="h-5 w-5 text-amber-500" />;
    }
    
    return <Clock className="h-5 w-5 text-gray-500" />;
  };
  
  // Helper function to get activity link
  const getActivityLink = (activity: any) => {
    if (activity.type === 'chat') {
      return `/dashboard/chat?type=${activity.chatType}&id=${activity.id}`;
    } else if (activity.type === 'research') {
      return `/dashboard/research?id=${activity.id}`;
    } else if (activity.type === 'quiz') {
      return `/dashboard/quiz?id=${activity.id}`;
    }
    
    return '#';
  };
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Activity & All Resources
      </h1>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterType === 'all' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('chat-study')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterType === 'chat-study' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="inline-block h-3 w-3 mr-1" />
              Study Assistant
            </button>
            <button 
              onClick={() => setFilterType('chat-essay')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterType === 'chat-essay' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PenTool className="inline-block h-3 w-3 mr-1" />
              Essay Writer
            </button>
            <button 
              onClick={() => setFilterType('chat-code')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterType === 'chat-code' 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Code className="inline-block h-3 w-3 mr-1" />
              Code Assistant
            </button>
            <button 
              onClick={() => setFilterType('research')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterType === 'research' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="inline-block h-3 w-3 mr-1" />
              Research
            </button>
            <button 
              onClick={() => setFilterType('quiz')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterType === 'quiz' 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="inline-block h-3 w-3 mr-1" />
              Quizzes
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your activity..."
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex border rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`} 
                title="List view"
              >
                <List className="h-4 w-4 text-gray-600" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`} 
                title="Grid view"
              >
                <Grid className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <button 
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center p-2 border rounded-lg bg-white"
              title="Change sort order"
            >
              <SortDesc className={`h-4 w-4 text-gray-600 ${sortOrder === 'oldest' ? 'transform rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Activities */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No activities found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try a different search term' : 'You don\'t have any activities yet'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredActivities.map(activity => (
            <Link
              key={activity.id}
              href={getActivityLink(activity)}
              className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'p-4' : 'p-5'
              }`}
            >
              <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'items-start'}`}>
                <div className={`${viewMode === 'grid' ? 'mb-4' : 'mr-4'} flex-shrink-0`}>
                  <div className={`${viewMode === 'grid' ? 'mx-auto' : ''} rounded-lg w-10 h-10 flex items-center justify-center bg-gray-100`}>
                    {getActivityIcon(activity)}
                  </div>
                </div>
                
                <div className={`flex-1 ${viewMode === 'grid' ? '' : 'min-w-0'}`}>
                  <div className={`flex justify-between items-start ${viewMode === 'grid' ? 'flex-col gap-1 mb-2' : ''}`}>
                    <h3 className={`font-medium text-gray-900 ${viewMode === 'grid' ? 'text-center' : ''}`}>
                      {activity.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className={`text-sm text-gray-600 mt-1 line-clamp-2 ${viewMode === 'grid' ? 'text-center' : ''}`}>
                    {activity.preview}
                  </p>
                  
                  {activity.tags && activity.tags.length > 0 && (
                    <div className={`mt-2 flex flex-wrap gap-1 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                      {activity.tags.map((tag: string) => (
                        <span 
                          key={tag} 
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(ActivityPage); 