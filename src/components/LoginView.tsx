import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, CheckCircle2, User, Key, Building2, Sliders } from 'lucide-react';
import { Role } from '../types';

interface LoginViewProps {
  onLogin: (role: Role) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('government');
  const [username, setUsername] = useState('admin_inspector');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const rolePresets = {
    government: {
      title: '政府监管人员',
      sub: '宏观全域态势、红线合规研判与执法监督',
      user: 'admin_inspector',
      icon: Shield,
      badge: '监管权限',
    },
    sandbox_operator: {
      title: '沙盒运营人员',
      sub: '企业入驻审核、专线路由与算力调度保障',
      user: 'ops_sandbox_lead',
      icon: Sliders,
      badge: '运维权限',
    },
    enterprise: {
      title: '入驻企业 (广州智算)',
      sub: 'Token配额监控、合规自查与跨境调用链追溯',
      user: 'ent_guangzhou_ai',
      icon: Building2,
      badge: '企业专区',
    },
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setUsername(rolePresets[role].user);
    setPassword('••••••••••••');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-between text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800 text-center py-2 px-4 text-xs text-slate-400">
        <span className="text-blue-400 font-semibold mr-2">【国家合规安全管控网络】</span>
        本平台受《中华人民共和国数据安全法》与《生成式人工智能服务管理暂行办法》保护，全操作行为实施链上可信审计与时钟固化。
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">有方</h1>
            <p className="text-sm font-medium text-blue-400 mt-1">
              跨境 AI 算力服务合规监管沙盒
            </p>
            <p className="text-xs text-slate-400 mt-1">
              国家级数据跨境与 AI 算力服务辅助监管技术平台
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              选择访问登录身份与权限范围
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['government', 'sandbox_operator', 'enterprise'] as Role[]).map((role) => {
                const isSelected = selectedRole === role;
                const config = rolePresets[role];
                const Icon = config.icon;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold shadow-inner'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="text-xs leading-tight">{config.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 bg-slate-800/40 p-2 rounded-lg border border-slate-800">
              当前授权身份：<span className="text-blue-300 font-medium">{rolePresets[selectedRole].title}</span> - {rolePresets[selectedRole].sub}
            </p>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                专网账号 / 电子公职身份标识
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入专网账号"
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                访问凭据 / 数字证书口令
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入访问凭证密码"
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                沙盒专用合规通道密钥就绪
              </span>
              <span className="text-slate-500 font-mono">TLS 1.3 / 国密SM4</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>进入有方监管驾驶舱</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Official Bottom Note */}
      <footer className="text-center py-4 px-6 border-t border-slate-800 text-xs text-slate-500">
        国家跨境 AI 算力服务合规监管沙盒管理系统 · 专网安全准入认证中心 · 运行环境合规认证备案：粤网信备2026-0038号
      </footer>
    </div>
  );
};
