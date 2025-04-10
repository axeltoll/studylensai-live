'use client';

import React from 'react';
import { BookOpen, Code, PenTool } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import withAuth from '@/app/components/auth/withAuth';

function StudyCenterPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Study Center</h1>
        <p className="text-gray-600 text-lg">
          Powerful AI tools to help you excel in your studies
        </p>
      </div>
      
      {/* Main Tools Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Study Assistant */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-blue-50 p-8 flex items-center justify-center">
            <Image 
              src="/images/features/study-assistant.svg"
              alt="Study Assistant"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-3">Study Assistant</h2>
            <p className="text-gray-600 mb-4">
              Get help with homework, study questions, and academic explanations. Ask any question and get detailed answers instantly.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Step-by-step explanations for any subject</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Instant answers to homework questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Detailed study notes and summaries</span>
              </li>
            </ul>
            <Link
              href="/dashboard/chat?type=study"
              className="inline-block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Use Study Assistant
            </Link>
          </div>
        </div>
        
        {/* Expert Essay Writer */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-green-50 p-8 flex items-center justify-center">
            <Image 
              src="/images/features/essay-writer.svg"
              alt="Expert Essay Writer"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-3">Expert Essay Writer</h2>
            <p className="text-gray-600 mb-4">
              Plan, draft, and polish essays with AI-powered writing assistance. Generate outlines, improve your writing, and craft compelling arguments.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-olive-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Transform topics into fully-written essays</span>
              </li>
              <li className="flex items-start">
                <span className="text-olive-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Interactive editing and real-time feedback</span>
              </li>
              <li className="flex items-start">
                <span className="text-olive-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Adjust tone, style, and academic level</span>
              </li>
            </ul>
            <Link
              href="/dashboard/chat?type=essay"
              className="inline-block w-full text-center bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Use Expert Essay Writer
            </Link>
          </div>
        </div>
        
        {/* Code Assistant */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-indigo-50 p-8 flex items-center justify-center">
            <Image 
              src="/images/features/code-assistant.svg"
              alt="Code Assistant"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-3">Code Assistant</h2>
            <p className="text-gray-600 mb-4">
              Write, debug, and optimize code with expert programming guidance. Get help with any programming language and solve coding challenges.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Generate code in any language with explanations</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Run and test code directly in the chat</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span className="text-sm text-gray-600">Debug and optimize existing code</span>
              </li>
            </ul>
            <Link
              href="/dashboard/chat?type=code"
              className="inline-block w-full text-center bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Use Code Assistant
            </Link>
          </div>
        </div>
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
    </div>
  );
}

export default withAuth(StudyCenterPage); 