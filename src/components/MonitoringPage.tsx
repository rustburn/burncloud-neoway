import React, { useState, useMemo } from 'react';
import {
  SearchCheck,
  Filter,
  Flame,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Zap,
  Layers,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  Building2,
  Lock,
  Search,
  RefreshCw,
  Database,
  Calendar,
  DollarSign,
  Network,
  Cpu,
} from 'lucide-react';
import {
  TOKEN_TRANSACTIONS_DATA,
  MARKET_MANIPULATION_EVENTS,
} from '../mock/regtechData';
import { TokenTransaction, MarketManipulationEvent, AlertLevel } from '../types';

interface MonitoringPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
  initialFilter?: string;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({
  onShowToast,
  onNavigate,
  initialFilter,
}) => {
  const [activeTab, setActiveTab] = useState<'transaction_stream' | 'market_manipulation' | 'historical_retrieval'>('transaction_stream');
  
  // Filters for Transactions
  const [selectedRule, setSelectedRule] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Selected modals
  const [selectedTx, setSelectedTx] = useState<TokenTransaction | null>(null);
  const [selectedManipulation, setSelectedManipulation] = useState<MarketManipulationEvent | null>(null);

  // Historical retrieval form state
  const [historyTimeRange, setHistoryTimeRange] = useState<string>('30d');
  const [historyTarget, setHistoryTarget] = useState<string>('sk-corp-ent-9981-88x9');
  const [isHistoryQuerying, setIsHistoryQuerying] = useState<boolean>(false);
  const [historyResultsCount, setHistoryResultsCount] = useState<number>(142);

  // Filtered token transactions
  const filteredTransactions = useMemo(() => {
    return TOKEN_TRANSACTIONS_DATA.filter((tx) => {
      const matchRule = selectedRule === 'all' || tx.triggerRule.includes(selectedRule);
      const matchModel = selectedModel === 'all' || tx.tokenModel.includes(selectedModel);
      const matchLevel = selectedLevel === 'all' || tx.alertLevel === selectedLevel;
      const matchSearch =
        !searchTerm ||
        tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.fromEntityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.toEntityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.toAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.tokenModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.channelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.uboGroup.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRule && matchModel && matchLevel && matchSearch;
    });
  }, [selectedRule, selectedModel, selectedLevel, searchTerm]);

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

  const getAlertLabel = (level: AlertLevel) => {
    switch (level) {
      case 'red':
        return '红牌·涉嫌违法犯罪';
      case 'orange':
        return '橙牌·高危异常流向';
      case 'yellow':
        return '黄牌·合规存疑排查';
      case 'blue':
      default:
        return '蓝牌·正常备案调用';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <SearchCheck className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              大模型Token交易监测分析与违规识别中心
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              模块 2 · 毫秒级流式探针计算 + 异常模式AI挖掘
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            实时监测大模型推理Token流向：算力券虚假刷量套现、企业API Key盗刷分流、未备案境外模型走私反向代理、跨境违规数据传输与算力恶意囤积操纵。
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('transaction_stream')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'transaction_stream'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Token流向与异常交易 ({filteredTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('market_manipulation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'market_manipulation'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            算力操纵与走私事件 ({MARKET_MANIPULATION_EVENTS.length})
          </button>
          <button
            onClick={() => setActiveTab('historical_retrieval')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'historical_retrieval'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PB级算网日志时序检索
          </button>
        </div>
      </div>

      {/* Tab 1: Token流向与异常交易实时监测 */}
      {activeTab === 'transaction_stream' && (
        <div className="space-y-4">
          {/* Threshold Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[11px]">算力券刷量骗补</span>
              <span className="font-bold text-slate-800 text-sm">单日 &gt; 50 万元</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">空载并发与重复Prompt特征</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[11px]">API Key盗刷异常</span>
              <span className="font-bold text-slate-800 text-sm">异地多IP高频调用</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">凌晨突发激增与暗网分流</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[11px]">未备案模型走私</span>
              <span className="font-bold text-slate-800 text-sm">违规镜像暗网分发</span>
              <span className="text-[10px] text-purple-600 block mt-0.5">境外闭源模型反向代理排查</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[11px]">跨境数据违规出境</span>
              <span className="font-bold text-slate-800 text-sm">跨境流量包未申报</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">涉及重要敏感算法与数据出境</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[11px]">算力囤积炒作</span>
              <span className="font-bold text-slate-800 text-sm">溢价率 &gt; 80%</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">智算配额垄断与虚假倒卖</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索调用哈希 / 企业名称 / API Key / 算力集群 / 关联团伙..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Rule selector */}
              <select
                value={selectedRule}
                onChange={(e) => setSelectedRule(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option value="all">全部监管触发规则</option>
                <option value="骗补">算力券骗补核查</option>
                <option value="盗刷">API Key 盗刷异动</option>
                <option value="走私">未备案模型走私倒卖</option>
                <option value="跨境">跨境数据违规出境</option>
                <option value="囤积">算力资源囤积与垄断</option>
                <option value="正常">合规备案放行</option>
              </select>

              {/* Model selector */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option value="all">全部大模型类型</option>
                <option value="DeepSeek">DeepSeek-R1 / V3 系列</option>
                <option value="Claude">Claude-3.5 (境外未备案走私)</option>
                <option value="Qwen">Qwen-2.5 (通义开源)</option>
                <option value="GPT">GPT-4o (境外未备案转售)</option>
                <option value="Llama">Llama-3.3 (开源衍生微调)</option>
              </select>

              {/* Risk level selector */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500"
              >
                <option value="all">全部风险级别</option>
                <option value="red">红牌 (高危涉案)</option>
                <option value="orange">橙牌 (异动监测)</option>
                <option value="yellow">黄牌 (合规存疑)</option>
                <option value="blue">蓝牌 (备案放行)</option>
              </select>

              {/* Export Button */}
              <button
                onClick={() => onShowToast('已导出Token流向监测报表', '已生成国家网信办/工信部规范格式的 CSV 审计流水', 'success')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>导出监管流水清单</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">调用流哈希 / 时间</th>
                    <th className="py-3 px-4">推理模型 / 算网节点</th>
                    <th className="py-3 px-4">调用实体 / 凭证Key</th>
                    <th className="py-3 px-4">智算服务方 / 网关</th>
                    <th className="py-3 px-4">Token量 / 算力券抵扣</th>
                    <th className="py-3 px-4">触发规则</th>
                    <th className="py-3 px-4">预警级别</th>
                    <th className="py-3 px-4">关联控制人(UBO)</th>
                    <th className="py-3 px-4">监管操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {filteredTransactions.map((tx) => (
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
                        <div className="font-medium text-slate-900 max-w-[160px] truncate">{tx.fromEntityName}</div>
                        <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[160px]">
                          {tx.fromAccount}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 max-w-[160px] truncate">{tx.toEntityName}</div>
                        <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[160px]">
                          {tx.toAccount}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-900">{(tx.totalTokens / 10000).toFixed(1)} 万 Tokens</div>
                        <div className="text-[10px] text-purple-700 font-medium">
                          券补: ¥{(tx.voucherSubsidyCNY / 10000).toFixed(2)}万 / 总: ¥{(tx.costCNY / 10000).toFixed(2)}万
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          {tx.triggerRule}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getAlertBadge(tx.alertLevel)}`}>
                          {getAlertLabel(tx.alertLevel).split('·')[0]}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] text-slate-600 block max-w-[140px] truncate" title={tx.uboGroup}>
                          {tx.uboGroup || '未定性团伙'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="px-2 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            穿透
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('fund-graph');
                              onShowToast('已载入Token流向图谱', `已将调用流 ${tx.txHash} 导入图数据库进行溯源穿透`, 'info');
                            }}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                            title="查看Token流向穿透图谱"
                          >
                            <Network className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 算力操纵与违规事件 (Wash Trading, Smurfing, Key Theft, Voucher Fraud) */}
      {activeTab === 'market_manipulation' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
            <div className="font-semibold flex items-center gap-1.5 mb-1 text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>大模型算力异常交易与黑产挖掘引擎 (GNN图拓扑 + 时序异常挖掘)</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              基于毫秒级 API 网关流式探针与拓扑神经网络，实时甄别：算力券虚假刷量套现、跨境内外镜像反向代理未备案模型、企业高权 API Key 异地突发盗刷倒卖及智算配额哄抬转售。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MARKET_MANIPULATION_EVENTS.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getAlertBadge(evt.level)}`}>
                      {evt.eventTypeName}
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {evt.targetTokenModel}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{evt.detectedAt}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">价格波动 / 补贴偏差</span>
                    <span className="font-semibold text-rose-600">{evt.priceVolatility}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Token流量异动</span>
                    <span className="font-semibold text-slate-900">{evt.volumeAnomaly}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">涉案协同账户/节点数</span>
                    <span className="font-bold text-blue-700">{evt.involvedAccountsCount} 个协同主体</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">涉嫌骗补/非法获利金额</span>
                    <span className="font-bold text-rose-600">{evt.estimatedIllicitGainsCNY}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-800 block mb-1">
                    涉案主体与实际控制人画像:
                  </span>
                  <p className="text-xs text-slate-700 font-medium bg-slate-100/70 p-2 rounded-lg">
                    {evt.primarySuspectGroup}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-800 block mb-1">
                    算法研判证据与规则吻合度:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {evt.algorithmEvidence}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">AI 置信度:</span>
                    <span className="font-mono font-bold text-emerald-600">{evt.confidenceScore}%</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-amber-700 font-medium">处置: {evt.status}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedManipulation(evt);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      查看详情
                    </button>
                    <button
                      onClick={() => {
                        onShowToast('已生成违规处置与立案卷宗', `已为【${evt.targetTokenModel}】涉案线索生成司法取证证据包`, 'success');
                        onNavigate('investigation');
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      立案存证
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: PB级数据湖时序检索 */}
      {activeTab === 'historical_retrieval' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Database className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                国家大模型监管沙盒 PB 级时序冷温热数据湖穿透检索
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              提供全国算力枢纽历史 5-10 年大模型 Token 流水追溯、企业多 Key 时间线推演与关联主体图谱回溯，支撑网信、工信与公安经侦对长期虚假骗补、黑产洗钱的取证固定。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">回溯时间范围</label>
                <select
                  value={historyTimeRange}
                  onChange={(e) => setHistoryTimeRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                >
                  <option value="7d">近 7 天 Token 流水 (实时热数据)</option>
                  <option value="30d">近 30 天算力券调用 (温存储索引)</option>
                  <option value="1y">近 1 年全量智算中心归档</option>
                  <option value="3y">近 3 年涉案异常追溯池</option>
                  <option value="5y">近 5-10 年司法不可篡改底账库</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">检索主体 / API Key / 流哈希</label>
                <input
                  type="text"
                  value={historyTarget}
                  onChange={(e) => setHistoryTarget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono"
                  placeholder="输入目标 API Key 或企业统一信用代码"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setIsHistoryQuerying(true);
                    setTimeout(() => {
                      setIsHistoryQuerying(false);
                      setHistoryResultsCount(218);
                      onShowToast('数据湖回溯完成', `在近 ${historyTimeRange} 历史归档中检索到 218 笔大模型调用流记录`, 'success');
                    }, 600);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-md shadow-blue-900/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isHistoryQuerying ? 'animate-spin' : ''}`} />
                  <span>{isHistoryQuerying ? '检索湖仓中...' : '启动数据湖回溯穿透'}</span>
                </button>
              </div>
            </div>

            {/* Retrieval Result Preview */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  回溯检索结果: 匹配到 {historyResultsCount} 笔涉案大模型调用流水记录
                </span>
                <span className="text-[11px] text-slate-500">湖仓响应延迟: 180ms</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>• 历史最早异常调用时间: 2025-08-12 02:15:22 (由境外住宅代理 IP 突发并发 500+ 会话)</p>
                <p>• 涉案算力券补贴累计套现: 1,840 万元人民币 (先后经由 12 家空壳壳公司虚假核销)</p>
                <p>• 关联司法立案记录: 公安部网安经侦局已实施电子证据锁定并开展线索追踪</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Inspection Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SearchCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Token 调用监管穿透与异常判据卷宗
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
                  <span className="text-slate-400 block text-[11px]">智算服务提供方与网关</span>
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
                  {selectedTx.isCrossBorder && ' 涉及跨境违规调用与数据出境风险，已同步推送网信与经侦专网。'}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3">
                <span className="font-semibold text-slate-800 block mb-1">Token 消耗与算力券补贴明细</span>
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div>Prompt: {selectedTx.promptTokens.toLocaleString()}</div>
                  <div>Completion: {selectedTx.completionTokens.toLocaleString()}</div>
                  <div className="font-bold text-slate-900">总计: {selectedTx.totalTokens.toLocaleString()} Tokens</div>
                  <div className="text-purple-700 font-bold">算力券补贴: ¥{(selectedTx.voucherSubsidyCNY / 10000).toFixed(2)} 万元</div>
                  <div className="text-blue-700 font-bold">折合交易规模: ¥{(selectedTx.amountCNY / 10000).toFixed(2)} 万元</div>
                  <div>监管属地: {selectedTx.jurisdiction}</div>
                  <div>研判状态: <span className="font-bold text-amber-700">{selectedTx.status}</span></div>
                  <div>调用时间: {selectedTx.timestamp}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  onShowToast('已下达算力配额熔断拦截指令', `已向推理网关下发对 ${selectedTx.fromAccount} 的 API Key 熔断封堵指令`, 'warning');
                  setSelectedTx(null);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                算力配额熔断 / 封停
              </button>
              <button
                onClick={() => {
                  onShowToast('已导入图数据库进行穿透', `已加载 ${selectedTx.fromAccount} 算力流向追踪拓扑`, 'info');
                  setSelectedTx(null);
                  onNavigate('fund-graph');
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Token流向穿透图谱
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manipulation Event Drawer */}
      {selectedManipulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  大模型违规交易专项稽查卷宗详情
                </h3>
              </div>
              <button
                onClick={() => setSelectedManipulation(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">违规类型:</span>
                  <span className="font-bold text-slate-800">{selectedManipulation.eventTypeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">标的模型/算力池:</span>
                  <span className="font-bold text-blue-700">{selectedManipulation.targetTokenModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">涉案主体/团伙:</span>
                  <span className="font-bold text-rose-700">{selectedManipulation.primarySuspectGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">涉案骗补/非法获利金额:</span>
                  <span className="font-bold text-rose-600 font-mono">{selectedManipulation.estimatedIllicitGainsCNY}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <span className="font-semibold block mb-1">稽查算法证据链:</span>
                <p className="leading-relaxed">{selectedManipulation.algorithmEvidence}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  onShowToast('已下发跨部门联合立案通知', `涉案标的 ${selectedManipulation.targetTokenModel} 卷宗已推送至工信与经侦联合办案组`, 'success');
                  setSelectedManipulation(null);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                下发联合立案处置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

