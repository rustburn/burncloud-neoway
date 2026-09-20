import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  BrainCircuit,
  MessageSquare,
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radar,
  HelpCircle,
  FileText,
  User,
  ShieldCheck,
  Terminal,
  Network,
  Activity,
  Layers,
  BarChart2,
} from 'lucide-react';
import {
  AI_DIAGNOSTIC_MODELS,
  SENTIMENT_FEED_ITEMS,
} from '../mock/regtechData';
import { AiDiagnosticModel, SentimentFeedItem } from '../types';

interface AiIntelligencePageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  explainability?: {
    featureWeights: { name: string; weight: string }[];
    legalBasis: string;
  };
}

export const AiIntelligencePage: React.FC<AiIntelligencePageProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const [models] = useState<AiDiagnosticModel[]>(AI_DIAGNOSTIC_MODELS);
  const [sentimentFeeds] = useState<SentimentFeedItem[]>(SENTIMENT_FEED_ITEMS);
  const [activeTab, setActiveTab] = useState<'copilot' | 'models' | 'sentiment_nlp'>('copilot');

  // AI Copilot State
  const [inputQuery, setInputQuery] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: '您好，我是国家智算与大模型监管沙盒 AI 智能研判助手 (RegTech AI Copilot)。专为国家互联网信息办公室、工业和信息化部算网调度中心、国家数据局及公安部网络安全保卫局专席服务。支持通过自然语言对大模型 Token 异常调用流、算力券虚假刷量骗补、企业 API Key 盗刷倒卖及未备案模型走私跨境链路进行实时研判，并提供完整的算法可解释性与法条依据。请问需要研判哪个模型调用流、涉案企业主体或黑产线索？',
      timestamp: '10:30',
    },
  ]);

  const handleSendMessage = () => {
    if (!inputQuery.trim() || isAiThinking) return;

    const userText = inputQuery;
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toTimeString().slice(0, 5),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAiThinking(true);

    setTimeout(() => {
      let botResponse = '';
      let explainability: ChatMessage['explainability'] = undefined;

      if (userText.includes('前海') || userText.includes('算力券') || userText.includes('套现') || userText.includes('刷量') || userText.includes('幽灵')) {
        botResponse = `【研判结论：深圳前海**智能算力券虚假刷量骗补案】\n经过 GNN 图神经网络与智算网关逐笔 Token 探针数据回溯：\n1. 标的模型：DeepSeek-R1-671B（国家一体化算力网贵州节点）\n2. 异常特征：在48小时内动用28台分布式云主机发送自动化 Prompt 轰炸，单次固定 3,800 tokens，累计虚假刷量 8,940 万 Tokens，以虚构科研消耗核销财政算力券。\n3. 获利估算：涉嫌套取地方财政算力补贴 480 万元人民币。\n4. 控制人判定：关联 4 家代理公司与 6 个中继节点，UBO 已穿透为同一控制人“算力幽灵”团伙（郑某）。\n5. 处置建议：已生成算力配额紧急熔断拦截指令，已下发工信部与地方财政联合止付通知书，并生成最高法存证标准电子卷宗。`;
        explainability = {
          featureWeights: [
            { name: '虚假 Prompt 熵值与重复率 (XGBoost)', weight: '42%' },
            { name: '算力券核销与实际产出偏离度', weight: '30%' },
            { name: '自动化脚本访问指纹与网络并发', weight: '18%' },
            { name: '暗网黑灰产刷量社群线索 (NLP)', weight: '10%' },
          ],
          legalBasis: '涉嫌违反《网络安全法》第十二条；触犯《中华人民共和国刑法》第二百六十六条诈骗罪（套取国家财政补贴资金）。',
        };
      } else if (userText.includes('黑狐') || userText.includes('API') || userText.includes('盗刷') || userText.includes('走私') || userText.includes('跨境') || userText.includes('Claude')) {
        botResponse = `【研判结论：“黑狐”暗网大模型 API Key 盗刷与跨境走私案】\n1. 涉案模型：Qwen-2.5-72B 及境外未备案 Claude-3.5。\n2. 涉案链路：某央企算网 API Key 遭渗透嗅探并在暗网以 2 折倾销，异地 34 个高频 IP 突发迸发，4小时内盗刷 1.2 亿 Tokens 并通过境外反向代理走私出境。\n3. 危害评估：造成企业重大算力损失，涉嫌未备案大模型境内非法展业及涉密数据跨境泄露。\n4. 处置建议：已下发 API Key 全网强制吊销令，并将 34 个跳板节点加入国家网信办跨境阻断清单。`;
        explainability = {
          featureWeights: [
            { name: 'API Key 异地突发调用速率 (GNN)', weight: '40%' },
            { name: '未备案大模型指纹探测与反代匹配', weight: '28%' },
            { name: '跨境违规流量与数据出境风险比对', weight: '20%' },
            { name: '暗网代调论坛标价与交易量 NLP', weight: '12%' },
          ],
          legalBasis: '违反《生成式人工智能服务管理暂行办法》第十七条、《数据出境安全评估办法》；触犯《中华人民共和国刑法》第二百八十五条非法获取计算机信息系统数据罪。',
        };
      } else {
        botResponse = `已基于国家智算与大模型监管沙盒 PB 级数据湖对【${userText}】进行穿透研判：\n• 经 GNN 关联聚类算法检测，该主体/调用流与已知涉案算力券套现或 API 盗刷团伙无两跳以内的高危交互；\n• 算法备案查验：已通过国家网信办境内深度合成服务算法备案（网信算备字号正常有效）；\n• 当前综合合规评分 22 分（绿牌·正常受控运行），系统已自动留痕，建议保持常规算力调用监测。`;
        explainability = {
          featureWeights: [
            { name: 'Token 消耗与报备业务场景匹配度', weight: '48%' },
            { name: '国家网信办算法备案合规查验', weight: '32%' },
            { name: '全网与暗网零黑产涉案记录', weight: '20%' },
          ],
          legalBasis: '符合《生成式人工智能服务管理暂行办法》与国家算力券合规使用指引，留痕备查。',
        };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: botResponse,
        timestamp: new Date().toTimeString().slice(0, 5),
        explainability,
      };

      setChatHistory((prev) => [...prev, botMsg]);
      setIsAiThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>AI 与智能监管中心 (RegTech AI Intelligence)</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
              模块 10 · GNN图分析 + XGBoost分类 + NLP舆情雷达
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            图神经网络 GNN 深度关联穿透 · XGBoost 市场操纵识别（误报率&lt;5%）· NLP 社交媒体与暗网情报雷达 · 算法可解释性与法条依据输出。
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'copilot'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            智能研判 Copilot 对话
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'models'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            在轨 AI 算法模型库 ({models.length})
          </button>
          <button
            onClick={() => setActiveTab('sentiment_nlp')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'sentiment_nlp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NLP 社交舆情与暗网雷达 ({sentimentFeeds.length})
          </button>
        </div>
      </div>

      {/* Tab 1: AI Copilot */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col h-[580px] overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl p-4 text-xs space-y-2.5 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                    {/* Explainability Block */}
                    {msg.explainability && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2 text-[11px]">
                        <span className="font-bold text-slate-900 block flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          算法研判可解释性与特征权重贡献度:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 font-mono">
                          {msg.explainability.featureWeights.map((fw, i) => (
                            <div key={i} className="bg-white p-1.5 rounded border border-slate-200 flex justify-between">
                              <span className="text-slate-600">{fw.name}:</span>
                              <span className="font-bold text-blue-700">{fw.weight}</span>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900">
                          <strong>适用法律依据: </strong>{msg.explainability.legalBasis}
                        </div>
                      </div>
                    )}

                    <span
                      className={`block text-[10px] text-right ${
                        msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isAiThinking && (
                <div className="flex gap-3 items-center text-xs text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center animate-spin">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <span>正在执行 GNN 图拓扑穿透与 XGBoost 操纵模型推理...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
              <input
                type="text"
                placeholder="输入研判指令 (如: 研判前海智能算力券套现、穿透暗网 API Key 盗刷、核查 Claude-3.5 走私通道)..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isAiThinking || !inputQuery.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>发送研判</span>
              </button>
            </div>
          </div>

          {/* Quick Prompts & AI Status */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3 text-xs">
              <span className="font-bold text-slate-900 block">专席常用预置研判指令:</span>
              <div className="space-y-2">
                {[
                  '研判前海智能算力券虚假刷量与财政套现',
                  '穿透“黑狐”暗网 API Key 盗刷倒卖与跨境流向',
                  '排查贵州算力池凌晨突发高频 Token 异常流水',
                  '核查境外未备案反向代理出口真实 UBO',
                  '生成工信部与网信办联合立案存证证据包',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputQuery(prompt);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 transition-colors cursor-pointer text-xs"
                  >
                    • {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-2xs space-y-2 text-xs">
              <span className="font-bold text-indigo-300 block">AI 模型在轨推理指标:</span>
              <div className="space-y-1.5 text-slate-300">
                <p>• 拓扑图神经网络 GNN: 延迟 42ms / 准确率 98.6%</p>
                <p>• 市场操纵分类 XGBoost: 误报率 &lt; 3.2%</p>
                <p>• 算力消耗: 昇腾与国产算力芯片本地化离线推理</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Models Registry */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{mod.modelName}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                    在轨服务中
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {mod.description}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">准确率 (Accuracy)</span>
                    <span className="font-bold text-emerald-600">{mod.accuracy}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">召回率 (Recall)</span>
                    <span className="font-bold text-blue-700">{mod.recall}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">误报率 (FPR)</span>
                    <span className="font-bold text-purple-700">{mod.falsePositiveRate}</span>
                  </div>
                </div>

                <div className="text-slate-500 text-[11px] pt-1">
                  核心输入特征：<span className="text-slate-700">{mod.features.join(' · ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: NLP Sentiment & Darkweb Feeds */}
      {activeTab === 'sentiment_nlp' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              社交平台、Telegram水军社群及暗网黑产论坛爬虫实时 NLP 情感与威胁特征抽取
            </span>
            <button
              onClick={() => onShowToast('爬虫探针已刷新', '已抓取最新 240 条全网社群异动情报', 'info')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
            >
              刷新爬虫探针
            </button>
          </div>

          <div className="space-y-3">
            {sentimentFeeds.map((feed) => (
              <div
                key={feed.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {feed.sourcePlatform}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        feed.riskLevel === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : feed.riskLevel === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      威胁等级: {feed.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{feed.timestamp}</span>
                </div>

                <p className="text-slate-800 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {feed.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>提取实体: <strong className="text-blue-700">{feed.extractedEntities.join(', ')}</strong></span>
                  <span>AI 置信度: <strong className="text-emerald-700 font-mono">{(feed.confidence * 100).toFixed(1)}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
