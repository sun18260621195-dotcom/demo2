import React from 'react';
import { TableColor, TableStyle } from '../types';
import { TABLE_COLORS } from '../data/initialContent';

export const PptManagementDiagram: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-[680px] mx-auto bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm my-5 ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100 text-xs text-stone-400">
        <span className="font-medium text-stone-600">图 1-1  物业管理综合服务架构与保障要素（PPT信息图）</span>
        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-500 font-mono text-[11px]">矢量架构图</span>
      </div>
      <svg viewBox="0 0 800 460" className="w-full h-auto drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="460" rx="10" fill="#FCFCFC" stroke="#F1F1EF" />
        
        <text x="400" y="52" textAnchor="middle" fill="#18181B" fontFamily="'Noto Serif SC', 'PingFang SC', sans-serif" fontSize="22" fontWeight="700" letterSpacing="1.2">
          物业管理服务方案
        </text>
        
        {/* Center Dark Ring */}
        <circle cx="400" cy="245" r="48" stroke="#3F3F46" strokeWidth="22" fill="#FFFFFF" />
        <circle cx="400" cy="245" r="28" fill="#FFFFFF" />
        <circle cx="400" cy="245" r="12" fill="#F4F4F5" />

        {/* Node 1: Top-Left (Red) 年度管理目标 */}
        <circle cx="280" cy="145" r="32" fill="#E24D47" />
        <path d="M312 165 L338 185" stroke="#E24D47" strokeWidth="4" strokeLinecap="round" />
        <polygon points="346,191 332,185 340,175" fill="#E24D47" />
        <text x="235" y="130" textAnchor="end" fill="#E24D47" fontFamily="'PingFang SC', sans-serif" fontSize="14" fontWeight="700">年度管理目标</text>
        <text x="235" y="152" textAnchor="end" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">确保环境整洁、设施正常、秩序稳定</text>
        <text x="235" y="170" textAnchor="end" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">及后勤保障，每月检查并反馈。</text>

        {/* Node 2: Mid-Left (Lime Green) 档案管理制度 */}
        <circle cx="250" cy="255" r="32" fill="#84B835" />
        <path d="M285 255 L320 255" stroke="#84B835" strokeWidth="4" strokeLinecap="round" />
        <polygon points="328,255 316,249 316,261" fill="#84B835" />
        <text x="205" y="248" textAnchor="end" fill="#84B835" fontFamily="'PingFang SC', sans-serif" fontSize="14" fontWeight="700">档案管理制度</text>
        <text x="205" y="270" textAnchor="end" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">建立电子与纸质双重归档，专人管理</text>
        <text x="205" y="288" textAnchor="end" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">，定期核查更新。</text>

        {/* Node 3: Bottom (Yellow/Gold) 信报服务标准 */}
        <circle cx="400" cy="380" r="32" fill="#E5B81C" />
        <path d="M400 345 L400 315" stroke="#E5B81C" strokeWidth="4" strokeLinecap="round" />
        <polygon points="400,307 394,319 406,319" fill="#E5B81C" />
        <text x="400" y="425" textAnchor="middle" fill="#C99805" fontFamily="'PingFang SC', sans-serif" fontSize="14" fontWeight="700">信报服务标准</text>
        <text x="400" y="445" textAnchor="middle" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">设立专门收发区，双人复核重要信件，确保信息准确及时。</text>

        {/* Node 4: Mid-Right (Sky Blue) 重大活动保障 */}
        <circle cx="550" cy="255" r="32" fill="#24A1DE" />
        <path d="M515 255 L480 255" stroke="#24A1DE" strokeWidth="4" strokeLinecap="round" />
        <polygon points="472,255 484,249 484,261" fill="#24A1DE" />
        <text x="595" y="248" textAnchor="start" fill="#24A1DE" fontFamily="'PingFang SC', sans-serif" fontSize="14" fontWeight="700">重大活动保障</text>
        <text x="595" y="270" textAnchor="start" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">制定后勤保障方案，安排专项负责人</text>
        <text x="595" y="288" textAnchor="start" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">对接协调活动需求。</text>

        {/* Node 5: Top-Right (Teal/Emerald Green) 人员培训计划 */}
        <circle cx="520" cy="145" r="32" fill="#30B974" />
        <path d="M488 165 L462 185" stroke="#30B974" strokeWidth="4" strokeLinecap="round" />
        <polygon points="454,191 460,175 468,185" fill="#30B974" />
        <text x="565" y="130" textAnchor="start" fill="#30B974" fontFamily="'PingFang SC', sans-serif" fontSize="14" fontWeight="700">人员培训计划</text>
        <text x="565" y="152" textAnchor="start" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">涵盖技能、应急、礼仪培训，每季度</text>
        <text x="565" y="170" textAnchor="start" fill="#52525B" fontFamily="'PingFang SC', sans-serif" fontSize="11">一次，考核合格后上岗。</text>
      </svg>
    </div>
  );
};

