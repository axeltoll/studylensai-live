import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo & Social */}
          <div>
             <div className="flex flex-col items-center">
               <div className="relative w-full h-12 mb-4">
                 <Image 
                   src="/images/logos/StudyLens-Ai-Logo-V1-White-Text.png"
                   alt="StudyLens AI"
                   width={200}
                   height={50}
                   className="object-contain"
                 />
               </div>
               <p className="mt-4 text-sm text-center">
                 Your AI-powered study companion for better grades and deeper understanding.
               </p>
             </div>
             {/* Social Icons */}
             <div className="flex space-x-4 mt-4">
               <a href="#" className="text-gray-400 hover:text-white">
                 <Twitter className="h-5 w-5" />
               </a>
               <a href="#" className="text-gray-400 hover:text-white">
                 <Facebook className="h-5 w-5" />
               </a>
               <a href="#" className="text-gray-400 hover:text-white">
                 <Instagram className="h-5 w-5" />
               </a>
               <a href="#" className="text-gray-400 hover:text-white">
                 <Linkedin className="h-5 w-5" />
               </a>
               <a href="#" className="text-gray-400 hover:text-white">
                 <Youtube className="h-5 w-5" />
               </a>
             </div>
          </div>
          
          {/* Column 2: Product */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Product</h4>
            <ul className="mt-4 space-y-4">
              <li><Link href="#features" className="hover:text-white">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h4>
            <ul className="mt-4 space-y-4">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h4>
            <ul className="mt-4 space-y-4">
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              <li><Link href="/accessibility" className="hover:text-white">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {currentYear} StudyGemini AI. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm hover:text-white">Privacy</a>
            <a href="#" className="text-sm hover:text-white">Terms</a>
            <a href="#" className="text-sm hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 