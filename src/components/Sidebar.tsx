import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GitFork,
  ShieldAlert,
  FileCheck2,
  SlidersHorizontal,
  Server,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  currentPage?: string;
  activePage?: string;
  onPageChange?: (page: string) => void;
  onNavigate?: (page: string) => void;
  pendingRisksCount?: number;
  currentRole?: Role;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  activePage,
  onPageChange,
  onNavigate,
  pendingRisksCount = 8,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const current = activePage || currentPage || 'overview';

  const handleItemClick = (pageId: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(pageId);
    }
    if (typeof onPageChange === 'function') {
      onPageChange(pageId);
    }
  };
  const menuItems = [
    {
      id: 'overview',
      name: '监管总览',
      icon: LayoutDashboard,
      badge: null,
      description: '全链路态势与流转看板',
    },
    {
      id: 'enterprise',
      name: '企业管理',
      icon: Building2,
      badge: '28家',
      description: '入驻企业及备案审查',
    },
    {
      id: 'cross-border',
      name: '跨境流转',
      icon: GitFork,
      badge: null,
      description: '全链路请求追踪与溯源',
    },
    {
      id: 'risk',
      name: '风险事件',
      icon: ShieldAlert,
      badge: pendingRisksCount > 0 ? `${pendingRisksCount}待办` : null,
      badgeColor: 'bg-rose-500 text-white',
      description: '异常拦截与合规闭环',
    },
    {
      id: 'audit',
      name: '审计中心',
      icon: FileCheck2,
      badge: null,
      description: '存证账本与监管报告',
    },
    {
      id: 'config',
      name: '沙盒配置',
      icon: SlidersHorizontal,
      badge: null,
      description: '合规策略基准与规则配置',
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none transition-all duration-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20">
            <Lock className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                <span>有方</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-normal">
                  Sandbox
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                跨境 AI 算力服务合规监管沙盒
              </p>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? '展开菜单' : '收起菜单'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Menu (Max 6 First-Level Items) */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            监管核心功能
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              title={isCollapsed ? `${item.name} - ${item.description}` : undefined}
              className={`w-full text-left rounded-xl flex items-center transition-all group ${
                isCollapsed
                  ? 'justify-center p-3'
                  : 'justify-between px-3.5 py-3'
              } text-xs font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                {!isCollapsed && (
                  <div className="truncate">
                    <div className="leading-none truncate">{item.name}</div>
                    <div
                      className={`text-[10px] mt-1 font-normal truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                    item.badgeColor
                      ? item.badgeColor
                      : isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Infrastructure Status Widget */}
      {!isCollapsed && (
        <div className="p-4 m-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-400 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300 text-[11px]">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              算力与沙盒集群状态
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">国际专线通道</span>
              <span className="text-slate-300 font-mono">5 条全部连通</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">国内算力节点</span>
              <span className="text-slate-300 font-mono">45 正常 / 1 维护</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">隔离沙盒环境</span>
              <span className="text-emerald-400 font-mono">零数据公网溢出</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between items-center">
            <span>系统版本: v2.4 (辅助监管版)</span>
            <span className="text-slate-400 font-mono">SEC-AA</span>
          </div>
        </div>
      )}
    </aside>
  );
};
