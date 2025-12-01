import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Wand2, Save, Loader2, FileJson, CheckCircle, Database, Layout, Edit, Plus, Trash2, Code, Download, Upload, FileType } from 'lucide-react';
import { CheatSheetData, Tool, CheatSheetItem, CheatSheetSection } from '../types';
import { CheatSheetViewer } from './CheatSheetViewer';

// Removed static import
// import { GoogleGenAI, Type } from "@google/genai";

interface AdminPanelProps {
  onClose: () => void;
  tools: Tool[];
  setTools: (tools: Tool[]) => void;
  cheatSheets: Record<string, CheatSheetData>;
  setCheatSheets: (map: Record<string, CheatSheetData>) => void;
}

type TabType = 'metadata' | 'markdown' | 'json' | 'ai';

// --- Helper Functions for Markdown Conversion ---

const jsonToMarkdown = (data: CheatSheetData): string => {
  if (!data) return '';
  let md = `# ${data.title || 'Untitled'}\n\n${data.description || ''}\n\n`;

  if (data.sections) {
    data.sections.forEach(section => {
      md += `## ${section.title}\n\n`;
      if (section.content) {
        section.content.forEach(item => {
          if (item.type === 'text') {
            md += `${item.value}\n\n`;
          } else if (item.type === 'code') {
            if (item.label) md += `### ${item.label}\n`;
            md += `\`\`\`\n${item.value}\n\`\`\`\n\n`;
          } else if (item.type === 'note') {
            md += `> ${item.value}\n\n`;
          } else if (item.type === 'table') {
            if (item.headers && item.rows) {
              md += `| ${item.headers.join(' | ')} |\n`;
              md += `| ${item.headers.map(() => '---').join(' | ')} |\n`;
              item.rows.forEach(row => {
                md += `| ${row.join(' | ')} |\n`;
              });
              md += '\n';
            }
          } else if (item.type === 'links') {
             if (item.links) {
               item.links.forEach(link => {
                 md += `- [${link.text}](${link.url})\n`;
               });
               md += '\n';
             }
          }
        });
      }
    });
  }
  return md;
};

