import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  X,
  Check,
  Wand2,
  Image as ImageIcon,
  BarChart2,
  RotateCcw,
  CheckCircle2,
  FileText,
  Edit3,
  Download,
  ArrowRight,
} from 'lucide-react';
import { ChapterContent, SectionContent, TableColor, TableStyle } from '../types';
import {
  PptManagementDiagram,
  SiteInspectionPhoto,
  StyledTable,
  FlowchartDiagram,
} from './Infographics';

interface DocumentViewProps {
  chapters: ChapterContent[];
  onUpdateSection: (
    chapterId: string,
    sectionId: string,
    updater: (sec: SectionContent) => SectionContent
  ) => void;
  tableStyle?: TableStyle;
  tableColor?: TableColor;
  onNavigateDownload?: () => void;
}

type AiToolType = 'expand' | 'polish' | 'photo' | 'ppt';

interface ActiveModalState {
  chapterId: string;
  sectionId: string;
  paragraphIndex: number;
  toolType: AiToolType;
  originalText: string;
  generatedText: string;
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  chapters,
  onUpdateSection,
  tableStyle = 'header',
  tableColor = 'purple',
  onNavigateDownload,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1-1');
  const [showOnboardingTip, setShowOnboardingTip] = useState<boolean>(true);

  // Hovered paragraph tracking: chapterId, sectionId, paragraphIndex
  const [hoveredParagraph, setHoveredParagraph] = useState<{
    chapterId: string;
    sectionId: string;
    pIndex: number;
  } | null>(null);

  // Floating AI toolbar state (opened upon clicking the small AI icon)
  const [activeToolbar, setActiveToolbar] = useState<{
    chapterId: string;
    sectionId: string;
    pIndex: number;
  } | null>(null);

  // Modal dialog state for handling AI action review and confirmation
  const [modalState, setModalState] = useState<ActiveModalState | null>(null);

  // Briefly highlighted paragraph after echoing content back to document
  const [highlightedParagraph, setHighlightedParagraph] = useState<{
    chapterId: string;
    sectionId: string;
    pIndex: number;
  } | null>(null);

  // Inline editing state for direct text editing
  const [editingParagraph, setEditingParagraph] = useState<{
    chapterId: string;
    sectionId: string;
    pIndex: number;
  } | null>(null);
  const [editingDraftText, setEditingDraftText] = useState<string>('');

