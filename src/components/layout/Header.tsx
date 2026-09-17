import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NabdLogo } from '../common/NabdLogo';
import {
  Bell,
  Search,
  Globe,
  UserCheck,
  Check,
  CheckCheck,
  ExternalLink,
  Menu,
  ChevronDown,
  Palette,
  Share2,
  Briefcase,
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    roles,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    language,
    setLanguage,
    setActiveTab,
  } = useApp();

  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.isRead && (n.userId === currentUser.id || n.userId === 'all')).length;
  const userNotifications = notifications.filter((n) => n.userId === currentUser.id || n.userId === 'all');

  const activeUserRole = roles.find((r) => currentUser.roleIds.includes(r.id));

  const getUserBadgeIcon = (team: string) => {
    switch (team) {
      case 'design':
        return <Palette className="h-3 w-3 text-amber-500" />;
      case 'social':
        return <Share2 className="h-3 w-3 text-emerald-500" />;
      default:
        return <Briefcase className="h-3 w-3 text-[#1b24f5]" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-3 sm:px-6 backdrop-blur-md shadow-2xs">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          id="mobile-menu-btn"
          onClick={onMobileMenuToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          title="القائمة"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Nabd Al Wusool Brand Logo In Header */}
        <div className="flex items-center gap-2.5 py-1">
          <NabdLogo variant="full" theme="light" size="sm" showSubtitle={false} />
          <span className="hidden xl:inline-flex items-center rounded-md bg-[#1b24f5]/10 border border-[#1b24f5]/20 px-2 py-0.5 text-[10px] font-bold text-[#1b24f5]">
            {language === 'ar' ? 'إدارة السوشيال ميديا والتصميم' : 'Social & Design Hub'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative hidden md:block w-48 lg:w-72">
          <Search className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث عن مهمة، تصميم، أو منشور...' : 'Search tasks, designs, posts...'}
            className={`w-full rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1b24f5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1b24f5] transition-all ${
              language === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3'
            }`}
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick 1-Click Fast Login / Profile Selector */}
        <div className="relative">
          {/* Desktop Direct 1-Click Quick Selector */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-xl bg-slate-100/80 p-1 border border-slate-200">
            <span className="px-2 text-[10px] font-bold text-slate-500 flex items-center gap-1">
              <UserCheck className="h-3 w-3 text-[#1b24f5]" />
              {language === 'ar' ? 'تسجيل الدخول السريع:' : 'Quick Login:'}
            </span>
            {users.map((u) => {
              const isSelected = u.id === currentUser.id;
              const role = roles.find((r) => u.roleIds.includes(r.id));
              return (
                <button
                  key={u.id}
                  onClick={() => setCurrentUser(u)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 font-bold shadow-xs ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title={`${u.name} - ${role ? (language === 'ar' ? role.nameAr : role.name) : ''}`}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-5 w-5 rounded-full object-cover border border-slate-200"
                  />
                  <span>{u.name.split(' ')[0]}</span>
                  {isSelected && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: role?.color || '#1b24f5' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Compact Dropdown Button for Mobile / Tablet */}
          <div className="xl:hidden">
            <button
              id="persona-switcher-btn"
              onClick={() => setShowUserSwitcher(!showUserSwitcher)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-5 w-5 rounded-full object-cover border border-slate-200"
              />
              <span className="font-bold text-slate-900">{currentUser.name.split(' ')[0]}</span>
              <span
                className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[9px] text-white font-bold"
                style={{ backgroundColor: activeUserRole?.color || '#1b24f5' }}
              >
                {activeUserRole ? (language === 'ar' ? activeUserRole.nameAr : activeUserRole.name) : 'User'}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showUserSwitcher && (
              <div
                className={`absolute mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  language === 'ar' ? 'left-0' : 'right-0'
                }`}
              >
                <div className="border-b border-slate-100 pb-2 px-2">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-[#1b24f5]" />
                    {language === 'ar' ? 'تسجيل دخول سريع وتبديل الحساب' : 'Switch Account / Login'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'ar'
                      ? 'اختر عضو الفريق لعرض المهام والتصاميم المخصصة له فقط.'
                      : 'Select member to view their tailored tasks and deliverables.'}
                  </p>
                </div>

                <div className="mt-2 space-y-1">
                  {users.map((u) => {
                    const role = roles.find((r) => u.roleIds.includes(r.id));
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowUserSwitcher(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-xl p-2.5 text-start transition-all ${
                          isSelected
                            ? 'bg-[#1b24f5]/10 border border-[#1b24f5]/30 text-[#1b24f5] font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{u.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {getUserBadgeIcon(u.team)}
                              <span className="text-[11px] text-slate-500 font-medium">
                                {role ? (language === 'ar' ? role.nameAr : role.name) : 'عضو فريق'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#1b24f5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            title="الإشعارات"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className={`absolute mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 animate-in fade-in duration-150 ${
                language === 'ar' ? 'left-0' : 'right-0'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-800">
                    {language === 'ar' ? 'مركز الإشعارات' : 'Notifications'}
                  </h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                      {unreadCount} {language === 'ar' ? 'جديد' : 'new'}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    {language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-72 overflow-y-auto space-y-1.5">
                {userNotifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    {language === 'ar' ? 'لا توجد إشعارات جديدة' : 'No notifications yet'}
                  </p>
                ) : (
                  userNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.linkTab) setActiveTab(n.linkTab);
                        setShowNotifications(false);
                      }}
                      className={`cursor-pointer rounded-xl p-2.5 transition-all text-start border ${
                        n.isRead
                          ? 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                          : 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50 text-slate-900 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                      {n.linkTab && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                          {language === 'ar' ? 'عرض التفاصيل' : 'View'}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <button
          id="lang-toggle-btn"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          title="تغيير لغة الواجهة"
        >
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          <span>{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </div>
    </header>
  );
};
