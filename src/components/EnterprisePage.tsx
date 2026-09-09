import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Download,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Server,
  Network,
  Cpu,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  Phone,
  User,
  Hash,
  Award,
  Plus,
  Edit3,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ENTERPRISES_DATA } from '../mock/data';
import { Enterprise } from '../types';

interface EnterprisePageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  selectedEntId?: string | null;
}

export const EnterprisePage: React.FC<EnterprisePageProps> = ({ onShowToast, selectedEntId }) => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(ENTERPRISES_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBiz, setFilterBiz] = useState('all');

  // Drawer state
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(
    selectedEntId ? enterprises.find((e) => e.id === selectedEntId) || enterprises[0] : null
  );
  const [drawerTab, setDrawerTab] = useState<'profile' | 'channel' | 'tokens' | 'risks'>('profile');
  const [isDownloading, setIsDownloading] = useState(false);

  // Add Enterprise Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntForm, setNewEntForm] = useState({
    name: '',
    creditCode: '',
    businessType: 'Token出海' as 'Token出海' | '外数中算' | '混合业务',
    models: 'DeepSeek-V3, Qwen-2.5',
    computeNodes: '广州南沙国际智算中心',
    contactPerson: '',
    contactPhone: '',
    icpCert: '粤B2-20260088',
    algorithmRecord: '网信算备440101990012号',
    modelRecord: '国网信模备2026-0081号',
    crossBorderChannel: '大湾区跨境数据安全合规专线',
  });

  // Edit Status Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTargetStatus, setStatusTargetStatus] = useState<Enterprise['status']>('已通过');
  const [statusScoreAdjustment, setStatusScoreAdjustment] = useState(95);

  // Filtered enterprises
  const filteredEnterprises = enterprises.filter((ent) => {
    const matchesSearch =
      ent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ent.creditCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ent.models.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || ent.status === filterStatus;
    const matchesBiz = filterBiz === 'all' || ent.businessType === filterBiz;

    return matchesSearch && matchesStatus && matchesBiz;
  });

  const handleDownloadReport = (ent: Enterprise) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      onShowToast(
        '审计合规报告已生成并下载',
        `已成功下载《${ent.name} 跨境AI业务沙盒合规审计报告 (2026年Q1版).pdf》`,
        'success'
      );
    }, 900);
  };

  const handleExportCSV = () => {
    onShowToast(
      '企业名录已导出',
      `已成功导出《国家跨境AI算力服务合规监管沙盒·入驻企业名录 (${filteredEnterprises.length}家).csv》`,
      'success'
    );
  };

  const handleCreateEnterprise = () => {
    if (!newEntForm.name || !newEntForm.creditCode) {
      onShowToast('表单未填写完整', '请填写企业名称与统一社会信用代码', 'warning');
      return;
    }

    const newEnt: Enterprise = {
      id: `ent-${Date.now()}`,
      name: newEntForm.name,
      creditCode: newEntForm.creditCode,
      businessType: newEntForm.businessType,
      mainRegions: ['新加坡', '中国香港'],
      models: newEntForm.models.split(',').map((s) => s.trim()),
      computeNodes: [newEntForm.computeNodes],
      todayTokens: '0.0亿',
      complianceScore: 100,
      status: '资料审核中',
      contactPerson: newEntForm.contactPerson || '负责人',
      contactPhone: newEntForm.contactPhone || '13800000000',
      joinDate: new Date().toISOString().split('T')[0],
      icpCert: newEntForm.icpCert,
      ediCert: '粤EDI-20260021',
      algorithmRecord: newEntForm.algorithmRecord,
      modelRecord: newEntForm.modelRecord,
      crossBorderChannel: newEntForm.crossBorderChannel,
      upstreamProvider: '中国移动国际互联专线',
      historicalTokens: [
        { month: '1月', tokens: 0 },
        { month: '2月', tokens: 0 },
        { month: '3月', tokens: 0 },
      ],
      riskCount: 0,
      recentRisks: [],
    };

    setEnterprises([newEnt, ...enterprises]);
    setShowAddModal(false);
    onShowToast('新企业已完成入驻申报登记', `企业【${newEnt.name}】已建立沙盒专属档案并派发技术验证通道`, 'success');
  };

  const handleSaveStatusChange = () => {
    if (!selectedEnterprise) return;
    const updated = enterprises.map((ent) => {
      if (ent.id === selectedEnterprise.id) {
        return {
          ...ent,
          status: statusTargetStatus,
          complianceScore: statusScoreAdjustment,
        };
      }
      return ent;
    });
    setEnterprises(updated);
    setSelectedEnterprise({
      ...selectedEnterprise,
      status: statusTargetStatus,
      complianceScore: statusScoreAdjustment,
    });
    setShowStatusModal(false);
    onShowToast(
      '沙盒准入状态调整成功',
      `企业【${selectedEnterprise.name}】状态已变更为: ${statusTargetStatus}，合规评分设定为 ${statusScoreAdjustment} 分`,
      'success'
    );
  };

  const getStatusBadge = (status: Enterprise['status']) => {
    switch (status) {
      case '已通过':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '技术验证中':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '限制运行':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case '资料审核中':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '已暂停':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Summary */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900">入驻沙盒企业管理</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
              共 28 家入驻主体
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            实施“一企一档”跨境 AI 算力服务审查，涵盖大模型备案、算力节点可信度量与数据出境专线路径。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="导出全部已入驻企业档案"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>导出企业名录 (CSV)</span>
          </button>

          <button
            onClick={() => {
              onShowToast('申请资料核验中', '已向网信办算法与模型系统发起批量资质同步', 'info');
            }}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>同步网信备案</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新增企业入驻申报</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索企业名称 / 信用代码 / 模型..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">沙盒状态: 全部</option>
            <option value="已通过">已通过</option>
            <option value="技术验证中">技术验证中</option>
            <option value="限制运行">限制运行</option>
            <option value="资料审核中">资料审核中</option>
            <option value="已暂停">已暂停</option>
          </select>

          {/* Filter Business */}
          <select
            value={filterBiz}
            onChange={(e) => setFilterBiz(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">业务类型: 全部</option>
            <option value="Token出海">Token出海</option>
            <option value="外数中算">外数中算</option>
            <option value="混合业务">混合业务</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          检索到 {filteredEnterprises.length} 家主体
        </div>
      </div>

      {/* Main Enterprise Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap min-w-[160px]">企业名称</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[160px]">统一社会信用代码</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[100px]">业务类型</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[130px]">主要服务地区</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[160px]">使用模型</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[140px]">算力节点</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[110px]">今日Token消耗</th>
                <th className="py-3 px-3 text-center whitespace-nowrap min-w-[90px]">合规评分</th>
                <th className="py-3 px-3 whitespace-nowrap min-w-[110px]">沙盒状态</th>
                <th className="py-3 px-4 text-right whitespace-nowrap min-w-[90px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnterprises.map((ent) => (
                <tr
                  key={ent.id}
                  onClick={() => setSelectedEnterprise(ent)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900 group-hover:text-blue-600 whitespace-nowrap flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0" />
                    <span>{ent.name}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">{ent.creditCode}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {ent.businessType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <div className="flex flex-wrap gap-1">
                      {ent.mainRegions.map((r, i) => (
                        <span key={i} className="text-[11px] whitespace-nowrap px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-mono font-medium text-blue-700">
                      {ent.models.join(', ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 truncate max-w-[160px]" title={ent.computeNodes.join(' / ')}>
                    {ent.computeNodes[0]}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                    {ent.todayTokens}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs whitespace-nowrap ${
                        ent.complianceScore >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ent.complianceScore >= 80
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {ent.complianceScore}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${getStatusBadge(ent.status)}`}>
                      {ent.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEnterprise(ent);
                      }}
                      className="px-2.5 py-1 rounded-md text-blue-600 hover:bg-blue-100/60 font-medium text-xs transition-colors whitespace-nowrap cursor-pointer"
                    >
                      详情审查
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise Detail Drawer */}
      {selectedEnterprise && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(selectedEnterprise.status)}`}>
                      {selectedEnterprise.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                      {selectedEnterprise.businessType}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    {selectedEnterprise.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    统一社会信用代码: {selectedEnterprise.creditCode}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedEnterprise(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="flex items-center gap-2 mt-6 border-b border-slate-200">
                <button
                  onClick={() => setDrawerTab('profile')}
                  className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all ${
                    drawerTab === 'profile'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  基本资料与资质备案
                </button>
                <button
                  onClick={() => setDrawerTab('channel')}
                  className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all ${
                    drawerTab === 'channel'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  出境路径与算力节点
                </button>
                <button
                  onClick={() => setDrawerTab('tokens')}
                  className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all ${
                    drawerTab === 'tokens'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  历史Token消耗
                </button>
                <button
                  onClick={() => setDrawerTab('risks')}
                  className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    drawerTab === 'risks'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>风险事件记录</span>
                  {selectedEnterprise.riskCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                      {selectedEnterprise.riskCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              {/* Tab 1: Profile & Qualifications */}
              {drawerTab === 'profile' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      主体信息与合规责任人
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-slate-600">
                      <div>
                        <span className="text-slate-400 block">法定联络人</span>
                        <span className="font-medium text-slate-900">{selectedEnterprise.contactPerson}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">应急响应电话</span>
                        <span className="font-mono text-slate-900">{selectedEnterprise.contactPhone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">入驻沙盒日期</span>
                        <span className="font-mono text-slate-900">{selectedEnterprise.joinDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">沙盒综合合规分</span>
                        <span className="font-bold text-emerald-600 font-mono text-sm">
                          {selectedEnterprise.complianceScore} / 100 分
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-blue-600" />
                      国家网信与电信合规备案核验
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                        <div>
                          <span className="text-slate-500 block text-[11px]">增值电信业务许可证 (ICP)</span>
                          <span className="font-mono font-semibold text-slate-900">{selectedEnterprise.icpCert}</span>
                        </div>
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-medium">
                          核验在期
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                        <div>
                          <span className="text-slate-500 block text-[11px]">在线数据处理与交易处理 (EDI)</span>
                          <span className="font-mono font-semibold text-slate-900">{selectedEnterprise.ediCert}</span>
                        </div>
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-medium">
                          核验在期
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                        <div>
                          <span className="text-slate-500 block text-[11px]">国家互联网信息办公室·算法备案号</span>
                          <span className="font-mono font-semibold text-blue-800">{selectedEnterprise.algorithmRecord}</span>
                        </div>
                        <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-medium">
                          算法通过
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
                        <div>
                          <span className="text-slate-500 block text-[11px]">生成式人工智能大模型上线备案</span>
                          <span className="font-mono font-semibold text-blue-800">{selectedEnterprise.modelRecord}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            selectedEnterprise.modelRecord.includes('复审')
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {selectedEnterprise.modelRecord.includes('复审') ? '审核中' : '模型有效'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Channel & Compute Nodes */}
              {drawerTab === 'channel' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Network className="w-4 h-4 text-blue-600" />
                      跨境合规通道与上游互联
                    </h3>
                    <div className="space-y-2 mt-3 text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[11px]">数据出境合规专线</span>
                        <p className="font-medium text-slate-900 mt-0.5">{selectedEnterprise.crossBorderChannel}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-slate-400 block text-[11px]">上游算力与专线运营服务商</span>
                        <p className="font-medium text-slate-900 mt-0.5">{selectedEnterprise.upstreamProvider}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-indigo-600" />
                      经认证的境内算力物理节点
                    </h3>
                    <div className="space-y-2 mt-2">
                      {selectedEnterprise.computeNodes.map((node, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-slate-900">{node}</span>
                            <span className="block text-[11px] text-slate-400 mt-0.5">硬件指纹度量: TPM 2.0 验证通过</span>
                          </div>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">在线</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-teal-600" />
                      准入调用大模型目录
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedEnterprise.models.map((m, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Historical Tokens */}
              {drawerTab === 'tokens' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900">近半年 Token 消耗走势 (单位: 亿)</h3>
                        <p className="text-[11px] text-slate-500">今日消耗: {selectedEnterprise.todayTokens}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-600">
                        月度环比稳定增长
                      </span>
                    </div>

                    <div className="h-48 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedEnterprise.historicalTokens} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                          />
                          <Bar dataKey="tokens" fill="#2563eb" radius={[4, 4, 0, 0]} name="Token (亿)" barSize={28} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-950">
                    <h4 className="font-bold mb-1">沙盒配额策略提示</h4>
                    <p className="text-[11px] leading-relaxed text-blue-800">
                      该企业已被授予日均 200 亿 Token 调用配额，单次请求最大 Token 限制为 32,768。若持续保持 90分以上合规评分，可申请开通绿色极速出关通道。
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Risks & Penalties */}
              {drawerTab === 'risks' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                      <span>历史风险事件与处置记录</span>
                      <span className="text-rose-600 font-mono font-bold">{selectedEnterprise.riskCount} 次记录</span>
                    </h3>
                    <div className="space-y-2.5 mt-3">
                      {selectedEnterprise.recentRisks.map((risk, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white border border-slate-200 text-xs">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="font-medium text-slate-800">{risk}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h4 className="font-bold text-slate-900 mb-1">合规评分动态变化机制</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      基础分 100 分。触犯一般告警不扣分；中风险（如敏感信息未端侧脱敏）扣 3分/次；高危红线（如未授权模型调用）扣 15分/次并挂起沙盒资格。连续30天无风险自动恢复 5分。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setStatusTargetStatus(selectedEnterprise.status);
                  setStatusScoreAdjustment(selectedEnterprise.complianceScore);
                  setShowStatusModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>调整沙盒权限与状态</span>
              </button>

              <button
                onClick={() => handleDownloadReport(selectedEnterprise)}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-70 cursor-pointer"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>下载合规审计报告 (PDF)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Add New Enterprise Registration */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">申报新入驻跨境 AI 算力企业</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto pr-1">
              <div className="col-span-2">
                <label className="block text-slate-700 font-medium mb-1">企业注册全称</label>
                <input
                  type="text"
                  placeholder="例如: 广州数字海缆智能计算技术有限公司"
                  value={newEntForm.name}
                  onChange={(e) => setNewEntForm({ ...newEntForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">统一社会信用代码</label>
                <input
                  type="text"
                  placeholder="91440101MA9..."
                  value={newEntForm.creditCode}
                  onChange={(e) => setNewEntForm({ ...newEntForm, creditCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">沙盒业务类型</label>
                <select
                  value={newEntForm.businessType}
                  onChange={(e) => setNewEntForm({ ...newEntForm, businessType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Token出海">Token出海 (单向AI推理)</option>
                  <option value="外数中算">外数中算 (境内隔离加工)</option>
                  <option value="混合业务">混合业务 (出海+中算)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">法定业务对接人</label>
                <input
                  type="text"
                  placeholder="姓名"
                  value={newEntForm.contactPerson}
                  onChange={(e) => setNewEntForm({ ...newEntForm, contactPerson: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">联系电话</label>
                <input
                  type="text"
                  placeholder="手机号"
                  value={newEntForm.contactPhone}
                  onChange={(e) => setNewEntForm({ ...newEntForm, contactPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-700 font-medium mb-1">调用大模型名称 (英文逗号分隔)</label>
                <input
                  type="text"
                  placeholder="DeepSeek-V3, Qwen-2.5-72B"
                  value={newEntForm.models}
                  onChange={(e) => setNewEntForm({ ...newEntForm, models: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-700 font-medium mb-1">指定物理算力机房节点</label>
                <select
                  value={newEntForm.computeNodes}
                  onChange={(e) => setNewEntForm({ ...newEntForm, computeNodes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="广州南沙国际智算中心">广州南沙国际智算中心 (等保三级+TEE)</option>
                  <option value="汕头国际数据传输飞地算力节点">汕头国际数据传输飞地算力节点</option>
                  <option value="上海临港数据特区智算中心">上海临港数据特区智算中心</option>
                  <option value="广州海珠琶洲人工智能算力专区">广州海珠琶洲人工智能算力专区</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">网信办算法备案号</label>
                <input
                  type="text"
                  value={newEntForm.algorithmRecord}
                  onChange={(e) => setNewEntForm({ ...newEntForm, algorithmRecord: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">大模型上线备案号</label>
                <input
                  type="text"
                  value={newEntForm.modelRecord}
                  onChange={(e) => setNewEntForm({ ...newEntForm, modelRecord: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleCreateEnterprise}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                提交沙盒入驻申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Adjust Enterprise Sandbox Privilege */}
      {showStatusModal && selectedEnterprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">调整企业沙盒准入状态</h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">当前目标企业:</span>
                <span className="font-bold text-slate-900">{selectedEnterprise.name}</span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">变更沙盒运行状态</label>
                <select
                  value={statusTargetStatus}
                  onChange={(e) => setStatusTargetStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <option value="已通过">已通过 (全量合规放行)</option>
                  <option value="技术验证中">技术验证中 (受控流量测试)</option>
                  <option value="限制运行">限制运行 (降级与限流模式)</option>
                  <option value="资料审核中">资料审核中 (挂起审批)</option>
                  <option value="已暂停">已暂停 (熔断并关闭通道)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  当前合规考核评分: <strong className="text-blue-600 font-mono">{statusScoreAdjustment} 分</strong>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={statusScoreAdjustment}
                  onChange={(e) => setStatusScoreAdjustment(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>50分 (违规熔断)</span>
                  <span>80分 (警告线)</span>
                  <span>100分 (优良)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                ⚠️ 注意：若将企业设置为“已暂停”，沙盒通道探针将即时丢弃该企业所有入出境 API 握手包并记录监管熔断取证。
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleSaveStatusChange}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                确认调整
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