const markdownToJson = (md: string): CheatSheetData => {
  const lines = md.split('\n');
  const data: CheatSheetData = {
    title: '',
    description: '',
    sections: []
  };

  let currentSection: CheatSheetSection | null = null;
  let textBuffer: string[] = [];
  let mode: 'text' | 'code' | 'table' = 'text';
  let codeLabel = '';
  
  // Table state
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushBuffer = () => {
    if (textBuffer.length === 0) return;
    
    const text = textBuffer.join('\n').trim();
    if (!text) { textBuffer = []; return; }

    // Check if it's a list of links
    if (text.startsWith('- [') && text.includes('](')) {
       const links = text.split('\n').map(l => {
         const match = l.match(/- \[(.*?)\]\((.*?)\)/);
         return match ? { text: match[1], url: match[2] } : null;
       }).filter(Boolean) as {text: string, url: string}[];

       if (links.length > 0 && currentSection) {
         currentSection.content.push({ type: 'links', links });
         textBuffer = [];
         return;
       }
    }

    if (!currentSection) {
       // Description
       if (!data.description) data.description = text;
       else data.description += '\n' + text;
    } else {
       currentSection.content.push({ type: 'text', value: text });
    }
    textBuffer = [];
  };

  const flushTable = () => {
    if (currentSection && tableHeaders.length > 0) {
      currentSection.content.push({
        type: 'table',
        headers: tableHeaders,
        rows: tableRows
      });
    }
    tableHeaders = [];
    tableRows = [];
    mode = 'text';
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Title (H1)
    if (line.startsWith('# ') && !line.startsWith('##')) {
       data.title = line.substring(2).trim();
       continue;
    }

    // Section (H2)
    if (line.startsWith('## ')) {
       if (mode === 'table') flushTable();
       flushBuffer();
       currentSection = {
         title: line.substring(3).trim(),
         content: []
       };
       data.sections.push(currentSection);
       continue;
    }

    // Code Block
    if (trimmed.startsWith('```')) {
      if (mode === 'code') {
        // End code block
        if (currentSection) {
          currentSection.content.push({
            type: 'code',
            value: textBuffer.join('\n'),
            label: codeLabel
          });
        }
        textBuffer = [];
        mode = 'text';
        codeLabel = '';
      } else {
        if (mode === 'table') flushTable();
        flushBuffer();
        mode = 'code';
        // Check if previous line was a label (H3)
        if (i > 0 && lines[i-1].startsWith('### ')) {
           codeLabel = lines[i-1].substring(4).trim();
           // Remove the label from the previous buffer or text item?
           // The buffer would have already been flushed if we handle h3 correctly
        }
      }
      continue;
    }

    if (mode === 'code') {
      textBuffer.push(line);
      continue;
    }

    // H3 (Label or Bold Text)
    if (line.startsWith('### ')) {
       if (mode === 'table') flushTable();
       flushBuffer();
       
       // Look ahead for code block to treat this as a label
       if (i + 1 < lines.length && lines[i+1].trim().startsWith('```')) {
          codeLabel = line.substring(4).trim();
       } else {
          textBuffer.push(`**${line.substring(4).trim()}**`);
       }
       continue;
    }

    // Table Detection
    if (trimmed.startsWith('|')) {
       if (mode !== 'table') {
         flushBuffer();
         mode = 'table';
         // Assume this is header
         tableHeaders = trimmed.split('|').map(s => s.trim()).filter(s => s);
       } else {
         // Check if separator row
         if (trimmed.includes('---')) continue;
         // Body row
         // Robust split for pipes
         const cells = trimmed.split('|').slice(1, -1).map(s => s.trim());
         tableRows.push(cells);
       }
       continue;
    } else if (mode === 'table' && trimmed === '') {
       flushTable();
       continue;
    }

    // Note (Blockquote)
    if (line.startsWith('> ')) {
       if (mode === 'table') flushTable();
       flushBuffer();
       if (currentSection) {
         currentSection.content.push({ type: 'note', value: line.substring(2).trim() });
       }
       continue;
    }

    // Regular Text
    if (trimmed !== '') {
       textBuffer.push(line);
    } else {
       if (textBuffer.length > 0) flushBuffer();
    }
  }

  if (mode === 'table') flushTable();
  flushBuffer();

  return data;
};