  const documentContainerRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Scrollspy to detect which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('[data-section-id]');
      let currentId = chapters[0]?.sections[0]?.id || 'sec-1-1';
      const scrollPosition = window.scrollY + 180;

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentId = sec.getAttribute('data-section-id') || currentId;
        }
      });
      setActiveSectionId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chapters]);

  const scrollToSection = (secId: string) => {
    const elem = document.getElementById(secId);
    if (elem) {
      const topOffset = 76;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSectionId(secId);
    }
  };

  // Close toolbar on click outside or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveToolbar(null);
        if (modalState) setModalState(null);
        if (editingParagraph) setEditingParagraph(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalState, editingParagraph]);

  // Open modal with pre-generated contextual content based on tool type
  const handleOpenAiModal = (
    chapterId: string,
    sectionId: string,
    pIndex: number,
    toolType: AiToolType,
    originalText: string
  ) => {
    setActiveToolbar(null);

    let generatedText = '';
    if (toolType === 'expand') {
      generatedText = `${originalText} 此外，针对早晚入场高峰（8:00—9:30）与重要公务会务，实行“双人交叉复核、5分钟即时补位”的响应机制。现场保洁巡检频次加密至每30分钟一次，设施运维值班工程师24小时常驻，关键区域设立专属工单台账与备件应急库，确保全天候无死角履约保障。`;
    } else if (toolType === 'polish') {
      generatedText = `根据技术标书响应规范与高标准商业物业服务准则，本项目严格确立“精细化管控、前置性预防、全流程闭环”的运营模式。全面细化服务考核标准，落实责任到人与即时追溯机制，确保各项技术指标符合招标规范。`;
    }

    setModalState({
      chapterId,
      sectionId,
      paragraphIndex: pIndex,
      toolType,
      originalText,
      generatedText,
    });
  };

  // Confirm in modal dialog and echo back directly into the document editor
  const handleConfirmModal = () => {
    if (!modalState) return;
    const { chapterId, sectionId, paragraphIndex, toolType, generatedText } = modalState;

    if (toolType === 'expand' || toolType === 'polish') {
      onUpdateSection(chapterId, sectionId, (sec) => {
        const nextParagraphs = [...sec.paragraphs];
        nextParagraphs[paragraphIndex] = generatedText;
        return {
          ...sec,
          paragraphs: nextParagraphs,
        };
      });
    } else if (toolType === 'photo' || toolType === 'ppt') {
      onUpdateSection(chapterId, sectionId, (sec) => {
        const updatedGraphics = { ...(sec.paragraphGraphics || {}) };
        updatedGraphics[paragraphIndex] = toolType;
        return {
          ...sec,
          paragraphGraphics: updatedGraphics,
        };
      });
    }

    // Flash highlight on the updated paragraph
    setHighlightedParagraph({ chapterId, sectionId, pIndex: paragraphIndex });
    setTimeout(() => {
      setHighlightedParagraph(null);
    }, 2000);

    setModalState(null);
  };

  // Remove graphic attached to a paragraph
  const handleRemoveParagraphGraphic = (
    chapterId: string,
    sectionId: string,
    pIndex: number
  ) => {
    onUpdateSection(chapterId, sectionId, (sec) => {
      const updatedGraphics = { ...(sec.paragraphGraphics || {}) };
      delete updatedGraphics[pIndex];
      return {
        ...sec,
        paragraphGraphics: updatedGraphics,
      };
    });
  };

  // Inline editing save
  const handleSaveInlineEdit = (
    chapterId: string,
    sectionId: string,
    pIndex: number
  ) => {
    if (!editingDraftText.trim()) return;
    onUpdateSection(chapterId, sectionId, (sec) => {
      const nextParagraphs = [...sec.paragraphs];
      nextParagraphs[pIndex] = editingDraftText;
      return {
        ...sec,
        paragraphs: nextParagraphs,
      };
    });
    setEditingParagraph(null);
  };

  const totalSections = chapters.reduce((acc, ch) => acc + ch.sections.length, 0);

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-6" ref={documentContainerRef}>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Table of Contents (TOC) Sidebar */}
        <aside className="w-full lg:w-[260px] shrink-0 sticky top-18 z-20">
          <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100">
              <h3 className="font-semibold text-xs text-stone-900 tracking-wider">标书目录</h3>
              <span className="text-[11px] font-mono text-stone-400">
                {chapters.length} 章 {totalSections} 节
              </span>
            </div>

            <nav className="space-y-1.5 max-h-[calc(100vh-160px)] overflow-y-auto pr-1 text-xs select-none">
              {chapters.map((ch) => {
                const isChapterActive = ch.sections.some((s) => s.id === activeSectionId);
                return (
                  <div key={ch.id} className="space-y-1">
                    <button
                      onClick={() => scrollToSection(ch.sections[0]?.id || ch.id)}
                      className={`w-full text-left font-medium py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer focus:outline-none ${
                        isChapterActive
                          ? 'bg-[#6438FF]/10 text-[#6438FF] font-semibold'
                          : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/70'
                      }`}
                    >
                      <span className="truncate">
                        {ch.chineseNumber} {ch.title}
                      </span>
                    </button>

                    {/* Sub-sections */}
                    <div className="pl-3 space-y-0.5 ml-2 border-l border-stone-200/80">
                      {ch.sections.map((sec) => {
                        const isSecActive = activeSectionId === sec.id;
                        return (
                          <button
                            key={sec.id}
                            onClick={() => scrollToSection(sec.id)}
                            className={`w-full text-left py-1 px-2 rounded-md transition-all flex items-center justify-between text-[11.5px] cursor-pointer focus:outline-none ${
                              isSecActive
                                ? 'text-[#6438FF] font-medium bg-purple-50/70'
                                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                            }`}
                          >
                            <span className="truncate">
                              {sec.sectionNumber} {sec.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Center & Main: Clean Word Document Editor Canvas */}
        <main className="flex-1 w-full max-w-[880px] mx-auto min-w-0">
          {/* Word Document Paper Sheet */}
          <div className="bg-white rounded-sm border border-stone-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.05),0_8px_20px_-6px_rgba(0,0,0,0.04)] px-8 py-12 sm:px-14 sm:py-16 md:px-18 md:py-20 relative transition-all min-h-[960px]">
            {/* Document Header - Clean Word Title, strictly NO dividers or horizontal lines */}
            <header className="text-center pt-2 pb-10">
              <h1 className="font-serif-doc text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                云栖科创中心办公楼物业服务项目
              </h1>
              <p className="font-serif-doc text-sm sm:text-base text-stone-600 mt-2 font-normal">
                技术标综合实施方案与质量保障文件
              </p>
            </header>

            {/* Continuous Chapters - Clean Word Document Flow without artificial dividers */}
            <div className="space-y-10">
              {chapters.map((chapter, chIdx) => (
                <section key={chapter.id} id={chapter.id} className="scroll-mt-20 space-y-6">
                  {/* Chapter Header - Standard Word Heading without underline border */}
                  <div className="pt-4 pb-1">
                    <h2 className="font-serif-doc text-lg sm:text-xl font-bold text-stone-950 tracking-normal">
                      {chapter.chineseNumber}　{chapter.title}
                    </h2>
                  </div>

                  {/* Chapter Sections */}
                  {chapter.sections.map((section, sIdx) => (
                    <div
                      key={section.id}
                      id={section.id}
                      data-section-id={section.id}
                      className="scroll-mt-20 space-y-4"
                    >
                      {/* Section Title - Clean Word Subheading without decoration lines */}
                      <h3 className="font-serif-doc text-[15px] sm:text-base font-bold text-stone-900 pt-3 flex items-center gap-2">
                        <span>{section.sectionNumber}</span>
                        <span>{section.title}</span>
                      </h3>

                      {/* Section Paragraphs with clean hover interaction & vertical indicator */}
                      <div className="space-y-4 text-stone-850 text-[15px] leading-[1.85] font-serif-doc text-justify">
                        {section.paragraphs.map((paraText, pIdx) => {
                          const isFirstParagraph = chIdx === 0 && sIdx === 0 && pIdx === 0;

                          const isHovered =
                            hoveredParagraph?.chapterId === chapter.id &&
                            hoveredParagraph?.sectionId === section.id &&
                            hoveredParagraph?.pIndex === pIdx;

                          const isToolbarOpen =
                            activeToolbar?.chapterId === chapter.id &&
                            activeToolbar?.sectionId === section.id &&
                            activeToolbar?.pIndex === pIdx;

                          const isHighlighted =
                            highlightedParagraph?.chapterId === chapter.id &&
                            highlightedParagraph?.sectionId === section.id &&
                            highlightedParagraph?.pIndex === pIdx;

                          const isEditing =
                            editingParagraph?.chapterId === chapter.id &&
                            editingParagraph?.sectionId === section.id &&
                            editingParagraph?.pIndex === pIdx;

                          const attachedGraphic =
                            section.paragraphGraphics?.[pIdx] ||
                            (pIdx === section.paragraphs.length - 1 ? section.insertedGraphic : null);

                          return (
                            <div
                              key={pIdx}
                              onMouseEnter={() => {
                                if (leaveTimeoutRef.current) {
                                  clearTimeout(leaveTimeoutRef.current);
                                  leaveTimeoutRef.current = null;
                                }
                                setHoveredParagraph({
                                  chapterId: chapter.id,
                                  sectionId: section.id,
                                  pIndex: pIdx,
                                });
                              }}
                              onMouseLeave={() => {
                                if (!isToolbarOpen) {
                                  leaveTimeoutRef.current = setTimeout(() => {
                                    setHoveredParagraph(null);
                                  }, 220);
                                }
                              }}
                              className={`relative pl-12 -ml-12 pr-2 py-1 transition-colors rounded-sm group ${
                                isHighlighted
                                  ? 'bg-purple-50/90 ring-1 ring-[#6438FF]/40 duration-300'
                                  : isHovered || isToolbarOpen
                                  ? 'bg-stone-50/80'
                                  : ''
                              }`}
                            >
                              {/* Left Paragraph Scope Vertical Line (段落竖线表示范围) */}
                              <div
                                className={`absolute left-9 top-1 bottom-1 w-[2.5px] rounded-full transition-all ${
                                  isHovered || isToolbarOpen
                                    ? 'bg-[#6438FF] opacity-100'
                                    : 'bg-transparent opacity-0'
                                }`}
                              />

                              {/* Interactive First-Time Experience Onboarding Tooltip */}
                              <AnimatePresence>
                                {isFirstParagraph && showOnboardingTip && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute left-10 -top-8.5 z-30 flex items-center gap-2 px-2.5 py-1.5 bg-stone-900 text-white rounded-lg shadow-lg text-xs pointer-events-auto select-none"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6438FF] animate-ping shrink-0" />
                                    <span className="text-[11.5px] font-medium whitespace-nowrap">
                                      点击段落左侧 AI 按钮，可体验智能扩写与润色工具
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowOnboardingTip(false);
                                      }}
                                      className="text-stone-400 hover:text-white p-0.5 ml-0.5 cursor-pointer"
                                      title="关闭提示"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                    <div className="absolute left-3.5 -bottom-1 w-2 h-2 bg-stone-900 rotate-45" />
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Left Gutter: Business Stylish AI Badge with generous hover bridge */}
                              <div
                                className={`absolute left-1.5 top-1.5 transition-all ${
                                  isHovered || isToolbarOpen || (isFirstParagraph && showOnboardingTip)
                                    ? 'opacity-100 scale-100 pointer-events-auto'
                                    : 'opacity-0 scale-90 pointer-events-none'
                                }`}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowOnboardingTip(false);
                                    if (isToolbarOpen) {
                                      setActiveToolbar(null);
                                    } else {
                                      setActiveToolbar({
                                        chapterId: chapter.id,
                                        sectionId: section.id,
                                        pIndex: pIdx,
                                      });
                                    }
                                  }}
                                  title="调出段落 AI 助手"
                                  className={`px-1.5 py-0.5 rounded-[5px] flex items-center justify-center transition-all cursor-pointer shadow-2xs select-none ${
                                    isToolbarOpen
                                      ? 'bg-[#6438FF] text-white ring-2 ring-[#6438FF]/30'
                                      : isFirstParagraph && showOnboardingTip
                                      ? 'bg-purple-50 text-[#6438FF] border border-[#6438FF] ring-2 ring-[#6438FF]/20 animate-pulse'
                                      : 'bg-white text-[#6438FF] border border-[#6438FF]/35 hover:bg-[#6438FF] hover:text-white hover:border-[#6438FF]'
                                  }`}
                                >
                                  <span className="text-[10px] font-bold font-sans tracking-wide leading-none">
                                    AI
                                  </span>
                                </button>
                              </div>

                              {/* Floating AI Toolbar (点击之后出工具栏，工具栏里有各个功能) */}
                              <AnimatePresence>
                                {isToolbarOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-8 -top-11 z-30 flex items-center gap-1 p-1 bg-white rounded-lg border border-stone-200 shadow-lg ring-1 ring-black/5"
                                  >
                                    <button
                                      onClick={() =>
                                        handleOpenAiModal(
                                          chapter.id,
                                          section.id,
                                          pIdx,
                                          'expand',
                                          paraText
                                        )
                                      }
                                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-stone-700 hover:text-[#6438FF] hover:bg-purple-50 transition-colors cursor-pointer"
                                    >
                                      <Sparkles className="w-3 h-3 text-[#6438FF]" />
                                      <span>AI 扩写</span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleOpenAiModal(
                                          chapter.id,
                                          section.id,
                                          pIdx,
                                          'polish',
                                          paraText
                                        )
                                      }
                                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-stone-700 hover:text-[#6438FF] hover:bg-purple-50 transition-colors cursor-pointer"
                                    >
                                      <Wand2 className="w-3 h-3 text-purple-600" />
                                      <span>段落润色</span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleOpenAiModal(
                                          chapter.id,
                                          section.id,
                                          pIdx,
                                          'ppt',
                                          paraText
                                        )
                                      }
                                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-stone-700 hover:text-[#6438FF] hover:bg-purple-50 transition-colors cursor-pointer"
                                    >
                                      <BarChart2 className="w-3 h-3 text-blue-600" />
                                      <span>PPT 架构图</span>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleOpenAiModal(
                                          chapter.id,
                                          section.id,
                                          pIdx,
                                          'photo',
                                          paraText
                                        )
                                      }
                                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-stone-700 hover:text-[#6438FF] hover:bg-purple-50 transition-colors cursor-pointer"
                                    >
                                      <ImageIcon className="w-3 h-3 text-emerald-600" />
                                      <span>现场配图</span>
                                    </button>

                                    <div className="w-px h-3.5 bg-stone-200 mx-0.5" />

                                    <button
                                      onClick={() => {
                                        setEditingParagraph({
                                          chapterId: chapter.id,
                                          sectionId: section.id,
                                          pIndex: pIdx,
                                        });
                                        setEditingDraftText(paraText);
                                        setActiveToolbar(null);
                                      }}
                                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                                      title="手动编辑段落"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>编辑</span>
                                    </button>

                                    <button
                                      onClick={() => setActiveToolbar(null)}
                                      className="p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer ml-0.5"
                                      title="关闭工具栏"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Paragraph Content (or inline textarea if editing) */}
                              {isEditing ? (
                                <div className="space-y-2 py-1">
                                  <textarea
                                    value={editingDraftText}
                                    onChange={(e) => setEditingDraftText(e.target.value)}
                                    rows={3}
                                    className="w-full text-xs sm:text-sm p-3 rounded-lg border border-purple-400 focus:outline-none focus:ring-2 focus:ring-[#6438FF]/30 font-serif-doc leading-relaxed bg-white"
                                    autoFocus
                                  />
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setEditingParagraph(null)}
                                      className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded-md cursor-pointer"
                                    >
                                      取消
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleSaveInlineEdit(chapter.id, section.id, pIdx)
                                      }
                                      className="px-3 py-1 text-xs font-medium text-white bg-[#6438FF] hover:bg-[#5329E6] rounded-md cursor-pointer"
                                    >
                                      保存文本
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="indent-[2em] text-stone-850 leading-[1.85] font-serif-doc">
                                  {paraText}
                                </p>
                              )}

                              {/* Attached Graphic inserted beneath this specific paragraph */}
                              {attachedGraphic === 'ppt' && (
                                <div className="my-4 relative group/graphic">
                                  <button
                                    onClick={() =>
                                      handleRemoveParagraphGraphic(
                                        chapter.id,
                                        section.id,
                                        pIdx
                                      )
                                    }
                                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white text-xs opacity-0 group-hover/graphic:opacity-100 transition-opacity cursor-pointer shadow-md"
                                    title="移除此图"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                  <PptManagementDiagram />
                                </div>
                              )}

                              {attachedGraphic === 'photo' && (
                                <div className="my-4 relative group/graphic">
                                  <button
                                    onClick={() =>
                                      handleRemoveParagraphGraphic(
                                        chapter.id,
                                        section.id,
                                        pIdx
                                      )
                                    }
                                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white text-xs opacity-0 group-hover/graphic:opacity-100 transition-opacity cursor-pointer shadow-md"
                                    title="移除此图"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                  <SiteInspectionPhoto />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Section Table if present */}
                      {section.table && (
                        <StyledTable
                          title={section.table.title}
                          headers={section.table.headers}
                          rows={section.table.rows}
                          style={tableStyle}
                          color={tableColor}
                        />
                      )}

                      {/* Section Flowchart if present */}
                      {section.flowSteps && (
                        <FlowchartDiagram steps={section.flowSteps} color={tableColor} />
                      )}
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </div>

          {/* Floating Centered Action Button: 偏居中主按钮，不占整行 */}
          <div className="sticky bottom-6 z-30 flex justify-center pointer-events-none mt-8">
            <button
              onClick={onNavigateDownload}
              className="pointer-events-auto flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold text-white bg-[#6438FF] hover:bg-[#5329E6] shadow-[0_8px_24px_rgba(100,56,255,0.3)] transition-all cursor-pointer focus:outline-none"
            >
              <span>下一步：下载方案</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      </div>

      {/* AI Tool Action Modal Dialog (点击功能弹窗处理，确认后回显内容到正文里) */}
      <AnimatePresence>
        {modalState && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl border border-stone-200 p-6 max-w-2xl w-full shadow-2xl space-y-5"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#6438FF] flex items-center justify-center">
                    {modalState.toolType === 'expand' && <Sparkles className="w-4 h-4" />}
                    {modalState.toolType === 'polish' && <Wand2 className="w-4 h-4" />}
                    {modalState.toolType === 'ppt' && <BarChart2 className="w-4 h-4" />}
                    {modalState.toolType === 'photo' && <ImageIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">
                      {modalState.toolType === 'expand' && 'AI 段落扩写与方案细化'}
                      {modalState.toolType === 'polish' && 'AI 段落专业润色与规范'}
                      {modalState.toolType === 'ppt' && '插入 PPT 架构协同图'}
                      {modalState.toolType === 'photo' && '生成并插入现场作业实景配图'}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setModalState(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                  title="关闭 (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Original Paragraph Context */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-stone-500">原正文段落：</div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 leading-relaxed font-serif-doc max-h-24 overflow-y-auto">
                  {modalState.originalText}
                </div>
              </div>

              {/* AI Processing Result Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#6438FF]">
                    {modalState.toolType === 'expand' || modalState.toolType === 'polish'
                      ? 'AI 处理生成结果（支持直接修改调整）：'
                      : '图表内容渲染预览：'}
                  </span>
                  <span className="text-[11px] font-mono text-stone-600">
                    确认后将即时回显至正文
                  </span>
                </div>

                {/* Text Generation / Polishing */}
                {(modalState.toolType === 'expand' || modalState.toolType === 'polish') && (
                  <textarea
                    value={modalState.generatedText}
                    onChange={(e) =>
                      setModalState({ ...modalState, generatedText: e.target.value })
                    }
                    rows={5}
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-[#6438FF]/30 font-serif-doc leading-relaxed bg-[#FAF9F6] text-stone-900 shadow-inner"
                  />
                )}

                {/* PPT Diagram Preview */}
                {modalState.toolType === 'ppt' && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 max-h-[260px] overflow-y-auto">
                    <PptManagementDiagram className="my-0 max-w-full" />
                  </div>
                )}

                {/* Photo Preview */}
                {modalState.toolType === 'photo' && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 max-h-[260px] overflow-y-auto">
                    <SiteInspectionPhoto className="my-0 max-w-full" />
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  onClick={() => setModalState(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmModal}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#6438FF] hover:bg-[#5329E6] shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>确认回显到正文</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
