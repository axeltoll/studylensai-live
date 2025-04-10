'use client';

import React, { useState, useEffect } from 'react';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Code, Play, Bug, Sparkles, RotateCcw, Terminal, Save, Copy } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeExecute?: (code: string, language: string) => Promise<string>;
  onCodeDebug?: (code: string, language: string) => Promise<string>;
  onCodeOptimize?: (code: string, language: string) => Promise<string>;
  aiModel?: 'gemini-pro-2.5' | 'claude-3.7' | 'gpt-4o';
}

const languageOptions = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 
  'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'html', 'css', 'sql'
];

export default function CodeEditor({
  initialCode = '// Start coding here\n',
  language = 'javascript', 
  onCodeExecute,
  onCodeDebug,
  onCodeOptimize,
  aiModel = 'claude-3.7'
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentTab, setCurrentTab] = useState('editor');
  
  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };
  
  // Execute code
  const executeCode = async () => {
    setIsExecuting(true);
    setCurrentTab('output');
    
    try {
      if (onCodeExecute) {
        const result = await onCodeExecute(code, selectedLanguage);
        setOutput(result);
      } else {
        // Fallback for when no execution handler is provided
        setOutput(`Code execution simulation for ${selectedLanguage}:\n\n[Output would appear here when connected to a real execution environment]`);
      }
    } catch (error) {
      setOutput(`Error executing code: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Debug code
  const debugCode = async () => {
    setIsDebugging(true);
    setCurrentTab('output');
    
    try {
      if (onCodeDebug) {
        const result = await onCodeDebug(code, selectedLanguage);
        setOutput(result);
      } else {
        // Simulate AI-powered debugging
        setOutput(`Debugging with ${aiModel}:\n\nAnalyzing your ${selectedLanguage} code...\n\n[Debugging suggestions would appear here]`);
      }
    } catch (error) {
      setOutput(`Error debugging code: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDebugging(false);
    }
  };
  
  // Optimize code
  const optimizeCode = async () => {
    setIsOptimizing(true);
    
    try {
      if (onCodeOptimize) {
        const result = await onCodeOptimize(code, selectedLanguage);
        setCode(result);
      } else {
        // Simulate AI-powered optimization
        setOutput(`Optimizing with ${aiModel}:\n\nAnalyzing your ${selectedLanguage} code for optimization opportunities...\n\n[Optimized code would replace your code]`);
      }
    } catch (error) {
      setOutput(`Error optimizing code: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Reset code to initial state
  const resetCode = () => {
    setCode(initialCode);
  };
  
  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            <Code className="inline mr-2" size={20} />
            Code Editor
            <span className="ml-2 text-xs text-gray-500">Powered by {aiModel}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" className="font-medium">
              <Code className="mr-2 h-4 w-4" /> Editor
            </TabsTrigger>
            <TabsTrigger value="output" className="font-medium">
              <Terminal className="mr-2 h-4 w-4" /> Output
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="border-none p-0">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono h-[400px] resize-none border rounded-md p-3 text-sm"
              placeholder="Write your code here..."
            />
          </TabsContent>
          
          <TabsContent value="output" className="border-none p-0">
            <div className="font-mono bg-gray-900 text-green-400 h-[400px] overflow-auto p-3 rounded-md text-sm whitespace-pre">
              {output || 'Run your code to see output here.'}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button onClick={resetCode} variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button onClick={copyCode} variant="outline" size="sm">
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={optimizeCode} variant="outline" disabled={isOptimizing} size="sm">
            <Sparkles className="mr-2 h-4 w-4" /> {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </Button>
          <Button onClick={debugCode} variant="outline" disabled={isDebugging} size="sm">
            <Bug className="mr-2 h-4 w-4" /> {isDebugging ? 'Debugging...' : 'Debug'}
          </Button>
          <Button onClick={executeCode} disabled={isExecuting} size="sm">
            <Play className="mr-2 h-4 w-4" /> {isExecuting ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 