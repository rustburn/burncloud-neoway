import React, { useState, useEffect } from 'react';
import {
  Shield,
  Bell,
  UserCheck,
  Building,
  Sliders,
  LogOut,
  Clock,
  ChevronDown,
  RefreshCw,
  FileCheck2,
} from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
  onNavigate?: (page: string) => void;
  pendingRisksCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onLogout,
  onNavigate,
  pendingRisksCount = 8,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      const hr = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const se = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${yr}-${mo}-${da} ${hr}:${mi}:${se}`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const roleConfig = {
    government: {
      name: '政府监管人员',
      department: '国家数据安全与跨境算力监管组',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <Shield className="w-3.5 h-3.5" />,
    },
    sandbox_operator: {
      name: '沙盒运营人员',
      department: '跨境数据沙盒联运技术保障中心',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <Sliders className="w-3.5 h-3.5" />,
    },
    enterprise: {
      name: '入驻企业 (广州智算)',
      department: '跨境业务合规负责人',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <Building className="w-3.5 h-3.5" />,
    },
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Official Government Sandbox Operational Status Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">
            国家跨境 AI 算力服务合规监管沙盒 · 广东省/大湾区试点节点
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">
            全网 46 个算力节点与 5 条合规国际专线物理在线 · SHA-256 存证链实时同步中
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>系统时钟 (UTC+8): {timeStr}</span>
          </span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
            <FileCheck2 className="w-3 h-3 text-emerald-400" />
            <span>国密密码机认证通过</span>
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Left Branding Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 flex items-center justify-center text-white shadow-md border border-blue-600">
              <Shield className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">有方</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                  跨境 AI 算力监管工作台
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-normal -mt-0.5 font-medium">
                跨境 AI 算力服务合规监管沙盒
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Refresh Status Button */}
          <button
            onClick={handleRefreshData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
            title="刷新沙盒探针指标"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isRefreshing ? '正在同步探针...' : '探针同步'}</span>
          </button>

          {/* Pending Risk Notification */}
          <button
            onClick={() => onNavigate && onNavigate('risk')}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="查看待处置风险事件"
          >
            <Bell className="w-4 h-4" />
            {pendingRisksCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 min-w-[16px] h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {pendingRisksCount}
              </span>
            )}
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-white text-xs text-slate-800 transition-colors"
            >
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${roleConfig[currentRole].badgeClass}`}
              >
                {roleConfig[currentRole].icon}
                {roleConfig[currentRole].name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRoleDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      切换系统工作台视角
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      不同角色拥有差异化监管处置、配置与申报权限
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    {(['government', 'sandbox_operator', 'enterprise'] as Role[]).map((r) => {
                      const isSelected = currentRole === r;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            onRoleChange(r);
                            setShowRoleDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-1.5 rounded-md ${
                                isSelected ? 'bg-blue-200 text-blue-900' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {roleConfig[r].icon}
                            </span>
                            <div>
                              <p>{roleConfig[r].name}</p>
                              <p className="text-[10px] text-slate-400 font-normal">
                                {roleConfig[r].department}
                              </p>
                            </div>
                          </div>
                          {isSelected && <UserCheck className="w-4 h-4 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 mt-1 pt-1 px-1">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>退出系统</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
