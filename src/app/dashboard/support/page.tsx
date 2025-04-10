'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { SearchIcon, MessageSquare, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import withAuth from '@/app/components/auth/withAuth';

// FAQ Data
const faqData = [
  {
    question: "How do I use the AI Study Assistant?",
    answer: "To use the AI Study Assistant, navigate to the Study Assistant section in the dashboard. Type your question in the chat box and hit send. You can upload documents for context by clicking the upload button, and you can specify the type of help you need (explanations, summaries, etc.) using the options menu."
  },
  {
    question: "What's the difference between 'Study Assistant' and 'Expert Essay Writer'?",
    answer: "The Study Assistant helps you understand concepts, answers questions, and provides explanations. The Expert Essay Writer specifically helps with writing essays, including structuring arguments, improving writing style, and providing feedback on your drafts."
  },
  {
    question: "How do I create flashcards?",
    answer: "To create flashcards, go to the Quizzes & Flashcards section. Click on 'Create New Flashcards', enter a title for your deck, and then add your cards one by one with the front (question) and back (answer) sides. You can also generate flashcards automatically from a document by using the 'Generate from Text' feature."
  },
  {
    question: "What is the Pomodoro Productivity Timer?",
    answer: "The Pomodoro Technique is a time management method that breaks work into intervals, traditionally 25 minutes, separated by short breaks. Our Pomodoro timer helps you implement this technique with customizable work and break durations, session tracking, and notifications."
  },
  {
    question: "How does the AI Deep Topic Research feature work?",
    answer: "The AI Deep Research feature allows you to explore topics in depth. Enter a subject you want to research, and the AI will generate comprehensive information, sources, and related concepts. You can ask follow-up questions to dive deeper into specific aspects."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security very seriously. All communications are encrypted, and we don't store the content of your chats or uploaded documents longer than necessary to provide the service. For more details, please refer to our Privacy Policy."
  },
  {
    question: "How do I upgrade to the Pro plan?",
    answer: "You can upgrade to Pro by clicking on the 'Upgrade to Pro' button in the sidebar or in your account settings. You'll be guided through a simple checkout process, and your account will be upgraded immediately after payment."
  },
  {
    question: "What happens if I reach my weekly usage limit?",
    answer: "If you reach your weekly usage limit on the free plan, you'll need to wait until your usage resets the following week, or upgrade to the Pro plan for increased limits. Pro users have significantly higher usage limits for all features."
  },
];

// Support Categories
const supportCategories = [
  { id: 'general', name: 'General Questions' },
  { id: 'account', name: 'Account & Billing' },
  { id: 'technical', name: 'Technical Issues' },
  { id: 'feature', name: 'Feature Requests' },
];

function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });
  
  // Filter FAQs based on search query
  const filteredFaqs = searchQuery 
    ? faqData.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqData;
  
  // Toggle FAQ accordion
  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };
  
  // Handle contact form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle contact form submission
  const handleSubmitContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission logic here
    alert('Your message has been sent! Our support team will get back to you soon.');
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      category: 'general',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto pt-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        Help Docs & Support
      </h1>
      
      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-lg">
          <TabsTrigger value="faq" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <BookOpen className="h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </TabsTrigger>
        </TabsList>
        
        {/* FAQs Tab */}
        <TabsContent value="faq">
          <Card className="mb-6 border-blue-100 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
              <CardTitle className="flex items-center text-blue-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions about using StudyLens AI
              </CardDescription>
              
              {/* Search Box */}
              <div className="relative mt-4">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  placeholder="Search for questions or keywords..." 
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border border-blue-100 rounded-lg overflow-hidden">
                      <button
                        className="w-full text-left p-4 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors"
                        onClick={() => toggleFaq(index)}
                      >
                        <h3 className="font-medium text-blue-800">{faq.question}</h3>
                        {expandedFaqs.includes(index) ? (
                          <ChevronUp className="h-5 w-5 text-blue-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-blue-500" />
                        )}
                      </button>
                      
                      {expandedFaqs.includes(index) && (
                        <div className="p-4 bg-white">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto text-gray-400 mb-4">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <p className="text-gray-500">No results found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-1">Try different keywords or check out our contact support tab</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-800 text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-blue-600">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-blue-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Account Setup Guide</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-blue-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">AI Assistant Basics</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-blue-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Dashboard Overview</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-blue-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Quick Start Tutorial</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-800 text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-purple-600">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="14" x2="23" y2="14"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="14" x2="4" y2="14"></line>
                  </svg>
                  Feature Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-purple-700">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-purple-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Research Feature Guide</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-purple-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Essay Writer Tips</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-purple-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Flashcard Creation</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-purple-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Productivity Tools</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-800 text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-green-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  Troubleshooting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-green-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Common Issues</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-green-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Connection Problems</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-green-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Billing FAQ</a>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-green-600">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    <a href="#" className="hover:underline">Error Messages</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Contact Support Tab */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Our Support Team</CardTitle>
                  <CardDescription>
                    Fill out this form and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitContactForm} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name
                        </label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={contactForm.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={contactForm.email}
                          onChange={handleInputChange}
                          placeholder="john.doe@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <select 
                        id="category" 
                        name="category"
                        value={contactForm.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                        required
                      >
                        {supportCategories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        placeholder="Briefly describe your issue"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="Please provide as much detail as possible about your question or issue..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button type="submit">Submit Support Request</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-blue-50 border-blue-100 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-800">Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 text-sm">
                    Our support team typically responds within 24 hours on weekdays. 
                    Pro users receive priority support with faster response times.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Other Ways to Get Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-gray-600">
                      For direct inquiries: <a href="mailto:support@studylens.ai" className="text-blue-600 hover:underline">support@studylens.ai</a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Help Center</h3>
                    <p className="text-sm text-gray-600">
                      Browse our extensive <a href="#" className="text-blue-600 hover:underline">knowledge base</a> for in-depth tutorials and guides.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Community Forum</h3>
                    <p className="text-sm text-gray-600">
                      Connect with other users in our <a href="#" className="text-blue-600 hover:underline">community forum</a> to share tips and solutions.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Suggest a Feature</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Have an idea for improving StudyLens AI? We'd love to hear it!
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = '/dashboard/feedback'}>
                    Submit Feature Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(SupportPage); 