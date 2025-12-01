import React from 'react';
import { ExternalLink, Terminal, Monitor, Box, FileText, ChevronRight } from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  hasCheatSheet?: boolean;
  onViewCheatSheet?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, hasCheatSheet, onViewCheatSheet }) => {
  const isCLI = tool.type.toLowerCase().includes('cli');
  const isGUI = tool.type.toLowerCase().includes('gui');

  const handleGuideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Fallback to google search
    const query = encodeURIComponent(`${tool.name} full guide documentation`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const handleTitleClick = () => {
    if (hasCheatSheet && onViewCheatSheet) {
      onViewCheatSheet();
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 
          onClick={handleTitleClick}
          className={`text-xl font-bold text-slate-900 font-mono tracking-tight transition-colors ${hasCheatSheet ? 'cursor-pointer hover:text-cyan-600 hover:underline decoration-cyan-300 underline-offset-4' : ''}`}
        >
          {tool.name}
        </h3>
        <div className="flex gap-2">
          {isCLI && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-emerald-700 border border-slate-200" title="Command Line Interface">
              <Terminal size={12} className="mr-1" /> CLI
            </span>
          )}
          {isGUI && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-blue-700 border border-slate-200" title="Graphical User Interface">
              <Monitor size={12} className="mr-1" /> GUI
            </span>
          )}
           {!isCLI && !isGUI && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-purple-700 border border-slate-200">
              <Box size={12} className="mr-1" /> {tool.type}
            </span>
          )}
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-4 flex-grow leading-relaxed">
        {tool.description}
      </p>

      <div className="space-y-4 mt-auto">
        <div className="flex flex-wrap gap-2">
          {tool.tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          {hasCheatSheet && (
            <button 
              onClick={onViewCheatSheet}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-purple-900/10 whitespace-nowrap"
            >
              <FileText size={14} />
              <span>Cheat Sheet</span>
            </button>
          )}
          
          <button 
            onClick={handleGuideClick}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 border whitespace-nowrap ${hasCheatSheet 
              ? 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900' 
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 group-hover:border-slate-300'}`}
          >
            <span>View Full Guide</span>
            <ExternalLink size={14} className={hasCheatSheet ? "opacity-50" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};