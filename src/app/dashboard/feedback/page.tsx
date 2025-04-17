'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, CheckCircle2, ThumbsUp, Clock, AlertCircle } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';
import { useUser } from '@/app/context/UserContext';

// Example feature requests data
const popularRequests = [
  { 
    id: 1, 
    title: 'Collaborative Study Groups', 
    description: 'Allow multiple students to collaborate in real-time on study sessions and share resources.',
    category: 'Collaboration',
    status: 'under-review',
    votes: 87,
  },
  { 
    id: 2, 
    title: 'Mobile App for iOS and Android', 
    description: 'A native mobile app to access all features on the go.',
    category: 'Platform',
    status: 'planned',
    votes: 156,
  },
  { 
    id: 3, 
    title: 'Dark Mode Theme', 
    description: 'Add a system-wide dark mode option for night-time studying.',
    category: 'UI/UX',
    status: 'in-progress',
    votes: 124,
  },
  { 
    id: 4, 
    title: 'Integration with Popular Note-Taking Apps', 
    description: 'Connect StudyLens with OneNote, Notion, and other note-taking applications.',
    category: 'Integration',
    status: 'under-review',
    votes: 73,
  },
  { 
    id: 5, 
    title: 'Voice Commands for Hands-Free Usage', 
    description: 'Add voice control to use the AI assistant while doing other tasks.',
    category: 'Accessibility',
    status: 'considering',
    votes: 65,
  },
];

// Status badge mapping
const statusConfig = {
  'planned': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
  'in-progress': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: AlertCircle },
  'under-review': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: CheckCircle2 },
  'considering': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: ThumbsUp },
  'completed': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
};

// Feature categories
const featureCategories = [
  { id: 'ai-features', name: 'AI & ML Features' },
  { id: 'ui-ux', name: 'User Interface & Experience' },
  { id: 'productivity', name: 'Productivity Tools' },
  { id: 'integration', name: 'Third-Party Integrations' },
  { id: 'mobile', name: 'Mobile & Offline Features' },
  { id: 'collaboration', name: 'Collaboration & Sharing' },
  { id: 'other', name: 'Other' },
];

function FeatureSuggestionPage() {
  const { user } = useUser();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
  
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [votedFeatures, setVotedFeatures] = useState<number[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.category || !formData.description.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Simulate submission
    setSubmissionStatus('success');
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        title: '',
        category: '',
        description: '',
      });
      setSubmissionStatus('idle');
    }, 3000);
  };
  
  const handleVote = (featureId: number) => {
    if (votedFeatures.includes(featureId)) {
      // If already voted, remove vote
      setVotedFeatures(prev => prev.filter(id => id !== featureId));
    } else {
      // Add vote
      setVotedFeatures(prev => [...prev, featureId]);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto pt-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Suggest a Feature
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Suggestion Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Feature Request</CardTitle>
              <CardDescription>
                Help us improve StudyLens AI by suggesting new features or improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissionStatus === 'success' ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-green-800 mb-1">
                    Thank You for Your Suggestion!
                  </h3>
                  <p className="text-green-700">
                    We've received your feature request and will review it soon.
                    Our team values your input in making StudyLens AI better for everyone.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Feature Title
                    </label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Briefly describe your feature idea"
                      maxLength={100}
                      required
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {formData.title.length}/100 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <select 
                      id="category" 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {featureCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Detailed Description
                    </label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe how this feature would work and why it would be valuable..."
                      rows={6}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Please be as specific as possible. Include use cases and how this would improve your experience.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button type="submit">Submit Feature Request</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
          
          {/* Guidelines Card */}
          <Card className="mt-6 bg-blue-50 border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-800">Feature Request Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <span>Be specific and detailed about how the feature would work</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <span>Explain the problem the feature would solve for you</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <span>Check if a similar feature has already been requested</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">•</span>
                  <span>Vote for existing feature requests you'd like to see implemented</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Popular Requests & Status */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Popular Requests
              </CardTitle>
              <CardDescription>
                Vote for features you'd like to see implemented
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularRequests.map(feature => {
                  const hasVoted = votedFeatures.includes(feature.id);
                  const StatusIcon = statusConfig[feature.status as keyof typeof statusConfig]?.icon || CheckCircle2;
                  
                  return (
                    <div key={feature.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{feature.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${statusConfig[feature.status as keyof typeof statusConfig]?.color}`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {feature.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {feature.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="bg-gray-100">
                          {feature.category}
                        </Badge>
                        <button 
                          className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-md ${
                            hasVoted 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => handleVote(feature.id)}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>{feature.votes + (hasVoted ? 1 : 0)}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Development Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const StatusIcon = config.icon;
                  return (
                    <div key={status} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${config.color.split(' ')[0]}`} />
                      <div className="flex items-center">
                        <StatusIcon className={`h-4 w-4 mr-1 ${config.color.split(' ')[1]}`} />
                        <span className="capitalize">{status.replace('-', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2">Recently Implemented</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Advanced Pomodoro Timer with session tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>PDF document analysis and summarization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span>Customizable AI chat prompts</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withAuth(FeatureSuggestionPage); 