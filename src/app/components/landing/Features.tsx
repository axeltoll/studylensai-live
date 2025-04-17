"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const Features = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Powerful AI Features
        </h2>

        {/* Problem Solving Feature */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <Image
              src="/images/graphics/Accurate-Problem-Solving-And-Guided-Reasoning.png"
              alt="Problem Solving Demo"
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Accurate problem solving and guided reasoning</h3>
            <p className="text-gray-600 mb-6">Fully guided explanations and step-by-step reasoning to explain any subject.</p>
          </div>
        </div>

        {/* Study Materials Feature */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-4">Add context from your study materials</h3>
            <p className="text-gray-600 mb-6">Upload guidebooks or lecture PDFs before a test and get tailored-specific answers.</p>
          </div>
          <div className="order-1 md:order-2 relative">
            <Image
              src="/images/graphics/Add-Context-From-Your-Study-Materials.png"
              alt="Upload Study Materials Demo"
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* AI Chat Feature */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <Image
              src="/images/graphics/Deepened-Understanding-Graphic-Number-4.png"
              alt="AI Chat Demo"
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Follow up with your personal AI for deepened understanding</h3>
            <p className="text-gray-600 mb-6">Open the AI chat on any website and ask any question you have!</p>
          </div>
        </div>

        {/* App Store Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gray-200 rounded-full inline-flex mr-3">
                  <Image 
                    src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/apple-icon.png" 
                    alt="Apple icon" 
                    width={24} 
                    height={24}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Download on the</p>
                  <p className="font-bold">App Store</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Scan & Solve All Subjects</h3>
              <p className="text-gray-600 mb-6">Simply take a picture and get an answer instantly.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-2xl text-gradient-blue-purple">4.8</p>
                  <p className="text-sm text-gray-600">on the app store</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-2xl text-gradient-blue-purple">20,000,000+</p>
                  <p className="text-sm text-gray-600">questions answered</p>
                </div>
              </div>
              
              <Link href="#" className="text-blue-600 font-medium flex items-center">
                Learn more
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/images/graphics/Scan-Phone-Mockup-V2.png"
                alt="A hand holding a smartphone surrounded by icons representing school subjects"
                width={500}
                height={400}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Study Chat Section */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/study-chat-demo.png"
              alt="Study Chat Demo"
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Study Chat for all your curricular needs</h3>
            <p className="text-gray-600 mb-6">The #1 voted AI homework helper for students at any academic level. Breaks down math and complex subjects better than any chatbot</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Explore Now
            </Button>
          </div>
        </div>

        {/* Essay Mode Section */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-4">Perfect Essays in a Click</h3>
            <p className="text-gray-600 mb-6">Activate the AI Homework Helper's Essay Mode to generate essays in seconds. Create A+ essays instantly, with expert touch, smart suggestions, and perfect readability</p>
          </div>
          <div className="order-1 md:order-2 relative">
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/essay-mode-demo.png"
              alt="Essay Mode Demo"
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Code Generator Section */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/code-generator-demo.png"
              alt="Code Generator Demo"
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Write, Run, Debug—All in One</h3>
            <p className="text-gray-600 mb-6">Use the AI Homework Helper's Code Generator to create, run, and debug code. Instantly generate code, run it, and improve it with comments and logs</p>
          </div>
        </div>

        {/* Chrome Extension Feature */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="p-2 bg-blue-100 rounded-full inline-flex mb-4">
              <Image 
                src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/chrome-extension-icon.png" 
                alt="Chrome extension icon" 
                width={24} 
                height={24}
                className="rounded-full"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4">Chrome extension (Coming Soon)</h3>
            <p className="text-gray-600 mb-6">One-click answers — without switching tabs. Get questions from wherever you are, and just ask with one click.</p>
            <Link href="#" className="text-blue-600 font-medium flex items-center">
              Learn more
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="order-1 md:order-2 relative">
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/chrome-extension-demo.png"
              alt="Chrome Extension Demo"
              width={500}
              height={300}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Additional Features */}
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mt-16 mb-12">
          The last AI tools you'll ever need
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3">Don't Get Caught</h3>
            <p className="text-gray-600 mb-4">Our software prevents websites from detecting our AI-powered quiz extension.</p>
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/undetected-poster.png"
              alt="poster showcasing how you won't get caught using the college tools chrome extension"
              width={320}
              height={200}
              className="rounded-lg w-full"
            />
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3">All answers are backed by reliable internet sources</h3>
            <p className="text-gray-600 mb-4">Get accurate information from trusted sources across the web.</p>
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/sources-poster.png"
              alt="poster showcasing how answers are backed by reliable internet sources"
              width={320}
              height={200}
              className="rounded-lg w-full"
            />
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3">Get step by step explanations</h3>
            <p className="text-gray-600 mb-4">Reinforce your learning with detailed, step-by-step guidance for each question.</p>
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/step-by-step-poster.png"
              alt="poster showcasing how you get step by step explanations with college tools"
              width={320}
              height={200}
              className="rounded-lg w-full"
            />
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3">15+ Languages Supported</h3>
            <p className="text-gray-600 mb-4">Automatically detect languages, and get answers on the fly.</p>
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/languages-poster.png"
              alt="poster showcasing the languages supported with College Tools"
              width={320}
              height={200}
              className="rounded-lg w-full"
            />
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3">Upload any image</h3>
            <p className="text-gray-600 mb-4">Solve problems from screenshots, textbooks, or handwritten notes.</p>
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/upload-image-poster.png"
              alt="poster showcasing the ability to upload any image"
              width={320}
              height={200}
              className="rounded-lg w-full"
            />
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-3">Reliable Answer Accuracy</h3>
            <p className="text-gray-600 mb-4">Backed by the latest generation of AI and custom trained models to bring near perfect answers</p>
            <Image
              src="https://storage.googleapis.com/msgsndr/stBxTs2j8T3pmc3ZL1WH/media/accuracy-poster.png"
              alt="poster showcasing how college tools works with all subjects"
              width={320}
              height={200}
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 