export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, tools, setTools, cheatSheets, setCheatSheets }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Selection State
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('markdown'); // Default to Markdown

  // Editing State
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [editJson, setEditJson] = useState<string>('');
  const [editMarkdown, setEditMarkdown] = useState<string>('');
  
  // AI State
  const [rawData, setRawData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // File Import Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleFileRef = useRef<HTMLInputElement>(null);

  // Filter tools sidebar
  const filteredTools = tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search.toLowerCase()));

  // When selection changes, load data into edit buffers
  useEffect(() => {
    if (selectedToolId) {
      const tool = tools.find(t => t.id === selectedToolId);
      if (tool) {
        setEditTool({ ...tool });
        const sheet = cheatSheets[selectedToolId];
        const jsonString = sheet ? JSON.stringify(sheet, null, 2) : '';
        setEditJson(jsonString);
        
        // Convert existing JSON to Markdown for the editor
        if (sheet) {
           setEditMarkdown(jsonToMarkdown(sheet));
        } else {
           setEditMarkdown(`# ${tool.name}\n\n${tool.description}\n\n## Basic Usage\n\n`);
        }
      }
    } else {
      setEditTool(null);
      setEditJson('');
      setEditMarkdown('');
    }
  }, [selectedToolId, tools, cheatSheets]);

  // Sync Markdown changes to JSON for preview/saving (When using Markdown Editor)
  useEffect(() => {
    if (activeTab === 'markdown' && editMarkdown) {
      const parsed = markdownToJson(editMarkdown);
      setEditJson(JSON.stringify(parsed, null, 2));
    }
  }, [editMarkdown, activeTab]);

  // Sync JSON changes to Markdown (When using JSON Editor)
  useEffect(() => {
    if (activeTab === 'json' && editJson) {
      try {
        const parsed = JSON.parse(editJson);
        setEditMarkdown(jsonToMarkdown(parsed));
      } catch (e) {
        // Invalid JSON while typing, skip markdown update until valid
      }
    }
  }, [editJson, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
  };

  const handleSaveTool = () => {
    if (!editTool) return;
    
    // Update Tools List
    const toolIndex = tools.findIndex(t => t.id === editTool.id);
    let newTools = [...tools];
    if (toolIndex >= 0) {
      newTools[toolIndex] = editTool;
    } else {
      newTools.push(editTool);
    }
    setTools(newTools);

    // Update Cheat Sheets
    try {
      if (editJson.trim()) {
        const parsedData = JSON.parse(editJson);
        const newCheatSheets = { ...cheatSheets, [editTool.id]: parsedData };
        setCheatSheets(newCheatSheets);
      } else {
        const newCheatSheets = { ...cheatSheets };
        delete newCheatSheets[editTool.id];
        setCheatSheets(newCheatSheets);
      }
      alert('Saved successfully!');
    } catch (e) {
      alert('Error: Invalid JSON in Cheat Sheet data');
    }
  };

  const handleDeleteTool = () => {
    if (!editTool || !confirm(`Are you sure you want to delete ${editTool.name}?`)) return;
    
    const newTools = tools.filter(t => t.id !== editTool.id);
    setTools(newTools);
    
    const newCheatSheets = { ...cheatSheets };
    delete newCheatSheets[editTool.id];
    setCheatSheets(newCheatSheets);
    
    setSelectedToolId(null);
  };

  const handleCreateNew = () => {
    const newId = `new-tool-${Date.now()}`;
    const newTool: Tool = {
      id: newId,
      name: 'New Tool',
      type: 'CLI',
      description: 'Description here...',
      tags: ['tag1']
    };
    setTools([...tools, newTool]);
    setSelectedToolId(newId);
    setEditMarkdown(`# New Tool\n\nDescription...\n\n## Section 1\n`);
    setActiveTab('markdown');
  };

  // --- Global Export/Import ---

  const handleExport = () => {
    const data = {
      tools,
      cheatSheets,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nettools-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (data.tools && Array.isArray(data.tools) && data.cheatSheets) {
          if (confirm(`Importing will overwrite current data. Found ${data.tools.length} tools. Continue?`)) {
            setTools(data.tools);
            setCheatSheets(data.cheatSheets);
            alert('Import successful!');
            setSelectedToolId(null);
          }
        } else {
          alert('Invalid file format. Must contain "tools" array and "cheatSheets" object.');
        }
      } catch (err) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Single Cheat Sheet Export/Import ---

  const handleExportSingleJson = () => {
    if (!editJson || !editTool) {
       alert("No content to export.");
       return;
    }
    const blob = new Blob([editJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editTool.id}-cheatsheet.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSingleJsonClick = () => {
    singleFileRef.current?.click();
  };

  const handleImportSingleJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        setEditJson(JSON.stringify(parsed, null, 2));
        setEditMarkdown(jsonToMarkdown(parsed));
      } catch (err) {
        alert('Error parsing JSON file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- AI Generation ---

  const handleGenerateAI = async () => {
    if (!rawData.trim()) {
      setAiError('Please provide raw data');
      return;
    }
    
    // Safety check for API Key presence
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setAiError('API Key is not configured in the environment variables (process.env.API_KEY). AI features will not work.');
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      // Dynamic import to prevent crash
      // @ts-ignore
      const { GoogleGenAI, Type } = await import("@google/genai");

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Convert the following documentation into the CheatSheet JSON format for the tool "${editTool?.name}".
        Return ONLY the JSON.
        
        Raw Data:
        ${rawData}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          type: { type: Type.STRING, enum: ["text", "code", "table", "note", "links"] },
                          value: { type: Type.STRING },
                          label: { type: Type.STRING },
                          headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                          rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } },
                          links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, url: { type: Type.STRING } } } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        setEditJson(JSON.stringify(parsed, null, 2));
        setEditMarkdown(jsonToMarkdown(parsed));
        setActiveTab('markdown');
      }
    } catch (err: any) {
      console.error(err);
      setAiError(`Generation failed: ${err.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-100 rounded-full">
              <Lock className="text-slate-600" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-cyan-500" placeholder="Password" autoFocus />
            <button type="submit" className="w-full py-3 rounded-lg bg-slate-900 text-white font-bold">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // Preview Data derivation
  let previewData: CheatSheetData | null = null;
  try {
    previewData = editJson ? JSON.parse(editJson) : null;
  } catch (e) {
    previewData = null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-slate-50 w-[95vw] h-[95vh] rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200">
        
        {/* Left Sidebar: Tool List */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-bold text-slate-800 flex items-center gap-2"><Database size={18}/> Tools</h2>
               <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X size={20} className="text-slate-400"/></button>
            </div>
            <input 
              type="text" 
              placeholder="Filter tools..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-cyan-500"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredTools.map(t => (
              <div 
                key={t.id}
                onClick={() => setSelectedToolId(t.id)}
                className={`px-4 py-3 cursor-pointer border-b border-slate-50 hover:bg-slate-50 transition-colors ${selectedToolId === t.id ? 'bg-cyan-50 border-cyan-100' : ''}`}
              >
                <div className="font-semibold text-slate-700">{t.name}</div>
                <div className="text-xs text-slate-400">{t.type}</div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/50">
            <button onClick={handleCreateNew} className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-700 shadow-sm">
              <Plus size={16} /> Add New Tool
            </button>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
               <button onClick={handleExport} className="py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                 <Download size={14} /> Backup
               </button>
               <button onClick={handleImportClick} className="py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                 <Upload size={14} /> Restore
               </button>
               <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  accept=".json"
                  className="hidden" 
               />
            </div>
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
          {selectedToolId && editTool ? (
            <>
              {/* Toolbar */}
              <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
                <div>
                   <h1 className="text-xl font-bold text-slate-800">{editTool.name}</h1>
                   <span className="text-xs font-mono text-slate-400">{editTool.id}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDeleteTool} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                  <button onClick={handleSaveTool} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex px-6 border-b border-slate-200 bg-white shrink-0">
                <button 
                  onClick={() => setActiveTab('markdown')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'markdown' ? 'border-cyan-500 text-cyan-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <FileType size={16} /> Markdown Editor
                </button>
                <button 
                  onClick={() => setActiveTab('metadata')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'metadata' ? 'border-cyan-500 text-cyan-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Layout size={16} /> Metadata
                </button>
                <button 
                  onClick={() => setActiveTab('json')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'json' ? 'border-cyan-500 text-cyan-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Code size={16} /> JSON Source
                </button>
                <button 
                  onClick={() => setActiveTab('ai')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'ai' ? 'border-cyan-500 text-cyan-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Wand2 size={16} /> AI Generator
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden relative">
                {activeTab === 'markdown' && (
                  <div className="h-full flex flex-col md:flex-row">
                    {/* Editor Side */}
                    <div className="flex-1 flex flex-col border-r border-slate-200 h-1/2 md:h-full">
                       <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 flex justify-between">
                         <span>Editor</span>
                         <span className="text-slate-400">Markdown Supported</span>
                       </div>
                       <textarea 
                          value={editMarkdown}
                          onChange={(e) => setEditMarkdown(e.target.value)}
                          className="flex-1 w-full p-4 font-mono text-sm bg-white text-slate-800 resize-none outline-none leading-relaxed"
                          placeholder="# Tool Title\n\nDescription...\n\n## Section 1\n..."
                       />
                    </div>
                    {/* Preview Side */}
                    <div className="flex-1 flex flex-col bg-slate-100 h-1/2 md:h-full overflow-hidden">
                       <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                         Live Preview
                       </div>
                       <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative">
                         {previewData ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-full">
                               <div className="p-6 border-b border-slate-100">
                                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    {previewData.title || 'Untitled'}
                                  </h2>
                                  <p className="text-sm text-slate-500 mt-1">{previewData.description}</p>
                               </div>
                               <div className="p-6 space-y-8">
                                  {previewData.sections.map((section, idx) => (
                                     <div key={idx}>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
                                           <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-800 text-white text-xs">{idx + 1}</span>
                                           {section.title}
                                        </h3>
                                        <div className="grid gap-4">
                                           {section.content.map((item, i) => (
                                              <div key={i} className="text-sm">
                                                 {item.type === 'text' && <div className="text-slate-600 whitespace-pre-wrap">{item.value}</div>}
                                                 {item.type === 'code' && (
                                                   <div className="bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                                                     {item.label && <div className="text-pink-400 text-[10px] uppercase mb-1">{item.label}</div>}
                                                     $ {item.value}
                                                   </div>
                                                 )}
                                                 {item.type === 'note' && (
                                                   <div className="bg-amber-50 border-l-4 border-amber-400 p-3 text-amber-900 rounded-r">
                                                     {item.value}
                                                   </div>
                                                 )}
                                                 {item.type === 'table' && (
                                                    <div className="overflow-x-auto border border-slate-200 rounded">
                                                       <table className="w-full text-xs">
                                                          <thead className="bg-slate-50 font-bold">
                                                             <tr>{item.headers?.map(h => <th key={h} className="p-2 border-r last:border-0">{h}</th>)}</tr>
                                                          </thead>
                                                          <tbody>
                                                             {item.rows?.map((r, ri) => <tr key={ri} className="border-t">{r.map((c, ci) => <td key={ci} className="p-2 border-r last:border-0">{c}</td>)}</tr>)}
                                                          </tbody>
                                                       </table>
                                                    </div>
                                                 )}
                                                 {item.type === 'links' && (
                                                    <div className="grid gap-2">
                                                      {item.links?.map((l, li) => <a key={li} href={l.url} className="text-cyan-600 underline block">{l.text}</a>)}
                                                    </div>
                                                 )}
                                              </div>
                                           ))}
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         ) : (
                           <div className="flex items-center justify-center h-full text-slate-400">
                             Start typing to see preview...
                           </div>
                         )}
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'metadata' && (
                  <div className="max-w-2xl space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm m-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">ID</label>
                        <input 
                           type="text" 
                           value={editTool.id} 
                           onChange={(e) => setEditTool({...editTool, id: e.target.value})}
                           className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono text-sm"
                           disabled 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                        <input 
                           type="text" 
                           value={editTool.name} 
                           onChange={(e) => setEditTool({...editTool, name: e.target.value})}
                           className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                       <select 
                         value={editTool.type} 
                         onChange={(e) => setEditTool({...editTool, type: e.target.value})}
                         className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                       >
                         <option value="CLI">CLI</option>
                         <option value="GUI">GUI</option>
                         <option value="CLI / GUI">CLI / GUI</option>
                         <option value="CLI / Library">CLI / Library</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                       <textarea 
                          value={editTool.description} 
                          onChange={(e) => setEditTool({...editTool, description: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg h-24 resize-none focus:border-cyan-500 outline-none"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1">Tags</label>
                       <input 
                          type="text" 
                          value={editTool.tags.join(', ')} 
                          onChange={(e) => setEditTool({...editTool, tags: e.target.value.split(',').map(s => s.trim())})}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-cyan-500 outline-none"
                       />
                    </div>
                  </div>
                )}

                {activeTab === 'json' && (
                  <div className="h-full flex flex-col p-6">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-slate-500">Edit raw JSON or import/export this sheet. Changes here sync to Markdown.</p>
                        <div className="flex gap-2">
                           <button onClick={handleImportSingleJsonClick} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-2">
                             <Upload size={14} /> Import
                           </button>
                           <button onClick={handleExportSingleJson} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-2">
                             <Download size={14} /> Export
                           </button>
                           <input 
                             type="file" 
                             ref={singleFileRef}
                             onChange={handleImportSingleJsonFile}
                             accept=".json"
                             className="hidden" 
                           />
                        </div>
                    </div>
                    <textarea 
                      value={editJson} 
                      onChange={(e) => setEditJson(e.target.value)}
                      className="flex-1 w-full p-4 font-mono text-sm bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:border-cyan-500 outline-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="max-w-3xl space-y-4 p-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
                      Paste documentation below. The AI will generate JSON and overwrite the current cheat sheet.
                    </div>
                    <textarea
                      value={rawData}
                      onChange={(e) => setRawData(e.target.value)}
                      placeholder="Paste text here..."
                      className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none text-sm font-mono"
                    />
                    {aiError && <p className="text-red-500 text-sm">{aiError}</p>}
                    <button
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />} Generate JSON
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
               <Edit size={48} className="mb-4 opacity-20" />
               <p>Select a tool from the sidebar to edit</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};