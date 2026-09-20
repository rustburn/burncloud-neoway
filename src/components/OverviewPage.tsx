import React, { useState } from 'react';
import {
  Activity,
  ShieldAlert,
  Flame,
  Network,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Radar,
  Eye,
  FileCheck,
  Terminal,
  Server,
  Zap,
  Shield,
  Search,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  REGULATORY_METRICS,
  TOKEN_TRANSACTIONS_DATA,
  MARKET_MANIPULATION_EVENTS,
  RISK_ALERT_TICKETS_DATA,
  DATA_INGESTION_SOURCES,
} from '../mock/regtechData';
import { JurisdictionLevel, RegulatoryAgency, TokenTransaction, AlertLevel } from '../types';

interface OverviewPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
  jurisdictionLevel: JurisdictionLevel;
  currentAgency: RegulatoryAgency;
}

// 24小时全国大模型推理 Token 实时吞吐与异动走势 (单位：亿 Tokens)
const HOURLY_TOKEN_FLOW_DATA = [
  { time: '00:00', normalVolumeTokens: 182, alertVolumeTokens: 12 },
  { time: '02:00', normalVolumeTokens: 85, alertVolumeTokens: 68 }, // 凌晨2-5点黑产API Key盗刷与虚假骗补峰值
  { time: '04:00', normalVolumeTokens: 62, alertVolumeTokens: 94 }, // 凌晨空载脚本集中刷量
  { time: '06:00', normalVolumeTokens: 140, alertVolumeTokens: 25 },
  { time: '08:00', normalVolumeTokens: 425, alertVolumeTokens: 38 },
  { time: '10:00', normalVolumeTokens: 784, alertVolumeTokens: 82 }, // 白天企业正常峰值与突发未备案模型反向代理
  { time: '12:00', normalVolumeTokens: 652, alertVolumeTokens: 45 },
  { time: '14:00', normalVolumeTokens: 926, alertVolumeTokens: 112 }, // 跨境大流量敏感数据外传峰值
  { time: '16:00', normalVolumeTokens: 880, alertVolumeTokens: 76 },
  { time: '18:00', normalVolumeTokens: 582, alertVolumeTokens: 41 },
  { time: '20:00', normalVolumeTokens: 710, alertVolumeTokens: 58 },
  { time: '22:00', normalVolumeTokens: 451, alertVolumeTokens: 36 },
];

// 跨区域重点算力枢纽与Token流向监测 (亿 Tokens / 异常事件数)
const REGIONAL_RISK_MAP = [
  { region: '贵州贵安 / 成渝西部算力枢纽', volume: '1,420 亿', alertCount: 22, riskFocus: '跨省财政算力券套现、虚假空载并发刷量' },
  { region: '京津冀枢纽 (北京/张家口/廊坊)', volume: '1,860 亿', alertCount: 14, riskFocus: '未备案境外大模型走私、反向代理暗网分流' },
  { region: '长三角集群 (上海/苏州/芜湖)', volume: '1,650 亿', alertCount: 19, riskFocus: '企业高权 API Key 批量撞库盗刷、黑产倒卖' },
  { region: '粤港澳大湾区 (韶关/深圳/广州)', volume: '1,280 亿', alertCount: 16, riskFocus: '跨境非法数据流转、境外算力违规通道' },
  { region: '境外未备案代理与暗网转售网关 (阻断)', volume: '340 亿', alertCount: 11, riskFocus: '无牌照模型走私、高危Prompt越狱分发' },
];

