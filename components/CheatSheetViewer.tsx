import React, { useState } from 'react';
import { X, Copy, ChevronRight, ExternalLink, AlertCircle, Home, FolderOpen, ChevronDown, List } from 'lucide-react';
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
        <div className="text-slate-600 mb-4 leading-relaxed text-base max-w-full">
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
                        i === 0 ? 'w-1/4' : 'w-auto'
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
  // Initialize with the first section (index 0) expanded
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (id: string, index: number) => {
    // Ensure section is expanded before scrolling
    if (!expandedSections.has(index)) {
        const newExpanded = new Set(expandedSections);
        newExpanded.add(index);
        setExpandedSections(newExpanded);
    }
    
    // Small delay to allow render
    setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 10);
  };

  return (
    // Replaced modal classes with fixed full-screen classes
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-200">
      
        {/* Header - Sticky and Full Width */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/95 backdrop-blur-sm z-30 shadow-sm shrink-0">
          <div className="flex flex-col gap-1">
             {/* Breadcrumbs */}
             <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                <button onClick={onClose} className="flex items-center gap-1 hover:text-cyan-600 transition-colors">
                  <Home size={12} className="text-slate-400" />
                  <span>Home</span>
                </button>
                <ChevronRight size={10} className="text-slate-300" />
                <button onClick={onClose} className="flex items-center gap-1 hover:text-cyan-600 transition-colors">
                  <FolderOpen size={12} className="text-slate-400" />
                  <span>Tools</span>
                </button>
                <ChevronRight size={10} className="text-slate-300" />
                <span className="text-cyan-700 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full">{data.title}</span>
             </div>

             <div className="flex items-center gap-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {data.title}
                </h2>
                <div className="hidden sm:block h-5 w-px bg-slate-200"></div>
                <p className="hidden sm:block text-sm text-slate-500 font-medium truncate max-w-2xl">{data.description}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <span className="font-sans font-bold">ESC</span> to close
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Layout: Content + Sidebar */}
        <div className="flex flex-1 overflow-hidden bg-slate-50/50">
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 scroll-smooth">
            {/* Increased max-width to 6xl for better full-screen usage */}
            <div className="max-w-6xl mx-auto space-y-4 pb-32">
              
              {data.sections.map((section, idx) => {
                const isExpanded = expandedSections.has(idx);
                return (
                  <div id={`section-${idx}`} key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                    {/* Collapsible Header */}
                    <button 
                      onClick={() => toggleSection(idx)}
                      className={`w-full text-left px-6 md:px-8 py-5 flex items-center justify-between group transition-colors ${isExpanded ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-mono text-sm font-bold transition-colors ${isExpanded ? 'bg-slate-900 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 text-slate-600'}`}>
                          {idx + 1}
                        </span>
                        <h3 className={`text-lg md:text-xl font-bold transition-colors ${isExpanded ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-800'}`}>
                          {section.title}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-slate-100 rotate-180 text-slate-900' : 'text-slate-400 group-hover:bg-white'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </button>
                    
                    {/* Content */}
                    {isExpanded && (
                      <div className="px-6 md:px-8 pb-8 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                        {/* Improved Grid: 2 cols on large screens, single on small */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-8">
                          {section.content.map((item, i) => (
                            <div key={i} className={item.type === 'table' || item.type === 'links' || (item.type === 'text' && item.value?.length && item.value.length > 150) ? 'col-span-1 xl:col-span-2' : 'col-span-1'}>
                                <ContentRenderer item={item} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          {/* Right Sidebar: Table of Contents - Hidden on smaller laptops, visible on large screens */}
          <div className="hidden xl:block w-72 shrink-0 border-l border-slate-200 bg-white overflow-y-auto custom-scrollbar p-6 z-20 shadow-[min(-10px,0)_0_20px_rgba(0,0,0,0.02)]">
            <div className="sticky top-0">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <List size={14} />
                Table of Contents
              </h4>
              <div className="space-y-1 relative">
                {/* Visual Connector Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100"></div>

                {data.sections.map((section, idx) => {
                  const isActive = expandedSections.has(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(`section-${idx}`, idx)}
                      className={`group relative w-full text-left py-2.5 pl-10 pr-4 rounded-lg text-sm font-medium transition-all duration-200 z-10 flex items-center ${
                        isActive 
                          ? 'bg-cyan-50 text-cyan-700' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {/* Dot indicator */}
                      <div className={`absolute left-4 w-2 h-2 rounded-full border-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-cyan-500 bg-cyan-500 scale-110' 
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}></div>
                      
                      <span className="truncate">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
    </div>
  );
};
