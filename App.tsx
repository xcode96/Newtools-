import React, { useState, useMemo, useEffect } from 'react';
import { Search, Command, Shield, Filter, Github, Check, ToggleLeft, ToggleRight, X, UserCog } from 'lucide-react';
import { toolsData as initialToolsData } from './data';
import { Tool, FilterType, LogicType, CheatSheetData } from './types';
import { ToolCard } from './components/ToolCard';
import { CheatSheetViewer } from './components/CheatSheetViewer';
import { cheatSheets as initialCheatSheets } from './cheatSheets';
import { AdminPanel } from './components/AdminPanel';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [filterLogic, setFilterLogic] = useState<LogicType>('OR');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  
  // State for tools (lifted from data.ts to allow editing)
  const [tools, setTools] = useState<Tool[]>(initialToolsData);
  
  // State for cheat sheets
  const [cheatSheetMap, setCheatSheetMap] = useState<Record<string, CheatSheetData>>(initialCheatSheets);
  const [showAdmin, setShowAdmin] = useState(false);

  // Close modal on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedToolId(null);
        setShowAdmin(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const toggleFilter = (type: FilterType) => {
    setActiveFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleUpdateCheatSheets = (newMap: Record<string, CheatSheetData>) => {
    setCheatSheetMap(newMap);
  };

  const handleUpdateTools = (newTools: Tool[]) => {
    setTools(newTools);
  };

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 1. Text Search Logic
      const matchesSearch = 
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Type Filter Logic
      if (activeFilters.length === 0) return true;

      const toolTypeLower = tool.type.toLowerCase();
      
      if (filterLogic === 'OR') {
        // Show tool if it matches ANY of the selected filters
        return activeFilters.some(filter => toolTypeLower.includes(filter.toLowerCase()));
      } else {
        // AND Logic: Show tool ONLY if it contains ALL selected filters
        // (e.g. CLI + GUI selected -> must be "CLI / GUI")
        return activeFilters.every(filter => toolTypeLower.includes(filter.toLowerCase()));
      }
    });
  }, [searchQuery, activeFilters, filterLogic, tools]);

  const stats = {
    total: tools.length,
    shown: filteredTools.length
  };

  const activeCheatSheet = selectedToolId ? cheatSheetMap[selectedToolId] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-100 selection:text-cyan-900 pb-20">
      {/* Cheat Sheet Modal */}
      {activeCheatSheet && (
        <CheatSheetViewer 
          data={activeCheatSheet} 
          onClose={() => setSelectedToolId(null)} 
        />
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
          tools={tools}
          setTools={handleUpdateTools}
          cheatSheets={cheatSheetMap}
          setCheatSheets={handleUpdateCheatSheets}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-900/10">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  NetTools<span className="text-cyan-600">.io</span>
                </h1>
                <p className="text-xs text-slate-500 font-mono">Network Security Cheat Sheet</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 hidden sm:flex">
               <div className="flex flex-col items-end">
                  <span className="font-mono text-xs font-semibold">{stats.shown} / {stats.total} TOOLS</span>
                  <span className="text-[10px] opacity-70">UPDATED 2024</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-600 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search tools, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all shadow-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <kbd className="hidden md:inline-flex items-center border border-slate-200 bg-slate-50 rounded px-2 text-xs font-sans font-medium text-slate-400">
                  <Command size={10} className="mr-1" /> K
                </kbd>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Filter Buttons */}
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shrink-0 shadow-sm overflow-x-auto">
                {(['CLI', 'GUI', 'Library'] as FilterType[]).map((type) => {
                  const isActive = activeFilters.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleFilter(type)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-slate-800 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isActive && <Check size={14} className="animate-in zoom-in duration-200" />}
                      {type}
                    </button>
                  );
                })}
              </div>

              {/* Logic Toggle */}
              <div className="flex items-center bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
                <span className="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">Logic:</span>
                <button
                  onClick={() => setFilterLogic(prev => prev === 'OR' ? 'AND' : 'OR')}
                  className="flex items-center gap-2 text-sm font-bold text-cyan-700 hover:text-cyan-800 transition-colors w-16"
                  title={`Switch to ${filterLogic === 'OR' ? 'AND' : 'OR'} logic`}
                >
                  {filterLogic === 'OR' ? (
                    <>
                      <ToggleLeft size={24} className="text-slate-300" /> OR
                    </>
                  ) : (
                    <>
                      <ToggleRight size={24} className="text-cyan-600" /> AND
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Active Filters Display */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 min-h-6">
             {(searchQuery || activeFilters.length > 0) && (
               <>
                 <Filter size={14} />
                 <span>Filters active:</span>
                 
                 {activeFilters.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                     {activeFilters.map(f => (
                       <span key={f} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                         {f}
                         <button onClick={() => toggleFilter(f)} className="ml-1 hover:text-red-500"><X size={12}/></button>
                       </span>
                     ))}
                     <span className="text-xs bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-slate-400 font-mono">
                        {filterLogic}
                     </span>
                   </div>
                 )}

                 {searchQuery && (
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100">
                     "{searchQuery}"
                     <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-cyan-900"><X size={12}/></button>
                   </span>
                 )}

                 <button 
                   onClick={() => { setSearchQuery(''); setActiveFilters([]); }}
                   className="text-slate-400 hover:text-red-500 hover:underline ml-2 text-xs font-medium transition-colors"
                 >
                   Clear All
                 </button>
               </>
             )}
          </div>
        </div>

        {/* Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                hasCheatSheet={!!cheatSheetMap[tool.id]}
                onViewCheatSheet={() => setSelectedToolId(tool.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="bg-white border border-slate-100 shadow-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">No tools found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any tools matching your search and filter combination.
              <br />
              <span className="text-xs mt-2 block bg-slate-100 p-2 rounded">
                 Hint: Try switching logic from <strong>{filterLogic}</strong> to <strong>{filterLogic === 'AND' ? 'OR' : 'AND'}</strong>
              </span>
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveFilters([]); }}
              className="mt-6 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2024 NetTools Cheat Sheet. Open source reference.</p>
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => setShowAdmin(true)}
              className="hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <UserCog size={14} /> Admin
            </button>
            <a href="#" className="hover:text-cyan-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-600 transition-colors flex items-center gap-2">
              <Github size={16} /> Contribute
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;