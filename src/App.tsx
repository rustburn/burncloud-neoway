import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { OverviewPage } from './components/OverviewPage';
import { EnterprisePage } from './components/EnterprisePage';
import { CrossBorderTracePage } from './components/CrossBorderTracePage';
import { RiskEventsPage } from './components/RiskEventsPage';
import { AuditReportPage } from './components/AuditReportPage';
import { SandboxConfigPage } from './components/SandboxConfigPage';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Authentication & Role
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentRole, setCurrentRole] = useState<'government' | 'operator' | 'enterprise'>('government');

  // Navigation
  const [activePage, setActivePage] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Cross-page parameters
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string | null>(null);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

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

  const handleLogin = (role: 'government' | 'operator' | 'enterprise') => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    showToast(
      '已成功登录有方监管沙盒',
      `当前身份：${
        role === 'government'
          ? '政府监管部门（网信/工信/发改）'
          : role === 'operator'
          ? '沙盒运营机构（数据要素运营平台）'
          : 'AI 算力出海企业（示范主体）'
      }`,
      'success'
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('已退出登录', '返回登录界面', 'info');
  };

  // If not logged in, render the login view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
        <LoginView onLogin={handleLogin} />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          showToast(
            '已切换监管工作台视角',
            `已切换为: ${
              role === 'government'
                ? '政府监管部门'
                : role === 'operator'
                ? '沙盒运营机构'
                : '入驻AI企业'
            }`,
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
          currentPage={activePage}
          currentRole={currentRole}
          onNavigate={(pageId) => {
            setActivePage(pageId);
            // Clear specific filters when navigating from sidebar
            if (pageId !== 'enterprise') setSelectedEnterpriseId(null);
            if (pageId !== 'cross-border') setSelectedTraceId(null);
            if (pageId !== 'audit') setSelectedEvidenceId(null);
          }}
          onPageChange={(pageId) => {
            setActivePage(pageId);
            if (pageId !== 'enterprise') setSelectedEnterpriseId(null);
            if (pageId !== 'cross-border') setSelectedTraceId(null);
            if (pageId !== 'audit') setSelectedEvidenceId(null);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center Main Content Page View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 bg-slate-100/50">
          <div className="max-w-[1720px] mx-auto w-full">
            {activePage === 'overview' && (
              <OverviewPage
                onShowToast={showToast}
                onNavigate={(page) => setActivePage(page)}
                onSelectEnterprise={(entId) => {
                  setSelectedEnterpriseId(entId);
                  setActivePage('enterprise');
                }}
                onSelectTrace={(traceId) => {
                  setSelectedTraceId(traceId);
                  setActivePage('cross-border');
                }}
              />
            )}

            {activePage === 'enterprise' && (
              <EnterprisePage
                onShowToast={showToast}
                selectedEntId={selectedEnterpriseId}
              />
            )}

            {activePage === 'cross-border' && (
              <CrossBorderTracePage
                onShowToast={showToast}
                initialTraceId={selectedTraceId}
                onJumpToAudit={(evidenceId) => {
                  setSelectedEvidenceId(evidenceId);
                  setActivePage('audit');
                }}
              />
            )}

            {activePage === 'risk' && (
              <RiskEventsPage onShowToast={showToast} />
            )}

            {activePage === 'audit' && (
              <AuditReportPage
                onShowToast={showToast}
                targetEvidenceId={selectedEvidenceId}
              />
            )}

            {activePage === 'config' && (
              <SandboxConfigPage
                onShowToast={showToast}
                userRole={currentRole}
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
