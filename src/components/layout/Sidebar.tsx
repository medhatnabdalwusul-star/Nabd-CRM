import React from 'react';
import { useApp } from '../../context/AppContext';
import { NabdLogo } from '../common/NabdLogo';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Calendar,
  Briefcase,
  X,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const {
    activeTab,
    setActiveTab,
    language,
    currentUser,
    roles,
    contentPosts,
    hasPermission,
  } = useApp();

  const userRoles = roles.filter((r) => currentUser.roleIds.includes(r.id));
  const mainRole = userRoles[0];

  const pendingPostsCount = contentPosts.filter((p) => p.status === 'review').length;

  const navItems = [
    {
      id: 'dashboard',
      labelAr: 'الرئيسية والعمليات',
      labelEn: 'Dashboard & Operations',
      icon: LayoutDashboard,
      badge: null,
      visible: true,
    },
    {
      id: 'tasks',
      labelAr: 'المشاريع والمهام (Kanban)',
      labelEn: 'Projects & Tasks',
      icon: CheckSquare,
      badge: null,
      visible: true,
    },
    {
      id: 'clients',
      labelAr: 'إدارة علاقات العملاء (CRM)',
      labelEn: 'Client CRM',
      icon: Briefcase,
      badge: null,
      visible: hasPermission('can_view_clients'),
    },
    {
      id: 'social',
      labelAr: 'تقويم السوشيال ميديا',
      labelEn: 'Social Media Calendar',
      icon: Calendar,
      badge: pendingPostsCount > 0 ? pendingPostsCount : null,
      badgeColor: 'bg-[#1b24f5] text-white',
      visible: true,
    },
    {
      id: 'admin',
      labelAr: 'إدارة الفريق والصلاحيات',
      labelEn: 'Team & RBAC',
      icon: Users,
      badge: null,
      visible: hasPermission('can_manage_roles') || hasPermission('can_manage_team_members'),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-50 flex w-72 flex-col justify-between border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          language === 'ar'
            ? 'right-0 border-l'
            : 'left-0 border-r'
        } ${isMobileOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 bg-[#1b24f5]">
            <NabdLogo variant="full" theme="dark" size="sm" />

            <button
              onClick={onMobileClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Items */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'ar' ? 'الوحدات الأساسية' : 'Core Modules'}
            </div>

            {navItems.map((item) => {
              if (!item.visible) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    onMobileClose();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1b24f5]/10 text-[#1b24f5] font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-[#1b24f5]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        item.badgeColor || 'bg-[#1b24f5] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Team / Role Indicator & Active Profile */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-xs border border-slate-200/80">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#b5f812] ring-2 ring-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">{currentUser.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: mainRole?.color || '#1b24f5' }}
                />
                <p className="truncate text-[10px] text-slate-500 font-medium">
                  {mainRole ? (language === 'ar' ? mainRole.nameAr : mainRole.name) : 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