// 智算模型Token流向结构分布与合规状态
const MODEL_TOKEN_SHARE_DATA = [
  { name: 'DeepSeek-R1 / V3 系列 (重点监管)', value: 38.5, color: '#3b82f6' },
  { name: '通义千问 Qwen-2.5 (开源备案)', value: 24.2, color: '#10b981' },
  { name: 'Claude-3.5 (境外未备案走私排查)', value: 16.8, color: '#ef4444' },
  { name: 'GPT-4o 系列 (违规转售代理排查)', value: 12.5, color: '#f59e0b' },
  { name: 'Llama-3.3 等开源衍生微调', value: 8.0, color: '#8b5cf6' },
];

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onShowToast,
  onNavigate,
  jurisdictionLevel,
  currentAgency,
}) => {
  const [selectedTx, setSelectedTx] = useState<TokenTransaction | null>(null);

  const getAlertBadge = (level: AlertLevel) => {
    switch (level) {
      case 'red':
        return 'bg-rose-500 text-white border-rose-600';
      case 'orange':
        return 'bg-amber-500 text-white border-amber-600';
      case 'yellow':
        return 'bg-yellow-400 text-yellow-950 border-yellow-500';
      case 'blue':
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  const getAlertText = (level: AlertLevel) => {
    switch (level) {
      case 'red':
        return '红牌·涉嫌犯罪';
      case 'orange':
        return '橙牌·高危异常';
      case 'yellow':
        return '黄牌·合规存疑';
      case 'blue':
      default:
        return '蓝牌·常规备案';
    }
  };

  const jurisdictionLabels: Record<JurisdictionLevel, { tag: string; desc: string }> = {
    ministry: { tag: '部级 · 全国一张图', desc: '穿透全国交易场所、跨链节点及跨省重大涉案资金流向' },
    province: { tag: '省级 · 辖区监管', desc: '省域金融监管局、人行分行与合规机构属地监管' },
    city: { tag: '市级 · 重点监测', desc: '地市高风险账户排查、资金落地点核实与线索深挖' },
    county: { tag: '县级 · 落地协查', desc: '属地企业走访勘察、司法查封冻结与经侦落地协查' },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & System Mandate Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 border border-slate-700 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/40">
                {jurisdictionLabels[jurisdictionLevel].tag}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                等保三级 · 国密SM3数字签章 · TSA司法时间戳
              </span>
              <span className="text-xs text-slate-300 font-mono">
                当前席位: {currentAgency.toUpperCase()} 专网在线
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>国家大模型Token交易合规监管科技（RegTech）沙盒驾驶舱</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-normal">
                B2G 纯监管科技
              </span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              严格遵循【❌ 不撮合交易 · ❌ 不碰客户资金 · ❌ 不做钱包/API中转 · ✅ 专职监测/预警/分析/报送】定位。面向国家互联网信息办公室(CAC)、工业和信息化部算力调度局(MIIT)、国家数据局(NDA)及公安部网安经侦局(MPS)，提供算力券虚假刷量骗补监测、企业API Key盗刷预警、未备案模型走私穿透排查与跨部门联合熔断处置。
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('monitoring')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-900/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Token流向与异常交易</span>
            </button>
            <button
              onClick={() => onNavigate('fund-graph')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Network className="w-3.5 h-3.5 text-indigo-400" />
              <span>Token链路穿透</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Regulatory Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {REGULATORY_METRICS.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
              <span>{metric.title}</span>
              <div className="p-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
                {metric.icon === 'Activity' && <Activity className="w-3.5 h-3.5 text-emerald-600" />}
                {metric.icon === 'DollarSign' && <DollarSign className="w-3.5 h-3.5 text-blue-600" />}
                {metric.icon === 'ShieldAlert' && <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
                {metric.icon === 'AlertTriangle' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                {metric.icon === 'Lock' && <Lock className="w-3.5 h-3.5 text-purple-600" />}
                {metric.icon === 'FileCheck' && <FileCheck className="w-3.5 h-3.5 text-indigo-600" />}
              </div>
            </div>

            <div className="flex items-baseline gap-1 my-1">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {metric.value}
              </span>
              <span className="text-xs text-slate-500 font-medium">{metric.unit}</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <span
                className={`flex items-center font-medium ${
                  metric.isIncrease ? 'text-emerald-700' : 'text-slate-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{metric.subtext}</p>
          </div>
        ))}
      </div>

      {/* Realtime Charts Row: 24H Volume Flow & Asset Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 24H Volume Flow Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  全国大模型推理 Token 实时吞吐与异动走势 (24小时)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                实时对比合规推理 Token 吞吐与触发骗补/盗刷规则的可疑流量 (单位: 亿 Tokens)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                合规推理吞吐 (亿 Tokens)
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                可疑预警流量 (亿 Tokens)
              </span>
            </div>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_TOKEN_FLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, name: any) => [
                    `${val} 亿 Tokens`,
                    name === 'normalVolumeTokens' ? '合规推理吞吐' : '可疑预警流量',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="normalVolumeTokens"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#normalGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="alertVolumeTokens"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#alertGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Asset Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  大模型资产分布与合规态势
                </h3>
              </div>
              <span className="text-xs text-blue-600 font-semibold">算力探针全覆盖</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              涵盖国产开源备案大模型、境外重点排查模型及违规分发代理
            </p>

            <div className="h-44 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MODEL_TOKEN_SHARE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {MODEL_TOKEN_SHARE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, '流向占比']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2">
              {MODEL_TOKEN_SHARE_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>境外未备案模型 (Claude/GPT等)</span>
            <span className="text-rose-600 font-bold">已联动推理网关限制分发并阻断</span>
          </div>
        </div>
      </div>

      {/* Regional Risk Map & Market Manipulation Events Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Risk Map */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                全国算力枢纽重点风险与Token流向监测
              </h3>
            </div>
            <button
              onClick={() => onNavigate('fund-graph')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>查看算力拓扑</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {REGIONAL_RISK_MAP.map((hub, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-900 text-xs">{hub.region}</span>
                  <span className="text-[11px] font-mono text-slate-600">
                    监测规模: <strong className="text-blue-600">{hub.volume}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>重点防范: <span className="text-slate-700 font-medium">{hub.riskFocus}</span></span>
                  <span className={hub.alertCount > 15 ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                    预警: {hub.alertCount} 起
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Market Manipulation Events */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                重点算力操纵与大模型违规交易识别
              </h3>
            </div>
            <button
              onClick={() => onNavigate('monitoring')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>违规识别专区</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {MARKET_MANIPULATION_EVENTS.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 transition-colors space-y-2 cursor-pointer"
                onClick={() => onNavigate('risk-alerts')}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getAlertBadge(evt.level)}`}>
                    {evt.eventTypeName}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{evt.detectedAt}</span>
                </div>

                <div className="text-xs text-slate-800 font-medium">
                  标的模型/算力池: <span className="text-blue-700 font-semibold">{evt.targetTokenModel}</span> · 主体: <span className="text-slate-700">{evt.primarySuspectGroup}</span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {evt.algorithmEvidence}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                  <span className="text-slate-600 font-medium">
                    涉案骗补/非法获利金额: <strong className="text-rose-600">{evt.estimatedIllicitGainsCNY}</strong>
                  </span>
                  <span className="text-blue-600 font-semibold">AI置信度: {evt.confidenceScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Realtime Suspicious Token Transaction Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">
                实时大模型 Token 异常调用流水与监管触发规则
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              网关流式探针实时捕获：算力券虚假刷量骗补、企业 API Key 异地突发盗刷、未备案模型走私与跨境违规流量
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('monitoring')}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              查看完整监测大厅
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">调用流哈希 / 时间</th>
                <th className="py-3 px-4">推理模型 / 算网节点</th>
                <th className="py-3 px-4">调用发起方 (Entity)</th>
                <th className="py-3 px-4">智算服务方 (Entity)</th>
                <th className="py-3 px-4">Token消耗 / 券补抵扣</th>
                <th className="py-3 px-4">触发监管规则</th>
                <th className="py-3 px-4">预警级别</th>
                <th className="py-3 px-4">操作研判</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {TOKEN_TRANSACTIONS_DATA.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="font-semibold text-slate-900">{tx.txHash}</div>
                    <div className="text-slate-400 text-[10px]">{tx.timestamp}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{tx.tokenModel}</span>
                    <span className="text-[10px] text-blue-600 block">{tx.channelType}</span>
                    <span className="text-[10px] text-slate-400">{tx.modelProvider}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 max-w-[180px] truncate">{tx.fromEntityName}</div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {tx.fromAccount}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 max-w-[180px] truncate">{tx.toEntityName}</div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {tx.toAccount}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-900">{(tx.totalTokens / 10000).toFixed(1)} 万 Tokens</div>
                    <div className="text-[10px] text-purple-700 font-medium">
                      券补: ¥{(tx.voucherSubsidyCNY / 10000).toFixed(2)}万
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      {tx.triggerRule}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getAlertBadge(tx.alertLevel)}`}>
                      {getAlertText(tx.alertLevel)}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      穿透研判
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Inspection Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  大模型 Token 调用流监管穿透卷宗
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">调用流哈希 (Call Hash)</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedTx.txHash}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">大模型与算网集群</span>
                  <span className="font-semibold text-blue-700">{selectedTx.tokenModel} · {selectedTx.modelProvider}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">调用发起方主体与凭证</span>
                  <span className="font-semibold text-slate-900 block">{selectedTx.fromEntityName}</span>
                  <span className="font-mono text-[10px] text-slate-400">{selectedTx.fromAccount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">智算中心与网关</span>
                  <span className="font-semibold text-slate-900 block">{selectedTx.toEntityName}</span>
                  <span className="font-mono text-[10px] text-slate-400">{selectedTx.toAccount}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900">
                <div className="font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>触发监管规则: {selectedTx.triggerRule}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  综合风险评分: <strong className="text-rose-600 font-bold">{selectedTx.riskScore} 分</strong>。
                  {selectedTx.uboGroup && ` 归属同一实际控制人/团伙: 【${selectedTx.uboGroup}】。`}
                  {selectedTx.isCrossBorder && ' 涉及跨境违规调用与数据出境风险，已标记为跨部门联合协查线索。'}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3">
                <span className="font-semibold text-slate-800 block mb-1">Token 消耗与补贴凭据</span>
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div>Prompt: {selectedTx.promptTokens.toLocaleString()}</div>
                  <div>Completion: {selectedTx.completionTokens.toLocaleString()}</div>
                  <div className="font-bold text-slate-900">总计: {selectedTx.totalTokens.toLocaleString()} Tokens</div>
                  <div className="text-purple-700 font-bold">算力券补贴: ¥{(selectedTx.voucherSubsidyCNY / 10000).toFixed(2)} 万元</div>
                  <div className="text-blue-700 font-bold">折合交易规模: ¥{(selectedTx.amountCNY / 10000).toFixed(2)} 万元</div>
                  <div>属地: {selectedTx.jurisdiction}</div>
                  <div>研判状态: <span className="font-bold text-amber-700">{selectedTx.status}</span></div>
                  <div>调用时间: {selectedTx.timestamp}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  onShowToast('已下发算力配额熔断指令', `已对涉案 API Key ${selectedTx.fromAccount} 下达实时阻断令`, 'warning');
                  setSelectedTx(null);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                算力配额熔断
              </button>
              <button
                onClick={() => {
                  onShowToast('已生成司法存证包', `证据编号: TSA-REGTECH-20260920-${Math.floor(Math.random()*9000)+1000}`, 'success');
                  setSelectedTx(null);
                  onNavigate('investigation');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                进入司法存证与立案
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
