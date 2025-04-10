"use client";

import React from 'react';
import { Button } from '@/app/components/ui/button';

const CTA = () => {
  return (
    <section className="bg-blue-600">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to fast-track your homework?
        </h2>
        <p className="mt-4 text-lg text-blue-100">
          Join thousands of students boosting their grades with AI.
        </p>
        <div className="mt-8">
           <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => console.log('Auth modal trigger needed')}> 
             Start Your Free Trial
           </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA; 