import React, { useState } from 'react';
import {
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { DownloadFormatSettings, TableColor, TableStyle } from '../types';
import { TABLE_COLORS } from '../data/initialContent';
import { StyledTable, FlowchartDiagram } from './Infographics';

interface DownloadViewProps {
  settings: DownloadFormatSettings;
  onUpdateSettings: (
    updater: (prev: DownloadFormatSettings) => DownloadFormatSettings
  ) => void;
  onNavigateDocument?: () => void;
}

export const DownloadView: React.FC<DownloadViewProps> = ({
  settings,
  onUpdateSettings,
  onNavigateDocument,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const marginClasses =
    settings.marginMode === 'compact'
      ? 'p-6 sm:p-8 md:p-10'
      : 'p-8 sm:p-12 md:p-14';

  const fontClass =
    settings.fontFamily === 'serif' ? 'font-serif-doc' : 'font-sans';

  const bodyTextSizeClass =
    settings.fontSize === 'regular4'
      ? 'text-[15.5px] leading-relaxed'
      : 'text-[13.5px] leading-normal';

  const lineHeightClass =
    settings.lineHeight === '1.5'
      ? 'leading-[1.5]'
      : settings.lineHeight === '1.75'
      ? 'leading-[1.75]'
      : settings.lineHeight === '1.95'
      ? 'leading-[1.95]'
      : 'leading-[2.0]';

  // Export document handler
  const handleExportWord = () => {
    setIsExporting(true);
    setTimeout(() => {
      const filename = '云栖科创中心办公楼物业服务项目_技术标投标文件.docx';
      const docContent = `
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${filename}</title>
        <style>
          body { font-family: ${settings.fontFamily === 'serif' ? 'SimSun, STSong' : 'Microsoft YaHei, SimHei'}; line-height: ${settings.lineHeight}; font-size: ${settings.fontSize === 'regular4' ? '14pt' : '12pt'}; }
          h1 { text-align: center; font-size: 22pt; font-weight: bold; margin-bottom: 20pt; }
          h2 { font-size: 16pt; font-weight: bold; margin-top: 18pt; margin-bottom: 10pt; }
          h3 { font-size: 14pt; font-weight: bold; margin-top: 14pt; margin-bottom: 8pt; }
          p { text-indent: 2em; margin: 8pt 0; text-align: justify; }
          table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
          th, td { border: 1px solid #d1d5db; padding: 6pt 10pt; text-align: left; font-size: 10.5pt; }
          th { background-color: #f3f4f6; font-weight: bold; }
        </style>
        </head>
        <body>
          <h1>云栖科创中心办公楼物业服务项目</h1>
          <p style="text-align:center;text-indent:0;color:#666;">综合物业管理方案（技术标响应文件）</p>
          <hr/>
          <h2>第一章　项目理解与服务总体策划</h2>
          <h3>一、项目概况与服务目标</h3>
          <p>本项目为云栖科创中心办公楼物业服务，服务面积约 28,600 平方米，服务期为 12 个月。办公楼包含办公区、公共走廊、会议中心及地下停车场。方案围绕日常办公连续性与现场服务响应，建立分区域、分时段的管理安排。</p>
          <p>针对早晚通勤人流集中、会议安排临时变化的特点，项目采用“固定岗位值守＋机动人员支援”的服务方式。公共区域作业避开 8:30—9:00 入场高峰，会议保障人员根据当日预约清单提前到位。</p>
          <h2>第二章　项目组织与人员配置</h2>
          <h3>一、管理架构与岗位职责</h3>
          <p>本项目设置项目经理统筹日常服务，下设客服会务、环境保洁、秩序维护及工程维护四个工作组。各工作组设现场负责人，对工作排班、作业质量与问题整改负责。</p>
        </body>
        </html>
      `;

      const blob = new Blob([docContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 700);
  };

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">
      {/* Main Grid: Left Settings (5 cols) + Right Preview (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Settings Card - 通过纯粹底色块和清晰字阶组织，杜绝多余边框与冗余 icon */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-7">
          {/* 01 编号与版式 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#6438FF]">
                01
              </span>
              <h3 className="font-semibold text-stone-900 text-sm">
                编号与版式
              </h3>
            </div>

            {/* 编号规范 */}
            <div className="space-y-1.5">
              <label className="text-xs text-stone-500 font-medium">
                章节编号：
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'chinese',
                    name: '中文传统编号',
                    sample: '第一章 / 一、',
                  },
                  {
                    id: 'numeric',
                    name: '数字多级编号',
                    sample: '1. / 1.1',
                  },
                ].map((s) => {
                  const isSelected = settings.numberScheme === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          numberScheme: s.id as any,
                        }))
                      }
                      className={`py-2 px-3 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white font-medium shadow-xs'
                          : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/60'
                      }`}
                    >
                      <div className="text-xs">{s.name}</div>
                      <div
                        className={`text-[10px] font-mono mt-0.5 ${
                          isSelected ? 'text-stone-300' : 'text-stone-400'
                        }`}
                      >
                        {s.sample}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 页边距 */}
            <div className="space-y-1.5">
              <label className="text-xs text-stone-500 font-medium">
                打印页边距：
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'standard', name: '标准页边距 (25mm)' },
                  { id: 'compact', name: '紧凑页边距 (18mm)' },
                ].map((m) => {
                  const isSelected = settings.marginMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          marginMode: m.id as any,
                        }))
                      }
                      className={`py-2 px-3 rounded-xl text-center text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white font-medium shadow-xs'
                          : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/60'
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 排版模式 */}
            <div className="space-y-1.5">
              <label className="text-xs text-stone-500 font-medium">
                排版模式：
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', name: '常规排版' },
                  { id: 'wrapped', name: '表格包围' },
                  { id: 'editorial', name: '图文精排' },
                ].map((m) => {
                  const isSelected = settings.layoutMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          layoutMode: m.id as any,
                        }))
                      }
                      className={`py-2 px-2.5 rounded-xl text-center text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white font-medium shadow-xs'
                          : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/60'
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 02 字体与行距 */}
          <div className="space-y-3.5 pt-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#6438FF]">
                02
              </span>
              <h3 className="font-semibold text-stone-900 text-sm">
                字体与行距
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-stone-500 font-medium">
                  正文字体：
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      fontFamily: e.target.value as any,
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl bg-stone-100/80 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6438FF] border-none"
                >
                  <option value="serif">思源宋体 (Noto Serif SC)</option>
                  <option value="sans">微软雅黑 (Microsoft YaHei)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-stone-500 font-medium">
                  正文字号：
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      fontSize: e.target.value as any,
                    }))
                  }
                  className="w-full text-xs p-2.5 rounded-xl bg-stone-100/80 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#6438FF] border-none"
                >
                  <option value="small4">小四号 (12pt / 约16px)</option>
                  <option value="regular4">四号 (14pt / 约18.7px)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-500 font-medium">
                段落行间距：
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1.5', '1.75', '1.95', '2.0'].map((lh) => {
                  const isSelected = settings.lineHeight === lh;
                  return (
                    <button
                      key={lh}
                      onClick={() =>
                        onUpdateSettings((prev) => ({
                          ...prev,
                          lineHeight: lh as any,
                        }))
                      }
                      className={`py-2 px-2 rounded-xl text-center text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white font-bold shadow-xs'
                          : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/60'
                      }`}
                    >
                      {lh}x
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 03 表格样式与主题色 */}
          <div className="space-y-3.5 pt-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#6438FF]">
                03
              </span>
              <h3 className="font-semibold text-stone-900 text-sm">
                表格样式与主题色
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'clean', name: '纯净版' },
                { id: 'header', name: '表头强化' },
                { id: 'zebra', name: '斑马条纹' },
                { id: 'solid', name: '全底色' },
              ].map((st) => {
                const isSelected = settings.tableStyle === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        tableStyle: st.id as TableStyle,
                      }))
                    }
                    className={`py-2 px-2 rounded-xl text-center text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white font-medium shadow-xs'
                        : 'bg-stone-100/70 text-stone-700 hover:bg-stone-200/60'
                    }`}
                  >
                    {st.name}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {Object.values(TABLE_COLORS).map((c) => {
                const isSelected = settings.tableColor === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() =>
                      onUpdateSettings((prev) => ({
                        ...prev,
                        tableColor: c.id as TableColor,
                      }))
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-all ${
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

        {/* Right Preview - 真实的纸张悬浮层次，无多余装饰 icon */}
        <div className="lg:col-span-7 sticky top-20 z-10">
          <div className="bg-stone-100/80 rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between px-2 pb-1 text-xs">
              <span className="font-medium text-stone-700">
                排版效果即时预览
              </span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
                <span>
                  {settings.marginMode === 'compact' ? '紧凑边距' : '标准边距'}
                </span>
                <span>·</span>
                <span>
                  {settings.numberScheme === 'chinese' ? '传统中文' : '多级数字'}
                </span>
              </div>
            </div>

            {/* Paper Container */}
            <div
              className={`bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] ${marginClasses} transition-all max-h-[calc(100vh-230px)] overflow-y-auto space-y-6 ${fontClass}`}
            >
              {/* Header */}
              <div
                className={`text-center pb-4 border-b border-stone-100 ${
                  settings.layoutMode === 'editorial' ? 'border-b-2 border-stone-800' : ''
                }`}
              >
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                  云栖科创中心办公楼物业服务项目
                </h2>
                <div className="text-xs text-stone-500 mt-1">
                  综合物业管理方案（技术标响应文件）
                </div>
              </div>

              {/* Chapter 1 */}
              <div className="space-y-3">
                <div className="font-bold text-base text-stone-900 flex items-center justify-between border-b border-stone-100 pb-1">
                  <span>
                    {settings.numberScheme === 'chinese'
                      ? '第一章　项目理解与服务总体策划'
                      : '1. 项目理解与服务总体策划'}
                  </span>
                  <span className="text-[10px] font-sans font-normal text-stone-400">
                    P.01
                  </span>
                </div>

                <div className="font-semibold text-stone-800 text-sm">
                  {settings.numberScheme === 'chinese'
                    ? '一、项目概况与服务目标'
                    : '1.1 项目概况与服务目标'}
                </div>

                <p
                  className={`${bodyTextSizeClass} ${lineHeightClass} text-stone-800 text-justify ${
                    settings.layoutMode === 'editorial'
                      ? 'first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1.5'
                      : 'indent-[2em]'
                  }`}
                >
                  本项目为云栖科创中心办公楼物业服务，服务面积约 28,600
                  平方米，服务期为 12
                  个月。办公楼包含办公区、公共走廊、会议中心及地下停车场。方案围绕日常办公连续性与现场服务响应，建立分区域、分时段的管理安排。
                </p>

                <p
                  className={`${bodyTextSizeClass} ${lineHeightClass} text-stone-800 text-justify indent-[2em]`}
                >
                  针对早晚通勤人流集中、会议安排临时变化的特点，项目采用“固定岗位值守＋机动人员支援”的服务方式。公共区域作业避开
                  8:30—9:00 入场高峰，会议保障人员根据当日预约清单提前到位。
                </p>

                {/* Table */}
                <StyledTable
                  title={
                    settings.numberScheme === 'chinese'
                      ? '表 1-1  服务范围与实施安排'
                      : '表 1.1  服务范围与实施安排'
                  }
                  headers={['事项', '执行安排', '检查与记录']}
                  rows={[
                    ['公共区域保洁', '分区作业，错峰清洁', '每日巡查，重点区域加密'],
                    ['设施设备维护', '日常巡检，异常派单', '形成设备巡检及维修记录'],
                    ['会务服务保障', '会前准备，会中值守', '会前 30 分钟完成场地检查'],
                  ]}
                  style={settings.tableStyle}
                  color={settings.tableColor}
                />
              </div>

              {/* Chapter 2 */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="font-bold text-base text-stone-900 flex items-center justify-between border-b border-stone-100 pb-1">
                  <span>
                    {settings.numberScheme === 'chinese'
                      ? '第二章　项目组织与人员配置'
                      : '2. 项目组织与人员配置'}
                  </span>
                  <span className="text-[10px] font-sans font-normal text-stone-400">
                    P.02
                  </span>
                </div>

                <div className="font-semibold text-stone-800 text-sm">
                  {settings.numberScheme === 'chinese'
                    ? '一、管理架构与岗位职责'
                    : '2.1 管理架构与岗位职责'}
                </div>

                <p
                  className={`${bodyTextSizeClass} ${lineHeightClass} text-stone-800 text-justify indent-[2em]`}
                >
                  本项目设置项目经理统筹日常服务，下设客服会务、环境保洁、秩序维护及工程维护四个工作组。各工作组设现场负责人，对工作排班、作业质量与问题整改负责。
                </p>

                {/* Flowchart */}
                <FlowchartDiagram
                  steps={['岗位落实', '进场交接', '日常值守', '质量复核']}
                  color={settings.tableColor}
                />

                <p
                  className={`${bodyTextSizeClass} ${lineHeightClass} text-stone-800 text-justify indent-[2em]`}
                >
                  新进人员先完成岗位培训和现场带教，再独立上岗。遇人员请假或临时增加会务需求，由项目经理从同岗位替补名单中安排支援，涉及特种作业的岗位核验相应资格。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Centered Action Island: 底部偏居中紧凑主按钮，拒绝大横条 */}
      <div className="sticky bottom-6 z-30 flex justify-center pointer-events-none mt-8">
        <div className="pointer-events-auto inline-flex items-center gap-2 p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
          {onNavigateDocument && (
            <button
              onClick={onNavigateDocument}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回正文</span>
            </button>
          )}

          <button
            onClick={handleExportWord}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold text-white bg-[#6438FF] hover:bg-[#5329E6] shadow-sm transition-all cursor-pointer disabled:opacity-70"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>正在导出...</span>
              </>
            ) : exportSuccess ? (
              <span>已导出 Word 文档 ✓</span>
            ) : (
              <span>导出 Word 文档</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
