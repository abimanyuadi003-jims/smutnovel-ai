
import React from 'react';
import { NovelConfig, Language, ExplicitLevel, OutputMode } from '../types';
import { BookOpen, PenTool, AlertCircle, Globe2 } from 'lucide-react';

interface InputFormProps {
  config: NovelConfig;
  mode: OutputMode;
  setConfig: React.Dispatch<React.SetStateAction<NovelConfig>>;
  setMode: React.Dispatch<React.SetStateAction<OutputMode>>;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ config, mode, setConfig, setMode, onGenerate, isLoading }) => {
  
  const handleChange = (field: keyof NovelConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFetishChange = (val: string) => {
    const arr = val.split(',').map(s => s.trim());
    handleChange('fetishes', arr);
  };

  return (
    <div className="bg-deep-purple/50 border border-white/10 p-6 rounded-xl backdrop-blur-sm shadow-2xl">
      {/* Mode Selection */}
      <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-6">
        <button
          onClick={() => setMode('Novel_From_Scratch')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${mode === 'Novel_From_Scratch' ? 'bg-passionate-red text-white shadow-lg shadow-red-900/50' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
        >
          <PenTool size={18} /> Create Novel
        </button>
        <button
          onClick={() => setMode('Review_Full_Draft')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${mode === 'Review_Full_Draft' ? 'bg-passionate-red text-white shadow-lg shadow-red-900/50' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
        >
          <BookOpen size={18} /> Review Draft
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neon-pink mb-1 flex items-center gap-2">
              <Globe2 size={14}/> Output Language
            </label>
            <select 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none appearance-none"
              value={config.language}
              onChange={(e) => handleChange('language', e.target.value)}
            >
              <option value="Indonesian">Bahasa Indonesia</option>
              <option value="English">English</option>
              <option value="Russian">Русский (Russian)</option>
              <option value="Chinese">中文 (Chinese)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Explicit Intensity</label>
            <select 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none"
              value={config.explicitLevel}
              onChange={(e) => handleChange('explicitLevel', e.target.value)}
            >
              <option value="Mild">Mild (Sensual & Emotional)</option>
              <option value="Standard">Standard (Explicit)</option>
              <option value="Intense">Intense (High Impact & Dirty)</option>
              <option value="Extreme">Extreme (Hardcore/Visceral)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Genre</label>
            <input 
              type="text" 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none"
              placeholder="e.g. CEO Romance, Dark Fantasy, Mafia"
              value={config.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Trope</label>
            <input 
              type="text" 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none"
              placeholder="e.g. Forced Marriage, Enemies to Lovers"
              value={config.trope}
              onChange={(e) => handleChange('trope', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Fetishes / Key Elements</label>
            <input 
              type="text" 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none"
              placeholder="e.g. Praise Kink, Mirror Play, Power Dynamics"
              value={config.fetishes.join(', ')}
              onChange={(e) => handleFetishChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Protagonist</label>
            <input 
              type="text" 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none"
              placeholder="Name & dominant trait"
              value={config.protagonist}
              onChange={(e) => handleChange('protagonist', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Antagonist / Love Interest</label>
            <input 
              type="text" 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none"
              placeholder="Name & dominant trait"
              value={config.antagonist}
              onChange={(e) => handleChange('antagonist', e.target.value)}
            />
          </div>
           
           <div>
             <label className="block text-sm font-semibold text-gray-400 mb-1">Tone</label>
             <input 
              type="text" 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none"
              placeholder="e.g. Dark, Fluffy, Angst, Possessive"
              value={config.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
            />
           </div>
        </div>
      </div>

      {/* Conditional Inputs based on Mode */}
      <div className="mt-6">
        {mode === 'Novel_From_Scratch' ? (
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Plot Idea / Summary</label>
            <textarea 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none h-32 placeholder-gray-600"
              placeholder="Describe the core conflict, setting, and initial hook..."
              value={config.plotSummary || ''}
              onChange={(e) => handleChange('plotSummary', e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-1">Paste Draft Content (Chapter or Scene)</label>
            <textarea 
              className="w-full bg-dark-surface border border-white/20 rounded p-3 text-white focus:border-neon-pink outline-none h-64 font-mono text-sm placeholder-gray-600"
              placeholder="Paste your text here for The Quilt to analyze and revitalize..."
              value={config.draftContent || ''}
              onChange={(e) => handleChange('draftContent', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Warning */}
      <div className="mt-6 flex items-start gap-3 bg-red-900/20 p-4 rounded border border-red-900/30 text-xs text-gray-400">
        <AlertCircle size={16} className="text-passionate-red mt-0.5 flex-shrink-0" />
        <div>
          <p className="mb-1 font-semibold text-passionate-red">THE SMUTNOVEL QUILT PROTOCOL</p>
          <p>
            This tool uses a specialized persona ("The Quilt") to generate high-retention, visceral, and explicit adult fiction.
            <strong> Strict Policy:</strong> Non-consensual sexual violence (rape), child exploitation, or illegal acts are strictly prohibited and will be rejected.
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="bg-gradient-to-r from-passionate-red to-neon-pink hover:brightness-110 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          {isLoading ? 'Weaving the Quilt...' : (mode === 'Novel_From_Scratch' ? 'Generate Novel Blueprint' : 'Analyze & Revitalize Draft')}
        </button>
      </div>
    </div>
  );
};
