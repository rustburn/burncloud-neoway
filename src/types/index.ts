export type RegulatoryAgency = 'cac' | 'miit' | 'nda' | 'mps_cyber' | 'regtech_center';

export type JurisdictionLevel = 'ministry' | 'province' | 'city' | 'county';

export type AlertLevel = 'red' | 'orange' | 'yellow' | 'blue';

export interface MetricCardData {
  title: string;
  value: string;
  unit: string;
  change: string;
  isIncrease: boolean;
  subtext: string;
  icon: string;
}

// 模块 1 & 9：多源数据接入与系统集成 (大模型Token交易源)
export interface DataIngestionSource {
  id: string;
  name: string;
  category:
    | 'llm_official_api'       // 大模型官方开放平台 API (阿里云百炼, 百度千帆, 智谱AI, DeepSeek等)
    | 'compute_hub_node'       // 全国一体化算网调度中心 (东数西算八大枢纽/智算中心)
    | 'compute_voucher_gateway'// 地方政府算力券申领与抵扣清算网关
    | 'api_relay_proxy'        // 第三方聚合分发与中继代理路由
    | 'data_exchange_api'      // 全国数据交易所大模型 Token 交易专区
    | 'darkweb_threat_feed';   // 暗网黑产与社交社群 API Key 倒卖威胁雷达
  categoryLabel: string;
  realtimeType: '实时' | 'T+1' | '准实时';
  qps: number;
  dailyRecords: string; // 如：4,820万 Tokens
  latencyMs: number;
  status: 'online' | 'degraded' | 'maintenance';
  protocol: string;
  lastSyncTime: string;
  dataQuality: number; // 0 - 100
  securityMasking: string;
}

// 模块 2：大模型 Token 异常与违规风险交易监测
export type SuspiciousRuleType =
  | '算力券虚假刷量套现(Wash Invocations)'
  | '单笔突发大额Token(>5000万)'
  | '单日密集异动(>1亿Token)'
  | '单月累计异常(>10亿Token)'
  | '凌晨异动刷量(2:00-5:00高频)'
  | '企业API Key盗刷与分拆转售(Key Smurfing)'
  | '境外未备案违规模型Token走私'
  | '违规跨境数据出境调用(Prompt Leakage)'
  | '恶意攻击与黑客武器化推理'
  | '恶意囤积居奇与哄抬Token单价'
  | '合规正常Token推理交易';

export interface TokenTransaction {
  id: string;
  txHash: string; // 交易/调用唯一流水凭证
  timestamp: string;
  tokenModel: string; // 如：DeepSeek-R1, DeepSeek-V3, Qwen-Max, GLM-4-Plus, Kimi-128K, 境外违规Claude-3.5等
  modelProvider: string; // 如：智算开放平台, 华为昇思集群, 阿里云百炼, 非法中继节点
  fromAccount: string; // 调用方企业账号/API Key 标识
  fromEntityName: string; // 调用主体/采购方
  toAccount: string; // 供应商账户/网关节点
  toEntityName: string; // 算力提供商 / 智算调度中枢
  promptTokens: number; // 输入 Token 数量
  completionTokens: number; // 生成 Token 数量
  totalTokens: number; // 总计 Token 数量
  amountCNY: number; // 人民币折算金额
  voucherSubsidyCNY: number; // 抵扣算力券金额
  channelType:
    | '官方大模型开放平台API'
    | '全国一体化算力网八大枢纽'
    | '地方算力券申报核销专线'
    | '第三方聚合API中继代理'
    | '暗网未授权转售节点';
  triggerRule: SuspiciousRuleType;
  alertLevel: AlertLevel;
  riskScore: number; // 0 - 100
  isCrossBorder: boolean; // 是否涉及违规跨境中继
  uboGroup: string; // 实际控制人 / 关联控制团伙
  status: '待研判' | '排查中' | '已下发协查' | '配额已冻结' | '移送经侦' | '合规放行';
  jurisdiction: string; // 属地 (如：京津冀算力枢纽, 粤港澳大湾区, 贵州枢纽等)
}

