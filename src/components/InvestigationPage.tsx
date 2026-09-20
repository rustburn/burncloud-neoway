import React, { useState } from 'react';
import {
  Briefcase,
  Lock,
  FileCheck2,
  Download,
  Search,
  Scale,
  ExternalLink,
  ShieldAlert,
  Layers,
  ArrowRight,
  Clock,
  BookOpen,
  Share2,
  Terminal,
  Building2,
  CheckCircle2,
  Shield,
  FileText,
} from 'lucide-react';
import {
  JUDICIAL_EVIDENCE_DATA,
  LEGAL_CASE_REFS,
} from '../mock/regtechData';
import { JudicialEvidence, LegalCaseRef } from '../types';

interface InvestigationPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
}

export const InvestigationPage: React.FC<InvestigationPageProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'joint_enforcement' | 'legal_precedent'>('evidence');
  const [evidenceList] = useState<JudicialEvidence[]>(JUDICIAL_EVIDENCE_DATA);
  const [selectedEvidence, setSelectedEvidence] = useState<JudicialEvidence | null>(null);

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>专案调查与跨部门联合执法协同中心</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              模块 7 & 8 · 最高法电子证据审查标准 + 四方协同处置闭环
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            国家网信办 / 工业和信息化部 / 国家数据局 / 公安部网安经侦四方联动 · 违规Token流向发现 ➔ 联合研判 ➔ 证据固定 ➔ 配额熔断/司法移送 ➔ 追踪反馈。
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            司法区块链存证卷宗 ({evidenceList.length})
          </button>
          <button
            onClick={() => setActiveTab('joint_enforcement')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'joint_enforcement'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            四方联合执法协同机制
          </button>
          <button
            onClick={() => setActiveTab('legal_precedent')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'legal_precedent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            刑法罪名判例参考库 ({LEGAL_CASE_REFS.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Judicial Evidence Packages */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-sm">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>符合最高人民法院《关于互联网法院审理案件若干问题的规定》第十一条电子证据审查标准</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                本系统固化的电子证据已由国家授时中心高精度 TSA 司法时间戳进行毫秒级时间固化，全量交易数据经国密 SM3 杂凑算法运算并同步锚定至最高法司法区块链节点，具备直接公诉庭审采信效力。
              </p>
            </div>
            <button
              onClick={() => onShowToast('正在批量导出存证凭证', '已打包当前所有已固化涉案卷宗', 'info')}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer"
            >
              一键打包批量存证
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceList.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {ev.evidenceNo}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {ev.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{ev.caseTitle}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>嫌疑主体: <strong className="text-slate-800">{ev.targetEntity}</strong></span>
                    <span>•</span>
                    <span>存证类型: <strong className="text-blue-700">{ev.evidenceType}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">司法链区块高度</span>
                    <span className="font-bold text-slate-800">#{ev.blockHeight}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">证据包体量</span>
                    <span className="font-bold text-purple-700">{ev.fileSize}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 bg-slate-100/60 p-2.5 rounded-xl">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">存证证书哈希:</span>
                    <span className="text-slate-700 font-bold truncate max-w-[220px]">{ev.certHash}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">授时中心TSA时间戳:</span>
                    <span className="text-emerald-700 font-bold truncate max-w-[220px]">{ev.timestampCert}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">公证/存证机构:</span>
                    <span className="text-blue-700 font-semibold truncate max-w-[220px]">{ev.notaryOffice}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono text-[10px] truncate max-w-[200px]">
                    摘要: {ev.sha256Digest.slice(0, 20)}...
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedEvidence(ev)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      检验证据摘要
                    </button>
                    <button
                      onClick={() => {
                        onShowToast('正在下载司法效力证据包', `已导出 ${ev.evidenceNo} (包含完整资金穿透图与数字签章)`, 'success');
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>下载证据包 (.zip)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Four-Agency Joint Enforcement Mechanism */}
      {activeTab === 'joint_enforcement' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Scale className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                多部门协同执法职责分工与处置流转矩阵
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <h3 className="font-bold text-blue-900 text-sm">国家互联网信息办公室 (CAC) · 算法与大模型安全治理局</h3>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  • 监管职责：算法及生成式人工智能服务上线备案核验、境内API服务合法资质审查、未备案境外模型(Claude/GPT)走私倒卖及违规跨境传输排查。<br/>
                  • 处置权力：依法约谈违规运营主体、下架未备案模型服务、封堵违规反向代理API镜像站、列入网信系统严重失信惩戒清单。
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                  <h3 className="font-bold text-indigo-900 text-sm">工业和信息化部 (MIIT) · 算网调度与算力券监管局</h3>
                </div>
                <p className="text-indigo-800 leading-relaxed">
                  • 监管职责：全国一体化算力网络算力调度监控、地方政府人工智能“算力券”冒领套现与刷量骗补核查、智算中心Token配额合规流转审计。<br/>
                  • 处置权力：追回并冻结财政算力券补贴资金、熔断违规智算节点国家公共调度网接入资格、取消涉案企业科技专项与算力补贴申报资格。
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                  <h3 className="font-bold text-emerald-900 text-sm">国家数据局 (NDA) · 数字要素与算力基础设施司</h3>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  • 监管职责：智能算力与大模型数据要素交易市场合规监管、大模型Token统一标准化计量结算审计、数据交易所大模型API专区交易监管。<br/>
                  • 处置权力：查处算力要素市场虚假计量与恶意囤积转售垄断、责令数交所下架违规API资产包、督促整改Token计量偏差。
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                  <h3 className="font-bold text-rose-900 text-sm">公安部网络安全保卫局 / 经济犯罪侦查局 (MPS)</h3>
                </div>
                <p className="text-rose-800 leading-relaxed">
                  • 监管职责：打击高价值企业大模型API Key渗透盗刷与暗网转售(非法获取计算机信息系统数据罪)、利用虚假调用骗补(诈骗罪)及黑产洗钱。<br/>
                  • 处置权力：跨省多地协同抓捕落地黑客与黑产中介；对黑产API网关服务器及涉案资金账户实施紧急止付与司法查封；移送检察院公诉。
                </p>
              </div>
            </div>

            {/* Workflow 5 Steps */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 space-y-2">
              <span className="font-bold text-slate-900 text-xs block">协同处置闭环标准操作规程 (SOP):</span>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-700">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-center flex-1 w-full">
                  <span className="font-bold text-blue-600 block">1. 异常发现</span>
                  <span className="text-[10px] text-slate-500">探针流监测触发盗刷/骗补红橙预警</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-center flex-1 w-full">
                  <span className="font-bold text-indigo-600 block">2. 联合研判</span>
                  <span className="text-[10px] text-slate-500">调取Token流向图谱与主体指纹</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-center flex-1 w-full">
                  <span className="font-bold text-purple-600 block">3. 证据固化</span>
                  <span className="text-[10px] text-slate-500">国密SM3摘要与司法授时TSA存证</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-center flex-1 w-full">
                  <span className="font-bold text-rose-600 block">4. 配额熔断/移送</span>
                  <span className="text-[10px] text-slate-500">切断API/追缴算力券并移送经侦立案</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-center flex-1 w-full">
                  <span className="font-bold text-emerald-600 block">5. 追踪反馈</span>
                  <span className="text-[10px] text-slate-500">追缴违法所得与司法存证结案归档</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Legal Precedent Reference Library */}
      {activeTab === 'legal_precedent' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEGAL_CASE_REFS.map((leg) => (
              <div
                key={leg.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{leg.title}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{leg.caseNo}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px]">
                    罪名: {leg.crimeType}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-blue-700 font-semibold">{leg.courtLevel}</span>
                  <span className="text-slate-400">|</span>
                  <span className="font-mono text-slate-500">{leg.verdictYear}年裁判</span>
                </div>

                <div className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  <strong>裁判要旨与判例指引: </strong>{leg.summary}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500">司法指导匹配度: <strong className="text-emerald-600 font-mono">{leg.relevanceScore}%</strong></span>
                  <span className="text-blue-600 font-semibold">最高法/最高检指导性案例库</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Verification Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  最高法电子证据核验证明公证书
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">证据包编号:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedEvidence.evidenceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">涉案案由:</span>
                  <span className="font-bold text-slate-900">{selectedEvidence.caseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">涉案嫌疑主体:</span>
                  <span className="font-bold text-blue-700">{selectedEvidence.targetEntity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">存证证书哈希:</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedEvidence.certHash}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TSA时间戳:</span>
                  <span className="font-mono text-emerald-700 font-bold">{selectedEvidence.timestampCert}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                经最高法互联网法院司法链节点验签，该电子数据自抓取生成起未发生任何篡改，证据链完整闭环。
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  onShowToast('正在下载最高法标准存证报告', 'PDF公证书已完成电子公章签章', 'success');
                  setSelectedEvidence(null);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                下载司法公证书 (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
