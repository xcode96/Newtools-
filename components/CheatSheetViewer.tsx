import React, { useState } from 'react';
import { X, Copy, Terminal, ChevronRight, ExternalLink, AlertCircle, Home, FolderOpen, List, ChevronDown } from 'lucide-react';
import { CheatSheetData, CheatSheetItem } from '../types';

interface CheatSheetViewerProps {
  data: CheatSheetData;
  onClose: () => void;
}

// Helper to parse basic markdown (bold, inline code) and apply color
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  // Split by bold (**...**) or inline code (`...`)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-extrabold text-indigo-600 not-italic">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="font-mono text-sm bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded border border-slate-200 mx-0.5 break-words">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const SyntaxHighlighter: React.FC<{ code: string }> = ({ code }) => {
  const parts = code.split(' ');
  return (
    <div className="font-mono text-sm leading-relaxed tracking-wide">
      {parts.map((part, i) => {
        let className = "text-slate-300"; // default
        
        if (i === 0) className = "text-pink-400 font-black"; // Command (nmap)
        else if (part.startsWith('-')) className = "text-emerald-400 font-bold"; // Flags
        else if (part.startsWith('[') || part.startsWith('<') || part.includes('.txt')) className = "text-amber-300 italic"; // Arguments/Placeholders
        else if (part.includes('http') || part.includes('*')) className = "text-sky-300 underline decoration-sky-300/30"; // URLs/Globs
        else if (part === 'OR' || part === '|') className = "text-red-400 font-black"; // Logical operators
        else if (part.match(/^\d+(\.\d+)*$/) || part.includes('/')) className = "text-violet-400 font-bold"; // IPs / Numbers
        else if (part.startsWith('"') || part.startsWith("'")) className = "text-lime-300"; // Strings
        
        return (
          <span key={i} className={className}>
            {part}{' '}
          </span>
        );
      })}
    </div>
  );
};

