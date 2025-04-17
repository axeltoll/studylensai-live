'use client';

import React, { useState, useRef, useEffect } from 'react';
import withAuth from '@/components/auth/withAuth';
import { BookOpen, PlusCircle, ChevronRight, ChevronLeft, RotateCw, Check, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import Image from 'next/image';

// Flashcard type definition
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  imageUrl?: string;
}

// Flashcard set type definition
interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  cards: Flashcard[];
}

// Quiz question type
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

// Quiz type
interface Quiz {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  questions: QuizQuestion[];
}

// Example flashcard sets
const exampleFlashcardSets: FlashcardSet[] = [
  {
    id: '1',
    title: 'Spelling Strategies',
    description: 'Learn common spelling rules and patterns',
    createdAt: new Date(),
    cards: [
      {
        id: '1-1',
        question: 'Drop "e" Rule',
        answer: 'When adding "-ion" to a word ending in "-e", drop the "e" before adding -ion.',
        imageUrl: '/images/flashcards/spelling-rule.png'
      },
      {
        id: '1-2',
        question: 'Base Word + Suffix',
        answer: 'Add suffixes like "-ion", "-ing", and "-d" to create new words.',
        imageUrl: '/images/flashcards/base-word.png'
      }
    ]
  },
  {
    id: '2',
    title: 'Pronunciation Tips',
    description: 'Tips for pronouncing challenging words',
    createdAt: new Date(),
    cards: [
      {
        id: '2-1',
        question: 'The "-ion" Suffix',
        answer: 'When following the letter s or t, is pronounced as /ʃən/ (shun).',
        imageUrl: '/images/flashcards/pronunciation.png'
      }
    ]
  },
  {
    id: '3',
    title: 'Word Family Connections',
    description: 'Related words that share a common base',
    createdAt: new Date(),
    cards: [
      {
        id: '3-1',
        question: 'Educate / Education',
        answer: 'Educate (verb) → Education (noun)',
        imageUrl: '/images/flashcards/word-family.png'
      },
      {
        id: '3-2',
        question: 'Celebrate / Celebration',
        answer: 'Celebrate (verb) → Celebration (noun)',
        imageUrl: '/images/flashcards/celebrate.png'
      }
    ]
  }
];

// Example quizzes
const exampleQuizzes: Quiz[] = [
  {
    id: 'q1',
    title: 'Basic Math Concepts',
    description: 'Test your understanding of basic math concepts',
    createdAt: new Date(),
    questions: [
      {
        id: 'q1-1',
        question: 'What is the result of 7 × 8?',
        options: ['54', '56', '64', '48'],
        correctAnswer: '56',
        explanation: '7 × 8 = 56'
      },
      {
        id: 'q1-2',
        question: 'If x + 3 = 10, what is the value of x?',
        options: ['5', '7', '13', '3'],
        correctAnswer: '7',
        explanation: 'x + 3 = 10, so x = 10 - 3 = 7'
      },
      {
        id: 'q1-3',
        question: 'What is the square root of 81?',
        options: ['8', '9', '6', '3'],
        correctAnswer: '9',
        explanation: '9 × 9 = 81, so √81 = 9'
      }
    ]
  },
  {
    id: 'q2',
    title: 'Science Fundamentals',
    description: 'Quiz yourself on basic science concepts',
    createdAt: new Date(),
    questions: [
      {
        id: 'q2-1',
        question: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 'Au',
        explanation: 'Au comes from the Latin word for gold, "aurum"'
      },
      {
        id: 'q2-2',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
        explanation: 'Mars appears reddish due to iron oxide (rust) on its surface'
      }
    ]
  }
];

