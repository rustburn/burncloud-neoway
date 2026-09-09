import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Building2,
  Server,
  ShieldAlert,
  CheckCircle2,
  PlayCircle,
  Filter,
  RefreshCw,
  Globe2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Eye,
  Shield,
  Layers,
  Sparkles,
  Lock,
  Pause,
  Play,
  RotateCcw,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CORE_METRICS,
  CROSS_BORDER_ROUTES,
  INITIAL_LIVE_CALLS,
  HOURLY_TOKEN_TREND,
  COUNTRY_RANKING,
  MODEL_USAGE_SHARE,
  RISK_TYPE_DISTRIBUTION,
  ENTERPRISES_DATA,
} from '../mock/data';
import { LiveCallItem, RouteItem } from '../types';

interface OverviewPageProps {
  onNavigate: (page: string) => void;
  onSelectEnterprise?: (entId: string) => void;
  onSelectTrace?: (traceId: string) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  onSelectEnterprise,
  onSelectTrace,
  onShowToast,
}) => {
  // Filters
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');
  const [selectedEnt, setSelectedEnt] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedBizType, setSelectedBizType] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');

  // Real-time live call feed with auto-tick
  const [liveCalls, setLiveCalls] = useState<LiveCallItem[]>(INITIAL_LIVE_CALLS);
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Selected pipeline node for inspection
  const [activePipelineStep, setActivePipelineStep] = useState(2);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem>(CROSS_BORDER_ROUTES[0]);

  // Auto add live calls every 4 seconds when active
  useEffect(() => {
    if (!isLiveActive) return;
    const interval = setInterval(() => {
      const sampleEnterprises = [
        '广州智算科技有限公司',
        '南沙跨境智能服务有限公司',
        '汕头国际数据加工有限公司',
        '上海临港模型服务有限公司',
        '海珠数字内容科技有限公司',
      ];
      const sampleCountries = ['新加坡', '中国香港', '马来西亚', '泰国', '德国'];
      const sampleModels = ['DeepSeek-V3', 'Qwen-2.5-72B', 'GLM-4-Air', 'DeepSeek-R1', 'Yi-Lightning'];
      const sampleBiz: ('Token出海' | '外数中算' | '跨境AI推理')[] = ['Token出海', '外数中算', '跨境AI推理'];
      const sampleRisks: ('正常' | '低风险' | '中风险' | '高风险')[] = ['正常', '正常', '正常', '中风险', '高风险'];
      const sampleStatus: ('处理完成' | '安全脱敏' | '计算中' | '已阻断')[] = ['处理完成', '处理完成', '安全脱敏', '计算中'];

      const randCountry = sampleCountries[Math.floor(Math.random() * sampleCountries.length)];
      const randRisk = sampleRisks[Math.floor(Math.random() * sampleRisks.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const newCall: LiveCallItem = {
        id: `call-${Date.now()}`,
        time: timeStr,
        enterprise: sampleEnterprises[Math.floor(Math.random() * sampleEnterprises.length)],
        sourceCountry: randCountry,
        businessType: sampleBiz[Math.floor(Math.random() * sampleBiz.length)],
        model: sampleModels[Math.floor(Math.random() * sampleModels.length)],
        tokenCount: Math.floor(Math.random() * 8000) + 1200,
        riskLevel: randRisk,
        status: randRisk === '高风险' ? '已阻断' : sampleStatus[Math.floor(Math.random() * sampleStatus.length)],
      };

      setLiveCalls((prev) => [newCall, ...prev.slice(0, 14)]);
    }, 3800);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Pipeline 8 Stages
  const pipelineStages = [
    {
      id: 1,
      title: '海外用户',
      sub: '终端/客户接入',
      role: '境外发起',
      details: {
        sourceCountry: '新加坡 / 马来西亚 / 香港等',
        dataType: '结构化报文 / 商业提示词',
        model: '等待分流',
        computeNode: '边境接入点',
        tokenCount: '4,120 avg',
        status: 'TLS 1.3 密文',
        risk: '正常',
      },
    },
    {
      id: 2,
      title: '合规跨境通道',
      sub: '国际数据专线',
      role: '受控传输',
      details: {
        sourceCountry: selectedRoute.from,
        dataType: '加密专线数据包',
        model: '未解耦',
        computeNode: selectedRoute.to,
        tokenCount: '带宽 ' + selectedRoute.bandwidth,
        status: '专线物理连通',
        risk: '合规通道A级',
      },
    },
    {
      id: 3,
      title: '有方监管网关',
      sub: '鉴权与路由分流',
      role: '沙盒前哨',
      details: {
        sourceCountry: '经专线入口',
        dataType: 'API 握手帧',
        model: '白名单校验',
        computeNode: '有方核心审计集群',
        tokenCount: '实时计量扣减',
        status: '企业身份有效',
        risk: '正常',
      },
    },
    {
      id: 4,
      title: '数据分类分级',
      sub: '敏感信息/PII脱敏',
      role: '特征识别',
      details: {
        sourceCountry: '境外',
        dataType: '商业文案 / 个人信息(脱敏)',
        model: '特征提取',
        computeNode: '有方规则引擎',
        tokenCount: '4,120 Tokens',
        status: 'L1/L2数据判定',
        risk: '自动脱敏保护',
      },
    },
    {
      id: 5,
      title: '隔离计算沙盒',
      sub: '可用不可见/不出域',
      role: '安全受控',
      details: {
        sourceCountry: '隔离飞地',
        dataType: '内存加密执行体',
        model: '挂载运行',
        computeNode: '南沙/汕头隔离区',
        tokenCount: '动态配额管控',
        status: '内存即用即毁',
        risk: '零数据溢出',
      },
    },
    {
      id: 6,
      title: '国内模型/算力节点',
      sub: 'DeepSeek/Qwen等',
      role: 'AI 推理',
      details: {
        sourceCountry: '国内GPU集群',
        dataType: '模型权重计算',
        model: 'DeepSeek-V3 / Qwen-2.5',
        computeNode: '广州南沙智算节点',
        tokenCount: '输入 1,840 / 输出 2,280',
        status: '推理生成完成',
        risk: '白名单已备案',
      },
    },
    {
      id: 7,
      title: '输出内容安全检查',
      sub: '双向审查与过滤',
      role: '合规出境卡口',
      details: {
        sourceCountry: '待返回境外',
        dataType: 'AI 最终回复结果',
        model: '网信办标准比对',
        computeNode: '双向审查网关',
        tokenCount: '输出内容合规比对',
        status: '安全放行',
        risk: '合规度 99.8%',
      },
    },
    {
      id: 8,
      title: '结果返回海外',
      sub: '出关回传与证据存证',
      role: '全流程留痕',
      details: {
        sourceCountry: '返回目的国',
        dataType: '脱敏生成成果',
        model: '调用完毕',
        computeNode: '出口专线网关',
        tokenCount: '生成完毕',
        status: '存证上链锁定',
        risk: 'SHA-256 存证完毕',
      },
    },
  ];

  const currentStageInfo = pipelineStages.find((s) => s.id === activePipelineStep) || pipelineStages[2];

  const getMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-600" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-teal-600" />;
      case 'Server':
        return <Server className="w-5 h-5 text-sky-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Activity className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === 'today' ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              今日
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === '7d' ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              最近7天
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === '30d' ? 'bg-white text-blue-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              最近30天
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Filters */}
          <select
            value={selectedEnt}
            onChange={(e) => setSelectedEnt(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">企业: 全部 (28家)</option>
            <option value="guangzhou">广州智算科技</option>
            <option value="nansha">南沙跨境智能</option>
            <option value="shantou">汕头国际数据</option>
            <option value="shanghai">上海临港模型</option>
            <option value="haizhu">海珠数字内容</option>
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">国家/地区: 全部</option>
            <option value="singapore">新加坡</option>
            <option value="hongkong">中国香港</option>
            <option value="malaysia">马来西亚</option>
            <option value="thailand">泰国</option>
            <option value="germany">德国</option>
          </select>

          <select
            value={selectedBizType}
            onChange={(e) => setSelectedBizType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">业务类型: 全部</option>
            <option value="outbound">Token出海 (跨境AI服务)</option>
            <option value="inbound">外数中算 (入境加工)</option>
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">模型: 全部备案模型</option>
            <option value="deepseek-v3">DeepSeek-V3</option>
            <option value="qwen-2.5">Qwen-2.5-72B</option>
            <option value="glm-4">GLM-4-Air</option>
            <option value="yi">Yi-Lightning</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">风险等级: 全部</option>
            <option value="normal">正常 (放行)</option>
            <option value="medium">中风险 (脱敏/限流)</option>
            <option value="high">高危 (自动阻断)</option>
          </select>
        </div>

        {/* Operational Filter Actions & Active Scan */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedEnt('all');
              setSelectedCountry('all');
              setSelectedBizType('all');
              setSelectedModel('all');
              setSelectedRisk('all');
              if (onShowToast) onShowToast('筛选条件已重置', '显示全网跨境监控全量态势', 'info');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="重置筛选"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (onShowToast) {
                onShowToast('全网探针即时巡检完成', '46 个物理算力节点响应正常，5 条国际专线密钥验证通过，无离线异常', 'success');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all"
            title="执行全网探针巡检"
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>探针即时巡检</span>
          </button>

          <button
            onClick={() => {
              if (onShowToast) {
                onShowToast('态势快报已生成并导出', '《国家跨境AI算力服务合规监管沙盒·态势日度快报》已归档并生成数字签名', 'success');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-blue-100" />
            <span>导出态势快报</span>
          </button>
        </div>
      </div>

      {/* Row 1: 6 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CORE_METRICS.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{metric.title}</span>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                {getMetricIcon(metric.icon)}
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 tracking-tight">{metric.value}</span>
                <span className="text-xs text-slate-500">{metric.unit}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span
                  className={`font-semibold flex items-center gap-0.5 ${
                    metric.isIncrease ? 'text-emerald-600' : 'text-slate-600'
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </span>
                <span className="text-slate-400 truncate max-w-[110px]" title={metric.subtext}>
                  {metric.subtext}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Centerpiece Pipeline & Real-Time Call Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Central Cross-Border Pipeline & Routes Visualizer (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">跨境 AI 服务流转图</h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200">
                全链路沙盒监管态势
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>通道状态: 正常受控</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] text-slate-400">点击下方节点查看实时监管研判</span>
            </div>
          </div>

          {/* Interactive Pipeline Steps Flowchart */}
          <div className="py-2">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 relative">
              {pipelineStages.map((stage, idx) => {
                const isSelected = activePipelineStep === stage.id;
                return (
                  <div
                    key={stage.id}
                    onClick={() => setActivePipelineStep(stage.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative group flex flex-col justify-between min-h-[96px] ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                        <span>0{stage.id}</span>
                        <span
                          className={`px-1 py-0.2 rounded text-[9px] ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {stage.role}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-bold leading-snug ${
                          isSelected ? 'text-blue-900' : 'text-slate-800'
                        }`}
                      >
                        {stage.title}
                      </h4>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                      {stage.sub}
                    </p>

                    {/* Subtle connecting arrow for items except last */}
                    {idx < pipelineStages.length - 1 && (
                      <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Live Inspection Card */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-white">
                  当前节点实时研判: 【{currentStageInfo.title}】
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({currentStageInfo.sub})
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700 font-mono">
                有方网关探针 ID: PROBE-0{currentStageInfo.id}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">请求来源国家/地区</span>
                <span className="font-medium text-slate-200">{currentStageInfo.details.sourceCountry}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">数据类型与特征</span>
                <span className="font-medium text-slate-200">{currentStageInfo.details.dataType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">调用模型</span>
                <span className="font-medium text-blue-300 font-mono">{currentStageInfo.details.model}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">算力节点位置</span>
                <span className="font-medium text-slate-200">{currentStageInfo.details.computeNode}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Token 消耗量</span>
                <span className="font-medium text-amber-300 font-mono">{currentStageInfo.details.tokenCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">当前处理状态</span>
                <span className="font-medium text-emerald-400">{currentStageInfo.details.status}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block">风险状态研判</span>
                <span className="font-semibold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {currentStageInfo.details.risk} (合规受控)
                </span>
              </div>
            </div>
          </div>

          {/* Simulated Cross-Border Routes Showcase */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                跨境合规专线路由监控 (5条核心通道)
              </span>
              <span className="text-[11px] text-slate-500">
                当前聚焦: <span className="font-semibold text-blue-700">{selectedRoute.from} → {selectedRoute.to}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {CROSS_BORDER_ROUTES.map((route) => {
                const isSelected = selectedRoute.id === route.id;
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 shadow-xs ring-1 ring-blue-400'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-800">
                      <span>{route.from}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[65px]">{route.to.split('算力')[0]}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{route.latency}</span>
                      <span className="text-blue-600">{route.bandwidth}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Real-time Cross-border Calls Stream (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">实时跨境调用</h2>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiveActive(!isLiveActive)}
                  className={`p-1 rounded-md text-xs transition-colors ${
                    isLiveActive
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={isLiveActive ? '暂停实时滚动' : '继续实时滚动'}
                >
                  {isLiveActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onNavigate('cross-border')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  全量追溯 →
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 my-2">
              每隔几秒自动推入境内外 API 握手与 Token 消耗流水：
            </p>

            {/* Stream List */}
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {liveCalls.map((call) => {
                const riskBadge = {
                  正常: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  低风险: 'bg-blue-50 text-blue-700 border-blue-200',
                  中风险: 'bg-amber-50 text-amber-800 border-amber-200',
                  高风险: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
                }[call.riskLevel];

                return (
                  <div
                    key={call.id}
                    onClick={() => onNavigate('cross-border')}
                    className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-xs cursor-pointer group animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-medium text-slate-900">
                        <span className="font-mono text-[11px] text-slate-400">{call.time}</span>
                        <span className="truncate max-w-[130px] font-semibold">{call.enterprise}</span>
                      </div>
                      <span className={`px-1.5 py-0.2 rounded border text-[10px] ${riskBadge}`}>
                        {call.riskLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 mt-1">
                      <div>
                        <span>来源: </span>
                        <span className="text-slate-800 font-medium">{call.sourceCountry}</span>
                        <span className="text-slate-400"> ({call.businessType})</span>
                      </div>
                      <div className="text-right">
                        <span>模型: </span>
                        <span className="font-mono text-blue-700 font-medium">{call.model}</span>
                      </div>
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-mono">
                        消耗: <strong className="text-slate-900">{call.tokenCount.toLocaleString()}</strong> Tokens
                      </span>
                      <span
                        className={`font-medium ${
                          call.status === '已阻断'
                            ? 'text-rose-600'
                            : call.status === '安全脱敏'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {call.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              数据流速: 约 1,850 QPS · 网关实时审计在线
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Five Analytics Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Token Hourly Trend AreaChart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Token 调用趋势折线图</h3>
              <p className="text-[11px] text-slate-500">今日24小时 Token 出海与外数中算对比 (单位: 亿)</p>
            </div>
            <span className="text-xs text-blue-600 font-medium">386.42亿总量</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_TOKEN_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="token出海" stroke="#2563eb" fillOpacity={1} fill="url(#colorOutbound)" strokeWidth={2} name="Token出海" />
                <Area type="monotone" dataKey="外数中算" stroke="#0d9488" fillOpacity={1} fill="url(#colorInbound)" strokeWidth={2} name="外数中算" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Country Call Volume Ranking */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900">各国家调用量排名</h3>
              <p className="text-[11px] text-slate-500">按境外来源国家/地区请求总量排序 (单位: 万次)</p>
            </div>
            <span className="text-xs text-slate-400">Top 5 境外区域</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COUNTRY_RANKING} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="requests" fill="#3b82f6" radius={[0, 4, 4, 0]} name="请求量(万次)" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Model Usage Share (Pie / Donut) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900">模型使用占比</h3>
              <p className="text-[11px] text-slate-500">各已备案模型 Token 消耗分布占比</p>
            </div>
            <span className="text-xs text-blue-600 font-mono">DeepSeek 50%</span>
          </div>
          <div className="h-56 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MODEL_USAGE_SHARE}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {MODEL_USAGE_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => `${val}%`}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Risk Type Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900">风险类型分布</h3>
              <p className="text-[11px] text-slate-500">今日沙盒风控引擎拦截的 17 件违规事件构成</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
              17件
            </span>
          </div>
          <div className="space-y-3 pt-1">
            {RISK_TYPE_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">{item.type}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        item.level === '极高'
                          ? 'bg-rose-100 text-rose-800'
                          : item.level === '高'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.level}危
                    </span>
                    <span className="font-bold text-slate-900 font-mono">{item.count} 件</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.level === '极高' ? 'bg-rose-600' : item.level === '高' ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${(item.count / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Enterprise Compliance Score Ranking */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900">企业合规评分排行</h3>
              <p className="text-[11px] text-slate-500">基于备案真实性、专线受控度、脱敏遵从度与风控记录的综合评定</p>
            </div>
            <button
              onClick={() => onNavigate('enterprise')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              全部28家企业 →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-2 whitespace-nowrap min-w-[50px]">排名</th>
                  <th className="pb-2 whitespace-nowrap min-w-[150px]">企业名称</th>
                  <th className="pb-2 whitespace-nowrap min-w-[90px]">业务类型</th>
                  <th className="pb-2 whitespace-nowrap min-w-[100px]">今日消耗</th>
                  <th className="pb-2 whitespace-nowrap min-w-[100px]">沙盒状态</th>
                  <th className="pb-2 text-right whitespace-nowrap min-w-[80px]">合规评分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ENTERPRISES_DATA.map((ent, idx) => (
                  <tr
                    key={ent.id}
                    onClick={() => {
                      if (onSelectEnterprise) onSelectEnterprise(ent.id);
                      onNavigate('enterprise');
                    }}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-bold font-mono text-slate-500 whitespace-nowrap">
                      {idx === 0 ? (
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-[10px]">
                          3
                        </span>
                      ) : (
                        <span className="pl-1.5">{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-2.5 font-semibold text-slate-900 whitespace-nowrap">{ent.name}</td>
                    <td className="py-2.5 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        {ent.businessType}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-700 whitespace-nowrap">{ent.todayTokens}</td>
                    <td className="py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          ent.status === '已通过'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ent.status === '技术验证中'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : ent.status === '限制运行'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {ent.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold whitespace-nowrap">
                      <span
                        className={
                          ent.complianceScore >= 90
                            ? 'text-emerald-600'
                            : ent.complianceScore >= 80
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        {ent.complianceScore}分
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
