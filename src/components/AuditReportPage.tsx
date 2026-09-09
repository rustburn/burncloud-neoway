import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Download,
  Printer,
  Share2,
  Sparkles,
  Lock,
  Hash,
  Clock,
  Building2,
  ExternalLink,
  X,
  FileCheck,
  Check,
  Eye,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { AUDIT_EVIDENCE_DATA } from '../mock/data';
import { AuditEvidence } from '../types';

interface AuditReportPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  targetEvidenceId?: string | null;
}

export const AuditReportPage: React.FC<AuditReportPageProps> = ({ onShowToast, targetEvidenceId }) => {
  const [evidenceList] = useState<AuditEvidence[]>(AUDIT_EVIDENCE_DATA);
  const [searchTerm, setSearchTerm] = useState(targetEvidenceId || '');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Selected Evidence for details modal
  const [selectedEvidence, setSelectedEvidence] = useState<AuditEvidence | null>(
    targetEvidenceId
      ? evidenceList.find((e) => e.evidenceNumber.includes(targetEvidenceId) || e.traceId.includes(targetEvidenceId)) || evidenceList[0]
      : null
  );

  // Generate Report Modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('monthly');
  const [selectedTargetEnt, setSelectedTargetEnt] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Preview generated report
  const [generatedReportPreview, setGeneratedReportPreview] = useState<{
    title: string;
    date: string;
    serial: string;
    summary: string;
  } | null>(null);

  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    onShowToast('哈希已复制', hash, 'info');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filter evidence
  const filteredList = evidenceList.filter((item) => {
    const matchesSearch =
      item.evidenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.traceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.enterprise.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || item.evidenceType === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStartGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(15);

    const timer1 = setTimeout(() => setGenerationProgress(55), 400);
    const timer2 = setTimeout(() => setGenerationProgress(90), 800);
    const timer3 = setTimeout(() => {
      setGenerationProgress(100);
      setIsGenerating(false);
      setShowGenerateModal(false);

      const titles: Record<string, string> = {
        monthly: '2026年3月 跨境 AI 算力服务月度监管态势报告',
        enterprise: '广州智算科技有限公司 · 跨境业务专项合规审计报告 (沙盒第03期)',
        risk: '2026年一季度 跨境 AI 风险拦截与处置综合通报',
        analysis: '“Token出海与外数中算”双向数据合规流转深度度量报告',
      };

      setGeneratedReportPreview({
        title: titles[selectedReportType] || titles['monthly'],
        date: '2026-03-09 15:40:22',
        serial: `DOC-AUDIT-${Date.now().toString().slice(-6)}`,
        summary:
          '本报告由“有方”跨境 AI 算力服务合规监管沙盒依据《生成式人工智能服务管理暂行办法》、《数据出境安全评估办法》及沙盒节点 SHA-256 存证链自动聚合生成，具有法律有效存证凭据效力。',
      });

      onShowToast('合规审计报告已成功生成', '报告已附加国家授时中心时间戳与防伪数字签名', 'success');
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const getStatusBadge = (status: AuditEvidence['status']) => {
    switch (status) {
      case '校验通过':
      case '哈希一致':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '异常不匹配':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900">不可篡改审计存证链</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
              国家可信时钟协同
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            提供从出境前哈希、脱敏哈希、模型执行到处置存证的防篡改区块链可信账本，满足网信、司法和行业合规核验。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onShowToast(
                '存证凭据包已打包',
                `已打包全量 ${filteredList.length} 份具有司法效力的 SHA-256 存证证书及时间戳签章文件 (.zip)`,
                'success'
              );
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>导出司法存证凭证包 (ZIP)</span>
          </button>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>一键生成合规审计报告</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索存证编号 / 关联请求ID / 企业..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Evidence Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">存证类型: 全部</option>
            <option value="出境前哈希">出境前哈希</option>
            <option value="出境后哈希">出境后哈希</option>
            <option value="模型调用存证">模型调用存证</option>
            <option value="脱敏存证">脱敏存证</option>
            <option value="处置存证">处置存证</option>
          </select>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">校验状态: 全部</option>
            <option value="校验通过">校验通过</option>
            <option value="哈希一致">哈希一致</option>
            <option value="异常不匹配">异常不匹配</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          存证区块高度: <strong className="text-blue-700">#1,829,042</strong>
        </div>
      </div>

      {/* Main Evidence Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap min-w-[160px]">存证编号</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[170px]">关联请求追踪ID</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[150px]">存证时间</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[160px]">存证企业</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[120px]">存证类型</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[110px]">校验状态</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[160px]">区块高度 / 节点签名</th>
                <th className="py-3 px-4 text-right whitespace-nowrap min-w-[90px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedEvidence(item)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600 whitespace-nowrap flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    <span>{item.evidenceNumber}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">{item.traceId}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{item.timestamp}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">{item.enterprise}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {item.evidenceType}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full border text-[11px] font-medium gap-1 w-fit ${getStatusBadge(item.status)}`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-700 font-medium">#{item.blockHeight}</span>
                      <span className="text-slate-300">/</span>
                      <span className="truncate max-w-[120px]" title={item.nodeSignature}>
                        {item.nodeSignature}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvidence(item);
                      }}
                      className="px-2.5 py-1 rounded-md text-blue-600 hover:bg-blue-100/60 font-medium text-xs transition-colors whitespace-nowrap cursor-pointer"
                    >
                      存证验签
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(selectedEvidence.status)}`}>
                    {selectedEvidence.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                    {selectedEvidence.evidenceType}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-2">
                  可信审计存证 · {selectedEvidence.evidenceNumber}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  企业: {selectedEvidence.enterprise} | 关联请求追踪: {selectedEvidence.traceId}
                </p>
              </div>

              <button
                onClick={() => setSelectedEvidence(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>原始输入请求 SHA-256 哈希值</span>
                    <button
                      onClick={() => handleCopy(selectedEvidence.rawHash)}
                      className="text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1"
                    >
                      {copiedHash === selectedEvidence.rawHash ? '已复制' : '复制哈希'}
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-800 break-all">
                    {selectedEvidence.rawHash}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>特征脱敏后数据 SHA-256 哈希值</span>
                    <button
                      onClick={() => handleCopy(selectedEvidence.desensitizedHash)}
                      className="text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1"
                    >
                      {copiedHash === selectedEvidence.desensitizedHash ? '已复制' : '复制哈希'}
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-800 break-all">
                    {selectedEvidence.desensitizedHash}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>模型生成输出结果 SHA-256 哈希值</span>
                    <button
                      onClick={() => handleCopy(selectedEvidence.responseHash)}
                      className="text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1"
                    >
                      {copiedHash === selectedEvidence.responseHash ? '已复制' : '复制哈希'}
                    </button>
                  </div>
                  <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-800 break-all">
                    {selectedEvidence.responseHash}
                  </div>
                </div>
              </div>

              {/* Timestamp Certificate & Node signature */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">国家授时中心可信时钟</span>
                  <span className="font-semibold text-slate-900 mt-1 block">
                    {selectedEvidence.timeCertificate}
                  </span>
                  <span className="text-[10px] text-emerald-600 mt-1 block">高精度时间同步保障</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">存证区块节点签名</span>
                  <span className="font-mono text-slate-800 mt-1 block truncate">
                    {selectedEvidence.nodeSignature}
                  </span>
                  <span className="text-[10px] text-blue-600 mt-1 block">
                    区块高度 #{selectedEvidence.blockHeight}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>验签结论: 证据链完备性 100%</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  经比对境外出入境网关报文镜像与本地沙盒节点内存执行签名，原始输入、特征过滤、模型推理与返回结果全链路哈希一致，不存在篡改与数据外溢隐患。
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  onShowToast(
                    '存证证书已导出',
                    `已导出《${selectedEvidence.evidenceNumber} 电子数据存证证书 (PDF)》`,
                    'success'
                  );
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出可信存证证明 (PDF)</span>
              </button>

              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* One-click Audit Report Generation Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">一键生成合规审计报告</h3>
                  <p className="text-xs text-slate-500">依据沙盒全流程证据链自动编纂合规报告</p>
                </div>
              </div>
              {!isGenerating && (
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">
                  报告类型选择
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'monthly', title: '跨境 AI 算力服务月度监管报告', desc: '宏观吞吐、国别流向、模型占比与月度安全研判' },
                    { id: 'enterprise', title: '企业合规专项审计报告', desc: '针对特定入驻主体的资质比对、链路脱敏和扣分明细' },
                    { id: 'risk', title: '风险事件处置汇总报告', desc: '违规拦截、熔断记录、整改复测闭环案卷' },
                    { id: 'analysis', title: 'Token出海与外数中算综合分析报告', desc: '产业侧算力调用格局与双向数据要素价值流动分析' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => !isGenerating && setSelectedReportType(opt.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedReportType === opt.id
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{opt.title}</span>
                        {selectedReportType === opt.id && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">
                  审计范围企业
                </label>
                <select
                  disabled={isGenerating}
                  value={selectedTargetEnt}
                  onChange={(e) => setSelectedTargetEnt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
                >
                  <option value="all">全部已接入企业 (28家综合汇总)</option>
                  <option value="gz">广州智算科技有限公司</option>
                  <option value="ns">南沙跨境智能服务有限公司</option>
                  <option value="st">汕头国际数据加工有限公司</option>
                </select>
              </div>

              {/* Generating Animation & Progress */}
              {isGenerating && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">正在聚合存证节点数据生成报告...</span>
                    <span className="font-mono font-bold text-blue-600">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center">
                    正在执行 SHA-256 签名与防伪水印嵌入
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                disabled={isGenerating}
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                disabled={isGenerating}
                onClick={handleStartGenerate}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>立即编译生成</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Report Preview Modal */}
      {generatedReportPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">审计报告预览</h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    编号: {generatedReportPreview.serial}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setGeneratedReportPreview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document body simulating standard government/institutional audit doc */}
            <div className="flex-1 p-8 overflow-y-auto space-y-6 text-xs bg-slate-100/60">
              <div className="bg-white p-8 rounded-xl shadow-xs border border-slate-200 space-y-6 max-w-2xl mx-auto">
                <div className="text-center pb-6 border-b border-slate-200">
                  <span className="text-xs tracking-widest text-slate-400 font-semibold uppercase">
                    GUANGDONG CROSS-BORDER AI SANDBOX REGULATORY REPORT
                  </span>
                  <h1 className="text-lg font-bold text-slate-900 mt-2">
                    {generatedReportPreview.title}
                  </h1>
                  <div className="mt-3 flex items-center justify-center gap-4 text-slate-500 text-[11px]">
                    <span>生成时间: {generatedReportPreview.date}</span>
                    <span>监管层级: 广东省/市两级算力沙盒</span>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">一、总体监管态势</h4>
                    <p className="text-slate-600 text-xs">
                      报告周期内，有方合规监管沙盒共接入算力服务企业 28 家，稳定运营国际合规专线 5 条。累计完成跨境 AI 推理请求 12,680,421 次，总计消耗 Token 386.42 亿。全域未发生核心数据泄露与出境失控事件，沙盒验证合规率达 92.6%。
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">二、数据分类分级与合规脱敏执行</h4>
                    <p className="text-slate-600 text-xs">
                      沙盒前置特征过滤系统累计对 1,420 条涉个人身份信息（身份证、手机号、企业高管信息）实施了单向掩码与端侧脱敏放行。针对 17 件高危行为（包括未授权模型调用、非受控算力节点探测等）实施了毫秒级硬阻断与存证上链。
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">三、技术与法律效力存证</h4>
                    <p className="text-slate-600 text-xs">
                      {generatedReportPreview.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <div>
                    <span>防伪哈希: 9f82...301a</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">数字签名: 国家电子签名认证中心 CA</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-blue-900 block">有方跨境 AI 算力服务监管沙盒</span>
                    <span className="text-[10px] text-slate-400">电子验讫印章已校验有效</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
              <span className="text-slate-500">
                支持格式: Adobe PDF (.pdf) / Microsoft Word (.docx)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onShowToast('正在调用本地打印机', '已生成矢量打印版面', 'info');
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印</span>
                </button>

                <button
                  onClick={() => {
                    onShowToast(
                      '下载完成',
                      `已保存《${generatedReportPreview.title}.pdf》`,
                      'success'
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载正式版 PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
