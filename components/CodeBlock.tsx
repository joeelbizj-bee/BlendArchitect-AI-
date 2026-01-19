import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Strip markdown backticks if present
    const cleanCode = code.replace(/```python\n?|```/g, '');
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic syntax highlighting simulation for presentation
  // In a real app, we might use a library, but regex is lightweight for this demo
  const highlightCode = (text: string) => {
    const cleanText = text.replace(/```python\n?|```/g, '');
    
    return cleanText.split('\n').map((line, i) => (
      <div key={i} className="table-row">
        <span className="table-cell select-none text-right pr-4 text-gray-600 w-10 text-xs py-0.5 border-r border-gray-700 bg-blender-panel/50">
          {i + 1}
        </span>
        <span className="table-cell pl-4 whitespace-pre-wrap break-all py-0.5 text-sm font-mono text-gray-300">
          {line}
        </span>
      </div>
    ));
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e] shadow-2xl my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal size={16} className="text-blender-orange" />
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">generated_script.py</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-3 py-1 rounded text-xs font-medium transition-all ${
            copied
              ? 'bg-green-600/20 text-green-400 border border-green-600/50'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
          }`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>
      <div className="p-0 overflow-x-auto max-h-[500px] w-full bg-[#1e1e1e]">
        <div className="table w-full border-collapse">
          {highlightCode(code)}
        </div>
      </div>
      <div className="px-4 py-2 bg-[#252525] border-t border-gray-700 text-xs text-gray-500 flex justify-between">
        <span>Python 3 (bpy)</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default CodeBlock;