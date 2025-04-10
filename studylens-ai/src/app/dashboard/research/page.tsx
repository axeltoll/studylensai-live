'use client';

import React, { useState, useRef } from 'react';
import withAuth from '@/app/components/auth/withAuth';
import { useAuth } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  Search, 
  Book, 
  FileText, 
  AlignLeft, 
  Globe,
  Download,
  Clipboard, 
  RefreshCw,
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Clock,
  DownloadCloud
} from 'lucide-react';
import Image from 'next/image';

function ResearchPage() {
  const { user, userTier } = useAuth();
  const [topic, setTopic] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [internetAccess, setInternetAccess] = useState(true);
  const [researchDepth, setResearchDepth] = useState('medium');
  const [outputFormat, setOutputFormat] = useState('summary');
  const [researchResult, setResearchResult] = useState(`
# Climate Change: Causes, Effects, and Solutions

## Introduction
Climate change refers to long-term shifts in temperatures and weather patterns, largely caused by human activities, especially the burning of fossil fuels. This research summary explores the major causes of climate change, its effects on our planet, and potential solutions to mitigate its impact.

## Causes of Climate Change

### Greenhouse Gas Emissions
- **Carbon Dioxide (CO₂)**: Released primarily through burning fossil fuels (coal, oil, and natural gas), deforestation, and industrial processes.
- **Methane (CH₄)**: Emitted during production and transport of fossil fuels, from livestock, and from landfills.
- **Nitrous Oxide (N₂O)**: Released from agricultural fertilizers, industrial processes, and combustion of fossil fuels.
- **Fluorinated Gases**: Synthetic gases used in various industrial applications.

### Deforestation
The removal of forests reduces the planet's ability to absorb CO₂ and contributes to approximately 10% of global greenhouse gas emissions.

### Industrial Activities
Manufacturing processes, especially in cement, steel, and chemical production, release significant amounts of greenhouse gases.

## Effects of Climate Change

### Rising Global Temperatures
- Global average temperature has increased by about 1.1°C since pre-industrial times.
- 19 of the 20 warmest years on record have occurred since 2001.

### Melting Ice and Rising Sea Levels
- Polar ice caps and glaciers are melting at unprecedented rates.
- Global sea levels have risen about 8-9 inches since 1880, with the rate accelerating in recent decades.
- Projections suggest sea levels could rise 1-8 feet by 2100, threatening coastal communities.

### Extreme Weather Events
- Increased frequency and intensity of hurricanes, floods, droughts, and heatwaves.
- These events cause significant economic damage and loss of life.

### Disruption of Ecosystems
- Shifting habitat ranges for plants and animals.
- Coral reef bleaching due to ocean warming and acidification.
- Increased extinction risks for many species.

## Solutions to Climate Change

### Renewable Energy Transition
- **Solar Power**: Costs have decreased by 89% since 2010, making it increasingly competitive.
- **Wind Energy**: Both onshore and offshore wind capacity is growing globally.
- **Hydroelectric, Geothermal, and Biomass**: Additional renewable sources with significant potential.

### Energy Efficiency
- Improving building insulation and HVAC systems.
- Developing more fuel-efficient vehicles and industrial processes.
- Implementing smart grid technologies to optimize energy distribution.

### Transportation Reform
- Transition to electric vehicles and improved public transportation.
- Development of sustainable aviation fuels and shipping alternatives.
- Urban planning to reduce commuting distances and encourage walking/cycling.

### Policy Approaches
- **Carbon Pricing**: Implementing carbon taxes or cap-and-trade systems.
- **Regulatory Standards**: For emissions, energy efficiency, and clean energy.
- **International Cooperation**: Paris Agreement and other global initiatives.

### Individual Actions
- Reducing meat consumption and food waste.
- Choosing energy-efficient appliances and transportation.
- Supporting businesses with sustainable practices.

## Conclusion
Climate change represents one of the most significant challenges facing humanity. While the causes and effects are increasingly well-understood, addressing this challenge requires coordinated action at global, national, local, and individual levels. The transition to a low-carbon economy presents not only challenges but also opportunities for innovation, job creation, and improved quality of life.

## References
1. IPCC (2021). Climate Change 2021: The Physical Science Basis.
2. NASA Global Climate Change. (2022). Facts and Evidence.
3. International Energy Agency. (2022). World Energy Outlook.
4. United Nations Environment Programme. (2022). Emissions Gap Report.
5. Project Drawdown. (2020). Solutions to Reverse Global Warming.
`);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLDivElement>(null);
  
  const handleStartResearch = async () => {
    if (!topic.trim()) return;
    
    setError('');
    setIsResearching(true);
    
    try {
      // Call the Perplexity API endpoint
      const response = await fetch('/api/perplexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: topic,
          userId: user?.uid,
          userTier: userTier,
          options: {
            depth: researchDepth,
            internetAccess: internetAccess,
            outputFormat: outputFormat
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to research topic');
      }
      
      const data = await response.json();
      setResearchResult(data.result);
      setResearchComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Research error:', err);
    } finally {
      setIsResearching(false);
    }
  };
  
  const handleNewResearch = () => {
    setTopic('');
    setResearchComplete(false);
    setResearchResult('');
    setError('');
  };
  
  const copyToClipboard = () => {
    if (textareaRef.current) {
      const text = textareaRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => toast.success('Research copied to clipboard!'))
        .catch(err => {
          console.error('Error copying text: ', err);
          toast.error('Failed to copy to clipboard');
        });
    }
  };
  
  const downloadAsPDF = async () => {
    try {
      const jsPDFModule = await import('jspdf');
      const doc = new jsPDFModule.default();
      
      if (textareaRef.current) {
        const content = textareaRef.current.innerText;
        
        // Add title
        doc.setFontSize(18);
        doc.text(`Research: ${topic}`, 20, 20);
        
        // Add content with word wrapping
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, 30);
        
        // Save the PDF
        doc.save(`research-${topic.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        toast.success('PDF downloaded successfully!');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to generate PDF');
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto pt-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        AI Deep Topic Research
      </h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <p className="text-gray-600 mb-6">
          Enter any research topic, and our AI will generate a comprehensive, well-structured research summary with all the key information you need.
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {!researchComplete ? (
          <>
            <div className="mb-6">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Research Topic
              </label>
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    id="topic"
                    placeholder="e.g., Climate Change, Quantum Physics, French Revolution..."
                    className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  {topic && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setTopic('')}
                    >
                      ×
                    </button>
                  )}
                </div>
                <button
                  onClick={handleStartResearch}
                  disabled={!topic.trim() || isResearching}
                  className={`px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-r-lg font-medium flex items-center ${
                    !topic.trim() || isResearching ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isResearching ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Research
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Research Depth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Research Depth
                </label>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button
                    className={`flex-1 py-2 px-3 text-sm ${
                      researchDepth === 'basic' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setResearchDepth('basic')}
                  >
                    Basic
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 text-sm border-l border-r border-gray-300 ${
                      researchDepth === 'medium' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setResearchDepth('medium')}
                  >
                    Medium
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 text-sm ${
                      researchDepth === 'deep' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setResearchDepth('deep')}
                  >
                    Deep
                  </button>
                </div>
              </div>
              
              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  <button
                    className={`flex-1 py-2 px-3 text-sm ${
                      outputFormat === 'summary' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setOutputFormat('summary')}
                  >
                    <AlignLeft className="h-4 w-4 inline mr-1" />
                    Summary
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 text-sm border-l border-gray-300 ${
                      outputFormat === 'report' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setOutputFormat('report')}
                  >
                    <FileText className="h-4 w-4 inline mr-1" />
                    Report
                  </button>
                </div>
              </div>
              
              {/* Internet Access */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Internet Access
                </label>
                <div className="flex items-center">
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      checked={internetAccess}
                      onChange={() => setInternetAccess(!internetAccess)}
                      className="opacity-0 absolute block w-6 h-6 cursor-pointer"
                      id="internet-toggle"
                    />
                    <label 
                      htmlFor="internet-toggle" 
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
                        internetAccess ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span 
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          internetAccess ? 'translate-x-6' : 'translate-x-0'
                        }`} 
                      />
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Globe className={`h-4 w-4 mr-1 ${internetAccess ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className={internetAccess ? 'text-gray-700' : 'text-gray-400'}>
                      Use latest web data
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-blue-800 text-sm font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Estimated Completion Time
              </h3>
              <p className="text-blue-700 text-sm">
                {researchDepth === 'basic' ? '1-2 minutes' : researchDepth === 'medium' ? '2-4 minutes' : '5-8 minutes'} 
                {!internetAccess && ' (faster without internet access)'}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Research Results */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Research Results: {topic}
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handleNewResearch}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  title="New Research"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  title="Copy to Clipboard"
                >
                  <Clipboard className="h-5 w-5" />
                </button>
                <button 
                  onClick={downloadAsPDF}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  title="Download as PDF"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 bg-white mb-6 prose prose-blue max-w-none overflow-auto">
              <div ref={textareaRef} className="whitespace-pre-wrap">
                {researchResult}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="flex space-x-2 mb-4 sm:mb-0">
                <button 
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  <span>Helpful</span>
                </button>
                <button 
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  <span>Not helpful</span>
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700"
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  <span>Copy</span>
                </button>
                <button 
                  onClick={downloadAsPDF}
                  className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                >
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* How it Works Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="h-16 w-16 mx-auto mb-3 flex items-center justify-center">
              <Image
                src="/images/features/enter-topic.svg"
                alt="Enter Your Topic"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h3 className="font-medium mb-2 text-center">Enter Your Topic</h3>
            <p className="text-sm text-gray-600">Type any research topic you need information on, and our AI will begin the research process.</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="h-16 w-16 mx-auto mb-3 flex items-center justify-center">
              <Image
                src="/images/features/ai-researches.svg"
                alt="AI Researches For You"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h3 className="font-medium mb-2 text-center">AI Researches For You</h3>
            <p className="text-sm text-gray-600">Our AI scans educational resources, research papers, and trusted sources to gather comprehensive information.</p>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="h-16 w-16 mx-auto mb-3 flex items-center justify-center">
              <Image
                src="/images/features/structured-results.svg"
                alt="Get Structured Results"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h3 className="font-medium mb-2 text-center">Get Structured Results</h3>
            <p className="text-sm text-gray-600">Receive a well-organized research summary with key concepts, important details, and cited sources.</p>
          </div>
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Research Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-green-100 h-6 w-6 rounded-full flex items-center justify-center text-green-600 mr-3 flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">1</span>
            </div>
            <p className="text-gray-600">Be specific with your topic for more focused results (e.g., "Causes of the French Revolution" rather than just "French Revolution")</p>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 h-6 w-6 rounded-full flex items-center justify-center text-green-600 mr-3 flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">2</span>
            </div>
            <p className="text-gray-600">Enable internet access for the most up-to-date information and recent research findings</p>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 h-6 w-6 rounded-full flex items-center justify-center text-green-600 mr-3 flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">3</span>
            </div>
            <p className="text-gray-600">Choose "Report" format for more detailed information with sections, subsections, and citations</p>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 h-6 w-6 rounded-full flex items-center justify-center text-green-600 mr-3 flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">4</span>
            </div>
            <p className="text-gray-600">After receiving your results, you can ask follow-up questions to explore specific aspects in more depth</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ResearchPage); 