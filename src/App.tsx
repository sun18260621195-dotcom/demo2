import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopNav } from './components/TopNav';
import { DocumentView } from './components/DocumentView';
import { GenerationView } from './components/GenerationView';
import { DownloadView } from './components/DownloadView';
import {
  ChapterContent,
  DocumentModule,
  DownloadFormatSettings,
  GenerationStep,
  ImageStyle,
  LengthLevel,
  SectionContent,
  TableColor,
  TableStyle,
} from './types';
import { INITIAL_CHAPTERS } from './data/initialContent';

export default function App() {
  // 1. Current Active Top-level Module: default is 'document' (示例正文)
  const [currentModule, setCurrentModule] = useState<DocumentModule>('document');

  // 2. Active Proposal Document Data (Initial 6 chapters 12 sections)
  const [chapters, setChapters] = useState<ChapterContent[]>(INITIAL_CHAPTERS);
  const [activeTableStyle, setActiveTableStyle] = useState<TableStyle>('header');
  const [activeTableColor, setActiveTableColor] = useState<TableColor>('purple');

  // 3. Fast Generation States & Draft configurations (Preserved across tab switches)
  const [generationStep, setGenerationStep] = useState<GenerationStep>('analysis');
  const [draftLengthLevel, setDraftLengthLevel] = useState<LengthLevel>(3); // Default: 中篇 350-500
  const [draftImageStyle, setDraftImageStyle] = useState<ImageStyle>('rich'); // Default: 丰富配图
  const [draftTableStyle, setDraftTableStyle] = useState<TableStyle>('header'); // Default: 表头强化
  const [draftTableColor, setDraftTableColor] = useState<TableColor>('purple'); // Default: 喜鹊紫
  const [draftOutline, setDraftOutline] = useState<ChapterContent[]>(INITIAL_CHAPTERS);

  // 4. Download & Export Formatting Settings
  const [downloadSettings, setDownloadSettings] = useState<DownloadFormatSettings>({
    layoutMode: 'standard',
    marginMode: 'standard',
    numberScheme: 'chinese',
    tableStyle: 'header',
    tableColor: 'purple',
    fontFamily: 'serif',
    fontSize: 'small4',
    lineHeight: '1.75',
  });

  // Notification Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Determine if the user has applied any AI modifications in the active document
  const hasUserModifications = chapters.some((ch) =>
    ch.sections.some((sec) => sec.appliedExpansion || sec.insertedGraphic)
  );

  // Handler to update section in active document (e.g. AI expansion or insert diagram/photo)
  const handleUpdateSection = (
    chapterId: string,
    sectionId: string,
    updater: (sec: SectionContent) => SectionContent
  ) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            sections: ch.sections.map((sec) =>
              sec.id === sectionId ? updater(sec) : sec
            ),
          };
        }
        return ch;
      })
    );
  };

  // Handler when generation workflow is confirmed in Step 3
  const handleCompleteGeneration = () => {
    // Apply draft outline & styling to active document
    setChapters(draftOutline);
    setActiveTableStyle(draftTableStyle);
    setActiveTableColor(draftTableColor);

    // Switch to active document view directly without extra steps
    setCurrentModule('document');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('✨ 标书正文已成功重新生成，目录结构与表格样式已同步更新！');
  };

  // Reset sample back to pristine baseline
  const handleResetSample = () => {
    setChapters(INITIAL_CHAPTERS);
    setActiveTableStyle('header');
    setActiveTableColor('purple');

    setDraftOutline(INITIAL_CHAPTERS);
    setGenerationStep('analysis');
    setDraftLengthLevel(3);
    setDraftImageStyle('rich');
    setDraftTableStyle('header');
    setDraftTableColor('purple');

    setDownloadSettings({
      layoutMode: 'standard',
      marginMode: 'standard',
      numberScheme: 'chinese',
      tableStyle: 'header',
      tableColor: 'purple',
      fontFamily: 'serif',
      fontSize: 'small4',
      lineHeight: '1.75',
    });
    showToast('已重置回初始六章十二节样书展台');
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#1E2024] flex flex-col selection:bg-[#6438FF]/15 selection:text-[#6438FF]">
      {/* Top Persistent Architectural Navigation */}
      <TopNav
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        onResetSample={handleResetSample}
      />

      {/* Main Work Surface with subtle, short-distance transition */}
      <main className="flex-1 w-full pb-16">
        <AnimatePresence mode="wait">
          {currentModule === 'document' && (
            <motion.div
              key="document-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <DocumentView
                chapters={chapters}
                onUpdateSection={handleUpdateSection}
                tableStyle={activeTableStyle}
                tableColor={activeTableColor}
                onNavigateDownload={() => {
                  setCurrentModule('download');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {currentModule === 'generation' && (
            <motion.div
              key="generation-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <GenerationView
                currentStep={generationStep}
                onStepChange={setGenerationStep}
                draftLengthLevel={draftLengthLevel}
                onDraftLengthChange={setDraftLengthLevel}
                draftImageStyle={draftImageStyle}
                onDraftImageStyleChange={setDraftImageStyle}
                draftTableStyle={draftTableStyle}
                onDraftTableStyleChange={setDraftTableStyle}
                draftTableColor={draftTableColor}
                onDraftTableColorChange={setDraftTableColor}
                draftOutline={draftOutline}
                onUpdateDraftOutline={setDraftOutline}
                hasUserModifications={hasUserModifications}
                onCompleteGeneration={handleCompleteGeneration}
              />
            </motion.div>
          )}

          {currentModule === 'download' && (
            <motion.div
              key="download-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <DownloadView
                settings={downloadSettings}
                onUpdateSettings={setDownloadSettings}
                onNavigateDocument={() => {
                  setCurrentModule('document');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Minimal Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-stone-900/90 text-white text-xs font-medium shadow-xl backdrop-blur-md flex items-center gap-2 border border-white/10"
            role="status"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
