'use client';

import React, { useState, useEffect } from 'react';
import withAuth from '../../../components/auth/withAuth';
import CodeEditor from '../../../components/dashboard/CodeEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Check, Code, FileCode, FileText, Lightbulb, MessageSquare } from 'lucide-react';

function CodeEditorDashboard() {
  const [selectedAIModel, setSelectedAIModel] = useState<'gemini-pro-2.5' | 'claude-3.7' | 'gpt-4o'>('claude-3.7');
  const [activeTab, setActiveTab] = useState('code-editor');
  
  // Sample code examples for different languages
  const codeExamples = {
    javascript: `// Simple JavaScript function to calculate factorial
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

// Test the function
console.log(factorial(5)); // Should output: 120`,

    python: `# Simple Python function to calculate factorial
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

# Test the function
print(factorial(5))  # Should output: 120`,

    java: `// Simple Java program to calculate factorial
public class FactorialExample {
    public static int factorial(int n) {
        if (n == 0 || n == 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
    
    public static void main(String[] args) {
        System.out.println(factorial(5)); // Should output: 120
    }
}`
  };
  
  // Simulate code execution with AI
  const executeCode = async (code: string, language: string): Promise<string> => {
    // This would normally call an API
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    return `// Simulated execution output for ${language}:
    
Running code...

> ${language === 'python' ? 'print(factorial(5))' : language === 'java' ? 'System.out.println(factorial(5))' : 'console.log(factorial(5))'}
120

Execution completed successfully.`;
  };
  
  // Simulate debugging with AI
  const debugCode = async (code: string, language: string): Promise<string> => {
    // This would normally call an AI API
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    return `# ${selectedAIModel} Debug Analysis
    
I've analyzed your ${language} factorial function and found:

✅ The base case handling is correct
✅ The recursive call is properly implemented
✅ The function will work for all non-negative integers that don't exceed stack limits

Potential improvements:
1. Consider adding input validation to handle negative numbers
2. For production code, you might want to implement an iterative version to avoid stack overflow on large inputs
3. For JavaScript and Java, consider using BigInt/BigInteger for large numbers to prevent integer overflow

No bugs found in the current implementation!`;
  };
  
  // Simulate code optimization with AI
  const optimizeCode = async (code: string, language: string): Promise<string> => {
    // This would normally call an AI API
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API delay
    
    // Return optimized version based on language
    if (language === 'javascript') {
      return `// Optimized JavaScript factorial function (iterative version)
function factorial(n) {
  // Input validation
  if (n < 0) throw new Error("Factorial not defined for negative numbers");
  if (!Number.isInteger(n)) throw new Error("Factorial only defined for integers");
  
  // Use iterative approach to avoid stack overflow
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Test with the same value
console.log(factorial(5)); // Should output: 120`;
    } else if (language === 'python') {
      return `# Optimized Python factorial function (iterative version)
def factorial(n):
    # Input validation
    if n < 0:
        raise ValueError("Factorial not defined for negative numbers")
    if not isinstance(n, int):
        raise TypeError("Factorial only defined for integers")
    
    # Use iterative approach to avoid stack overflow
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Test with the same value
print(factorial(5))  # Should output: 120`;
    } else {
      return `// Optimized Java factorial function (iterative version)
public class FactorialExample {
    public static int factorial(int n) {
        // Input validation
        if (n < 0) {
            throw new IllegalArgumentException("Factorial not defined for negative numbers");
        }
        
        // Use iterative approach to avoid stack overflow
        int result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(factorial(5)); // Should output: 120
    }
}`;
    }
  };
  
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Assistant & Editor</h1>
          <p className="text-muted-foreground mt-1">
            Write, run, debug, and optimize your code with AI assistance.
          </p>
        </div>
        
        {/* Benefit Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Generate Code */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-4">
              <Code className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Generate Code</h3>
            <p className="text-sm text-gray-600">
              Write code in any language with detailed explanations and best practices
            </p>
          </div>
          
          {/* Run & Test */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 mb-4">
              <FileCode className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Run & Test</h3>
            <p className="text-sm text-gray-600">
              Execute code directly in chat with real-time output and test cases
            </p>
          </div>
          
          {/* Debug & Optimize */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 mb-4">
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Debug & Optimize</h3>
            <p className="text-sm text-gray-600">
              Find and fix bugs, improve performance, and refactor your code
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Code Editor */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="code-editor">
                  <Code className="mr-2 h-4 w-4" /> Editor
                </TabsTrigger>
                <TabsTrigger value="javascript-example">
                  <FileCode className="mr-2 h-4 w-4" /> JavaScript
                </TabsTrigger>
                <TabsTrigger value="python-example">
                  <FileCode className="mr-2 h-4 w-4" /> Python
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="code-editor" className="border-none p-0 mt-4">
                <CodeEditor 
                  initialCode="// Write your code here"
                  language="javascript"
                  onCodeExecute={executeCode}
                  onCodeDebug={debugCode}
                  onCodeOptimize={optimizeCode}
                  aiModel={selectedAIModel}
                />
              </TabsContent>
              
              <TabsContent value="javascript-example" className="border-none p-0 mt-4">
                <CodeEditor 
                  initialCode={codeExamples.javascript}
                  language="javascript"
                  onCodeExecute={executeCode}
                  onCodeDebug={debugCode}
                  onCodeOptimize={optimizeCode}
                  aiModel={selectedAIModel}
                />
              </TabsContent>
              
              <TabsContent value="python-example" className="border-none p-0 mt-4">
                <CodeEditor 
                  initialCode={codeExamples.python}
                  language="python"
                  onCodeExecute={executeCode}
                  onCodeDebug={debugCode}
                  onCodeOptimize={optimizeCode}
                  aiModel={selectedAIModel}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Model Selection */}
            <Card>
              <CardHeader>
                <CardTitle>AI Model</CardTitle>
                <CardDescription>Select the AI model to power your coding experience.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input
                      type="radio"
                      name="aiModel"
                      checked={selectedAIModel === 'claude-3.7'}
                      onChange={() => setSelectedAIModel('claude-3.7')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">Claude 3.7 Sonnet</span>
                    {selectedAIModel === 'claude-3.7' && <Check className="h-4 w-4 text-green-500 ml-auto" />}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input
                      type="radio"
                      name="aiModel"
                      checked={selectedAIModel === 'gemini-pro-2.5'}
                      onChange={() => setSelectedAIModel('gemini-pro-2.5')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">Gemini Pro 2.5</span>
                    {selectedAIModel === 'gemini-pro-2.5' && <Check className="h-4 w-4 text-green-500 ml-auto" />}
                  </label>
                  
                  <label className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input
                      type="radio"
                      name="aiModel"
                      checked={selectedAIModel === 'gpt-4o'}
                      onChange={() => setSelectedAIModel('gpt-4o')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">GPT-4o</span>
                    {selectedAIModel === 'gpt-4o' && <Check className="h-4 w-4 text-green-500 ml-auto" />}
                  </label>
                </div>
              </CardContent>
            </Card>
            
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>What you can do with the AI Code Editor</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Code className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <span className="text-sm">Write code in 16+ programming languages</span>
                  </li>
                  <li className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                    <span className="text-sm">Get detailed explanations and best practices</span>
                  </li>
                  <li className="flex items-start">
                    <FileText className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-sm">Run code and see results instantly</span>
                  </li>
                  <li className="flex items-start">
                    <Lightbulb className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <span className="text-sm">Debug and optimize your code with AI assistance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CodeEditorDashboard); 