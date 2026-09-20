import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Filter,
  Plus,
  Send,
  UserCheck,
  Building2,
  FileCheck,
  Search,
  Lock,
  ChevronRight,
  RefreshCw,
  Terminal,
  Shield,
  Layers,
  FileSpreadsheet,
  Network,
} from 'lucide-react';
import {
  RISK_ALERT_TICKETS_DATA,
  TOKEN_WATCHLIST_ENTRIES,
} from '../mock/regtechData';
import { RiskAlertTicket, WatchlistEntry, AlertLevel } from '../types';

interface RiskAlertsPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
}

export const RiskAlertsPage: React.FC<RiskAlertsPageProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const [tickets, setTickets] = useState<RiskAlertTicket[]>(RISK_ALERT_TICKETS_DATA);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(TOKEN_WATCHLIST_ENTRIES);
  const [activeTab, setActiveTab] = useState<'tickets' | 'scoring_model' | 'watchlist'>('tickets');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<RiskAlertTicket | null>(null);
  const [isHandling, setIsHandling] = useState(false);

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    if (selectedLevel === 'all') return true;
    return t.level === selectedLevel;
  });

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

  const getAlertTitle = (level: AlertLevel) => {
    switch (level) {
      case 'red':
        return '🔴 红牌·涉嫌严重犯罪';
      case 'orange':
        return '🟠 橙牌·高危异常行为';
      case 'yellow':
        return '🟡 黄牌·合规存疑排查';
      case 'blue':
      default:
        return '🔵 蓝牌·常规备案放行';
    }
  };

  const handleActionTicket = (ticketId: string, actionText: string) => {
    setIsHandling(true);
    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status: '已采取冻结措施',
                actionsTaken: [...t.actionsTaken, actionText],
              }
            : t
        )
      );
      setIsHandling(false);
      onShowToast('工单处置状态已更新', `已执行：${actionText}，处置留痕已写入不可篡改底账`, 'success');
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) =>
          prev
            ? {
                ...prev,
                status: '已采取冻结措施',
                actionsTaken: [...prev.actionsTaken, actionText],
              }
            : null
        );
      }
    }, 400);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>风险预警与分级响应处置工单中心</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
              模块 3 · 30分钟闭环应急响应机制
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            红/橙/黄/蓝四级敏捷预警机制 · 0-100分Token交易合规多维评分模型 · 黑白灰名单库动态联防联控与实时阻断
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'tickets'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            预警工单看板 ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('scoring_model')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'scoring_model'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            0-100分综合风险评级模型
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'watchlist'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            黑白灰名单库 ({watchlist.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Tickets List */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* Four-tier alert level summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div
              onClick={() => setSelectedLevel(selectedLevel === 'red' ? 'all' : 'red')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedLevel === 'red'
                  ? 'border-rose-500 bg-rose-50/70 shadow-xs ring-2 ring-rose-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-700">🔴 红牌预警</span>
                <span className="font-mono font-bold text-base text-rose-600">2 起</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">涉嫌算力券骗补套现/API盗刷/跨境走私</p>
              <div className="mt-2 text-[10px] text-rose-600 font-medium">
                处置时限: 30分钟内完成配额熔断与工单流转
              </div>
            </div>

            <div
              onClick={() => setSelectedLevel(selectedLevel === 'orange' ? 'all' : 'orange')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedLevel === 'orange'
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-700">🟠 橙牌预警</span>
                <span className="font-mono font-bold text-base text-amber-600">2 起</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">自动化Prompt轰炸刷量/异地并发调用高危</p>
              <div className="mt-2 text-[10px] text-amber-600 font-medium">
                处置时限: 2小时内人工核查与限流限额
              </div>
            </div>

            <div
              onClick={() => setSelectedLevel(selectedLevel === 'yellow' ? 'all' : 'yellow')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedLevel === 'yellow'
                  ? 'border-yellow-500 bg-yellow-50/70 shadow-xs ring-2 ring-yellow-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-yellow-800">🟡 黄牌预警</span>
                <span className="font-mono font-bold text-base text-yellow-700">1 起</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">算法未备案存疑/数据出境未申报排查</p>
              <div className="mt-2 text-[10px] text-yellow-700 font-medium">
                处置时限: 24小时内调取业务凭证与语料说明
              </div>
            </div>

            <div
              onClick={() => setSelectedLevel(selectedLevel === 'blue' ? 'all' : 'blue')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedLevel === 'blue'
                  ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-700">🔵 蓝牌备案</span>
                <span className="font-mono font-bold text-base text-blue-600">1 起</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">智算中心合规备案模型常规调度流转</p>
              <div className="mt-2 text-[10px] text-blue-600 font-medium">
                处置时限: 自动化留痕与归档备查
              </div>
            </div>
          </div>

          {/* Ticket Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getAlertBadge(ticket.level)}`}>
                      {getAlertTitle(ticket.level)}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-bold">{ticket.ticketNo}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>倒计时: {Math.floor(ticket.responseTimeRemaining / 60)}分{ticket.responseTimeRemaining % 60}秒</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                    {ticket.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>目标主体: <strong className="text-slate-800">{ticket.targetEntity}</strong></span>
                    <span>•</span>
                    <span>承办机构: <strong className="text-blue-700">{ticket.assignedTo}</strong></span>
                  </div>
                </div>

                {/* Risk Score Breakdown Meter */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">0-100分综合风险评级:</span>
                    <span className="font-mono font-bold text-rose-600 text-sm">
                      {ticket.riskScoreBreakdown.totalScore} 分
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <div className="text-slate-400">交易异常(40%)</div>
                      <div className="font-bold text-slate-800">{ticket.riskScoreBreakdown.transactionAnomaly}</div>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <div className="text-slate-400">网络团伙(30%)</div>
                      <div className="font-bold text-slate-800">{ticket.riskScoreBreakdown.networkClusterRisk}</div>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <div className="text-slate-400">舆情暗网(20%)</div>
                      <div className="font-bold text-slate-800">{ticket.riskScoreBreakdown.sentimentRisk}</div>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <div className="text-slate-400">资质历史(10%)</div>
                      <div className="font-bold text-slate-800">{ticket.riskScoreBreakdown.entityRisk}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    处置状态: <strong className="text-amber-700">{ticket.status}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      研判详情
                    </button>
                    <button
                      onClick={() => handleActionTicket(ticket.id, '紧急下发风控止付令并推送经侦')}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      应急处置
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 0-100分综合风险评级模型 */}
      {activeTab === 'scoring_model' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                大模型 Token 交易与算力券核销 0-100 分量化风险评分矩阵设计规范
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              系统采用多维动态特征加权体系，通过大模型调用探针数据、图神经网络与 XGBoost 分类器对每一笔 Token 消耗流水、参与主体与关联算力券核销进行毫秒级实时评分。评分达到 80 分触发橙牌，90 分以上触发红牌。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-sm">Token 异动特征</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">40% 权重</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  单笔及单日 Token 消耗异常激增、Prompt 长度与语义熵值固定、API Key 并发请求异常突发、凌晨反常高频批量调用等。
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 text-sm">算力拓扑与团伙</span>
                  <span className="font-mono font-bold text-indigo-600 text-sm">30% 权重</span>
                </div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  虚假中继代理穿透、同一控制人(UBO)关联企业骗补集群、自动化刷量云服务器指纹聚集、境外反向代理出口跳数等。
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 text-sm">暗网与黑产情报</span>
                  <span className="font-mono font-bold text-purple-600 text-sm">20% 权重</span>
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">
                  暗网代调论坛低价 API Key 抛售、黑灰产社群有偿招募算力券刷量人头、社工库泄露 API 凭证比对命中、敏感词高频试探等。
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">模型备案与合规资质</span>
                  <span className="font-mono font-bold text-slate-600 text-sm">10% 权重</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  国家网信办深度合成算法备案查验状态、算力券申领真实性审核、企业工商存续状态、网络安全与数据违规行政处罚记录。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 黑白灰名单库 */}
      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              跨部门协同黑名单、灰名单与沙盒白名单互认共享底库
            </span>
            <button
              onClick={() => onShowToast('添加名单记录', '已打开跨机构协同名单录入弹窗', 'info')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>录入新名单</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">名单类型</th>
                  <th className="py-3 px-4">标识 / 账户实体</th>
                  <th className="py-3 px-4">分类标签</th>
                  <th className="py-3 px-4">列入依据与案由</th>
                  <th className="py-3 px-4">录入监管机构</th>
                  <th className="py-3 px-4">拦截匹配次</th>
                  <th className="py-3 px-4">管控状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {watchlist.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type === 'blacklist'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.type === 'blacklist' ? '黑名单·禁止交易' : '灰名单·重点排查'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.identifierOrEntity}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={item.reason}>
                      {item.reason}
                    </td>
                    <td className="py-3 px-4 text-blue-700 font-medium">
                      {item.addedByAgency}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.matchCount} 次
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-700 font-semibold">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Detail Inspection Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  预警处置工单全流程审理卷宗
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">工单编号:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedTicket.ticketNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">目标涉案主体:</span>
                  <span className="font-bold text-slate-900">{selectedTicket.targetEntity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">涉案账户地址:</span>
                  <span className="font-mono text-slate-700">{selectedTicket.suspectAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">主管协同机构:</span>
                  <span className="font-semibold text-blue-700">{selectedTicket.assignedTo}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <span className="font-bold block">30分钟应急闭环流转状态:</span>
                <p className="text-[11px] leading-relaxed">
                  当前处于【{selectedTicket.status}】阶段。倒计时还剩 {Math.floor(selectedTicket.responseTimeRemaining / 60)} 分钟。已实施的协同处置步骤：
                </p>
                <div className="space-y-1 pt-1">
                  {selectedTicket.actionsTaken.map((act, i) => (
                    <div key={i} className="text-[10px] text-amber-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  onShowToast('已下发冻结与移送协查令', `已向公安部经侦局专线推送工单 ${selectedTicket.ticketNo}`, 'success');
                  setSelectedTicket(null);
                  onNavigate('investigation');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                推送经侦联合立案
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
