import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { NovelConfig, OutputMode } from './types';
import { generateNovelContent } from './services/gemini';
import { Sparkles, Feather } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<OutputMode>('Novel_From_Scratch');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<NovelConfig>({
    language: 'Indonesian',
    genre: '',
    trope: '',
    tone: '',
    fetishes: [],
    explicitLevel: 'Standard',
    pov: 'Third',
    protagonist: '',
    antagonist: '',
    plotSummary: '',
    draftContent: ''
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const content = await generateNovelContent(config);
      setResult(content);
    } catch (err: any) {
      setError(err.message || "An error occurred while contacting the Muse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple via-[#2d0f38] to-[#0f0518] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Feather className="text-passionate-red" size={32} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-passionate-red to-neon-pink">
              The SmutNovel Quilt
            </h1>
            <Sparkles className="text-neon-pink" size={24} />
          </div>
          <p className="text-gray-400 italic">"Weaving visceral desires into addictive prose."</p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {/* Main Content Area */}
        <main>
          {!result ? (
            <InputForm 
              config={config}
              mode={mode}
              setConfig={setConfig}
              setMode={setMode}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          ) : (
            <OutputDisplay 
              content={result} 
              onReset={() => setResult(null)} 
            />
          )}
        </main>

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>Powered by Gemini 2.5 Flash • Protocols by The Quilt</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
