import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import {
  ChapterContent,
  GenerationStep,
  ImageStyle,
  LengthLevel,
  TableColor,
  TableStyle,
} from '../types';
import {
  LENGTH_CONFIGS,
  TABLE_COLORS,
  CHINESE_NUMERALS,
  createDefaultChapter,
  createDefaultSection,
} from '../data/initialContent';
import {
  StyledTable,
  PptManagementDiagram,
  SiteInspectionPhoto,
} from './Infographics';

interface GenerationViewProps {
  currentStep: GenerationStep;
  onStepChange: (step: GenerationStep) => void;
  draftLengthLevel: LengthLevel;
  onDraftLengthChange: (level: LengthLevel) => void;
  draftImageStyle: ImageStyle;
  onDraftImageStyleChange: (style: ImageStyle) => void;
  draftTableStyle: TableStyle;
  onDraftTableStyleChange: (style: TableStyle) => void;
  draftTableColor: TableColor;
  onDraftTableColorChange: (color: TableColor) => void;
  draftOutline: ChapterContent[];
  onUpdateDraftOutline: (newOutline: ChapterContent[]) => void;
  hasUserModifications: boolean;
  onCompleteGeneration: () => void;
}

const ANALYSIS_SECTIONS = [
  {
    num: '01',
    title: '项目概况与服务目标',
    content:
      '云栖科创中心办公楼物业服务采购，建筑面积约 28,600 平方米，涵盖主办公区、公共走廊、高阶接待会议中心及地下两层停车场。采购方重点要求维持日常办公连续性、VIP会务无感响应及高峰期人流动线高效疏导。',
  },
  {
    num: '02',
    title: '评分要点与废标防范',
    content:
      '技术标权重 45%，核心得分点集中在日常巡检频次与智能化派单闭环、会务保障突发支援预案及特种设备持证上岗证明。严格对照招标文件第二章格式规范，杜绝因格式缺项或签字盖章瑕疵导致废标。',
  },
  {
    num: '03',
    title: '服务范围与关键要求',
    content:
      '服务期为 12 个月，服务内容涵盖客户接待、秩序维护、环境保洁及日常工程维修。重点考核早晚通勤人流高峰疏导、重要会议提前保障以及突发暴雨、停电等应急处置机制。',
  },
];

