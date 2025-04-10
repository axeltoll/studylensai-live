"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import AuthModal from '@/app/components/auth/AuthModal';

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  return (
    <section className="pt-36 pb-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        {/* Left Column - Text Content */}
        <div className="lg:w-1/2 lg:pr-12 text-left">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight animate-fade-in-right">
            Instant, <span className="text-gradient-blue-purple">Expert AI</span> <br />
            Homework Helper.
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl animate-fade-in-right animation-delay-200">
            Unlock your academic potential with AI-powered tools for research, writing, and studying. Get instant answers and guidance.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-right animation-delay-300">
            <Button 
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-gradient text-white px-6 py-3 text-lg font-medium rounded-lg shadow-lg"
            >
              Try it Free
            </Button>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  ))}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">98% Success rate</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1">
                <div className="text-center">
                  <div className="font-bold text-xl">20M+</div>
                  <div className="text-xs text-gray-500">Questions Solved</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">4.8 Stars</div>
                  <div className="text-xs text-gray-500">Rated by students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Screenshot/Mockup */}
        <div className="lg:w-1/2 mt-10 lg:mt-0 animate-fade-in-left animation-delay-400">
          <div className="relative mx-auto w-full max-w-md">
            <Image
              src="/images/graphics/StudyLens-Software-Graphic-Example-Hero-v3.png"
              alt="StudyLens AI interface"
              width={500}
              height={400}
              className="rounded-xl shadow-2xl"
            />
            {/* Chat Bubble */}
            <div className="absolute -right-10 -top-10 bg-white p-3 rounded-xl shadow-lg max-w-[200px] animate-fade-in-up">
              <p className="text-sm">How do I solve this calculus problem?</p>
            </div>
            {/* Stats Badge */}
            <div className="absolute -left-10 bottom-10 bg-white p-3 rounded-xl shadow-lg animate-fade-in-up animation-delay-500">
              <div className="font-bold text-gradient-blue-purple">98%</div>
              <div className="text-xs">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trusted by logos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 animate-fade-in-up animation-delay-600">
        <p className="text-sm text-center text-gray-500 mb-4">Trusted by students at:</p>
        <div className="flex flex-wrap justify-center gap-8 grayscale opacity-60">
          {['Moodle', 'Canvas', 'Blackboard', 'Google Classroom'].map((logo, index) => (
            <div key={logo} className={`flex items-center h-8 animate-fade-in-up animation-delay-${index + 6}00`}>
              <div className="text-gray-400">{logo}</div>
            </div>
          ))}
        </div>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
};

export default Hero; 