// 市场操纵与黑产交易事件识别
export interface MarketManipulationEvent {
  id: string;
  eventType:
    | 'subsidy_fraud'          // 算力券与创新券虚假刷量骗补
    | 'key_theft_resell'       // 企业级大模型 API Key 盗刷低价倒卖
    | 'unregistered_smuggling' // 境外未备案违禁大模型境内走私转售
    | 'tps_spoofing_hoarding'  // 智算中心独占 TPS 算力囤积居奇与暴涨倒卖
    | 'cross_border_leakage';  // 涉密政企语料 Prompt 跨境走私出境
  eventTypeName: string;
  targetTokenModel: string; // 涉案大模型/算力池
  detectedAt: string;
  priceVolatility: string; // 如：二级倒卖加价 320% 或 1折骨折甩卖
  volumeAnomaly: string; // 调用量突发放大 18.5 倍
  involvedAccountsCount: number; // 涉案账号数
  estimatedIllicitGainsCNY: string; // 涉嫌诈骗算力补贴或非法获利金额
  confidenceScore: number; // AI 模型置信度
  primarySuspectGroup: string; // 嫌疑企业团伙/黑产组织
  algorithmEvidence: string; // 算法研判证据
  status: '实时监测' | '已生成稽查卷宗' | '已通报联合查处' | '已移送立案';
  level: AlertLevel;
}

// 模块 3：风险预警与工单
export interface RiskAlertTicket {
  id: string;
  ticketNo: string;
  level: AlertLevel;
  title: string;
  source: string;
  targetEntity: string;
  suspectAccount: string;
  triggerTime: string;
  responseDeadline: string; // 30分钟响应倒计时
  responseTimeRemaining: number; // 剩余秒数
  assignedTo: string; // 监管机构 (网信办/工信部/数据局/公安经侦)
  status: '待接收' | '研判中' | '协查函已发' | '已采取冻结措施';
  riskScoreBreakdown: {
    transactionAnomaly: number; // 40% Token交易与异常特征
    networkClusterRisk: number; // 30% 关联主体与代理中继网络
    sentimentRisk: number;      // 20% 暗网雷达与非法分发情报
    entityRisk: number;         // 10% 主体资质与算力券申报历史
    totalScore: number;         // 0 - 100
  };
  actionsTaken: string[];
}

// 监管黑名单 / 灰名单
export interface WatchlistEntry {
  id: string;
  identifierOrEntity: string;
  type: 'blacklist' | 'greylist';
  category:
    | '涉嫌算力券骗补空壳'
    | '暗网API Key倒卖黑产团伙'
    | '境外未备案走私中继站'
    | '恶意囤积算力黄牛'
    | '黑客自动化盗刷脚本源';
  reason: string;
  addedByAgency: string;
  addedDate: string;
  matchCount: number;
  status: '生效阻断中' | '重点监测中' | '已解除留痕';
}

// 模块 4：法定监管报表
export interface RegulatoryReportItem {
  id: string;
  title: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  period: string;
  targetAgency:
    | '国家互联网信息办公室'
    | '工业和信息化部算网调度中心'
    | '国家数据局数字要素与算力司'
    | '公安部网络安全保卫与经侦局';
  generatedTime: string;
  submissionDeadline: string; // 如：次日 09:00 前
  status: '已报送' | '待报送' | '生成中';
  totalMonitoredTokens: string; // 如：8,940 亿 Tokens
  totalMonitoredVolumeCNY: string; // 如：¥4,280 万元
  suspiciousTxCount: number;
  frozenAccountsCount: number;
  format: 'XML' | 'JSON' | 'PDF';
  digestHash: string;
  complianceChecks: {
    modelRegistrationPassed: boolean; // 大模型算法备案查验
    computeVoucherCompliant: boolean;  // 算力券申领合规防套现
    crossBorderDataCompliant: boolean; // 跨境数据流动安全评估
  };
}