export const SiteInspectionPhoto: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full max-w-[680px] mx-auto bg-white rounded-xl border border-stone-200/80 p-4 shadow-sm my-5 ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100 text-xs text-stone-400">
        <span className="font-medium text-stone-600">图 4-1  设备机房运行状态日常巡查及仪表校核（现场作业实录）</span>
        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-500 font-mono text-[11px]">现场插图</span>
      </div>
      <div className="relative rounded-lg overflow-hidden border border-stone-200 bg-stone-100 aspect-[16/10]">
        <svg viewBox="0 0 800 500" className="w-full h-full object-cover select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wallGrad" x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EEF2F6" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="jacketGrad2" x1="380" y1="200" x2="550" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <linearGradient id="pumpGrad2" x1="100" y1="300" x2="350" y2="450" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#wallGrad)" />
          
          {/* Wall tiles & frames */}
          <line x1="160" y1="0" x2="160" y2="500" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="380" y1="0" x2="380" y2="500" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="620" y1="0" x2="620" y2="500" stroke="#CBD5E1" strokeWidth="2" />
          
          {/* Vertical fire/water pipes */}
          <rect x="360" y="10" width="28" height="440" fill="#EA580C" rx="4" />
          <rect x="680" y="10" width="34" height="440" fill="#334155" rx="6" />
          <rect x="190" y="30" width="40" height="280" fill="#475569" rx="6" />
          
          {/* Cable trunking & warning sign */}
          <rect x="610" y="120" width="65" height="95" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <rect x="625" y="140" width="35" height="22" rx="2" fill="#0284C7" />
          <circle cx="632" cy="190" r="4" fill="#EF4444" />
          <circle cx="650" cy="190" r="4" fill="#10B981" />
          <rect x="735" y="140" width="18" height="24" rx="2" fill="#DC2626" />
          
          {/* Heavy Water Pump Assembly */}
          <rect x="40" y="430" width="380" height="50" rx="6" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
          <rect x="60" y="335" width="230" height="100" rx="12" fill="url(#pumpGrad2)" />
          <circle cx="210" cy="385" r="42" fill="#0369A1" stroke="#38BDF8" strokeWidth="4" />
          <circle cx="210" cy="385" r="22" fill="#075985" />
          <rect x="250" y="315" width="60" height="120" rx="8" fill="#0284C7" />
          
          {/* Pressure Gauge */}
          <circle cx="210" cy="290" r="18" fill="#FFFFFF" stroke="#0369A1" strokeWidth="3" />
          <line x1="210" y1="290" x2="220" y2="282" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Technician In Equipment Room */}
          <path d="M480 340 L450 420 L530 450 L560 410 Z" fill="#172554" />
          <path d="M430 420 L395 455 L460 465 Z" fill="#78350F" />
          <path d="M530 450 L520 475 L580 480 Z" fill="#78350F" />
          
          {/* Jacket Body */}
          <path d="M430 250 C410 270 410 320 440 370 C470 380 520 370 540 330 C550 290 530 250 490 240 Z" fill="url(#jacketGrad2)" />
          <path d="M435 295 L520 285" stroke="#34D399" strokeWidth="6" strokeLinecap="round" />
          
          {/* Inspection Arms & Tool */}
          <path d="M450 260 L380 285 L320 275" stroke="#1D4ED8" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="300" y="265" width="26" height="14" rx="4" fill="#0F172A" />
          <polygon points="300,272 210,255 210,290" fill="#FEF08A" opacity="0.65" />
          
          {/* Yellow Hard Hat & Head */}
          <circle cx="485" cy="205" r="24" fill="#FBBF24" />
          <path d="M460 195 C460 165 510 165 515 195 Z" fill="#FACC15" stroke="#D97706" strokeWidth="2" />
          <path d="M452 195 L525 195" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <circle cx="475" cy="210" r="14" fill="#FCD34D" />
          <rect x="465" y="206" width="14" height="6" rx="2" fill="#0284C7" stroke="#1E293B" strokeWidth="1.5" />

          {/* Authentic Camera Overlay Info */}
          <rect x="20" y="20" width="220" height="32" rx="6" fill="#090A0C" opacity="0.8" />
          <text x="32" y="41" fill="#F8FAFC" fontFamily="'PingFang SC', sans-serif" fontSize="12" fontWeight="500">
            现场工况实景 · 设备巡检记录
          </text>
        </svg>
      </div>
      <div className="mt-2 text-center text-xs text-stone-400">
        注：插图由预置样例提供，作为工程设备维护规程之示范参考。
      </div>
    </div>
  );
};

