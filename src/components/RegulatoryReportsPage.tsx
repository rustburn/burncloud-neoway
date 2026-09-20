import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  FileCode,
  FileText,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  FileCheck,
  Zap,
} from 'lucide-react';
import { REGULATORY_REPORT_ITEMS } from '../mock/regtechData';
import { RegulatoryReportItem } from '../types';

interface RegulatoryReportsPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
}

export const RegulatoryReportsPage: React.FC<RegulatoryReportsPageProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const [reports, setReports] = useState<RegulatoryReportItem[]>(REGULATORY_REPORT_ITEMS);
  const [activeTab, setActiveTab] = useState<'reports' | 'gov_apis' | 'compliance_checklist'>('reports');
  const [selectedReport, setSelectedReport] = useState<RegulatoryReportItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleSendReport = (repId: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === repId ? { ...r, status: '已报送' } : r))
      );
      setIsExporting(false);
      onShowToast(
        '报送成功',
        '报表已通过国家电子政务外网及国家智算监管专线安全直报上级部门',
        'success'
      );
    }, 500);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>法定监管报表自动生成与专线报送中心</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              模块 4 · 国密SM3防篡改摘要 + TSA司法时间戳
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            严格依照法定周期生成：日报(次日9:00前)、周报(每周一9:00前)、月报(每月5日前)、季报(每季初10日前)、年报(次年1月底前)；直连国家网信办、工信部算网调度中心、国家数据局与公安部专网。
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            法定监管报表库 ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('gov_apis')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'gov_apis'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            监管专线 API 直报接口
          </button>
          <button
            onClick={() => setActiveTab('compliance_checklist')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'compliance_checklist'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            大模型算法与算力券合规对照
          </button>
        </div>
      </div>

      {/* Tab 1: Reports List */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        rep.reportType === 'daily'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : rep.reportType === 'weekly'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rep.reportType === 'monthly'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {rep.reportType === 'daily' && '法定日报 (次日9:00前)'}
                      {rep.reportType === 'weekly' && '法定周报 (周一9:00前)'}
                      {rep.reportType === 'monthly' && '法定月报 (每月5日前)'}
                      {rep.reportType === 'quarterly' && '法定季报 (每季10日前)'}
                      {rep.reportType === 'annual' && '法定年报 (1月底前)'}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-semibold">{rep.format}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      rep.status === '已报送'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{rep.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>报送对象: <strong className="text-blue-700">{rep.targetAgency}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">监测 Token 规模</span>
                    <span className="font-bold text-slate-800 truncate block">{rep.totalMonitoredTokens}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">折合算力/资金</span>
                    <span className="font-bold text-slate-800">{rep.totalMonitoredVolumeCNY}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">可疑预警数</span>
                    <span className="font-bold text-rose-600">{rep.suspiciousTxCount} 笔</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">管控/熔断数</span>
                    <span className="font-bold text-blue-700">{rep.frozenAccountsCount} 个</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono truncate">
                  国密SM3存证哈希: {rep.digestHash}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onShowToast('已导出标准监管格式', `格式: ${rep.format}，含TSA时间戳与国密SM3防篡改摘要`, 'success')}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>下载报表 ({rep.format})</span>
                    </button>
                    <button
                      onClick={() => onShowToast('已导出 PDF 格式公文', '已包含法定监管签章版面', 'info')}
                      className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => onShowToast('已导出 Excel / CSV', '已生成明细数据表格', 'info')}
                      className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Excel
                    </button>
                  </div>

                  <button
                    onClick={() => handleSendReport(rep.id)}
                    disabled={rep.status === '已报送'}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                      rep.status === '已报送'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{rep.status === '已报送' ? '已安全报送' : '专线直报'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 监管专线直报接口 */}
      {activeTab === 'gov_apis' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Zap className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                国家监管部门智算专网与直报接口对接状态
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">国家互联网信息办公室 算法治理与大模型备案直报通道 (CAC)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">专线在线 · TLS 1.3 + SM4</span>
                  </div>
                  <p className="text-[11px] text-slate-500">接口：/api/v2/cac/algorithm-compliance-feed · 协议：XML / 国密SM3数字签章</p>
                </div>
                <button
                  onClick={() => onShowToast('专线连通性自检成功', '延迟: 12ms，SM3验签通过', 'success')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  专线心跳测试
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">工业和信息化部 国家算力互联互通平台与算网调度专线 (MIIT)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">专线在线 · 电子政务外网专线</span>
                  </div>
                  <p className="text-[11px] text-slate-500">接口：/api/v1/miit/compute-voucher-audit · 协议：JSON / Kafka 准实时推送</p>
                </div>
                <button
                  onClick={() => onShowToast('专线连通性自检成功', '延迟: 18ms，通道畅通', 'success')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  专线心跳测试
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">国家数据局 数字要素交易与跨境算力监管平台</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">专线在线 · 国家数据要素主干网</span>
                  </div>
                  <p className="text-[11px] text-slate-500">接口：/api/v1/nda/token-market-telemetry · 协议：REST + 国密加密通道</p>
                </div>
                <button
                  onClick={() => onShowToast('专线连通性自检成功', '延迟: 15ms，数据专线正常', 'success')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  专线心跳测试
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">公安部网络安全保卫局 大模型黑产线索与电子存证专网 (MPS)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">公安网安专线已就绪</span>
                  </div>
                  <p className="text-[11px] text-slate-500">接口：/api/psb/cyber/judicial-evidence-sync · 协议：最高法司法链电子证据存证</p>
                </div>
                <button
                  onClick={() => onShowToast('专线连通性自检成功', '公安网安/经侦通道就绪', 'success')}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  专线心跳测试
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 大模型算法与算力券合规对照 */}
      {activeTab === 'compliance_checklist' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                大模型算法与算力券合规法定对照标准 (网信备案 / 算力券核销 / 数据出境)
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="font-bold text-emerald-900 block mb-1">1. 生成式大模型算法备案与安全评估 (国家网信办标准)</span>
                <p className="text-emerald-800 leading-relaxed">
                  严格穿透大模型服务的服务主体名称、算法备案号及训练语料来源合法性；对境内上线向公众提供服务的大模型必须通过网信办深度合成算法备案，未备案或私自反代境外模型的行为强制拦截并下达通报。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
                <span className="font-bold text-blue-900 block mb-1">2. 财政算力券核销真实性与防骗补审查 (工信部与地方财政联合指引)</span>
                <p className="text-blue-800 leading-relaxed">
                  建立 Token 消耗真实性与算力产出偏离度评估矩阵；严防企业利用固定 Prompt 自动化脚本刷量、虚假自循环调用等手段套取国家和地方政府专项算力券补贴资金，涉案行为 100% 留痕并同步财政稽核。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
                <span className="font-bold text-amber-900 block mb-1">3. 数据出境安全评估与跨境非法反向代理阻断 (数据安全法与跨境评估规定)</span>
                <p className="text-amber-800 leading-relaxed">
                  对境内敏感数据经大模型推理流向境外节点、或跨境走私境外未备案大模型算力配额的无申报出境行为进行重点阻断；严格遵循《数据出境安全评估办法》，杜绝核心数据与工业关键参数违规外流。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