function QuizAndFlashcardsPage() {
  const { user, userTier } = useAuth();
  const [isCreatingSet, setIsCreatingSet] = useState(false);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>(exampleFlashcardSets);
  const [quizzes, setQuizzes] = useState<Quiz[]>(exampleQuizzes);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<'flashcards' | 'quizzes'>('flashcards');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Reference for the card container to get dimensions
  const cardContainerRef = useRef<HTMLDivElement>(null);
  
  // Get the active flashcard set
  const activeSet = activeSetId 
    ? flashcardSets.find(set => set.id === activeSetId) 
    : null;
  
  // Get active quiz
  const activeQuiz = activeQuizId
    ? quizzes.find(quiz => quiz.id === activeQuizId)
    : null;
  
  // Current card being displayed
  const currentCard = activeSet?.cards[currentCardIndex];
  
  // Current question being displayed
  const currentQuestion = activeQuiz?.questions[currentQuestionIndex];
  
  // Handle topic input change
  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };
  
  // Update the generateFlashcards function to use our API
  const generateFlashcards = async (topic: string) => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // Make a request to our flashcards API endpoint
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      
      const data = await response.json();
      
      if (!response.ok && !data.flashcards) {
        throw new Error(data.error || 'Failed to generate flashcards');
      }
      
      const generatedFlashcards: Flashcard[] = data.flashcards;
      
      if (generatedFlashcards && generatedFlashcards.length > 0) {
        // Create a new flashcard set with the generated cards
        const newSet: FlashcardSet = {
          id: `set-${Date.now()}`,
          title: topic,
          description: `Flashcards about ${topic}`,
          createdAt: new Date(),
          cards: generatedFlashcards,
        };
        
        // Update state with the new flashcard set
        setFlashcardSets(prev => [...prev, newSet]);
        setActiveSetId(newSet.id);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setIsCreatingSet(false);
        setTopic('');
        
        // Show animation
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);
        
        // Show message if fallback was used
        if (data.message) {
          console.log(data.message);
        }
      } else {
        throw new Error('No flashcards were generated');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate Quiz
  const generateQuiz = async (topic: string) => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // Make a request to our quiz API endpoint
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      
      const data = await response.json();
      
      if (!response.ok && !data.questions) {
        throw new Error(data.error || 'Failed to generate quiz');
      }
      
      const generatedQuestions = data.questions;
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        // Create a new quiz with the generated questions
        const newQuiz: Quiz = {
          id: `quiz-${Date.now()}`,
          title: topic,
          description: `Quiz about ${topic}`,
          createdAt: new Date(),
          questions: generatedQuestions,
        };
        
        // Update state with the new quiz
        setQuizzes(prev => [...prev, newQuiz]);
        setActiveQuizId(newQuiz.id);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
        setIsCreatingSet(false);
        setTopic('');
        
        // Show animation
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);
        
        // Show message if fallback was used
        if (data.message) {
          console.log(data.message);
        }
      } else {
        throw new Error('No quiz questions were generated');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle option selection in quiz
  const handleOptionSelect = (option: string) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(option);
  };
  
  // Check answer and reveal result
  const checkAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    setIsAnswerRevealed(true);
    
    // If answer is correct, trigger confetti
    if (selectedAnswer === currentQuestion.correctAnswer) {
      triggerConfetti();
    }
  };
  
  // Trigger confetti animation
  const triggerConfetti = () => {
    // Create a simple CSS confetti effect
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // Create 50 confetti elements
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
      confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation completes
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 4000);
  };
  
  // Move to next question
  const nextQuestion = () => {
    if (!activeQuiz) return;
    
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      setCurrentQuestionIndex(0);
      // Here you could trigger some completion animation or feedback
    }
  };
  
  // Navigate to the next card
  const nextCard = () => {
    if (!activeSet) return;
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex < activeSet.cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentCardIndex(0);
      }
    }, 200);
  };
  
  // Navigate to the previous card
  const prevCard = () => {
    if (!activeSet) return;
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      } else {
        setCurrentCardIndex(activeSet.cards.length - 1);
      }
    }, 200);
  };
  
  // Toggle the card flip state
  const toggleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Quizzes & Flashcards</h1>
      <p className="text-gray-600 mb-8">Create and study with AI-powered flashcards and quizzes</p>
      
      {/* Animation that appears when items are generated */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl p-8 flex flex-col items-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <motion.div 
                className="w-20 h-20 mb-4 text-blue-600"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              >
                <RotateCw className="w-full h-full" />
              </motion.div>
              <h2 className="text-xl font-bold mb-2">Generating Content</h2>
              <p className="text-gray-600">Creating personalized learning materials for your topic</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Feature Cards in 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Quiz Feature Card */}
        <div 
          className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col ${activeTab === 'quizzes' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">Interactive Quizzes</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Test your knowledge with AI-generated quizzes customized to your topics of interest.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('quizzes');
                setIsCreatingSet(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Quiz
            </button>
          </div>
        </div>
        
        {/* Flashcards Feature Card */}
        <div 
          className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col ${activeTab === 'flashcards' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold">Flashcards</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Create visual flashcards with AI to enhance your studying experience and improve retention.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('flashcards');
                setIsCreatingSet(true);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Flashcards
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs for Flashcards/Quizzes - Now below the feature cards */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('flashcards')} 
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'flashcards' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('quizzes')} 
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'quizzes' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Quizzes
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar - Flashcard Sets or Quiz Sets */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {activeTab === 'flashcards' ? 'My Flashcard Sets' : 'My Quizzes'}
              </h2>
              <button 
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                onClick={() => setIsCreatingSet(true)}
              >
                <PlusCircle className="w-4 h-4 mr-1" /> New {activeTab === 'flashcards' ? 'Set' : 'Quiz'}
              </button>
            </div>
            
            {/* Create new set/quiz form */}
            {isCreatingSet && (
              <div className="mb-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">
                  Create New {activeTab === 'flashcards' ? 'Flashcard Set' : 'Quiz'}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={handleTopicChange}
                    placeholder="Enter a topic (e.g. Physics, History, etc.)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setIsCreatingSet(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 text-sm bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md hover:from-orange-600 hover:to-red-700 disabled:opacity-50"
                    onClick={() => activeTab === 'flashcards' ? generateFlashcards(topic) : generateQuiz(topic)}
                    disabled={loading || !topic.trim()}
                  >
                    {loading ? 'Generating...' : activeTab === 'flashcards' ? 'Generate Flashcards' : 'Generate Quiz'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Sets/Quizzes list */}
            <div className="space-y-2">
              {activeTab === 'flashcards' ? (
                // Flashcard sets
                flashcardSets.map(set => (
                  <div 
                    key={set.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeSetId === set.id ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => {
                      setActiveSetId(set.id);
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                      setActiveQuizId(null);
                    }}
                  >
                    <h3 className="font-medium">{set.title}</h3>
                    <p className="text-sm text-gray-600">{set.cards.length} cards</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {set.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                // Quizzes
                quizzes.map(quiz => (
                  <div 
                    key={quiz.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeQuizId === quiz.id ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => {
                      setActiveQuizId(quiz.id);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswer(null);
                      setIsAnswerRevealed(false);
                      setActiveSetId(null);
                    }}
                  >
                    <h3 className="font-medium">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{quiz.questions.length} questions</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {quiz.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
              
              {((activeTab === 'flashcards' && flashcardSets.length === 0) || 
                (activeTab === 'quizzes' && quizzes.length === 0)) && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-2 relative opacity-30">
                    <Image 
                      src="/images/features/quizzes-flashcards.svg" 
                      alt="Quizzes & Flashcards" 
                      width={64} 
                      height={64} 
                      className="object-contain" 
                    />
                  </div>
                  <p>No {activeTab} yet</p>
                  <p className="text-sm">Create your first {activeTab === 'flashcards' ? 'set' : 'quiz'} to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Area - Flashcard Viewer or Quiz */}
        <div className="lg:col-span-2">
          {activeTab === 'flashcards' ? (
            // Flashcard Viewer
            activeSet ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{activeSet.title}</h2>
                    <p className="text-sm text-gray-600">{activeSet.description}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Card {currentCardIndex + 1} of {activeSet.cards.length}
                  </div>
                </div>
                
                {/* Flashcard container */}
                <div className="relative h-96 mb-6" ref={cardContainerRef}>
                  {/* Flashcard */}
                  <div 
                    className={`w-full h-full perspective-1000 cursor-pointer ${isFlipped ? 'pointer-events-none' : ''}`}
                    onClick={toggleCardFlip}
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}>
                      {/* Front side */}
                      <div className="absolute inset-0 backface-hidden bg-white border-2 border-gray-200 rounded-xl flex flex-col">
                        <div className="flex-1 flex items-center justify-center p-6 text-center">
                          <h3 className="text-2xl font-bold">{currentCard?.question}</h3>
                        </div>
                        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 border-t border-gray-200">
                          Click to reveal answer
                        </div>
                      </div>
                      
                      {/* Back side */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                        <div className="flex flex-col h-full">
                          {currentCard?.imageUrl && (
                            <div className="w-full p-4 flex justify-center">
                              <Image
                                src={currentCard.imageUrl}
                                alt={currentCard.question}
                                width={240}
                                height={180}
                                className="rounded-lg object-cover max-h-40"
                              />
                            </div>
                          )}
                          <div className="flex-1 flex items-center justify-center p-6 text-center">
                            <p className="text-lg">{currentCard?.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation controls */}
                <div className="flex justify-between items-center">
                  <button 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={prevCard}
                    disabled={activeSet.cards.length <= 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700"
                    onClick={toggleCardFlip}
                  >
                    {isFlipped ? 'Show Question' : 'Show Answer'}
                  </button>
                  
                  <button 
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={nextCard}
                    disabled={activeSet.cards.length <= 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="w-24 h-24 relative mb-6">
                  <Image 
                    src="/images/features/quizzes-flashcards.svg" 
                    alt="Flashcards" 
                    width={96} 
                    height={96} 
                    className="object-contain" 
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">Select a Flashcard Set</h2>
                <p className="text-gray-600 mb-6">Choose a flashcard set from the left or create a new one.</p>
                <button
                  onClick={() => setIsCreatingSet(true)} 
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700"
                >
                  Create New Flashcards
                </button>
              </div>
            )
          ) : (
            // Quiz
            activeQuiz ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{activeQuiz.title}</h2>
                    <p className="text-sm text-gray-600">{activeQuiz.description}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                  </div>
                </div>
                
                {/* Question */}
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">{currentQuestion?.question}</h3>
                  
                  {/* Options */}
                  <div className="space-y-2">
                    {currentQuestion?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedAnswer === option
                            ? isAnswerRevealed
                              ? option === currentQuestion.correctAnswer
                                ? 'bg-green-100 border-green-500 text-green-800'
                                : 'bg-red-100 border-red-500 text-red-800'
                              : 'bg-blue-100 border-blue-500 text-blue-800'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        disabled={isAnswerRevealed}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {isAnswerRevealed && option === currentQuestion.correctAnswer && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                          {isAnswerRevealed && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                            <X className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Explanation (shown after answer is revealed) */}
                {isAnswerRevealed && currentQuestion?.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-1">Explanation:</h4>
                    <p className="text-blue-900">{currentQuestion.explanation}</p>
                  </div>
                )}
                
                {/* Controls */}
                <div className="flex justify-end">
                  {!isAnswerRevealed ? (
                    <button
                      onClick={checkAnswer}
                      disabled={!selectedAnswer}
                      className={`px-4 py-2 rounded-lg ${
                        selectedAnswer
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="w-24 h-24 relative mb-6">
                  <Image 
                    src="/images/features/quizzes-flashcards.svg" 
                    alt="Quizzes" 
                    width={96} 
                    height={96} 
                    className="object-contain" 
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">Select a Quiz</h2>
                <p className="text-gray-600 mb-6">Choose a quiz from the left or create a new one.</p>
                <button
                  onClick={() => setIsCreatingSet(true)} 
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700"
                >
                  Create New Quiz
                </button>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* Add custom CSS for animations */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        /* Confetti Animation */
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #f00;
          top: -10px;
          animation: fall 4s linear forwards;
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Export with authentication wrapper
export default withAuth(QuizAndFlashcardsPage); 