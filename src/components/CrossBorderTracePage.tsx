import React, { useState } from 'react';
import {
  GitFork,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Download,
  FileText,
  Shield,
  Layers,
  ArrowRight,
  Eye,
  Lock,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { TRACE_RECORDS_DATA } from '../mock/data';
import { TraceRecord, TraceTimelineStep } from '../types';

interface CrossBorderTracePageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onJumpToAudit?: (evidenceId: string) => void;
  initialTraceId?: string | null;
}

export const CrossBorderTracePage: React.FC<CrossBorderTracePageProps> = ({
  onShowToast,
  onJumpToAudit,
  initialTraceId,
}) => {
  const [traceRecords] = useState<TraceRecord[]>(TRACE_RECORDS_DATA);
  const [searchTraceId, setSearchTraceId] = useState(initialTraceId || '');
  const [filterCompliance, setFilterCompliance] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterPII, setFilterPII] = useState('all');

  // Selected Record for Calling Chain Details
  const [selectedRecord, setSelectedRecord] = useState<TraceRecord | null>(
    initialTraceId
      ? traceRecords.find((t) => t.traceId.toLowerCase().includes(initialTraceId.toLowerCase())) || traceRecords[0]
      : null
  );

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    onShowToast('已复制到剪贴板', text, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter records
  const filteredRecords = traceRecords.filter((rec) => {
    const matchesId =
      !searchTraceId ||
      rec.traceId.toLowerCase().includes(searchTraceId.toLowerCase()) ||
      rec.enterprise.toLowerCase().includes(searchTraceId.toLowerCase()) ||
      rec.model.toLowerCase().includes(searchTraceId.toLowerCase());

    const matchesCompliance = filterCompliance === 'all' || rec.complianceResult === filterCompliance;
    const matchesCountry = filterCountry === 'all' || rec.sourceCountry === filterCountry;
    const matchesPII =
      filterPII === 'all' ||
      (filterPII === 'yes' && rec.hasPersonalInfo) ||
      (filterPII === 'no' && !rec.hasPersonalInfo);

    return matchesId && matchesCompliance && matchesCountry && matchesPII;
  });

  const getComplianceBadge = (res: TraceRecord['complianceResult']) => {
    switch (res) {
      case '合规通过':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '脱敏放行':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case '阻断拦截':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      case '人工复核':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStepResultBadge = (result: TraceTimelineStep['result']) => {
    switch (result) {
      case '通过':
      case '生成完毕':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case '脱敏放行':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case '合规阻断':
        return 'text-rose-700 bg-rose-50 border-rose-200 font-bold';
      case '隔离计算中':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900">跨境流转全链路记录</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
              全量可溯源
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            监控每一次跨境 AI 推理请求从境外接入、特征识别、隔离计算到出关审计的 11 个关键执行节点。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onShowToast(
                '链路重放校验完成',
                '已针对全量11个执行节点（DNS、网关、特征探针、TEE计算、脱敏、出关）完成SHA-256存证签名校验，全部一致',
                'success'
              );
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-blue-600" />
            <span>执行链路完整性自检</span>
          </button>

          <button
            onClick={() => {
              onShowToast(
                '明细数据已导出',
                `已导出今日跨境流转追踪全量记录（共 ${filteredRecords.length} 条调用链）`,
                'success'
              );
            }}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>导出追踪明细报表</span>
          </button>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Trace ID Search */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTraceId}
              onChange={(e) => setSearchTraceId(e.target.value)}
              placeholder="通过请求追踪ID / 企业 / 模型查询..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Preset quick filter buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchTraceId('')}
              className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                searchTraceId === '' ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部记录
            </button>
            <button
              onClick={() => setSearchTraceId('TR-20260309-8819024')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors ${
                searchTraceId === 'TR-20260309-8819024'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              出海放行链 (TR-...8819024)
            </button>
            <button
              onClick={() => setSearchTraceId('TR-20260309-8819025')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors ${
                searchTraceId === 'TR-20260309-8819025'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              脱敏放行链 (TR-...8819025)
            </button>
            <button
              onClick={() => setSearchTraceId('TR-20260309-8819026')}
              className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors ${
                searchTraceId === 'TR-20260309-8819026'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              阻断拦截链 (TR-...8819026)
            </button>
          </div>

          {/* Compliance Filter */}
          <select
            value={filterCompliance}
            onChange={(e) => setFilterCompliance(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">合规结果: 全部</option>
            <option value="合规通过">合规通过</option>
            <option value="脱敏放行">脱敏放行</option>
            <option value="阻断拦截">阻断拦截</option>
            <option value="人工复核">人工复核</option>
          </select>

          {/* PII Filter */}
          <select
            value={filterPII}
            onChange={(e) => setFilterPII(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">个人信息: 全部</option>
            <option value="yes">包含个人信息</option>
            <option value="no">不包含个人信息</option>
          </select>
        </div>

        <div className="text-xs text-slate-400">
          共 {filteredRecords.length} 条调用链
        </div>
      </div>

      {/* Main Flow Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1360px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap min-w-[170px]">请求追踪ID</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[150px]">请求时间</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[160px]">企业名称</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[90px]">来源国家</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[150px]">接入线路</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[90px]">数据类别</th>
                <th className="py-3 px-2 text-center whitespace-nowrap min-w-[70px]">个人信息</th>
                <th className="py-3 px-2 text-center whitespace-nowrap min-w-[70px]">敏感信息</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[130px]">调用模型</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[140px]">输入/输出Token</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[100px]">合规结果</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[80px]">请求状态</th>
                <th className="py-3 px-4 text-right whitespace-nowrap min-w-[100px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600 whitespace-nowrap flex items-center gap-1">
                    <span>{rec.traceId}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{rec.requestTime}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">{rec.enterprise}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">{rec.sourceCountry}</td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap" title={rec.line}>
                    {rec.line}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {rec.dataCategory}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    {rec.hasPersonalInfo ? (
                      <span className="inline-flex items-center justify-center whitespace-nowrap text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                        是
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">否</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    {rec.hasSensitiveInfo ? (
                      <span className="inline-flex items-center justify-center whitespace-nowrap text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                        敏感
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">无</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-slate-800 whitespace-nowrap">{rec.model}</td>
                  <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {rec.inputTokens.toLocaleString()} / {rec.outputTokens.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center whitespace-nowrap px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${getComplianceBadge(rec.complianceResult)}`}>
                      {rec.complianceResult}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center whitespace-nowrap text-[11px] font-medium ${
                        rec.requestStatus === '已完成'
                          ? 'text-emerald-600'
                          : rec.requestStatus === '阻断'
                          ? 'text-rose-600 font-bold'
                          : 'text-amber-600'
                      }`}
                    >
                      {rec.requestStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecord(rec);
                      }}
                      className="px-2.5 py-1 rounded-md text-blue-600 hover:bg-blue-100/60 font-medium text-xs transition-colors whitespace-nowrap cursor-pointer"
                    >
                      调用链详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calling Chain Details Modal / Drawer (11 Steps Timeline) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getComplianceBadge(selectedRecord.complianceResult)}`}>
                      {selectedRecord.complianceResult}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                      {selectedRecord.requestStatus}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-2 flex items-center gap-2">
                    <span>调用链详情 · {selectedRecord.traceId}</span>
                    <button
                      onClick={() => handleCopy(selectedRecord.traceId)}
                      className="text-slate-400 hover:text-slate-600"
                      title="复制追踪ID"
                    >
                      {copiedId === selectedRecord.traceId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    企业: <strong className="text-slate-800">{selectedRecord.enterprise}</strong> | 来源: {selectedRecord.sourceCountry} → 算力: {selectedRecord.computeNode}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* High-level parameters strip */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">模型及版本</span>
                  <span className="font-mono font-semibold text-blue-700">{selectedRecord.model}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">数据分类</span>
                  <span className="font-medium text-slate-800">{selectedRecord.dataCategory}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Token 消耗</span>
                  <span className="font-mono text-slate-800">
                    {selectedRecord.inputTokens + selectedRecord.outputTokens}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">专线信道</span>
                  <span className="text-slate-600 truncate block">{selectedRecord.line}</span>
                </div>
              </div>
            </div>

            {/* Content: Desensitized Content Prompt & 11-Step Timeline */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              {/* Desensitized Prompt Sample Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    原始输入脱敏摘要（符合《个人信息保护法》与数据不出域原则）
                  </span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                    敏感字段已掩码遮蔽
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed">
                  {selectedRecord.promptSample}
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>明文原始数据严禁留存落盘 · 内存沙盒计算完毕即销毁</span>
                  <span className="text-emerald-600 font-medium">数据可用不可见</span>
                </div>
              </div>

              {/* 11 Steps Timeline */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-sm">
                    全链路 11 步合规审计与执行节拍
                  </h3>
                  <span className="text-xs text-slate-400">11/11 节点覆盖</span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Default fallback steps if empty */}
                  {(selectedRecord.timeline.length > 0
                    ? selectedRecord.timeline
                    : TRACE_RECORDS_DATA[0].timeline
                  ).map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center text-[10px] font-bold ${
                          step.result === '合规阻断'
                            ? 'border-rose-500 text-rose-600'
                            : step.result === '脱敏放行'
                            ? 'border-amber-500 text-amber-600'
                            : 'border-blue-600 text-blue-600'
                        }`}
                      >
                        {step.stepNumber}
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">
                              {step.stepNumber}. {step.title}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${getStepResultBadge(step.result)}`}>
                              {step.result}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                            <span>{step.timestamp}</span>
                            <span className="bg-slate-100 px-1.5 py-0.2 rounded text-slate-600 text-[10px]">
                              {step.evidenceId}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                          <div>
                            <span className="text-slate-400">执行节点: </span>
                            <span className="font-mono text-slate-800">{step.node}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">风险等级: </span>
                            <span className="font-medium text-slate-700">{step.riskLevel}</span>
                          </div>
                        </div>

                        <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-100 font-mono text-[11px] text-slate-600">
                          {step.logSummary}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                存证哈希: 7a8f12c8...390a (SHA-256 Valid)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onJumpToAudit) onJumpToAudit(selectedRecord.timeline[0]?.evidenceId || 'EVD-99211');
                    onShowToast('正在定位存证账本', `已跳转至关联存证记录 ${selectedRecord.traceId}`, 'info');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>查看证据链</span>
                </button>

                <button
                  onClick={() => {
                    onShowToast(
                      '审计报告已导出',
                      `已导出追踪单 ${selectedRecord.traceId} 全流程可信存证报告 (JSON/PDF)`,
                      'success'
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出审计报告</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
