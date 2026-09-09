import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  Shield,
  Plus,
  Server,
  Cpu,
  Layers,
  Network,
  BellRing,
  Save,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import {
  WHITELISTED_MODELS_DATA,
  COMPUTE_NODES_DATA,
  DATA_CLASSIFICATION_RULES,
  CROSS_BORDER_CHANNELS,
} from '../mock/data';
import {
  WhitelistedModel,
  ComputeNodeConfig,
  DataClassRule,
  ChannelConfig,
} from '../types';

interface SandboxConfigPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  userRole?: string;
}

export const SandboxConfigPage: React.FC<SandboxConfigPageProps> = ({ onShowToast, userRole = 'government' }) => {
  const [activeTab, setActiveTab] = useState<'models' | 'nodes' | 'rules' | 'channels' | 'thresholds'>('models');

  // Models State
  const [models, setModels] = useState<WhitelistedModel[]>(WHITELISTED_MODELS_DATA);
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [newModelForm, setNewModelForm] = useState({
    name: '',
    provider: '',
    recordNumber: '',
    applicableBiz: 'Token出海与外数中算',
  });

  // Nodes State
  const [nodes, setNodes] = useState<ComputeNodeConfig[]>(COMPUTE_NODES_DATA);

  // Data Classification Rules State
  const [rules, setRules] = useState<DataClassRule[]>(DATA_CLASSIFICATION_RULES);

  // Cross-Border Channels
  const [channels, setChannels] = useState<ChannelConfig[]>(CROSS_BORDER_CHANNELS);

  // Thresholds & Alert Policies
  const [thresholds, setThresholds] = useState({
    maxSingleToken: 32768,
    spikeRatioThreshold: 20, // 20 times per min
    maxRetryLimit: 5,
    qpsLimit: 500,
    autoBlockOnFailure: true,
    alertNotifySMS: true,
    requireTEEForInbound: true,
  });

  // Toggle model status
  const handleToggleModelStatus = (id: string) => {
    setModels((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus: WhitelistedModel['status'] =
            m.status === '已启用' ? '已限制' : m.status === '已限制' ? '已禁用' : '已启用';
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
    onShowToast('模型准入状态已切换', '沙盒边缘鉴权网关策略已实时同步生效', 'info');
  };

  // Toggle node status
  const handleToggleNodeStatus = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextStatus: ComputeNodeConfig['status'] = n.status === '已启用' ? '维护中' : '已启用';
          return { ...n, status: nextStatus };
        }
        return n;
      })
    );
    onShowToast('算力节点状态已调整', '已向专线路由网关下发路由规避策略', 'info');
  };

  // Add new model
  const handleAddNewModel = () => {
    if (!newModelForm.name || !newModelForm.provider) {
      onShowToast('表单未填写完整', '请填写模型名称与提供商', 'warning');
      return;
    }

    const newM: WhitelistedModel = {
      id: `model-${Date.now()}`,
      name: newModelForm.name,
      provider: newModelForm.provider,
      recordNumber: newModelForm.recordNumber || '国网信算备2026-新',
      applicableBiz: newModelForm.applicableBiz,
      status: '已启用',
    };

    setModels([...models, newM]);
    setShowAddModelModal(false);
    setNewModelForm({ name: '', provider: '', recordNumber: '', applicableBiz: 'Token出海与外数中算' });
    onShowToast('已成功添加准入大模型', `模型 ${newM.name} 已加入沙盒合规白名单`, 'success');
  };

  // Save all policies
  const handleSavePolicies = () => {
    onShowToast('沙盒安全合规基线配置已保存', '策略配置已下发至全网 46 个在线沙盒网关节点并完成签名存证', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h1 className="text-base font-bold text-slate-900">沙盒合规基线与规则配置</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200">
              监管策略控制台
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            由监管部门与沙盒运营方统一设定模型白名单、物理算力节点认证、数据分级策略及熔断阈值。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSavePolicies}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>保存并下发策略</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'models', label: '模型白名单配置', icon: Cpu },
          { id: 'nodes', label: '算力节点准入认证', icon: Server },
          { id: 'rules', label: '数据分类分级规则', icon: Layers },
          { id: 'channels', label: '跨境专线传输信道', icon: Network },
          { id: 'thresholds', label: '阈值与告警策略', icon: BellRing },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Whitelisted Models */}
      {activeTab === 'models' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">准入大模型合规白名单</h2>
              <p className="text-xs text-slate-500">
                只有在国家网信办完成算法备案或通过沙盒专项评估的模型，才允许通过专线向海外提供推理或承接境外数据。
              </p>
            </div>
            <button
              onClick={() => setShowAddModelModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加准入模型</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap min-w-[130px]">模型名称</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[100px]">提供商</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[180px]">网信办算法/模型备案号</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[110px]">适用业务类型</th>
                  <th className="py-3 px-3 whitespace-nowrap min-w-[90px]">准入状态</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap min-w-[90px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono text-xs whitespace-nowrap">{m.name}</td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{m.provider}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">{m.recordNumber}</td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{m.applicableBiz}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${
                          m.status === '已启用'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : m.status === '已限制'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleModelStatus(m.id)}
                        className="px-2.5 py-1 rounded text-blue-600 hover:bg-blue-50 font-medium text-xs transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {m.status === '已启用' ? '变更限制' : m.status === '已限制' ? '禁用' : '重新启用'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Compute Nodes Admittance */}
      {activeTab === 'nodes' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">算力节点准入与物理隔离度量</h2>
              <p className="text-xs text-slate-500">
                严格审查境内机房物理隔离度量（等保三级、密评、机密计算可信执行环境TEE）。
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">已认证节点: {nodes.length} 个</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all text-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-xs">{n.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${
                      n.status === '已启用'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {n.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                  <div>
                    <span className="text-slate-400">运营主体: </span>
                    <span className="font-medium text-slate-800">{n.operator}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">安全等级: </span>
                    <span className="text-blue-700 font-semibold">{n.securityLevel}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">物理位置: </span>
                    <span className="text-slate-800">{n.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">TEE 机密环境: 硬件级隔离保障</span>
                  <button
                    onClick={() => handleToggleNodeStatus(n.id)}
                    className="text-xs text-slate-600 hover:text-blue-600"
                  >
                    {n.status === '已启用' ? '设为维护' : '恢复上线'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Data Classification Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">数据分类分级与合规脱敏策略</h2>
              <p className="text-xs text-slate-500">
                依据《数据安全法》与《个人信息保护法》配置各层级数据在跨境通道上的自动化处置动作。
              </p>
            </div>
            <span className="text-xs text-slate-400">5级分类策略联动</span>
          </div>

          <div className="space-y-3">
            {rules.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.category}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        r.level === '核心数据'
                          ? 'bg-rose-100 text-rose-800 font-bold'
                          : r.level === '重要数据'
                          ? 'bg-amber-100 text-amber-800 font-bold'
                          : r.level === '敏感个人信息'
                          ? 'bg-purple-100 text-purple-800 font-bold'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">处置动作:</span>
                    <select
                      value={r.action}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setRules((prev) =>
                          prev.map((item) => (item.id === r.id ? { ...item, action: val } : item))
                        );
                        onShowToast('分类动作已修改', `${r.category} 处置动作变更为: ${val}`, 'info');
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium"
                    >
                      <option value="放行">放行 (直通)</option>
                      <option value="脱敏">脱敏 (端侧脱敏掩码)</option>
                      <option value="阻断">阻断 (强制熔断)</option>
                      <option value="人工审核">人工审核 (挂起工单)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400">匹配规则与特征工程: </span>
                    <span className="font-medium text-slate-800">{r.rule}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">检测灵敏度阈值: </span>
                    <span className="font-mono text-blue-700 font-semibold">{r.threshold}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Cross-Border Channels */}
      {activeTab === 'channels' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">跨境传输专用通道配置</h2>
              <p className="text-xs text-slate-500">
                国际海缆与数据专线网关物理链路配置，要求全程 TLS 1.3 + 国密 SM4 强加密受控传输。
              </p>
            </div>
            <span className="text-xs text-emerald-600 font-medium">5条通道全量监控在线</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{ch.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                    {ch.status}
                  </span>
                </div>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div>专线物理带宽: <strong className="text-slate-800">{ch.bandwidth}</strong></div>
                  <div>传输加密算法: <span className="font-mono text-blue-700">{ch.encryption}</span></div>
                  <div>当前信道延迟: <span className="font-mono text-slate-700">{ch.latency}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Thresholds & Alert Policies */}
      {activeTab === 'thresholds' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">阈值与突发告警熔断策略</h2>
            <p className="text-xs text-slate-500">
              设置防范 API 泛洪攻击、突发海量数据盗刷和异常 Token 消耗的自动化熔断基线。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  单次请求最大 Token 消耗限制
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={thresholds.maxSingleToken}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, maxSingleToken: Number(e.target.value) })
                    }
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs w-36 font-mono"
                  />
                  <span className="text-slate-500">Tokens / 次 (防止超大恶意提示词注入)</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  流量突增告警阈值倍数
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={thresholds.spikeRatioThreshold}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, spikeRatioThreshold: Number(e.target.value) })
                    }
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs w-36 font-mono"
                  />
                  <span className="text-slate-500">倍 / 分钟 (高于历史基线时自动触发限流)</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  单企业高频 API 限速 QPS
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={thresholds.qpsLimit}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, qpsLimit: Number(e.target.value) })
                    }
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs w-36 font-mono"
                  />
                  <span className="text-slate-500">QPS (超出部分平滑排队或抛弃)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  网关鉴权失败重试锁定上限
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={thresholds.maxRetryLimit}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, maxRetryLimit: Number(e.target.value) })
                    }
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs w-36 font-mono"
                  />
                  <span className="text-slate-500">次 (连续失败锁定 30 分钟)</span>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thresholds.autoBlockOnFailure}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, autoBlockOnFailure: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-800 font-medium">触发高危违规自动执行网关硬熔断</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thresholds.alertNotifySMS}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, alertNotifySMS: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-800 font-medium">发生极高危事件时向监管专员发送紧急短信提醒</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thresholds.requireTEEForInbound}
                    onChange={(e) =>
                      setThresholds({ ...thresholds, requireTEEForInbound: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-800 font-medium">外数中算业务强制校验 TEE 机密计算环境度量证明</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Model Modal */}
      {showAddModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900">登记并准入新大模型</h3>
              <button
                onClick={() => setShowAddModelModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">模型名称及版本</label>
                <input
                  type="text"
                  placeholder="例如: DeepSeek-R1-Distill-Qwen-32B"
                  value={newModelForm.name}
                  onChange={(e) => setNewModelForm({ ...newModelForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">研发或运营提供商</label>
                <input
                  type="text"
                  placeholder="例如: 杭州深度求索人工智能基础技术研究有限公司"
                  value={newModelForm.provider}
                  onChange={(e) => setNewModelForm({ ...newModelForm, provider: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">国家网信办算法/模型备案号</label>
                <input
                  type="text"
                  placeholder="例如: 国网信算备440115000000001号"
                  value={newModelForm.recordNumber}
                  onChange={(e) => setNewModelForm({ ...newModelForm, recordNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">适用沙盒业务类型</label>
                <select
                  value={newModelForm.applicableBiz}
                  onChange={(e) => setNewModelForm({ ...newModelForm, applicableBiz: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Token出海与外数中算">Token出海与外数中算 (全业务)</option>
                  <option value="Token出海 (单向AI推理)">Token出海 (单向AI推理)</option>
                  <option value="外数中算 (境内隔离加工)">外数中算 (境内隔离加工)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModelModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleAddNewModel}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                确认准入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
