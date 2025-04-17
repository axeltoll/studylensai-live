'use client';

import React from 'react';
import withAuth from '@/components/auth/withAuth';
import FeatureShowcase from '@/components/dashboard/FeatureShowcase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function FeaturesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          href="/dashboard"
          className="flex items-center text-blue-600 hover:underline mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">All Features</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <p className="text-gray-600 mb-8">
          Explore all the features available in StudyLens AI to enhance your learning experience. Click on any feature to get started.
        </p>
        
        <FeatureShowcase maxFeatures={15} />
      </div>
      
      <div className="bg-gradient-blue-purple rounded-lg shadow p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Missing something?</h2>
        <p className="mb-4">We're constantly improving and adding new features to make your learning experience better.</p>
        <Link 
          href="/dashboard/feedback"
          className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Suggest a Feature
        </Link>
      </div>
    </div>
  );
}

export default withAuth(FeaturesPage); 