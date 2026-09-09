import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Shield,
  FileText,
  User,
  RotateCcw,
  Sliders,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { RISK_EVENTS_DATA } from '../mock/data';
import { RiskEvent } from '../types';

interface RiskEventsPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const RiskEventsPage: React.FC<RiskEventsPageProps> = ({ onShowToast }) => {
  const [events, setEvents] = useState<RiskEvent[]>(RISK_EVENTS_DATA);
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected event for disposal detail modal
  const [selectedEvent, setSelectedEvent] = useState<RiskEvent | null>(null);

  // Action Confirmation Modal State
  const [actionConfirmModal, setActionConfirmModal] = useState<{
    actionType: string;
    actionLabel: string;
    description: string;
    isDangerous?: boolean;
  } | null>(null);

  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // New Risk Case Modal State
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    enterprise: '广州智算科技有限公司',
    riskType: '重要数据疑似出境' as RiskEvent['riskType'],
    riskLevel: '高危' as RiskEvent['riskLevel'],
    affectedRequests: 120,
    currentHandler: '张建军 (监管专员)',
    description: '通过跨境网关抓包分析，发现包含未经申报的境外财务报表数据集。',
  });

  // Regulatory Memo Note
  const [memoNote, setMemoNote] = useState('');

  // Advance stage manually
  const handleAdvanceStage = () => {
    if (!selectedEvent) return;
    const nextStage = Math.min(8, selectedEvent.workflowStage + 1);
    const updated = {
      ...selectedEvent,
      workflowStage: nextStage,
      status: (nextStage === 8 ? '已处置' : '处理中') as RiskEvent['status'],
    };
    setEvents((prev) => prev.map((item) => (item.id === selectedEvent.id ? updated : item)));
    setSelectedEvent(updated);
    onShowToast(
      '闭环流程节点已推进',
      `事件 ${selectedEvent.eventNumber} 流程节点变更为：第 ${nextStage} 步 (${workflowStages[nextStage - 1]?.title})`,
      'success'
    );
  };

  const handleSaveMemo = () => {
    if (!memoNote.trim() || !selectedEvent) return;
    onShowToast('监管调查备忘录已归档', `已为事件 ${selectedEvent.eventNumber} 附加监管研判批注并生成存证链节点`, 'success');
    setMemoNote('');
  };

  const handleCreateCase = () => {
    const newCase: RiskEvent = {
      id: `risk-${Date.now()}`,
      eventNumber: `RSK-20260309-${Math.floor(Math.random() * 9000) + 1000}`,
      discoveryTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      enterprise: newCaseForm.enterprise,
      riskType: newCaseForm.riskType,
      riskLevel: newCaseForm.riskLevel,
      affectedRequests: newCaseForm.affectedRequests,
      autoDisposalResult: '人工受理立案，已自动生成风险存证卷宗',
      currentHandler: newCaseForm.currentHandler,
      status: '待处理',
      description: newCaseForm.description,
      evidenceId: `EVD-20260309-${Math.floor(Math.random() * 90000) + 10000}`,
      workflowStage: 1,
    };

    setEvents([newCase, ...events]);
    setShowNewCaseModal(false);
    onShowToast('人工监管立案成功', `风险事件 ${newCase.eventNumber} 已正式建档并派发处置工单`, 'success');
  };

  // Top Counters
  const pendingCount = 8;
  const processingCount = 5;
  const resolvedCount = 126;
  const criticalCount = 2;

  // Filter list
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.eventNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.enterprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || ev.riskType === filterType;
    const matchesLevel = filterLevel === 'all' || ev.riskLevel === filterLevel;
    const matchesStatus = filterStatus === 'all' || ev.status === filterStatus;

    return matchesSearch && matchesType && matchesLevel && matchesStatus;
  });

  const getLevelBadge = (level: RiskEvent['riskLevel']) => {
    switch (level) {
      case '极高':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      case '高危':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      case '中度':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case '一般':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: RiskEvent['status']) => {
    switch (status) {
      case '待处理':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case '处理中':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
      case '已处置':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // 8 Disposal Workflow Stages
  const workflowStages = [
    { stage: 1, title: '发现风险', desc: '特征探针检测触发' },
    { stage: 2, title: '自动阻断', desc: '网关熔断拦截' },
    { stage: 3, title: '保存证据', desc: '不可篡改哈希存证' },
    { stage: 4, title: '通知企业', desc: '下达整改告警通知' },
    { stage: 5, title: '人工复核', desc: '监管专员研判' },
    { stage: 6, title: '整改', desc: '企业提交补正资料' },
    { stage: 7, title: '复测', desc: '沙盒回归合规测试' },
    { stage: 8, title: '关闭事件', desc: '归档解除预警' },
  ];

  const handleActionExecute = () => {
    if (!actionConfirmModal || !selectedEvent) return;

    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      const action = actionConfirmModal.actionType;

      // Update event state
      setEvents((prev) =>
        prev.map((item) => {
          if (item.id === selectedEvent.id) {
            let nextStage = item.workflowStage;
            let nextStatus = item.status;
            let nextAuto = item.autoDisposalResult;

            if (action === 'block') {
              nextStage = 2;
              nextStatus = '处理中';
              nextAuto = '已执行系统级立即硬阻断并切断通道连接';
            } else if (action === 'limit_token') {
              nextStage = 3;
              nextStatus = '处理中';
              nextAuto = '已下调该企业API速率至基准10%，限制日额度';
            } else if (action === 'suspend_ent') {
              nextStage = 2;
              nextStatus = '处理中';
              nextAuto = '已暂停涉事主体沙盒运行资格，上报网信办';
            } else if (action === 'rectify') {
              nextStage = 4;
              nextStatus = '处理中';
              nextAuto = '已下发限期整改通知单（7个工作日内整改）';
            } else if (action === 'false_positive') {
              nextStage = 8;
              nextStatus = '已处置';
              nextAuto = '经监管专员二次比对确认为业务正常测试，已标记误报解封';
            } else if (action === 'submit_review') {
              nextStage = 5;
              nextStatus = '处理中';
              nextAuto = '已指派高级监管组张建军、李晓明联合复核研判';
            } else if (action === 'close') {
              nextStage = 8;
              nextStatus = '已处置';
              nextAuto = '整改复测已完全通过，事件闭环归档';
            }

            const updated = {
              ...item,
              workflowStage: nextStage,
              status: nextStatus,
              autoDisposalResult: nextAuto,
            };
            setSelectedEvent(updated);
            return updated;
          }
          return item;
        })
      );

      onShowToast(
        `操作已执行：${actionConfirmModal.actionLabel}`,
        `事件编号 ${selectedEvent.eventNumber} 状态已更新为最新处置节拍`,
        actionConfirmModal.isDangerous ? 'warning' : 'success'
      );

      setActionConfirmModal(null);
    }, 700);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h1 className="text-base font-bold text-slate-900">风险事件与合规处置</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium border border-rose-200">
              风控闭环协同
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            监测跨境数据出境疑似泄露、敏感个人信息未脱敏、未备案模型调用及异常 Token 突增等风险并实施自动化梯级管控。
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>人工新建立案</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">待处理风险</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-rose-600 font-mono">{pendingCount}</span>
              <span className="text-xs text-slate-400">件</span>
            </div>
            <span className="text-[11px] text-rose-600 font-medium mt-1 inline-block">需在2小时内研判</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">处理中事件</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-600 font-mono">{processingCount}</span>
              <span className="text-xs text-slate-400">件</span>
            </div>
            <span className="text-[11px] text-amber-700 font-medium mt-1 inline-block">企业整改 / 复测中</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">已处置闭环</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-600 font-mono">{resolvedCount}</span>
              <span className="text-xs text-slate-400">件</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">历史全量归档存证</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-300 shadow-xs flex items-center justify-between bg-rose-50/20">
          <div>
            <span className="text-xs font-medium text-rose-900">严重红线风险</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-rose-700 font-mono">{criticalCount}</span>
              <span className="text-xs text-rose-800">件</span>
            </div>
            <span className="text-[11px] text-rose-700 font-bold mt-1 inline-block">触发系统硬熔断</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索事件编号 / 企业名称 / 描述..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Risk Type Filter (All 10 required types) */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">风险类型: 全部 (10类)</option>
            <option value="重要数据疑似出境">重要数据疑似出境</option>
            <option value="敏感个人信息未脱敏">敏感个人信息未脱敏</option>
            <option value="未备案模型调用">未备案模型调用</option>
            <option value="未授权算力节点">未授权算力节点</option>
            <option value="异常Token消耗">异常Token消耗</option>
            <option value="高频API攻击">高频API攻击</option>
            <option value="跨境线路异常">跨境线路异常</option>
            <option value="输出内容违规">输出内容违规</option>
            <option value="企业资质过期">企业资质过期</option>
            <option value="审计日志不完整">审计日志不完整</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">风险等级: 全部</option>
            <option value="极高">极高</option>
            <option value="高危">高危</option>
            <option value="中度">中度</option>
            <option value="一般">一般</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">处置状态: 全部</option>
            <option value="待处理">待处理</option>
            <option value="处理中">处理中</option>
            <option value="已处置">已处置</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          共 {filteredEvents.length} 件风险记录
        </div>
      </div>

      {/* Main Risk Events Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4">事件编号</th>
                <th className="py-3 px-3">发现时间</th>
                <th className="py-3 px-3">涉事企业</th>
                <th className="py-3 px-3">风险类型</th>
                <th className="py-3 px-3 text-center">风险等级</th>
                <th className="py-3 px-3 text-center">影响请求数</th>
                <th className="py-3 px-3">自动处置结果</th>
                <th className="py-3 px-3">当前负责人</th>
                <th className="py-3 px-3">状态</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((ev) => (
                <tr
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="hover:bg-rose-50/30 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-rose-700">
                    {ev.eventNumber}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{ev.discoveryTime}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{ev.enterprise}</td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800">{ev.riskType}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded border text-[11px] ${getLevelBadge(ev.riskLevel)}`}>
                      {ev.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                    {ev.affectedRequests} 次
                  </td>
                  <td className="py-3 px-3 text-slate-600 truncate max-w-[200px]" title={ev.autoDisposalResult}>
                    {ev.autoDisposalResult}
                  </td>
                  <td className="py-3 px-3 text-slate-700">{ev.currentHandler}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] ${getStatusBadge(ev.status)}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(ev);
                      }}
                      className="px-2.5 py-1 rounded-md text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-medium text-xs transition-colors"
                    >
                      处置与研判
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Event Detail & Disposal Workflow Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs border font-semibold ${getLevelBadge(selectedEvent.riskLevel)}`}>
                    {selectedEvent.riskLevel}危险等级
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusBadge(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {selectedEvent.eventNumber}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-2">
                  {selectedEvent.riskType} · {selectedEvent.enterprise}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  发现时间: {selectedEvent.discoveryTime} | 影响跨境请求: {selectedEvent.affectedRequests} 次 | 负责人: {selectedEvent.currentHandler}
                </p>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              {/* Description & Automated Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1.5">风险事件详情描述</span>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {selectedEvent.description}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-500">
                    关联证据号: {selectedEvent.evidenceId}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                  <span className="font-bold text-rose-900 block mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    系统自动处置执行结果
                  </span>
                  <p className="text-rose-950 font-medium leading-relaxed text-xs">
                    {selectedEvent.autoDisposalResult}
                  </p>
                  <div className="mt-3 pt-2 border-t border-rose-200/80 text-[11px] text-rose-700">
                    沙盒网关策略拦截响应用时: 18ms
                  </div>
                </div>
              </div>

              {/* Complete 8 Stages Workflow Diagram */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    风险处置闭环流程 (8大关键节点)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-700 font-medium">
                      当前推进至: 第 {selectedEvent.workflowStage} 步 (
                      {workflowStages[selectedEvent.workflowStage - 1]?.title})
                    </span>
                    {selectedEvent.workflowStage < 8 && (
                      <button
                        onClick={handleAdvanceStage}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
                        title="将处置工单推进一步"
                      >
                        推进至下一流程节点 →
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {workflowStages.map((wf) => {
                    const isPassed = wf.stage < selectedEvent.workflowStage;
                    const isCurrent = wf.stage === selectedEvent.workflowStage;

                    return (
                      <div
                        key={wf.stage}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-rose-50 border-rose-500 shadow-sm ring-1 ring-rose-500'
                            : isPassed
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="text-[10px] font-mono mb-1">0{wf.stage}</div>
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-rose-900'
                              : isPassed
                              ? 'text-emerald-800'
                              : 'text-slate-600'
                          }`}
                        >
                          {wf.title}
                        </h4>
                        <p className="text-[9px] text-slate-500 mt-1 leading-tight">
                          {wf.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Regulatory Memo Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block text-xs">监管研判指导意见与核查备忘录</span>
                <textarea
                  rows={2}
                  placeholder="在此输入监管复核批注、整改要求或对企业复测结论的评语（将自动生成不可篡改日志并签署电子签章）..."
                  value={memoNote}
                  onChange={(e) => setMemoNote(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveMemo}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition-colors"
                  >
                    保存备忘录
                  </button>
                </div>
              </div>

              {/* Operations Panel (Required 7 action buttons) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-2">监管处置决策指令</span>
                <p className="text-slate-500 text-xs mb-3">
                  点击以下任意操作指令，将弹出确认研判弹窗并记录监管日志：
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      setActionConfirmModal({
                        actionType: 'block',
                        actionLabel: '立即阻断',
                        description: '系统将强制下发会话熔断，并向各边缘专线网关广播黑名单封禁规则。',
                        isDangerous: true,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    立即阻断
                  </button>

                  <button
                    onClick={() =>
                      setActionConfirmModal({
                        actionType: 'limit_token',
                        actionLabel: '限制Token额度',
                        description: '将涉事企业今日Token消耗速率压制至正常基线10%，防止资源被突发恶意挤占。',
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    限制Token额度
                  </button>

                  <button
                    onClick={() =>
                      setActionConfirmModal({
                        actionType: 'suspend_ent',
                        actionLabel: '暂停企业',
                        description: '暂停该企业在沙盒环境内的全部业务运营资质，上报网信与主管监管部门。',
                        isDangerous: true,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    暂停企业
                  </button>

                  <button
                    onClick={() =>
                      setActionConfirmModal({
                        actionType: 'rectify',
                        actionLabel: '要求整改',
                        description: '向企业合规负责人下达限期合规整改督办单，要求在7个工作日内补正数据脱敏规则。',
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    要求整改
                  </button>

                  <button
                    onClick={() =>
                      setActionConfirmModal({
                        actionType: 'false_positive',
                        actionLabel: '标记误报',
                        description: '经监管人工复核研判为合规白名单业务或测试请求，解除告警并更新样本特征库。',
                      })
                    }
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                  >
                    标记误报
                  </button>

                  <button
                    onClick={() =>
                      setActionConfirmModal({
                        actionType: 'submit_review',
                        actionLabel: '提交监管复核',
                        description: '将该风险工单移送至高级监管合规专家委员会进行多方联合会商研判。',
                      })
                    }
                    className="px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-xs transition-colors"
                  >
                    提交监管复核
                  </button>

                  <button
                    onClick={() =>
                      setActionConfirmModal({
                        actionType: 'close',
                        actionLabel: '关闭事件',
                        description: '确认整改复测合规，完成风险闭环，归档该安全事件。',
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    关闭事件
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-slate-500 text-xs">
              <span>研判归档标准: 《国家数据出境安全评估标准指南》</span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
              >
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-3 rounded-xl ${
                  actionConfirmModal.isDangerous ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  确认执行操作：【{actionConfirmModal.actionLabel}】
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  事件: {selectedEvent?.eventNumber}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-5">
              {actionConfirmModal.description}
            </p>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setActionConfirmModal(null)}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                取消
              </button>

              <button
                onClick={handleActionExecute}
                disabled={isProcessingAction}
                className={`px-4 py-2 rounded-xl text-white font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                  actionConfirmModal.isDangerous
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessingAction ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>确认下达指令</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Risk Case Filing Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in zoom-in-95 duration-150 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">监管专员人工新建立案登记</h3>
              </div>
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">涉事企业名称</label>
                <input
                  type="text"
                  value={newCaseForm.enterprise}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, enterprise: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">风险事件类型</label>
                  <select
                    value={newCaseForm.riskType}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, riskType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs"
                  >
                    <option value="重要数据疑似出境">重要数据疑似出境</option>
                    <option value="敏感个人信息未脱敏">敏感个人信息未脱敏</option>
                    <option value="未备案模型调用">未备案模型调用</option>
                    <option value="跨境流量突增异常">跨境流量突增异常</option>
                    <option value="未知境外IP高频嗅探">未知境外IP高频嗅探</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">风险定级</label>
                  <select
                    value={newCaseForm.riskLevel}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, riskLevel: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs"
                  >
                    <option value="极高">极高 (严重威胁)</option>
                    <option value="高危">高危 (需要阻断)</option>
                    <option value="中度">中度 (需整改)</option>
                    <option value="一般">一般 (轻微违规)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">关联异常请求次数 (估算)</label>
                <input
                  type="number"
                  value={newCaseForm.affectedRequests}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, affectedRequests: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">风险线索描述与立案依据</label>
                <textarea
                  rows={3}
                  value={newCaseForm.description}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">指定处置专员</label>
                <input
                  type="text"
                  value={newCaseForm.currentHandler}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, currentHandler: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleCreateCase}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                确认建立案宗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
