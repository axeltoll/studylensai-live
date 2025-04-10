'use client'; // Needs interactivity for accordion

import React from 'react';
import { Disclosure } from '@headlessui/react';
import { HiChevronUp } from 'react-icons/hi'; // Example icon

const faqs = [
  { question: 'What is StudyLens AI?', answer: 'It is an AI platform...' },
  { question: 'How do I get started?', answer: 'Sign up for a free account...' },
  // Add more FAQs based on the image
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="w-full space-y-4">
          {faqs.map((faq) => (
            <Disclosure key={faq.question} as="div" className="bg-white p-6 rounded-lg shadow-sm">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full text-left text-lg font-medium text-gray-900">
                    <span>{faq.question}</span>
                    <HiChevronUp
                      className={`${open ? 'transform rotate-180' : ''
                        } w-5 h-5 text-gray-500 transition-transform`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-4 text-base text-gray-600">
                    {faq.answer}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 