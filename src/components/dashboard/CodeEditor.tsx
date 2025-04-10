'use client';

import React, { useState } from 'react';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onCodeExecute?: (code: string, language: string) => Promise<string>;
  onCodeDebug?: (code: string, language: string) => Promise<string>;
  onCodeOptimize?: (code: string, language: string) => Promise<string>;
  aiModel?: 'gemini-pro-2.5' | 'claude-3.7' | 'gpt-4o';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  language,
  onCodeExecute,
  onCodeDebug,
  onCodeOptimize,
  aiModel = 'claude-3.7'
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!onCodeExecute) return;
    
    setIsExecuting(true);
    try {
      const result = await onCodeExecute(code, language);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h3 className="text-sm font-medium">{language.toUpperCase()} Editor</h3>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleExecute}
            disabled={isExecuting || !onCodeExecute}
          >
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      
      <div className="p-4 min-h-[300px] bg-gray-50">
        <textarea
          className="w-full h-40 p-2 font-mono text-sm border rounded bg-white"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        
        {output && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Output:</div>
            <pre className="p-2 bg-black text-green-400 rounded text-sm overflow-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor; 