// 模块 5：关联图谱与穿透分析 (Token 流向与资金结算)
export interface GraphNode {
  id: string;
  label: string;
  nodeKey: string;
  type:
    | 'account_master'        // 申报主体 / 核心企业
    | 'account_proxy'         // 虚假聚合中继代理
    | 'compute_cluster'       // 智算中心 / 官方算力池
    | 'script_farm'           // 自动化刷量脚本集群
    | 'darkweb_broker'        // 暗网 API 倒卖撮合节点
    | 'suspicious_entity';    // 涉案异常关联主体
  categoryName: string;
  balanceCNY: string;
  tokenQuota: string;
  riskScore: number;
  isFrozen: boolean;
  uboCluster?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amountCNY: string;
  amountTokens: string;
  txCount: number;
  timestamp: string;
  flowType:
    | 'token_consumption'     // Token 消费与调用流
    | 'voucher_subsidy'       // 算力券套现资金结算
    | 'proxy_relay'           // 中继路由与流量转手
    | 'darkweb_resell';       // 盗刷 Key 拆单分销
  isSuspicious: boolean;
}

// 司法存证与案件调查 (大模型 Token 涉案取证)
export interface JudicialEvidence {
  id: string;
  evidenceNo: string;
  caseTitle: string;
  targetEntity: string;
  evidenceType:
    | '大模型Token虚假刷量骗取算力券证据包'
    | '企业级API Key盗刷与暗网分销证据'
    | '违规跨境走私境外大模型Token链条报告'
    | '涉密数据Prompt跨境出境取证固化';
  blockHeight: number;
  certHash: string;
  sha256Digest: string;
  timestampCert: string; // 国家授时中心 TSA 时间戳认证
  notaryOffice: string; // 司法鉴定中心与最高法存证节点
  status: '已固化存证' | '具司法效力' | '已出具鉴定意见书';
  fileSize: string;
}

// 判例库参考 (针对大模型/算力新型犯罪)
export interface LegalCaseRef {
  id: string;
  caseNo: string;
  title: string;
  crimeType:
    | '诈骗罪(骗取国家科技算力补贴)'
    | '非法获取计算机信息系统数据罪'
    | '非法经营罪(未备案大模型跨境倒卖)'
    | '侵犯商业秘密与数据安全罪';
  courtLevel: string;
  verdictYear: number;
  relevanceScore: number;
  summary: string;
}

// 模块 8：NLP 舆情与暗网大模型 API 监控
export interface SentimentFeedItem {
  id: string;
  source:
    | 'Telegram大模型API倒卖群'
    | '暗网算力黑产论坛'
    | '开源大模型镜像讨论区'
    | '网络安全威胁情报雷达'
    | '算力券黄牛收券社群';
  title: string;
  sentiment: '极高危' | '市场异动' | '内幕泄露' | '黑产炒作';
  sentimentScore: number; // -100 to 100
  relatedModels: string[];
  suspectAccountOrGroup?: string;
  publishedAt: string;
  aiRiskTag: string;
}

// AI 智能诊断模型 (大模型 Token 专用)
export interface AiDiagnosticModel {
  id: string;
  name: string;
  algorithm: string;
  targetObjective: string;
  accuracy: number;
  falsePositiveRate: number;
  latencyMs: number;
  status: '在线推理' | '持续学习' | '优化中';
  lastTrained: string;
}

// 模块 7：权限与审计
export interface AuditLogItem {
  id: string;
  timestamp: string;
  operatorName: string;
  operatorId: string;
  agency: string;
  action:
    | '查询涉案企业大模型Token调用流水'
    | '下达大模型API配额临时冻结令'
    | '生成算力券骗补司法鉴定电子证据包'
    | '向工信部算网调度中心直报XML数据'
    | '调取Token穿透图谱与Prompt指纹'
    | '配置大模型Token异常阈值规则';
  targetResource: string;
  ipAddress: string;
  sm3Hash: string; // 国密不可篡改哈希
  status: '成功' | '已留痕存证';
}
