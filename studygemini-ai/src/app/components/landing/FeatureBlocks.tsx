'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, PenTool, Code } from 'lucide-react';

interface FeatureBlockProps {
  title: string;
  description: string;
  iconSrc: string;
  bgColor: string;
  link: string;
}

const FeatureBlock = ({ title, description, iconSrc, bgColor, link }: FeatureBlockProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className={`relative ${bgColor} p-5 flex items-center justify-center h-32`}>
        <div className="relative w-16 h-16">
          <Image
            src={iconSrc}
            alt={title}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Link
          href={link}
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Try Now
        </Link>
      </div>
    </div>
  );
};

const FeatureBlocks = () => {
  const features = [
    {
      title: "AI Study Assistant",
      description: "Take a picture and get clear, step-by-step solutions to your study questions.",
      iconSrc: "/images/features/study-assistant.svg",
      bgColor: "bg-blue-50",
      link: "/dashboard/chat?type=study"
    },
    {
      title: "AI Essay Writer",
      description: "Ask questions and get instant answers on any subject for your essays.",
      iconSrc: "/images/features/essay-writer.svg",
      bgColor: "bg-green-50",
      link: "/dashboard/chat?type=essay"
    },
    {
      title: "AI Code Assistant",
      description: "Screenshot any question and get instant answers on programming problems.",
      iconSrc: "/images/features/code-assistant.svg", 
      bgColor: "bg-cyan-50",
      link: "/dashboard/chat?type=code"
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            <div className="flex items-center mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-2">Popular</span>
            </div>
            <FeatureBlock {...features[0]} />
          </div>
          <div className="w-full lg:w-1/3 px-4 mb-8 lg:mb-0">
            <div className="flex items-center mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mr-2">New</span>
            </div>
            <FeatureBlock {...features[1]} />
          </div>
          <div className="w-full lg:w-1/3 px-4">
            <div className="flex items-center mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-cyan-100 text-cyan-800 rounded-full mr-2">New</span>
            </div>
            <FeatureBlock {...features[2]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBlocks; 