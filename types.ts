
export interface Tool {
  id: string;
  name: string;
  type: string; // "CLI", "GUI", "CLI / GUI", "CLI / Library"
  description: string;
  tags: string[];
}

export type FilterType = 'CLI' | 'GUI' | 'Library';

export type LogicType = 'AND' | 'OR';

export type CheatSheetItemType = 'text' | 'code' | 'table' | 'note' | 'links';

export interface CheatSheetItem {
  type: CheatSheetItemType;
  value?: string;
  label?: string;
  headers?: string[];
  rows?: string[][];
  links?: { text: string; url: string; }[];
}

export interface CheatSheetSection {
  title: string;
  content: CheatSheetItem[];
}

export interface CheatSheetData {
  title: string;
  description: string;
  sections: CheatSheetSection[];
}
