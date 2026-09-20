import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { OverviewPage } from './components/OverviewPage';
import { MonitoringPage } from './components/MonitoringPage';
import { FundGraphPage } from './components/FundGraphPage';
import { RiskAlertsPage } from './components/RiskAlertsPage';
import { InvestigationPage } from './components/InvestigationPage';
import { RegulatoryReportsPage } from './components/RegulatoryReportsPage';
import { DataIngestionPage } from './components/DataIngestionPage';
import { AiIntelligencePage } from './components/AiIntelligencePage';
import { AuditSecurityPage } from './components/AuditSecurityPage';
import { ToastContainer, ToastMessage } from './components/Toast';
import { RegulatoryAgency, JurisdictionLevel } from './types';

export default function App() {
  // Authentication & Regulatory Agency
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentAgency, setCurrentAgency] = useState<RegulatoryAgency>('cac');
  const [jurisdictionLevel, setJurisdictionLevel] = useState<JurisdictionLevel>('ministry');

  // Navigation
  const [activePage, setActivePage] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Cross-page parameters
  const [focusTxId, setFocusTxId] = useState<string | undefined>(undefined);
  const [focusAddress, setFocusAddress] = useState<string | undefined>(undefined);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const agencyNames: Record<RegulatoryAgency, string> = {
    cac: '国家互联网信息办公室 · 算法与大模型安全治理局',
    miit: '工业和信息化部 · 算网调度与算力券监管局',
    nda: '国家数据局 · 数字要素与算力基础设施司',
    mps_cyber: '公安部网络安全保卫局 / 经侦局 · 大模型涉案专席',
    regtech_center: '国家智算与大模型监管沙盒运行中心',
  };

  const handleLogin = (agency: RegulatoryAgency) => {
    setCurrentAgency(agency);
    setIsLoggedIn(true);
    showToast(
      '已成功登录监管工作台',
      `当前接入机构：${agencyNames[agency] || agency}`,
      'success'
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('已安全退出', '已切断监管专线连接并安全登出', 'info');
  };

  // If not logged in, render the login view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <LoginView onLogin={handleLogin} />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentAgency={currentAgency}
        onAgencyChange={(agency) => {
          setCurrentAgency(agency);
          showToast(
            '已切换监管视角',
            `已切换至: ${agencyNames[agency] || agency}`,
            'info'
          );
        }}
        jurisdictionLevel={jurisdictionLevel}
        onJurisdictionChange={(level) => {
          setJurisdictionLevel(level);
          const levelLabels: Record<JurisdictionLevel, string> = {
            ministry: '部级 · 全国一张图',
            province: '省级 · 广东省/大湾区',
            city: '市级 · 深圳市',
            county: '县级 · 南山区',
          };
          showToast(
            '已切换监管穿透层级',
            `当前视角: ${levelLabels[level]}`,
            'info'
          );
        }}
        onNavigate={(page) => setActivePage(page)}
        onLogout={handleLogout}
      />

      {/* Main Layout Area: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={(pageId) => {
            setActivePage(pageId);
          }}
          pendingRisksCount={17}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center Main Content Page View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 bg-slate-100/70">
          <div className="max-w-[1780px] mx-auto w-full">
            {activePage === 'overview' && (
              <OverviewPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
                jurisdictionLevel={jurisdictionLevel}
                currentAgency={currentAgency}
              />
            )}

            {activePage === 'monitoring' && (
              <MonitoringPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
                initialFilter="all"
              />
            )}

            {activePage === 'fund-graph' && (
              <FundGraphPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
                initialTxId={focusTxId}
                initialAddress={focusAddress}
              />
            )}

            {activePage === 'risk-alerts' && (
              <RiskAlertsPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
              />
            )}

            {activePage === 'investigation' && (
              <InvestigationPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
              />
            )}

            {activePage === 'regulatory-reports' && (
              <RegulatoryReportsPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
              />
            )}

            {activePage === 'data-ingestion' && (
              <DataIngestionPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
              />
            )}

            {activePage === 'ai-intelligence' && (
              <AiIntelligencePage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
              />
            )}

            {activePage === 'audit-security' && (
              <AuditSecurityPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
