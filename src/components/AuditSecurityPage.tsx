import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  FileCheck2,
  Search,
  Key,
  Database,
  Building2,
  CheckCircle2,
  Shield,
  Layers,
  Terminal,
} from 'lucide-react';
import { AUDIT_LOGS_DATA } from '../mock/regtechData';
import { AuditLogItem } from '../types';

interface AuditSecurityPageProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  onNavigate: (page: string) => void;
}

export const AuditSecurityPage: React.FC<AuditSecurityPageProps> = ({
  onShowToast,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'guomi_security' | 'audit_logs' | 'masking_rules'>('audit_logs');
  const [logs] = useState<AuditLogItem[]>(AUDIT_LOGS_DATA);
  const [isMasked, setIsMasked] = useState(true);

  // Sample sensitive enterprise and personal record for testing data masking
  const testData = {
    enterpriseName: '深圳极光云链科技合伙企业 (涉嫌地下洗钱通道)',
    usccMasked: '91440300MA5H******',
    usccRaw: '91440300MA5H9K8812',
    legalPerson: '陈*明 (实控人李某某代持)',
    idCardMasked: '440305********4891',
    idCardRaw: '440305198809124891',
    bankCardMasked: '6225 88** **** 2910',
    bankCardRaw: '6225 8820 1928 2910 (招商银行深圳南山科苑支行 对公涉案账户)',
    tokenAddressMasked: '0x8f2a...9d1e (TRON/ERC20 混币入金中继)',
    tokenAddressRaw: '0x8f2a940175b682cdb0321a48c935471e9d1e23fa',
  };

  const handleToggleMask = () => {
    if (isMasked) {
      onShowToast(
        '已申请解密授权',
        '解密操作已触发国密SM3审计留痕，双人U-Key验证通过，操作日志已锚定司法审计区块链',
        'warning'
      );
      setIsMasked(false);
    } else {
      setIsMasked(true);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>安全合规与全流程不可篡改审计中心</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              模块 11 · 国家等保三级 + 国密SM2/3/4体系
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            网络安全等级保护三级 · 国密 SM2数字签章/SM3防篡改杂凑/SM4落盘传输加密 · 涉案主体隐私脱敏与双人审批机制 · 审计日志不可篡改区块链存证。
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'audit_logs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            不可篡改审计日志 ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('guomi_security')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'guomi_security'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            国密算法与等保三级规范
          </button>
          <button
            onClick={() => setActiveTab('masking_rules')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'masking_rules'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            隐私脱敏与解密演练
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              全量监管人员调阅、研判、冻结及移送指令实时写入底层司法审计链，任何删改均触发安全告警
            </span>
            <button
              onClick={() => onShowToast('审计日志完整性校验通过', '全量 SM3 摘要与区块高度匹配无篡改', 'success')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold cursor-pointer"
            >
              国密SM3防篡改验签
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">操作时间</th>
                  <th className="py-3 px-4">操作监管专席</th>
                  <th className="py-3 px-4">所属机构</th>
                  <th className="py-3 px-4">监管操作动作</th>
                  <th className="py-3 px-4">目标涉案对象</th>
                  <th className="py-3 px-4">专网终端IP</th>
                  <th className="py-3 px-4">国密SM3摘要</th>
                  <th className="py-3 px-4">存证状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono text-slate-500">{item.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.operatorName}</td>
                    <td className="py-3 px-4 text-blue-700 font-medium">{item.agency}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                        {item.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{item.targetResource}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{item.ipAddress}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400 max-w-xs truncate" title={item.sm3Hash}>
                      {item.sm3Hash}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{item.auditBlockHeight}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Guomi Security Architecture */}
      {activeTab === 'guomi_security' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                国家网络安全等保三级与国密算法全栈落地标准
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                <span className="font-bold text-blue-900 text-sm block">SM2 椭圆曲线公钥密码算法</span>
                <p className="text-blue-800 leading-relaxed">
                  用于监管专席身份鉴权、执法公证书电子公章数字签名、跨部门协同处置指令防抵赖。公钥长度 256 位，安全性相当于 RSA 3072 位。
                </p>
                <div className="pt-2 font-mono text-[11px] text-blue-700">
                  标准号: GB/T 32918-2016
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <span className="font-bold text-emerald-900 text-sm block">SM3 密码杂凑算法</span>
                <p className="text-emerald-800 leading-relaxed">
                  用于全量交易流水完整性校验、司法证据包数字指纹提取、审计日志区块链固化。输出 256 比特哈希值，具有极高抗碰撞性。
                </p>
                <div className="pt-2 font-mono text-[11px] text-emerald-700">
                  标准号: GB/T 32905-2016
                </div>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                <span className="font-bold text-purple-900 text-sm block">SM4 分组密码算法</span>
                <p className="text-purple-800 leading-relaxed">
                  用于涉案嫌疑人银行卡、公民身份数据落盘加密存储与专网专线安全传输。分组长度 128 比特，密匙长度 128 比特，硬加密芯片加速。
                </p>
                <div className="pt-2 font-mono text-[11px] text-purple-700">
                  标准号: GB/T 32907-2016
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy Masking Simulator */}
      {activeTab === 'masking_rules' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  敏感交易数据脱敏与去脱敏双人审批演练
                </h2>
              </div>
              <button
                onClick={handleToggleMask}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isMasked
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{isMasked ? '申请经办人+主管双U-Key临时解密' : '立即恢复安全掩码脱敏'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-400 block text-[11px]">涉案主体统一社会信用代码</span>
                <span className="font-mono text-sm font-bold text-slate-800 block">
                  {isMasked ? testData.usccMasked : testData.usccRaw}
                </span>
                <span className="text-[10px] text-slate-500">规则: 掩盖中后段6位唯一代码，立案后方可穿透</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-400 block text-[11px]">法定代表人居民身份证号</span>
                <span className="font-mono text-sm font-bold text-slate-800 block">
                  {isMasked ? testData.idCardMasked : testData.idCardRaw}
                </span>
                <span className="text-[10px] text-slate-500">规则: 生日8位星号脱敏，防止隐私泄露</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-400 block text-[11px]">关联结算商业银行账户</span>
                <span className="font-mono text-sm font-bold text-slate-800 block">
                  {isMasked ? testData.bankCardMasked : testData.bankCardRaw}
                </span>
                <span className="text-[10px] text-slate-500">规则: 掩盖中段卡号，保护商业往来机密</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-400 block text-[11px]">链上涉案代币钱包地址</span>
                <span className="font-mono text-sm font-bold text-slate-800 block">
                  {isMasked ? testData.tokenAddressMasked : testData.tokenAddressRaw}
                </span>
                <span className="text-[10px] text-slate-500">规则: 穿透模式下展示完整42位校验地址</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