export const FlowchartDiagram: React.FC<{ steps: string[]; color?: TableColor }> = ({ steps, color = 'purple' }) => {
  const colorCfg = TABLE_COLORS[color] || TABLE_COLORS.purple;
  return (
    <div className="my-4 p-3.5 rounded-lg border border-stone-200/80 bg-stone-50/60">
      <div className="text-[11px] font-medium text-stone-400 mb-2 tracking-wider">执行管理流程节点</div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border shadow-xs transition-all"
              style={{
                backgroundColor: colorCfg.bgLight,
                borderColor: colorCfg.borderLight,
                color: colorCfg.hex,
              }}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-mono" style={{ backgroundColor: colorCfg.hex }}>
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
            {idx < steps.length - 1 && (
              <span className="text-stone-300 font-bold text-sm">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export interface StyledTableProps {
  title?: string;
  headers: string[];
  rows: string[][];
  style?: TableStyle;
  color?: TableColor;
  className?: string;
}

export const StyledTable: React.FC<StyledTableProps> = ({
  title,
  headers,
  rows,
  style = 'header',
  color = 'purple',
  className = '',
}) => {
  const colorCfg = TABLE_COLORS[color] || TABLE_COLORS.purple;

  // Compute table styling based on style and color:
  const getContainerStyle = () => {
    switch (style) {
      case 'solid':
        return 'border-2 rounded-lg overflow-hidden shadow-xs';
      case 'zebra':
      case 'header':
      default:
        return 'border border-stone-200 rounded-lg overflow-hidden shadow-xs';
      case 'clean':
        return 'border-t-2 border-b-2 overflow-hidden';
    }
  };

  const getHeaderClasses = () => {
    switch (style) {
      case 'header':
      case 'solid':
        return 'text-white font-semibold';
      case 'zebra':
        return 'font-semibold border-b border-stone-200';
      case 'clean':
      default:
        return 'font-semibold border-b-2 border-stone-300 text-stone-800';
    }
  };

  const getHeaderInlineStyle = (): React.CSSProperties => {
    if (style === 'header' || style === 'solid') {
      return { backgroundColor: colorCfg.hex, color: '#FFFFFF' };
    }
    if (style === 'zebra') {
      return { backgroundColor: colorCfg.bgLight, color: colorCfg.hex };
    }
    return { backgroundColor: '#F8F9FA' };
  };

  return (
    <div className={`my-4 ${className}`}>
      {title && (
        <div className="font-serif-doc text-[13.5px] font-semibold text-stone-800 mb-2 tracking-wide flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorCfg.hex }} />
          <span>{title}</span>
        </div>
      )}
      <div
        className={`w-full overflow-x-auto ${getContainerStyle()}`}
        style={style === 'solid' ? { borderColor: colorCfg.hex } : style === 'clean' ? { borderColor: colorCfg.hex } : {}}
      >
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={getHeaderClasses()} style={getHeaderInlineStyle()}>
              {headers.map((h, i) => (
                <th key={i} className="py-2.5 px-3.5 tracking-wide text-xs">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((row, rIdx) => {
              let rowBg = 'bg-white';
              if (style === 'zebra' && rIdx % 2 === 1) {
                rowBg = colorCfg.bgLight;
              } else if (style === 'solid' && rIdx % 2 === 1) {
                rowBg = 'bg-stone-50';
              }
              return (
                <tr key={rIdx} className={`${rowBg} hover:bg-stone-50/80 transition-colors`}>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-2 px-3.5 text-stone-700 leading-relaxed ${
                        cIdx === 0 ? 'font-medium text-stone-900' : ''
                      } ${style === 'solid' ? 'border-r border-stone-200 last:border-r-0' : ''}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
