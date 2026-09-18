export type DocumentModule = 'document' | 'generation' | 'download';

export type GenerationStep = 'analysis' | 'settings' | 'outline';

export type ImageStyle = 'none' | 'basic' | 'rich' | 'enhanced';

export type TableStyle = 'clean' | 'header' | 'zebra' | 'solid';

export type TableColor = 'blue' | 'purple' | 'green' | 'black' | 'red' | 'cyan' | 'orange';

export type LengthLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface LengthConfig {
  level: LengthLevel;
  name: string;
  pages: string;
  desc: string;
}

export interface TableColorConfig {
  id: TableColor;
  name: string;
  hex: string;
  bgLight: string;
  borderLight: string;
  headerBg: string;
  headerText: string;
}

export interface SectionContent {
  id: string;
  sectionNumber: string;
  title: string;
  paragraphs: string[];
  table?: {
    title: string;
    headers: string[];
    rows: string[][];
  };
  flowSteps?: string[];
  expansionCandidate: string;
  appliedExpansion?: boolean;
  insertedGraphic?: 'ppt' | 'photo' | null;
  paragraphGraphics?: Record<number, 'ppt' | 'photo' | null>;
}

export interface ChapterContent {
  id: string;
  chapterNumber: number;
  chineseNumber: string;
  title: string;
  requirement: string;
  sections: SectionContent[];
}

export interface DownloadFormatSettings {
  layoutMode: 'standard' | 'wrapped' | 'editorial';
  marginMode: 'standard' | 'compact';
  numberScheme: 'chinese' | 'numeric';
  tableStyle: TableStyle;
  tableColor: TableColor;
  fontFamily: 'serif' | 'sans';
  fontSize: 'small4' | 'regular4';
  lineHeight: '1.5' | '1.75' | '1.95' | '2.0';
}
