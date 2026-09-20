import React, { useState } from 'react';
import {
  DatabaseZap,
  Activity,
  HardDrive,
  RefreshCw,
  Server,
  Network,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Search,
  Lock,
  ArrowRight,
  Download,
  Eye,
  Terminal,
} from 'lucide-react';
import { DATA_INGESTION_SOURCES } from '../mock/regtechData';
import { DataIngestionSource } from '../types';

interface DataIngestionPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
}

export const DataIngestionPage: React.FC<DataIngestionPageProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const [sources, setSources] = useState<DataIngestionSource[]>(DATA_INGESTION_SOURCES);
  const [activeTab, setActiveTab] = useState<'sources' | 'standard_schema' | 'privacy_masking'>('sources');
  const [selectedSource, setSelectedSource] = useState<DataIngestionSource | null>(null);

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DatabaseZap className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>多源异构数据采集与系统集成前置机中心</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              模块 1 & 9 · Kafka + Flink 实时探针 · 5.8万条/秒
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            多源异构接入（合规交易所API · DEX链上全节点 · 银行反洗钱结算网关 · OTC大宗专线 · 公链浏览器 · 舆情暗网雷达）；统一监管数据元规范与隐私脱敏防护。
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'sources'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            数据采集通道 ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('standard_schema')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'standard_schema'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            统一监管数据元规范
          </button>
          <button
            onClick={() => setActiveTab('privacy_masking')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'privacy_masking'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            隐私保护与脱敏前置机
          </button>
        </div>
      </div>

      {/* Tab 1: Sources Grid */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {src.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-semibold text-emerald-700">在线采集</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{src.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                    <span>协议: {src.protocol}</span>
                    <span>•</span>
                    <span>接入机制: {src.realtimeType}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">瞬时吞吐 (QPS)</span>
                    <span className="font-bold text-slate-800">{src.qps} QPS</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">平均延迟</span>
                    <span className="font-bold text-emerald-600">{src.latencyMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">日采集量</span>
                    <span className="font-bold text-blue-700">{src.dailyRecords}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">数据清洗质量</span>
                    <span className="font-bold text-slate-900">{src.dataQuality} 分</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-100/60 p-2 rounded-lg truncate">
                  脱敏规则: <span className="font-mono text-slate-700">{src.securityMasking}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 text-[11px]">同步时间: {src.lastSyncTime}</span>
                  <button
                    onClick={() => {
                      onShowToast('通道自检正常', `${src.name} 连通性测试通过，丢包率 0%`, 'success');
                    }}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    探针自检
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Standard Schema */}
      {activeTab === 'standard_schema' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                国家金融科技监管沙盒 Token 交易统一数据元标准规范 (JSON Schema)
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              针对不同链（BTC / EVM / Solana / TRON）及中心化交易所、银行银联通道的异构数据格式，统一转换为国家监管通用数据元标准，确立全网跨平台穿透基石。
            </p>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{`{
  "$schema": "https://regtech.gov.cn/schema/token-transaction-v2.json",
  "type": "object",
  "required": ["tx_hash", "timestamp_utc", "token_symbol", "amount_token", "amount_cny", "from_account", "to_account", "channel_type", "ubo_id"],
  "properties": {
    "tx_hash": { "type": "string", "description": "交易全网唯一哈希" },
    "timestamp_utc": { "type": "string", "format": "date-time" },
    "token_symbol": { "type": "string", "enum": ["USDT", "BTC", "ETH", "CNH-Token", "STO-B01", "RWA-C02"] },
    "amount_token": { "type": "number", "minimum": 0 },
    "amount_cny": { "type": "number", "description": "按人行当日中间价自动折算" },
    "from_account": { "type": "string", "description": "付款方唯一标识（地址/卡号/交易所UID）" },
    "from_entity_name": { "type": "string", "description": "KYC认证主体企业/个人" },
    "to_account": { "type": "string", "description": "收款方唯一标识" },
    "to_entity_name": { "type": "string" },
    "channel_type": { "type": "string", "enum": ["合规交易所API", "DEX链上合约", "银行资金结算网关", "OTC大宗场外专线"] },
    "is_cross_border": { "type": "boolean", "description": "是否涉及跨境资产出境" },
    "ubo_id": { "type": "string", "description": "穿透图谱识别之最终受益人/疑似团伙标识" },
    "risk_score": { "type": "integer", "minimum": 0, "maximum": 100 }
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy Masking */}
      {activeTab === 'privacy_masking' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                电子政务外网前置机隐私保护与不可逆脱敏策略
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              严格遵循《中华人民共和国个人信息保护法》与《数据安全法》。在非司法机关立案调查许可前，对大众交易者的敏感身份数据进行前置机硬件加密与掩码脱敏。
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">自然人公民身份号码 (18位)</span>
                  <span className="text-slate-500 text-[11px]">前置机掩码规则：保留前6位行政区划与后4位校验码，中段生日8位掩码</span>
                </div>
                <div className="font-mono font-bold text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  440301********2019
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">商业银行结算银行卡号</span>
                  <span className="text-slate-500 text-[11px]">前置机掩码规则：仅显示发卡行卡BIN前6位与末4位，中间脱敏</span>
                </div>
                <div className="font-mono font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  622848******9012
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">去脱敏与穿透解密权限管控</span>
                  <span className="text-slate-500 text-[11px]">仅在公检法机关出具《立案决定书》或《调取证据通知书》后，经双人U-Key数字签章授权解锁</span>
                </div>
                <span className="text-rose-600 font-bold">需经办人+主管双U-Key审批</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
