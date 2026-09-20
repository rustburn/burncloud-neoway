import React, { useState, useEffect } from 'react';
import {
  Shield,
  Bell,
  UserCheck,
  Building2,
  Sliders,
  LogOut,
  Clock,
  ChevronDown,
  RefreshCw,
  FileCheck2,
  Layers,
  Cpu,
  Terminal,
} from 'lucide-react';
import { RegulatoryAgency, JurisdictionLevel } from '../types';

interface HeaderProps {
  currentAgency: RegulatoryAgency;
  onAgencyChange: (agency: RegulatoryAgency) => void;
  jurisdictionLevel?: JurisdictionLevel;
  onJurisdictionChange?: (level: JurisdictionLevel) => void;
  onLogout: () => void;
  onNavigate?: (page: string) => void;
  pendingRisksCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentAgency,
  onAgencyChange,
  jurisdictionLevel = 'ministry',
  onJurisdictionChange,
  onLogout,
  onNavigate,
  pendingRisksCount = 11,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
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

  const agencyConfig: Record<
    RegulatoryAgency,
    { name: string; dept: string; badgeClass: string; icon: React.ReactNode }
  > = {
    cac: {
      name: '国家网信办',
      dept: '算法与大模型安全治理局',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <Shield className="w-3.5 h-3.5" />,
    },
    miit: {
      name: '工业和信息化部',
      dept: '算网调度与算力券监管局',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: <Cpu className="w-3.5 h-3.5" />,
    },
    nda: {
      name: '国家数据局',
      dept: '数字要素与算力基础设施司',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <Building2 className="w-3.5 h-3.5" />,
    },
    mps_cyber: {
      name: '公安部网安经侦',
      dept: '大模型涉案与算力黑产专席',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <Terminal className="w-3.5 h-3.5" />,
    },
    regtech_center: {
      name: '智算沙盒中心',
      dept: '国家智算与大模型沙盒运行室',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: <Sliders className="w-3.5 h-3.5" />,
    },
  };

  const jurisdictionConfig: Record<
    JurisdictionLevel,
    { label: string; desc: string }
  > = {
    ministry: { label: '部级 · 全国一张图', desc: '全国八大算力枢纽大模型Token流转总览' },
    province: { label: '省级 · 辖区智算', desc: '省域算力券申领核销、地方智算中心与属地合规' },
    city: { label: '市级 · 重点监测', desc: '地市重点科技主体排查与异常Token线索核查' },
    county: { label: '园区 · 落地核验', desc: '算力产业园实体落地勘察与企业调用实地协助' },
  };

  const activeAgency = agencyConfig[currentAgency] || agencyConfig.cac;
  const activeJurisdiction = jurisdictionConfig[jurisdictionLevel] || jurisdictionConfig.ministry;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Critical RegTech Anti-Trading Disclaimer & Operational Banner */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-semibold text-amber-300 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded text-[11px]">
            B2G / 监管沙盒纯监管科技定位
          </span>
          <span className="text-slate-300 font-medium text-[11px] hidden md:inline">
            辅助政府对大模型Token交易进行监管：❌ 不撮合交易 · ❌ 不碰资金 · ❌ 不做钱包/API中转收费 · ✅ 专职监测/预警/分析/报送
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 hidden lg:flex">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>北京时间: {timeStr}</span>
          </span>
          <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
            <FileCheck2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>等保三级 · 国密SM2/SM3 · 国家授时TSA存证</span>
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Left Branding Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 flex items-center justify-center text-white shadow-md border border-blue-600 shrink-0">
              <Shield className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">有方 RegTech</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                  大模型Token交易合规监管科技沙盒平台
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-normal -mt-0.5 font-medium">
                面向 国家网信办 · 工业和信息化部 · 国家数据局 · 公安部网安经侦 的算网专线
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions & Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Jurisdiction Level Switcher (部级/省级/市级/县级) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLevelDropdown(!showLevelDropdown);
                setShowAgencyDropdown(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-white text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              title="切换大模型算力监管层级视角"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeJurisdiction.label.split(' · ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLevelDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLevelDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      算力网层级视角穿透
                    </p>
                  </div>
                  <div className="p-1 space-y-1">
                    {(['ministry', 'province', 'city', 'county'] as JurisdictionLevel[]).map((lvl) => {
                      const isSelected = jurisdictionLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          onClick={() => {
                            onJurisdictionChange?.(lvl);
                            setShowLevelDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <p className="font-medium">{jurisdictionConfig[lvl].label}</p>
                            <p className="text-[10px] text-slate-400 font-normal">
                              {jurisdictionConfig[lvl].desc}
                            </p>
                          </div>
                          {isSelected && <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Refresh Status Button */}
          <button
            onClick={handleRefreshData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all cursor-pointer"
            title="刷新大模型流处理与探针指标"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden md:inline">{isRefreshing ? '同步中...' : '流监控刷新'}</span>
          </button>

          {/* Pending Risk Notification */}
          <button
            onClick={() => onNavigate && onNavigate('risk-alerts')}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title="查看待处置红橙黄四级大模型违规风险"
          >
            <Bell className="w-4 h-4" />
            {pendingRisksCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 min-w-[16px] h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {pendingRisksCount}
              </span>
            )}
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Regulatory Agency Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAgencyDropdown(!showAgencyDropdown);
                setShowLevelDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-white text-xs text-slate-800 transition-colors cursor-pointer"
            >
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${activeAgency.badgeClass}`}
              >
                {activeAgency.icon}
                <span>{activeAgency.name}</span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showAgencyDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowAgencyDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      切换监管机构专席
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      各部门依照法定职责享有差异化大模型与算力监管、执法权限
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    {(
                      [
                        'cac',
                        'miit',
                        'nda',
                        'mps_cyber',
                        'regtech_center',
                      ] as RegulatoryAgency[]
                    ).map((agencyKey) => {
                      const isSelected = currentAgency === agencyKey;
                      const agency = agencyConfig[agencyKey];
                      return (
                        <button
                          key={agencyKey}
                          onClick={() => {
                            onAgencyChange(agencyKey);
                            setShowAgencyDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
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
                              {agency.icon}
                            </span>
                            <div>
                              <p className="font-semibold">{agency.name}</p>
                              <p className="text-[10px] text-slate-400 font-normal">
                                {agency.dept}
                              </p>
                            </div>
                          </div>
                          {isSelected && <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 mt-1 pt-1 px-1">
                    <button
                      onClick={() => {
                        setShowAgencyDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>安全退出登录</span>
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
