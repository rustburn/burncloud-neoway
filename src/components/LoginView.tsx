import React, { useState } from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  User,
  Key,
  Building2,
  Cpu,
  Terminal,
  Sliders,
} from 'lucide-react';
import { RegulatoryAgency } from '../types';

interface LoginViewProps {
  onLogin: (agency: RegulatoryAgency) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedAgency, setSelectedAgency] = useState<RegulatoryAgency>('cac');
  const [username, setUsername] = useState('cac_algorithm_01');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const agencyPresets: Record<
    RegulatoryAgency,
    { title: string; sub: string; user: string; badge: string }
  > = {
    cac: {
      title: '国家互联网信息办公室 · 算法与大模型安全治理局',
      sub: '大模型算法上线备案核验、境内外API Token跨境合规审查、生成内容安全与数据出境风险防控',
      user: 'cac_algorithm_01',
      badge: '网信算法安全专席',
    },
    miit: {
      title: '工业和信息化部 · 算网调度与算力券监管局',
      sub: '全国一体化算力网调度运行、地方人工智能算力券防冒领套现核查、智算中心Token分发准入',
      user: 'miit_compute_lead',
      badge: '工信算网监管专席',
    },
    nda: {
      title: '国家数据局 · 数字要素与算力基础设施司',
      sub: '数据要素与智算资源交易市场监管、Token标准化计量结算规范、数交所API专区交易监管',
      user: 'nda_data_officer',
      badge: '数据局算力要素',
    },
    mps_cyber: {
      title: '公安部网络安全保卫局 / 经侦局 · 大模型涉案专席',
      sub: '打击企业大模型API Key盗刷倒卖、假借算力券套现涉嫌诈骗犯罪、暗网API黑产与跨境司法取证',
      user: 'mps_cyber_agent09',
      badge: '公安网安经侦专席',
    },
    regtech_center: {
      title: '国家智算与大模型监管沙盒运行中心 · 运行监测室',
      sub: '大模型官方开放平台API与算网枢纽实时流接入(Kafka/Flink)、前置机脱敏与全天候沙盒监测',
      user: 'regtech_sysadmin',
      badge: '沙盒运行保障',
    },
  };

  const handleAgencySelect = (agency: RegulatoryAgency) => {
    setSelectedAgency(agency);
    setUsername(agencyPresets[agency].user);
    setPassword('••••••••••••');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedAgency);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-center py-2 px-4 text-xs text-slate-400">
        <span className="text-emerald-400 font-semibold mr-2">【国家金融科技监管沙盒专网接入】</span>
        纯监管科技（RegTech/B2G）定位 · 严格遵循 ❌ 不撮合交易 · ❌ 不碰客户资金 · ❌ 不做钱包/托管 · ✅ 专职监测/预警/分析/报送
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Header & Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white mb-3 shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Token交易合规监管科技沙盒平台
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              National Token Regulatory Technology Sandbox Console (RegTech / B2G)
            </p>
          </div>

          {/* Preset Agency Selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              选择登录的监管部门席位
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  { id: 'cac' as const, name: '国家网信办', icon: Shield },
                  { id: 'miit' as const, name: '工信部算网局', icon: Cpu },
                  { id: 'nda' as const, name: '国家数据局', icon: Building2 },
                  { id: 'mps_cyber' as const, name: '公安网安经侦', icon: Terminal },
                  { id: 'regtech_center' as const, name: '智算沙盒中心', icon: Sliders },
                ]
              ).map((item) => {
                const isSelected = selectedAgency === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAgencySelect(item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/60 text-white shadow-sm ring-1 ring-blue-500/50'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="font-medium truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Current Selected Role Hint */}
            <div className="mt-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
              <div>
                <p className="font-semibold text-blue-300">
                  {agencyPresets[selectedAgency].title}
                </p>
                <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">
                  {agencyPresets[selectedAgency].sub}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>专网账号 (数字证书识别号)</span>
                <span className="text-[10px] text-slate-500">UKEY硬件绑定</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="请输入账号"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                国密密码口令 (动态安全令牌)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono tracking-widest"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>正在验证专网国密身份...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>以 {agencyPresets[selectedAgency].badge} 专席登录</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Security Certifications */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-around text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>国家授时中心TSA时钟</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>国密SM2/SM3签章</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>等保三级专网认证</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 text-[11px] text-slate-600 border-t border-slate-900 bg-slate-950">
        <p>国家大模型监管科技 (RegTech) 创新工程 · 算力网络与大模型 Token 流向合规监管科技平台</p>
      </div>
    </div>
  );
};