const ContentRenderer: React.FC<{ item: CheatSheetItem }> = ({ item }) => {
  switch (item.type) {
    case 'text':
      return (
        <div className="text-slate-600 mb-4 leading-relaxed max-w-4xl text-base">
          <MarkdownText text={item.value || ''} />
        </div>
      );
    
    case 'note':
      return (
        <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg flex gap-3 text-amber-900 shadow-sm">
          <AlertCircle size={20} className="shrink-0 text-amber-500" />
          <div className="text-sm font-medium leading-relaxed">
             <MarkdownText text={item.value || ''} />
          </div>
        </div>
      );

    case 'code':
      return (
        <div className="mb-4 group break-inside-avoid">
          {item.label && (
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 pl-1">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
              {item.label}
            </div>
          )}
          {/* Code block with "Terminal" aesthetic */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 relative hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group-hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 w-full overflow-x-auto custom-scrollbar pb-1">
                <span className="text-slate-600 select-none font-mono font-bold">$</span>
                <SyntaxHighlighter code={item.value || ''} />
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(item.value || '')}
                className="text-slate-500 hover:text-cyan-400 transition-colors p-1.5 opacity-0 group-hover:opacity-100 rounded-md hover:bg-slate-800"
                title="Copy command"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    
    case 'table':
      return (
        <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 shadow-sm break-inside-avoid bg-white ring-1 ring-slate-900/5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm border-collapse table-fixed">
              <thead className="bg-slate-100 text-slate-800 border-b-2 border-slate-200">
                <tr>
                  {item.headers?.map((h, i) => (
                    <th 
                      key={i} 
                      className={`px-6 py-3 font-extrabold uppercase text-xs tracking-wider border-r last:border-r-0 border-slate-200 ${
                        i === 0 ? 'w-1/3 sm:w-1/4' : 'w-auto'
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {item.rows?.map((row, i) => (
                  <tr key={i} className="group transition-colors even:bg-slate-50 hover:bg-slate-100">
                    {row.map((cell, j) => (
                      <td 
                        key={j} 
                        className={`px-6 py-3.5 leading-relaxed align-top ${
                          j === 0 
                            ? 'font-mono text-indigo-700 font-bold border-r border-slate-200 break-words' 
                            : 'text-slate-600 italic break-words'
                        }`}
                      >
                        <MarkdownText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      
    case 'links':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {item.links?.map((link, i) => (
            <a 
              key={i} 
              href={link.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 border border-slate-200 hover:border-cyan-200 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white text-slate-400 group-hover:text-cyan-500 transition-colors">
                <ExternalLink size={16} />
              </div>
              <span className="text-slate-700 group-hover:text-cyan-900 text-sm font-semibold">{link.text}</span>
            </a>
          ))}
        </div>
      );

    default:
      return null;
  }
};

export const CheatSheetViewer: React.FC<CheatSheetViewerProps> = ({ data, onClose }) => {
  // Track expanded sections. Default: Index 0 is expanded, others closed.
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (idx: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx); // Collapse
    } else {
      newExpanded.add(idx); // Expand
    }
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (idx: number) => {
    // If hidden, expand it first
    if (!expandedSections.has(idx)) {
      const newExpanded = new Set(expandedSections);
      newExpanded.add(idx);
      setExpandedSections(newExpanded);
    }

    // Delay slightly to allow render to happen if it was collapsed
    setTimeout(() => {
      const el = document.getElementById(`section-${idx}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="bg-white w-full h-full md:w-[95vw] md:h-[95vh] md:rounded-2xl shadow-2xl shadow-black/20 border-0 md:border border-white/20 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0 z-20 shadow-sm">
          <div className="flex flex-col gap-1">
             {/* Breadcrumbs */}
             <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <button onClick={onClose} className="flex items-center gap-1 hover:text-cyan-600 transition-colors">
                  <Home size={12} className="text-slate-300" />
                  <span>Home</span>
                </button>
                <ChevronRight size={10} />
                <button onClick={onClose} className="flex items-center gap-1 hover:text-cyan-600 transition-colors">
                  <FolderOpen size={12} className="text-slate-300" />
                  <span>Tools</span>
                </button>
                <ChevronRight size={10} />
                <span className="text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">{data.title}</span>
             </div>

             <div className="flex items-center gap-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {data.title}
                </h2>
                <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
                <p className="hidden sm:block text-sm text-slate-500 font-medium truncate max-w-lg">{data.description}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
              <span className="font-sans">ESC</span> to close
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all hover:scale-110 active:scale-95"
              aria-label="Close"
            >
              <X size={26} />
            </button>
          </div>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex-1 flex overflow-hidden bg-slate-50/50">
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 scroll-smooth" id="scroll-container">
            <div className="max-w-5xl mx-auto space-y-6 pb-24">
              {data.sections.map((section, idx) => (
                <div key={idx} id={`section-${idx}`} className="relative group scroll-mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                  
                  {/* Section Title (Clickable) */}
                  <div 
                    onClick={() => toggleSection(idx)}
                    className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-slate-50 select-none transition-colors"
                  >
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white font-mono text-sm font-bold shadow-md ring-4 ring-white">
                        {idx + 1}
                      </span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        {section.title}
                      </span>
                    </h3>
                    <div className={`p-2 rounded-full bg-slate-100 text-slate-400 transition-transform duration-300 ${expandedSections.has(idx) ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                  
                  {/* Collapsible Content */}
                  <div className={`transition-all duration-300 ease-in-out ${expandedSections.has(idx) ? 'max-h-[5000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-4">
                      {section.content.map((item, i) => (
                        <div key={i} className={item.type === 'table' || item.type === 'links' || (item.type === 'text' && item.value?.length && item.value.length > 120) ? 'col-span-1 xl:col-span-2' : 'col-span-1'}>
                            <ContentRenderer item={item} />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* TOC Sidebar (Right) */}
          <div className="hidden lg:block w-64 bg-white border-l border-slate-200 p-6 overflow-y-auto custom-scrollbar shrink-0">
             <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
               <List size={14} />
               Table of Contents
             </div>
             <nav className="space-y-1">
               {data.sections.map((section, idx) => (
                 <button
                   key={idx}
                   onClick={() => scrollToSection(idx)}
                   className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors truncate ${
                     !expandedSections.has(idx) 
                      ? 'text-slate-400 hover:text-cyan-600 hover:bg-slate-50' 
                      : 'text-cyan-700 bg-cyan-50 font-medium'
                   }`}
                   title={section.title}
                 >
                   <span className={`font-mono text-xs mr-2 ${!expandedSections.has(idx) ? 'text-slate-300' : 'text-cyan-400'}`}>{idx + 1}.</span>
                   {section.title}
                 </button>
               ))}
             </nav>
          </div>
        </div>
        
      </div>
    </div>
  );
};