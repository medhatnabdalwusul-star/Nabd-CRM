import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { TasksView } from './components/tasks/TasksView';
import { ClientsView } from './components/crm/ClientsView';
import { SocialCalendarView } from './components/social/SocialCalendarView';
import { RbacSettingsView } from './components/admin/RbacSettingsView';
import { ActivityLogView } from './components/activity/ActivityLogView';
import { ToastContainer } from './components/common/ToastContainer';
import { ShieldAlert, Sparkles, UserCheck, AlertTriangle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, hasPermission, language, currentUser, roles } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeRole = roles.find((r) => currentUser.roleIds.includes(r.id));

  // Access validation for tabs
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;

      case 'clients':
        if (!hasPermission('can_view_clients')) {
          return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <ShieldAlert className="h-12 w-12 text-rose-500" />
              <h3 className="mt-3 text-base font-bold text-slate-900">
                {language === 'ar' ? 'صلاحية الوصول غير متوفرة' : 'Access Restricted'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md leading-relaxed">
                {language === 'ar'
                  ? 'يتطلب الوصول إلى إدارة علاقات العملاء (CRM) صلاحية can_view_clients (المتاحة للسوبر أدمن ومدير العمليات).'
                  : 'Access to CRM requires can_view_clients permission (granted to Super Admin and Operations Manager).'}
              </p>
            </div>
          );
        }
        return <ClientsView />;

      case 'tasks':
        return <TasksView />;

      case 'social':
        return <SocialCalendarView />;

      case 'admin':
        if (!hasPermission('can_manage_roles') && !hasPermission('can_manage_team_members')) {
          return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <ShieldAlert className="h-12 w-12 text-rose-500" />
              <h3 className="mt-3 text-base font-bold text-slate-900">
                {language === 'ar' ? 'صفحة الإدارة محصورة بالمديرين' : 'Admin Area Restricted'}
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md leading-relaxed">
                {language === 'ar'
                  ? 'يتطلب الوصول إلى إدارة الصلاحيات وأدوار الفريق حساب مدير نظام (Super Admin أو Ops Manager).'
                  : 'Requires administrator privileges (can_manage_roles / can_manage_team_members).'}
              </p>
              <p className="mt-2 text-[11px] text-indigo-600 font-semibold">
                {language === 'ar'
                  ? '💡 تلميح: تتاح إدارة صلاحيات الفريق لحساب الأكونت مانجر ومدير العمليات (مدحت).'
                  : '💡 Tip: Team management is reserved for Account Manager / Operations Manager (Medhat).'}
              </p>
            </div>
          );
        }
        return <RbacSettingsView />;

      case 'activity':
        return <ActivityLogView />;

      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans antialiased">
      {/* Toast Notifications System */}
      <ToastContainer />

      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <Header onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        {/* Dynamic View Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
