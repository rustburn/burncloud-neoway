export type Role = 'government' | 'sandbox_operator' | 'enterprise';

export interface MetricCardData {
  title: string;
  value: string;
  unit: string;
  change: string;
  isIncrease: boolean;
  subtext: string;
  icon: string;
}

export interface RouteItem {
  id: string;
  from: string;
  to: string;
  fromCoords: [number, number]; // relative percent [x, y]
  toCoords: [number, number];
  status: 'normal' | 'busy' | 'alert';
  latency: string;
  activeRequests: number;
  bandwidth: string;
}

export interface LiveCallItem {
  id: string;
  time: string;
  enterprise: string;
  sourceCountry: string;
  businessType: 'Token出海' | '外数中算' | '跨境AI推理';
  model: string;
  tokenCount: number;
  riskLevel: '正常' | '低风险' | '中风险' | '高风险';
  status: '处理完成' | '安全脱敏' | '计算中' | '已阻断';
}

export interface Enterprise {
  id: string;
  name: string;
  creditCode: string;
  businessType: 'Token出海' | '外数中算' | '混合业务';
  mainRegions: string[];
  models: string[];
  computeNodes: string[];
  todayTokens: string;
  complianceScore: number;
  status: '资料审核中' | '技术验证中' | '限制运行' | '已通过' | '已暂停';
  contactPerson: string;
  contactPhone: string;
  joinDate: string;
  icpCert: string;
  ediCert: string;
  algorithmRecord: string;
  modelRecord: string;
  crossBorderChannel: string;
  upstreamProvider: string;
  historicalTokens: { month: string; tokens: number }[];
  riskCount: number;
  recentRisks: string[];
}

export interface TraceTimelineStep {
  stepNumber: number;
  title: string;
  timestamp: string;
  node: string;
  result: '通过' | '脱敏放行' | '合规阻断' | '隔离计算中' | '生成完毕';
  riskLevel: '无风险' | '低' | '中' | '高';
  evidenceId: string;
  logSummary: string;
}

export interface TraceRecord {
  id: string;
  traceId: string;
  requestTime: string;
  enterprise: string;
  sourceCountry: string;
  line: string;
  dataCategory: '商业营销' | '跨国办公' | '客户支持' | '个人信息' | '工业设计' | '医疗咨询';
  hasPersonalInfo: boolean;
  hasSensitiveInfo: boolean;
  model: string;
  computeNode: string;
  inputTokens: number;
  outputTokens: number;
  returnCountry: string;
  complianceResult: '合规通过' | '脱敏放行' | '阻断拦截' | '人工复核';
  requestStatus: '已完成' | '阻断' | '复核中';
  promptSample: string;
  timeline: TraceTimelineStep[];
}

export interface RiskEvent {
  id: string;
  eventNumber: string;
  discoveryTime: string;
  enterprise: string;
  riskType:
    | '重要数据疑似出境'
    | '敏感个人信息未脱敏'
    | '未备案模型调用'
    | '未授权算力节点'
    | '异常Token消耗'
    | '高频API攻击'
    | '跨境线路异常'
    | '输出内容违规'
    | '企业资质过期'
    | '审计日志不完整';
  riskLevel: '一般' | '中度' | '高危' | '极高';
  affectedRequests: number;
  autoDisposalResult: string;
  currentHandler: string;
  status: '待处理' | '处理中' | '已处置';
  description: string;
  evidenceId: string;
  workflowStage: number; // 1 to 8: 发现风险 -> 自动阻断 -> 保存证据 -> 通知企业 -> 人工复核 -> 整改 -> 复测 -> 关闭事件
}

export interface AuditRecord {
  id: string;
  evidenceNumber: string;
  traceId: string;
  enterprise: string;
  eventType: string;
  occurTime: string;
  dataDigest: string;
  modelSource: string;
  computeNode: string;
  sha256Hash: string;
  signatureStatus: '签名有效' | '签名异常' | '待验证';
  storageStatus: '已存证' | '存证中' | '存证失败';
  fileSize: string;
}

export interface SandboxConfigRule {
  id: string;
  category: string;
  name: string;
  desc: string;
  enabled: boolean;
  level?: string;
  action?: string;
}

export interface AuditEvidence {
  id: string;
  evidenceNumber: string;
  traceId: string;
  timestamp: string;
  enterprise: string;
  evidenceType: '出境前哈希' | '出境后哈希' | '模型调用存证' | '脱敏存证' | '处置存证';
  status: '校验通过' | '哈希一致' | '异常不匹配';
  blockHeight: number;
  nodeSignature: string;
  rawHash: string;
  desensitizedHash: string;
  responseHash: string;
  timeCertificate: string;
}

export interface WhitelistedModel {
  id: string;
  name: string;
  provider: string;
  recordNumber: string;
  applicableBiz: string;
  status: '已启用' | '已限制' | '已禁用';
}

export interface ComputeNodeConfig {
  id: string;
  name: string;
  operator: string;
  securityLevel: string;
  location: string;
  status: '已启用' | '维护中';
}

export interface DataClassRule {
  id: string;
  category: string;
  level: '核心数据' | '重要数据' | '一般数据' | '个人信息' | '敏感个人信息';
  rule: string;
  threshold: string;
  action: '放行' | '脱敏' | '阻断' | '人工审核';
}

export interface ChannelConfig {
  id: string;
  name: string;
  bandwidth: string;
  encryption: string;
  latency: string;
  status: string;
}
