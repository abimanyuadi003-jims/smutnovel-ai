import React from 'react';
import { Copy, RefreshCw } from 'lucide-react';

interface OutputDisplayProps {
  content: string;
  onReset: () => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, onReset }) => {
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert("Content copied to clipboard!");
  };

  return (
    <div className="bg-deep-purple/50 border border-white/10 p-6 rounded-xl backdrop-blur-sm animate-fade-in">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
        <h2 className="text-xl font-serif text-neon-pink">The Quilt Result</h2>
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className="p-2 hover:bg-white/10 rounded-full text-gray-300 transition-colors"
            title="Copy to Clipboard"
          >
            <Copy size={20} />
          </button>
          <button 
            onClick={onReset}
            className="p-2 hover:bg-white/10 rounded-full text-gray-300 transition-colors"
            title="Start Over"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
      
      <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white max-w-none">
        {/* Simple markdown rendering for the prototype */}
        <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed text-gray-200 bg-transparent border-none p-0">
          {content}
        </pre>
      </div>
    </div>
  );
};
