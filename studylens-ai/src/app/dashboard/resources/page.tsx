'use client';

import React, { useState, useEffect } from 'react';
import withAuth from '@/components/auth/withAuth';
import { useAuth } from '@/lib/contexts/AuthContext';
import { BookOpen, PenTool, Code, Search, FileText, Clock, Calendar, Filter, SortDesc, List, Grid, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Activity {
  id: string;
  title: string;
  preview: string;
  timestamp: number;
  type: string;
  chatType?: 'study' | 'essay' | 'code' | string;
}

function ResourcesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        // Load global chat history from localStorage
        const globalHistoryStr = localStorage.getItem('studylens_chat_history_global');
        let allActivities: Activity[] = [];
        
        if (globalHistoryStr) {
          try {
            const globalHistory = JSON.parse(globalHistoryStr);
            allActivities = [...globalHistory];
          } catch (e) {
            console.error('Error parsing global history:', e);
          }
        }
        
        // Also check individual chat histories for each type
        const chatTypes = ['study', 'essay', 'code', 'general'];
        
        for (const chatType of chatTypes) {
          const typeHistoryStr = localStorage.getItem(`studylens_chat_history_${chatType}`);
          
          if (typeHistoryStr) {
            try {
              const typeHistory = JSON.parse(typeHistoryStr);
              // Only add chats that aren't already in our activities list
              const newChats = typeHistory.filter((chat: Activity) => 
                !allActivities.some(activity => activity.id === chat.id)
              );
              
              allActivities = [...allActivities, ...newChats];
            } catch (e) {
              console.error(`Error parsing ${chatType} history:`, e);
            }
          }
        }
        
        // Sort all activities by timestamp (newest first)
        allActivities.sort((a, b) => b.timestamp - a.timestamp);
        
        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivities([]);
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
        filterType === 'chat-study' && !(activity.type === 'study' || (activity.chatType === 'study')) ||
        filterType === 'chat-essay' && !(activity.type === 'essay' || (activity.chatType === 'essay')) ||
        filterType === 'chat-code' && !(activity.type === 'code' || (activity.chatType === 'code'))
      )) {
        return false;
      }
      
      // Search by title and preview
      if (searchQuery && !(
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.preview.toLowerCase().includes(searchQuery.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by timestamp
      return sortOrder === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
    });
  
  // Helper function to format relative time
  const formatRelativeTime = (timestamp: number) => {
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
  const getActivityIcon = (activity: Activity) => {
    const chatType = activity.chatType || activity.type;
    
    switch (chatType) {
      case 'study':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case 'essay':
        return <PenTool className="h-5 w-5 text-green-500" />;
      case 'code':
        return <Code className="h-5 w-5 text-teal-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Helper function to get activity link
  const getActivityLink = (activity: Activity) => {
    const chatType = activity.chatType || activity.type;
    return `/dashboard/chat?type=${chatType}&id=${activity.id}`;
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
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              title={sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            >
              <SortDesc className="h-4 w-4 text-gray-700" />
            </button>
            
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
                title="List view"
              >
                <List className="h-4 w-4 text-gray-700" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'}`}
                title="Grid view"
              >
                <Grid className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activities List/Grid */}
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(ResourcesPage); 