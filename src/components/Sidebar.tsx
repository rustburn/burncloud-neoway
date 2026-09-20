import React from 'react';
import {
  LayoutDashboard,
  SearchCheck,
  Network,
  ShieldAlert,
  Briefcase,
  FileSpreadsheet,
  DatabaseZap,
  Bot,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
  pendingRisksCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  pendingRisksCount = 11,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const menuSections = [
    {
      title: 'Token流向监测与预警驾驶舱',
      items: [
        {
          id: 'overview',
          name: '监管驾驶舱',
          icon: LayoutDashboard,
          badge: '部省市县',
          badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
          desc: '全国大模型Token交易大屏、算力券核销与风险态势',
        },
        {
          id: 'monitoring',
          name: 'Token流向与风险交易',
          icon: SearchCheck,
          badge: '核心模块',
          badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
          desc: 'API Key盗刷、算力券骗补、模型走私与跨境异常流动',
        },
        {
          id: 'risk-alerts',
          name: '风险预警与处置工单',
          icon: ShieldAlert,
          badge: `${pendingRisksCount} 待办`,
          badgeColor: 'bg-rose-600 text-white shadow-xs',
          desc: '红橙黄蓝四级预警与算力配额熔断闭环处置',
        },
      ],
    },
    {
      title: '穿透图谱与案件调查',
      items: [
        {
          id: 'fund-graph',
          name: 'Token流向与穿透图谱',
          icon: Network,
          badge: 'Graph DB',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
          desc: '多级API转售追踪、同一控制人(UBO)与黑产团伙识别',
        },
        {
          id: 'investigation',
          name: '案件调查与司法存证',
          icon: Briefcase,
          badge: '司法存证',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          desc: '调用指纹比对、国密TSA存证与司法电子证据包导出',
        },
        {
          id: 'regulatory-reports',
          name: '监管法定报送报表',
          icon: FileSpreadsheet,
          badge: 'XML/JSON',
          badgeColor: 'bg-slate-700 text-slate-200 border border-slate-600',
          desc: '网信办/工信部/数据局法定报送与算力券核验清单',
        },
      ],
    },
    {
      title: '智能研判与系统集成',
      items: [
        {
          id: 'data-ingestion',
          name: '多源算网探针接入',
          icon: DatabaseZap,
          badge: '日均1亿+条',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
          desc: '大模型平台API/智算中心调度/API网关/数交所专区',
        },
        {
          id: 'ai-intelligence',
          name: 'AI 智能研判与舆情',
          icon: Bot,
          badge: 'GNN/XGBoost',
          badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
          desc: 'Token异常流量GNN研判、暗网黑产监控与监管Copilot',
        },
        {
          id: 'audit-security',
          name: '权限与安全审计',
          icon: SlidersHorizontal,
          badge: '等保三级',
          badgeColor: 'bg-slate-700 text-slate-300',
          desc: 'RBAC多部门组织隔离、国密SM3审计与专网安全',
        },
      ],
    },
  ];

  return (
    <aside
      className={`bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none transition-all duration-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600/90 text-white flex items-center justify-center shrink-0 shadow-sm border border-blue-400/40">
            <Cpu className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <h1 className="font-bold text-slate-100 text-sm tracking-wide">
                有方 RegTech
              </h1>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span>大模型Token监管平台</span>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/80 transition-colors cursor-pointer"
          title={isCollapsed ? '展开导航栏' : '收起导航栏'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 custom-scrollbar">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={isCollapsed ? `${item.name} - ${item.desc}` : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="truncate">
                        <span className="block truncate font-medium text-[13px]">{item.name}</span>
                        <span
                          className={`block text-[10px] truncate ${
                            isActive ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {item.desc}
                        </span>
                      </div>

                      {item.badge && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded shrink-0 ${
                            isActive
                              ? 'bg-blue-700/80 text-white'
                              : item.badgeColor || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      {!isCollapsed && (
        <div className="p-3 m-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-slate-300 font-medium">Token 异构流监控</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              在线
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
            吞吐: 32.5万 Tokens/s · 延迟: 12ms · 算力券核销核验: 100%
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">法规基准</span>
            <span className="text-blue-400 font-semibold">生成式AI暂行办法</span>
          </div>
        </div>
      )}
    </aside>
  );
};