export const GenerationView: React.FC<GenerationViewProps> = ({
  currentStep,
  onStepChange,
  draftLengthLevel,
  onDraftLengthChange,
  draftImageStyle,
  onDraftImageStyleChange,
  draftTableStyle,
  onDraftTableStyleChange,
  draftTableColor,
  onDraftTableColorChange,
  draftOutline,
  onUpdateDraftOutline,
  hasUserModifications,
  onCompleteGeneration,
}) => {
  // File state
  const [uploadedFile, setUploadedFile] = useState({
    name: '云栖科创中心办公楼物业服务招标文件.docx',
    size: '4.2 MB',
    pages: 48,
    time: '刚刚',
  });

  // Streaming state for Step 1
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedChars, setStreamedChars] = useState(9999);
  const [streamProgress, setStreamProgress] = useState(100);

  // Outline Editing state for Step 3
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionText, setEditingSectionText] = useState('');

  // Generation Loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);

  // Fast streaming simulator
  const runStreamingAnalysis = () => {
    setIsStreaming(true);
    setStreamedChars(0);
    setStreamProgress(0);

    const totalChars = ANALYSIS_SECTIONS.reduce(
      (sum, s) => sum + s.content.length,
      0
    );
    let count = 0;

    const interval = setInterval(() => {
      count += 16;
      setStreamedChars(count);
      const prog = Math.min(100, Math.floor((count / totalChars) * 100));
      setStreamProgress(prog);

      if (count >= totalChars) {
        clearInterval(interval);
        setIsStreaming(false);
        setStreamedChars(totalChars);
        setStreamProgress(100);
      }
    }, 40);
  };

  const currentLength =
    LENGTH_CONFIGS.find((c) => c.level === draftLengthLevel) ||
    LENGTH_CONFIGS[3];

  const handleStartOutlineGeneration = () => {
    onStepChange('outline');
  };

  const handleTriggerFinalGeneration = () => {
    if (hasUserModifications) {
      setShowOverwriteModal(true);
    } else {
      executeFinalGeneration();
    }
  };

  const executeFinalGeneration = () => {
    setIsGenerating(true);
    setShowOverwriteModal(false);

    setTimeout(() => {
      setIsGenerating(false);
      onCompleteGeneration();
    }, 1000);
  };

  // Outline helper functions
  const reindexOutline = (outline: ChapterContent[]): ChapterContent[] => {
    return outline.map((ch, chIdx) => ({
      ...ch,
      chapterNumber: chIdx + 1,
      chineseNumber: `第${CHINESE_NUMERALS[chIdx] || chIdx + 1}章`,
      sections: ch.sections.map((sec, secIdx) => ({
        ...sec,
        sectionNumber: `${CHINESE_NUMERALS[chIdx] || chIdx + 1}.${secIdx + 1}`,
      })),
    }));
  };

  const handleAddChapter = () => {
    const newIdx = draftOutline.length + 1;
    const newCh = createDefaultChapter(
      newIdx,
      `新策划重点章节 ${CHINESE_NUMERALS[newIdx - 1] || newIdx}`
    );
    onUpdateDraftOutline(reindexOutline([...draftOutline, newCh]));
  };

  const handleDeleteChapter = (chId: string) => {
    const filtered = draftOutline.filter((c) => c.id !== chId);
    onUpdateDraftOutline(reindexOutline(filtered));
  };

  const handleSaveChapterTitle = (chId: string) => {
    if (!editingTitleText.trim()) return;
    const updated = draftOutline.map((c) =>
      c.id === chId ? { ...c, title: editingTitleText.trim() } : c
    );
    onUpdateDraftOutline(updated);
    setEditingChapterId(null);
  };

  const handleAddSection = (chId: string) => {
    const ch = draftOutline.find((c) => c.id === chId);
    if (!ch) return;
    const newSecIdx = ch.sections.length + 1;
    const newSec = createDefaultSection(
      ch.chapterNumber,
      newSecIdx,
      `新拟定技术执行要点 ${newSecIdx}`
    );
    const updated = draftOutline.map((c) => {
      if (c.id === chId) {
        return { ...c, sections: [...c.sections, newSec] };
      }
      return c;
    });
    onUpdateDraftOutline(reindexOutline(updated));
  };

  const handleDeleteSection = (chId: string, secId: string) => {
    const updated = draftOutline.map((c) => {
      if (c.id === chId) {
        return {
          ...c,
          sections: c.sections.filter((s) => s.id !== secId),
        };
      }
      return c;
    });
    onUpdateDraftOutline(reindexOutline(updated));
  };

  const handleSaveSectionTitle = (chId: string, secId: string) => {
    if (!editingSectionText.trim()) return;
    const updated = draftOutline.map((c) => {
      if (c.id === chId) {
        return {
          ...c,
          sections: c.sections.map((s) =>
            s.id === secId ? { ...s, title: editingSectionText.trim() } : s
          ),
        };
      }
      return c;
    });
    onUpdateDraftOutline(updated);
    setEditingSectionId(null);
  };

  const totalSectionsCount = draftOutline.reduce(
    (acc, ch) => acc + ch.sections.length,
    0
  );
  const isOutlineEmpty = draftOutline.length === 0;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 space-y-6 pb-20">
      {/* SUB-STATE 1: 上传文件与流式解析 */}
      {currentStep === 'analysis' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Card: 纯粹使用柔和底色与间距拉开层级，去除多余硬边框 */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-8">
            {/* Header: Document Meta & Upload Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6438FF] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  DOCX
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-semibold text-stone-900 text-sm tracking-tight">
                    {uploadedFile.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span>
                      {uploadedFile.size} · {uploadedFile.pages} 页 ·{' '}
                      {uploadedFile.time}
                    </span>
                    <span>·</span>
                    {isStreaming ? (
                      <span className="text-[#6438FF] font-medium animate-pulse">
                        AI 正在解析 ({streamProgress}%)
                      </span>
                    ) : (
                      <span className="text-stone-600 font-medium">
                        已提取 3 项核心履约要素
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={runStreamingAnalysis}
                  disabled={isStreaming}
                  className="px-3 py-1.5 rounded-lg text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-40"
                >
                  重新解析
                </button>

                <label className="px-3 py-1.5 rounded-lg bg-stone-100/80 hover:bg-stone-200/70 text-xs font-medium text-stone-800 cursor-pointer transition-colors">
                  <span>更换文件</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFile({
                          name: file.name,
                          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                          pages: Math.max(12, Math.floor(file.size / 300000)),
                          time: '刚刚',
                        });
                        runStreamingAnalysis();
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Dynamic Subtle Progress Hairline */}
            {isStreaming && (
              <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden -mt-4">
                <div
                  className="bg-[#6438FF] h-full transition-all duration-100 rounded-full"
                  style={{ width: `${streamProgress}%` }}
                />
              </div>
            )}

            {/* Editorial Analysis */}
            <div className="space-y-8 divide-y divide-stone-100">
              {ANALYSIS_SECTIONS.map((sec, idx) => {
                const prevChars = ANALYSIS_SECTIONS.slice(0, idx).reduce(
                  (sum, s) => sum + s.content.length,
                  0
                );
                const currentLimit = Math.max(0, streamedChars - prevChars);
                const isFullyRevealed = currentLimit >= sec.content.length;
                const isTypingNow =
                  isStreaming && currentLimit > 0 && !isFullyRevealed;
                const visibleText = isStreaming
                  ? sec.content.slice(0, currentLimit)
                  : sec.content;

                return (
                  <div key={sec.num} className="space-y-2 pt-6 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#6438FF]">
                        {sec.num}
                      </span>
                      <h4 className="font-semibold text-stone-900 text-sm">
                        {sec.title}
                      </h4>
                      {isTypingNow && (
                        <span className="text-[11px] font-mono text-[#6438FF] animate-pulse">
                          解析中...
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed max-w-4xl min-h-[1.5rem]">
                      {visibleText}
                      {isTypingNow && (
                        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#6438FF] align-middle animate-pulse" />
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating Centered Action Button: 偏居中主按钮，不占整行 */}
          <div className="sticky bottom-6 z-30 flex justify-center pointer-events-none mt-8">
            <button
              onClick={() => onStepChange('settings')}
              disabled={isStreaming}
              className="pointer-events-auto flex items-center gap-2 px-7 py-3 rounded-full text-xs font-semibold text-white bg-[#6438FF] hover:bg-[#5329E6] shadow-[0_8px_24px_rgba(100,56,255,0.3)] transition-all cursor-pointer disabled:opacity-40"
            >
              <span>下一步：篇幅版式</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* SUB-STATE 2: 标书设置 */}
      {currentStep === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Main Grid: Left Controls (7 cols) + Right Preview Specimen (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-8">
              {/* Group 1: 篇幅规格 */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#6438FF]">
                    01
                  </span>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    篇幅规格
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div className="text-xs text-stone-500">目标交付规模：</div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900">
                        {currentLength.name}
                      </span>
                      <span className="text-xs text-stone-500 ml-2">
                        {currentLength.pages} · {currentLength.desc}
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={draftLengthLevel}
                    onChange={(e) =>
                      onDraftLengthChange(Number(e.target.value) as LengthLevel)
                    }
                    className="w-full accent-[#6438FF] cursor-pointer h-2 bg-stone-100 rounded-lg"
                  />

                  <div className="grid grid-cols-7 gap-1 text-[11px] text-center">
                    {LENGTH_CONFIGS.map((cfg) => {
                      const isSelected = cfg.level === draftLengthLevel;
                      return (
                        <button
                          key={cfg.level}
                          onClick={() => onDraftLengthChange(cfg.level)}
                          className={`py-1 rounded transition-colors text-center cursor-pointer focus:outline-none ${
                            isSelected
                              ? 'text-[#6438FF] font-bold'
                              : 'text-stone-400 hover:text-stone-700'
                          }`}
                        >
                          <div className="text-[11px] leading-tight">
                            {cfg.name}
                          </div>
                          <div className="text-[10px] font-mono scale-90 -mt-0.5">
                            {cfg.pages.replace(' 页', '')}p
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Group 2: 配图模式 - 纯色块拉开层级，无冗余图标 */}
              <div className="space-y-3.5 pt-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#6438FF]">
                    02
                  </span>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    配图模式
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'enhanced', label: '增强配图' },
                    { id: 'rich', label: '丰富配图' },
                    { id: 'basic', label: '基础配图' },
                    { id: 'none', label: '纯文字' },
                  ].map((styleOpt) => {
                    const isSelected = draftImageStyle === styleOpt.id;
                    return (
                      <button
                        key={styleOpt.id}
                        onClick={() =>
                          onDraftImageStyleChange(styleOpt.id as ImageStyle)
                        }
                        className={`py-2.5 px-3 rounded-xl text-center text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-stone-900 text-white font-medium shadow-xs'
                            : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/60'
                        }`}
                      >
                        {styleOpt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 3: 表格规格与主题色 */}
              <div className="space-y-3.5 pt-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#6438FF]">
                    03
                  </span>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    表格规格与主题色
                  </h3>
                </div>

                {/* Table Styles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'clean', name: '纯净版' },
                    { id: 'header', name: '表头强化' },
                    { id: 'zebra', name: '斑马条纹' },
                    { id: 'solid', name: '全底色白框' },
                  ].map((tStyle) => {
                    const isSelected = draftTableStyle === tStyle.id;
                    return (
                      <button
                        key={tStyle.id}
                        onClick={() =>
                          onDraftTableStyleChange(tStyle.id as TableStyle)
                        }
                        className={`py-2 px-2.5 rounded-xl text-center text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-stone-900 text-white font-medium shadow-xs'
                            : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/60'
                        }`}
                      >
                        {tStyle.name}
                      </button>
                    );
                  })}
                </div>

                {/* Color swatches */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {Object.values(TABLE_COLORS).map((c) => {
                    const isSelected = draftTableColor === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() =>
                          onDraftTableColorChange(c.id as TableColor)
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white ring-2 ring-stone-900 font-semibold shadow-xs text-stone-900'
                            : 'bg-stone-100/70 text-stone-600 hover:bg-stone-200/60'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[11.5px]">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Live Specimen Paper (5 cols) */}
            <div className="lg:col-span-5 sticky top-20 z-10">
              <div className="bg-stone-100/80 rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex items-center justify-between px-2 pb-1 text-xs">
                  <span className="font-medium text-stone-700">
                    版式效果即时预览
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    {currentLength.pages}
                  </span>
                </div>

                {/* Editorial Paper Canvas */}
                <div className="p-6 rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] font-serif-doc text-stone-800 text-xs leading-relaxed space-y-3">
                  <div className="font-bold text-sm text-stone-900 pb-1 border-b border-stone-100 flex items-center justify-between">
                    <span>1.1 项目概况与服务目标</span>
                  </div>

                  <p className="indent-[2em] text-stone-700">
                    本项目为云栖科创中心办公楼物业服务，服务面积约 28,600
                    平方米，服务期为 12
                    个月。办公楼包含办公区、公共走廊、会议中心及地下停车场。
                  </p>

                  {/* Reactive Table Specimen */}
                  <StyledTable
                    title="表 1-1  服务范围与实施安排"
                    headers={['事项', '执行安排', '检查与记录']}
                    rows={[
                      ['公共区域保洁', '分区作业，错峰清洁', '每日巡查，重点加密'],
                      ['设施设备维护', '日常巡检，异常派单', '形成巡检与维修记录'],
                      ['会务服务保障', '会前准备，会中值守', '会前30分钟完成检查'],
                    ]}
                    style={draftTableStyle}
                    color={draftTableColor}
                    className="my-2"
                  />

                  {/* Reactive Image Style Preview */}
                  {draftImageStyle !== 'none' && (
                    <div className="mt-3 pt-2 border-t border-stone-100">
                      {draftImageStyle === 'rich' ||
                      draftImageStyle === 'enhanced' ? (
                        <SiteInspectionPhoto
                          caption="图 1-1 办公楼大堂高峰期秩序维护巡检现场"
                          color={draftTableColor}
                        />
                      ) : (
                        <PptManagementDiagram
                          caption="图 1-1 物业日常巡检与品质核查管理闭环"
                          color={draftTableColor}
                        />
                      )}
                    </div>
                  )}

                  {draftImageStyle === 'none' && (
                    <div className="p-2 rounded-lg bg-stone-50 text-[11px] text-stone-400 font-sans text-center">
                      纯文字排版模式：不插入图表，保持条例纯净
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Centered Action Island: 底部偏居中紧凑胶囊 */}
          <div className="sticky bottom-6 z-30 flex justify-center pointer-events-none mt-8">
            <div className="pointer-events-auto inline-flex items-center gap-2 p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
              <button
                onClick={() => onStepChange('analysis')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>

              <button
                onClick={handleStartOutlineGeneration}
                className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold text-white bg-[#6438FF] hover:bg-[#5329E6] shadow-sm transition-all cursor-pointer"
              >
                <span>下一步：大纲确认</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* SUB-STATE 3: 大纲确认 */}
      {currentStep === 'outline' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-8">
            {/* Header: Document Meta & Add Chapter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-stone-900 text-sm tracking-tight">
                    标书大纲编排与核定
                  </h3>
                  <span className="text-xs text-stone-400">
                    · {draftOutline.length} 个章节 · {totalSectionsCount} 项要点
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  点击标题可直接重命名或微调要点，确认后以此框架编排方案正文
                </div>
              </div>

              <button
                onClick={handleAddChapter}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-stone-900 hover:bg-black transition-colors cursor-pointer self-start sm:self-auto"
              >
                新增章节
              </button>
            </div>

            {/* Empty Outline State */}
            {isOutlineEmpty && (
              <div className="py-12 border-2 border-dashed border-stone-200 rounded-xl text-center space-y-3">
                <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                <div className="text-xs font-semibold text-stone-800">
                  大纲为空，请至少添加一个章节
                </div>
                <button
                  onClick={handleAddChapter}
                  className="px-4 py-2 rounded-full bg-[#6438FF] text-white text-xs font-semibold hover:bg-[#5329E6] cursor-pointer"
                >
                  添加初始章节
                </button>
              </div>
            )}

            {/* Continuous Flat Chapter Outlines */}
            <div className="space-y-8 divide-y divide-stone-100">
              {draftOutline.map((ch) => {
                const isEditingChTitle = editingChapterId === ch.id;

                return (
                  <div key={ch.id} className="pt-6 first:pt-0 space-y-3">
                    {/* Chapter Header Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="font-mono text-xs font-bold text-[#6438FF]">
                          第{ch.chapterNumber}章
                        </span>

                        {isEditingChTitle ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingTitleText}
                              onChange={(e) =>
                                setEditingTitleText(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                  handleSaveChapterTitle(ch.id);
                                if (e.key === 'Escape')
                                  setEditingChapterId(null);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#6438FF] bg-white focus:outline-none w-full max-w-md"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveChapterTitle(ch.id)}
                              className="px-2.5 py-1 rounded-md bg-[#6438FF] text-white text-xs font-semibold cursor-pointer"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => setEditingChapterId(null)}
                              className="px-2 py-1 rounded-md text-stone-600 text-xs hover:bg-stone-200 cursor-pointer"
                            >
                              取消
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 min-w-0">
                            <h4 className="font-semibold text-sm text-stone-900 truncate">
                              {ch.title}
                            </h4>
                            <button
                              onClick={() => {
                                setEditingChapterId(ch.id);
                                setEditingTitleText(ch.title);
                              }}
                              className="p-1 text-stone-300 hover:text-stone-700 transition-colors cursor-pointer"
                              title="重命名章节标题"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleAddSection(ch.id)}
                          className="px-2.5 py-1 rounded-md text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        >
                          添加要点
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(ch.id)}
                          className="p-1 rounded text-stone-300 hover:text-red-600 transition-colors cursor-pointer"
                          title="删除此章节"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Section Rows */}
                    <div className="space-y-1 pl-4 sm:pl-6">
                      {ch.sections.map((sec) => {
                        const isEditingSec = editingSectionId === sec.id;

                        return (
                          <div
                            key={sec.id}
                            className="group/sec py-2 px-3 rounded-xl hover:bg-stone-50 transition-colors flex items-start justify-between gap-3 text-xs"
                          >
                            {isEditingSec ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={editingSectionText}
                                  onChange={(e) =>
                                    setEditingSectionText(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter')
                                      handleSaveSectionTitle(ch.id, sec.id);
                                    if (e.key === 'Escape')
                                      setEditingSectionId(null);
                                  }}
                                  className="px-2 py-1 text-xs rounded-lg border border-[#6438FF] bg-white focus:outline-none w-full max-w-sm"
                                  autoFocus
                                />
                                <button
                                  onClick={() =>
                                    handleSaveSectionTitle(ch.id, sec.id)
                                  }
                                  className="px-2 py-1 rounded-md bg-[#6438FF] text-white text-xs cursor-pointer"
                                >
                                  保存
                                </button>
                                <button
                                  onClick={() => setEditingSectionId(null)}
                                  className="px-2 py-1 rounded-md text-stone-600 text-xs hover:bg-stone-200 cursor-pointer"
                                >
                                  取消
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-stone-400 font-medium">
                                  {sec.sectionNumber}
                                </span>
                                <span className="text-stone-800 font-medium truncate">
                                  {sec.title}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingSectionId(sec.id);
                                    setEditingSectionText(sec.title);
                                  }}
                                  className="opacity-0 group-hover/sec:opacity-100 p-0.5 text-stone-300 hover:text-stone-700 transition-all cursor-pointer"
                                  title="修改要点标题"
                                >
                                  <Edit2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() =>
                                handleDeleteSection(ch.id, sec.id)
                              }
                              className="opacity-0 group-hover/sec:opacity-100 p-1 text-stone-300 hover:text-red-600 transition-all cursor-pointer"
                              title="删除此要点"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating Centered Action Island: 底部偏居中紧凑胶囊 */}
          <div className="sticky bottom-6 z-30 flex justify-center pointer-events-none mt-8">
            <div className="pointer-events-auto inline-flex items-center gap-2 p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
              <button
                onClick={() => onStepChange('settings')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>上一步</span>
              </button>

              <button
                onClick={handleTriggerFinalGeneration}
                disabled={isGenerating || isOutlineEmpty}
                className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold text-white bg-[#6438FF] hover:bg-[#5329E6] shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {isGenerating
                    ? '正在编排生成标书...'
                    : isOutlineEmpty
                    ? '大纲不能为空'
                    : '确认大纲，生成标书正文'}
                </span>
                {!isGenerating && !isOutlineEmpty && (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overwrite Confirmation Modal */}
      <AnimatePresence>
        {showOverwriteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <h3 className="text-sm font-bold text-stone-900">
                确认覆盖重新生成？
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                检测到您已经在“标书正文”中手动编辑或调用 AI
                优化过部分段落。重新生成将按当前大纲覆盖所有段落内容。
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowOverwriteModal(false)}
                  className="px-4 py-2 rounded-full text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={executeFinalGeneration}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#6438FF] hover:bg-[#5329E6] cursor-pointer"
                >
                  确认覆盖生成
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
