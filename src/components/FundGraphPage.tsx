import React, { useState } from 'react';
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Download,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  Building,
  DollarSign,
  Share2,
  Lock,
  Layers,
  CheckCircle2,
  HelpCircle,
  FileCheck2,
  Server,
  Terminal,
  Search,
  Crosshair,
  ExternalLink,
} from 'lucide-react';
import { GRAPH_NODES_DATA, GRAPH_EDGES_DATA } from '../mock/regtechData';
import { GraphNode, GraphEdge } from '../types';

interface FundGraphPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
}

export const FundGraphPage: React.FC<FundGraphPageProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>(GRAPH_NODES_DATA);
  const [edges, setEdges] = useState<GraphEdge[]>(GRAPH_EDGES_DATA);
  const [selectedNode, setSelectedNode] = useState<GraphNode>(GRAPH_NODES_DATA[0]);
  const [filterType, setFilterType] = useState<string>('all');
  const [penetrationDepth, setPenetrationDepth] = useState<number>(4);

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'account_master':
        return { bg: '#dc2626', text: '#ffffff', stroke: '#991b1b', label: '申领主体 / 核心企业' };
      case 'account_proxy':
        return { bg: '#ea580c', text: '#ffffff', stroke: '#c2410c', label: '虚假聚合中继代理' };
      case 'compute_cluster':
        return { bg: '#2563eb', text: '#ffffff', stroke: '#1d4ed8', label: '智算中心 / 官方算力池' };
      case 'script_farm':
        return { bg: '#7c3aed', text: '#ffffff', stroke: '#6d28d9', label: '自动化刷量脚本集群' };
      case 'darkweb_broker':
        return { bg: '#0f172a', text: '#38bdf8', stroke: '#38bdf8', label: '暗网 API 倒卖撮合' };
      case 'suspicious_entity':
      default:
        return { bg: '#b91c1c', text: '#ffffff', stroke: '#7f1d1d', label: '涉案套现终点/沉淀账户' };
    }
  };

  const handleToggleFreeze = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const newStatus = !n.isFrozen;
          onShowToast(
            newStatus ? '已下发紧急配额熔断与止付令' : '已解除临时配额管控',
            `已对 ${n.nodeKey} (${n.label}) 执行跨部门协同冻结`,
            newStatus ? 'error' : 'info'
          );
          return { ...n, isFrozen: newStatus };
        }
        return n;
      })
    );
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode((prev) => ({ ...prev, isFrozen: !prev.isFrozen }));
    }
  };

  const filteredNodes = nodes.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'frozen') return n.isFrozen;
    if (filterType === 'crossborder') return n.type === 'darkweb_broker' || n.type === 'account_proxy';
    if (filterType === 'compute') return n.type === 'compute_cluster' || n.type === 'script_farm';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Token 流向与算力券资金穿透图谱 (Graph DB)
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
              模块 5 · 实时大模型拓扑关联追踪
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            还原大模型黑产完整调用与结算流向：申领主体(套现) ➔ 虚假聚合中继 ➔ 自动化刷量脚本 ➔ 智算中心核销；API Key 盗刷 ➔ 暗网经纪商 ➔ 境外走私中转，支持穿透同一实际控制人(UBO)。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onShowToast('正在导出拓扑司法证据', '已生成 GraphML 与国密哈希区块链固证卷宗', 'info');
            }}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出图谱证据 (GraphML/JSON)</span>
          </button>
        </div>
      </div>

      {/* Control & Filter Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            链路筛选:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {[
              { id: 'all', label: '全量涉案拓扑' },
              { id: 'frozen', label: '已止付/封停节点' },
              { id: 'crossborder', label: '暗网/跨境流出' },
              { id: 'compute', label: '算力池与刷量集群' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-600">
          <div className="flex items-center gap-2">
            <span>穿透深度:</span>
            <input
              type="range"
              min="1"
              max="6"
              value={penetrationDepth}
              onChange={(e) => setPenetrationDepth(Number(e.target.value))}
              className="w-24 accent-indigo-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-indigo-700">{penetrationDepth} 层穿透</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200"></div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>红色: 申领企业 / 橙色: 中继代理</span>
          </div>
        </div>
      </div>

      {/* Main Canvas & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner relative overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* Canvas Top Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 z-10">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>监测节点: {filteredNodes.length} / 涉案流向边: {edges.length}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
              <button className="p-1 text-slate-400 hover:text-white rounded cursor-pointer" title="放大">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="p-1 text-slate-400 hover:text-white rounded cursor-pointer" title="缩小">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="p-1 text-slate-400 hover:text-white rounded cursor-pointer" title="全屏">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Graph View */}
          <div className="flex-1 w-full h-full flex items-center justify-center py-6">
            <svg className="w-full h-96" viewBox="0 0 950 480">
              {/* Grid Background */}
              <defs>
                <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                <marker
                  id="arrow-normal"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
                <marker
                  id="arrow-suspicious"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#graph-grid)" />

              {/* Edges */}
              {edges.map((e) => {
                const src = nodes.find((n) => n.id === e.source);
                const tgt = nodes.find((n) => n.id === e.target);
                if (!src || !tgt) return null;

                const isSuspicious = e.isSuspicious;

                return (
                  <g key={e.id}>
                    <line
                      x1={src.x || 100}
                      y1={src.y || 100}
                      x2={tgt.x || 300}
                      y2={tgt.y || 100}
                      stroke={isSuspicious ? '#ef4444' : '#475569'}
                      strokeWidth={isSuspicious ? 2.5 : 1.5}
                      strokeDasharray={isSuspicious ? '5 3' : undefined}
                      markerEnd={isSuspicious ? 'url(#arrow-suspicious)' : 'url(#arrow-normal)'}
                    />
                    {/* Edge Label */}
                    <text
                      x={((src.x || 100) + (tgt.x || 300)) / 2}
                      y={((src.y || 100) + (tgt.y || 100)) / 2 - 8}
                      fill={isSuspicious ? '#fca5a5' : '#94a3b8'}
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {e.amountCNY} ({e.amountToken})
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((n) => {
                const colors = getNodeColor(n.type);
                const isSelected = selectedNode?.id === n.id;

                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x || 100}, ${n.y || 100})`}
                    onClick={() => setSelectedNode(n)}
                    className="cursor-pointer"
                  >
                    {/* Pulsing ring for high risk */}
                    {n.riskScore >= 90 && (
                      <circle
                        r="28"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    )}

                    {/* Frozen indicator ring */}
                    {n.isFrozen && (
                      <circle
                        r="24"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Main Circle */}
                    <circle
                      r="20"
                      fill={colors.bg}
                      stroke={isSelected ? '#ffffff' : colors.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all hover:scale-110"
                    />

                    {/* Node Identifier Shortcode */}
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill={colors.text}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {n.id.replace('node-', '')}
                    </text>

                    {/* Node Label Below */}
                    <text
                      textAnchor="middle"
                      dy="36"
                      fill="#e2e8f0"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {n.label.split('(')[0]}
                    </text>

                    {/* Balance */}
                    <text
                      textAnchor="middle"
                      dy="49"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {n.balanceCNY}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Canvas Bottom Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                申领主体/母账户
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                聚合中继代理
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                自动化刷量脚本
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                官方智算中心
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-cyan-400"></span>
                暗网 API 倒卖
              </span>
            </div>
            <span className="text-slate-400 font-mono">图引擎: Neo4j Cypher 实时穿透计算</span>
          </div>
        </div>

        {/* Node Deep Inspection Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  主体画像与关联穿透
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  selectedNode.riskScore > 90
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                风险分: {selectedNode.riskScore}
              </span>
            </div>

            {/* Selected Node Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">账户主体与凭证</span>
                <span className="font-bold text-slate-900 text-sm block">{selectedNode.label}</span>
                <span className="font-mono text-slate-500 text-[11px]">{selectedNode.nodeKey}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">节点类型分类</span>
                  <span className="font-semibold text-slate-800">{selectedNode.categoryName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">当前涉案资金/补贴</span>
                  <span className="font-bold text-blue-700 font-mono">{selectedNode.balanceCNY}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Token配额 / 异动规模</span>
                  <span className="font-bold text-purple-700 font-mono">{selectedNode.tokenQuota}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">疑似所属控制人 / 犯罪团伙 (UBO)</span>
                <span className="font-semibold text-rose-700 block">{selectedNode.uboCluster}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">当前司法管控状态:</span>
                <span className={`font-bold ${selectedNode.isFrozen ? 'text-blue-600' : 'text-amber-600'}`}>
                  {selectedNode.isFrozen ? '已实施紧急熔断与止付' : '未冻结·实时监控中'}
                </span>
              </div>
            </div>

            {/* Flow Statistics */}
            <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-2">
              <span className="font-semibold text-slate-800 block">Token与资金流转行为特征</span>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <p>• Token 突发特征: 单日高频调用超 1.2 亿 Tokens，Prompt 长度固定高度雷同</p>
                <p>• 券补套现特征: 申领地方 480 万元算力券，通过代理分流与刷量脚本快速核销</p>
                <p>• 涉案情报关联: 关联公安网安“黑狐”大模型盗刷案与国家数据局算力异常通报</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleToggleFreeze(selectedNode.id)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedNode.isFrozen
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/20'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{selectedNode.isFrozen ? '解除账户临时管控' : '下达紧急止付/账户冻结指令'}</span>
            </button>

            <button
              onClick={() => {
                onShowToast('已生成立案卷宗证据包', `已将节点 ${selectedNode.nodeKey} 的全量交易证据移送调查中心`, 'success');
                onNavigate('investigation');
              }}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>生成司法区块链存证卷宗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
