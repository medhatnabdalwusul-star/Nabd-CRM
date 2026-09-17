import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role, User, PermissionCategory } from '../../types';
import {
  ShieldCheck,
  Users,
  Plus,
  Lock,
  Unlock,
  Check,
  Trash2,
  Edit2,
  X,
  UserPlus,
  Key,
  Shield,
  Briefcase,
  Calendar,
  Settings,
  Sparkles,
  AlertCircle,
  Palette,
  RotateCcw,
} from 'lucide-react';

export const RbacSettingsView: React.FC = () => {
  const {
    roles,
    users,
    permissions,
    currentUser,
    setCurrentUser,
    addRole,
    updateRolePermissions,
    deleteRole,
    addUser,
    updateUser,
    deleteUser,
    hasPermission,
    language,
    resetDemoData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'members'>('matrix');
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0] || {
    id: 'role-account-manager',
    name: 'Account Manager',
    nameAr: 'أكونت مانجر',
    description: '',
    descriptionAr: '',
    permissions: [],
    color: '#1b24f5',
  });

  // Add Role modal
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleNameAr, setNewRoleNameAr] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#1b24f5');

  // Add User modal
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userTeam, setUserTeam] = useState<'management' | 'social' | 'design'>('management');
  const [userRoleId, setUserRoleId] = useState(roles[0]?.id || 'role-account-manager');

  const canManageRoles = hasPermission('can_manage_roles');
  const canManageMembers = hasPermission('can_manage_team_members');

  // Group permissions by agency category (CRM, Tasks & Design, Social Media, Admin)
  const categories: { id: PermissionCategory; labelAr: string; labelEn: string; icon: any }[] = [
    { id: 'crm', labelAr: 'إدارة العملاء والـ CRM', labelEn: 'Client CRM', icon: Briefcase },
    { id: 'tasks', labelAr: 'المهام والمشاريع والتسليمات البصرية', labelEn: 'Tasks & Visual Deliverables', icon: Check },
    { id: 'social', labelAr: 'السوشيال ميديا وصناعة المحتوى', labelEn: 'Social Media & Content', icon: Calendar },
    { id: 'admin', labelAr: 'الإدارة والنظام ومصفوفة الصلاحيات', labelEn: 'Administration & RBAC', icon: Settings },
  ];

  const handleTogglePermission = (roleId: string, permKey: string) => {
    if (!canManageRoles) return;
    const targetRole = roles.find((r) => r.id === roleId);
    if (!targetRole) return;

    const exists = targetRole.permissions.includes(permKey as any);
    const updated = exists
      ? targetRole.permissions.filter((k) => k !== permKey)
      : [...targetRole.permissions, permKey as any];

    updateRolePermissions(roleId, updated);

    // Also update selectedRole state
    if (selectedRole.id === roleId) {
      setSelectedRole({
        ...selectedRole,
        permissions: updated,
      });
    }
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    addRole({
      name: newRoleName,
      nameAr: newRoleNameAr || newRoleName,
      description: newRoleDesc,
      descriptionAr: newRoleDesc || newRoleNameAr,
      permissions: [],
      isSystem: false,
      color: newRoleColor,
    });

    setIsAddRoleOpen(false);
    setNewRoleName('');
    setNewRoleNameAr('');
    setNewRoleDesc('');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    addUser({
      name: userName,
      email: userEmail || `${userName.toLowerCase().replace(/\s+/g, '')}@agencyhub.internal`,
      roleIds: [userRoleId],
      team: userTeam,
      status: 'active',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    });

    setIsAddUserOpen(false);
    setUserName('');
    setUserEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#1b24f5]" />
              {language === 'ar' ? 'إدارة الصلاحيات والفريق (Dynamic RBAC)' : 'Team & Dynamic RBAC'}
            </h2>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              {language === 'ar' ? 'نظام مرن 100%' : '100% Dynamic'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ar'
              ? 'تحكم كامل في مصفوفة الصلاحيات، إضافة أدوار مخصصة وتعديل صلاحيات المستخدمين فورياً دون الحاجة لكود.'
              : 'Configure dynamic roles, permissions matrix, and team members with instantaneous updates.'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'matrix' ? 'bg-white text-[#1b24f5] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            {language === 'ar' ? 'مصفوفة الصلاحيات (Roles Matrix)' : 'Roles Matrix'}
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'members' ? 'bg-white text-[#1b24f5] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            {language === 'ar' ? 'أعضاء الفريق (Members)' : 'Team Members'}
          </button>
        </div>
      </div>

      {/* Agency Roles Overview Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1b24f5] text-white shadow-xs">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'ar' ? 'الهيكل التنظيمي المعتمد لوكالة نبض الوصول' : 'Nabd Al Wusool Roles Architecture'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'ar'
                  ? 'تم تخصيص الصلاحيات بناءً على الأدوار الثلاثة المعتمدة للوكالة: أكونت مانجر، سوشيال ميديا سبيشياليست، وجرافيك ديزاينر.'
                  : 'Role-based access customized for the 3 core agency roles: Account Manager, Social Media Specialist, Graphic Designer.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#b5f812]/20 border border-[#b5f812]/40 px-3 py-1 text-[11px] font-extrabold text-[#0b0f4a]">
              <span className="h-2 w-2 rounded-full bg-[#b5f812] animate-pulse" />
              {language === 'ar' ? '3 أدوار أساسية محددة' : '3 Core Agency Roles'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Account Manager Card */}
          <div
            onClick={() => {
              const r = roles.find((x) => x.id === 'role-account-manager');
              if (r) {
                setSelectedRole(r);
                setActiveTab('matrix');
              }
            }}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              selectedRole.id === 'role-account-manager'
                ? 'border-[#1b24f5] bg-[#1b24f5]/5 shadow-xs'
                : 'border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#1b24f5]" />
              <span className="rounded bg-[#1b24f5]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#1b24f5]">
                {language === 'ar' ? 'صلاحيات كاملة' : 'Full Control'}
              </span>
            </div>
            <h4 className="mt-2 text-xs font-bold text-slate-900">
              {language === 'ar' ? '1. أكونت مانجر' : '1. Account Manager'}
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {language === 'ar'
                ? 'إدارة العملاء والعقود، تعيين المهام، الاعتماد النهائي، والتقارير المالية.'
                : 'Client CRM, contracts, task delegation, approvals, and financials.'}
            </p>
          </div>

          {/* Social Media Specialist Card */}
          <div
            onClick={() => {
              const r = roles.find((x) => x.id === 'role-social-specialist');
              if (r) {
                setSelectedRole(r);
                setActiveTab('matrix');
              }
            }}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              selectedRole.id === 'role-social-specialist'
                ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                : 'border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                {language === 'ar' ? 'محتوى ونشر' : 'Content & Social'}
              </span>
            </div>
            <h4 className="mt-2 text-xs font-bold text-slate-900">
              {language === 'ar' ? '2. سوشيال ميديا سبيشياليست' : '2. Social Media Specialist'}
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {language === 'ar'
                ? 'كتابة المحتوى، إدارة تقويم النشر، الجدولة التلقائية، ومتابعة الحملات.'
                : 'Copywriting, calendar planning, automated scheduling, and campaigns.'}
            </p>
          </div>

          {/* Graphic Designer Card */}
          <div
            onClick={() => {
              const r = roles.find((x) => x.id === 'role-graphic-designer');
              if (r) {
                setSelectedRole(r);
                setActiveTab('matrix');
              }
            }}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              selectedRole.id === 'role-graphic-designer'
                ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                : 'border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                {language === 'ar' ? 'تصميم ومرفقات' : 'Visual Assets'}
              </span>
            </div>
            <h4 className="mt-2 text-xs font-bold text-slate-900">
              {language === 'ar' ? '3. جرافيك ديزاينر' : '3. Graphic Designer'}
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              {language === 'ar'
                ? 'تنفيذ الهويات، الكاروسيل، المونتاج، ورفع المرفقات البصرية وملفات العمل.'
                : 'Creatives, carousels, reels editing, and visual deliverables uploads.'}
            </p>
          </div>
        </div>
      </div>

      {/* MATRIX VIEW */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 items-start">
          {/* Roles Selector Sidebar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-indigo-600" />
                {language === 'ar' ? 'الأدوار الوظيفية المعرفة' : 'Configured Roles'}
              </h3>
              {canManageRoles && (
                <button
                  onClick={() => setIsAddRoleOpen(true)}
                  className="rounded-lg p-1 text-indigo-600 hover:bg-indigo-50"
                  title="إضافة دور مخصص جديد"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {roles.map((role) => {
                const isSelected = selectedRole.id === role.id;
                const membersWithRole = users.filter((u) => u.roleIds.includes(role.id)).length;

                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full flex items-center justify-between rounded-xl p-2.5 text-start transition-all border ${
                      isSelected
                        ? 'border-indigo-200 bg-indigo-50/70 text-indigo-950 font-bold shadow-2xs'
                        : 'border-transparent text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: role.color }}
                      />
                      <div>
                        <p className="text-xs">{language === 'ar' ? role.nameAr : role.name}</p>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {membersWithRole} {language === 'ar' ? 'موظفين' : 'members'} •{' '}
                          {role.permissions.length} {language === 'ar' ? 'صلاحيات' : 'perms'}
                        </span>
                      </div>
                    </div>

                    {role.isSystem && (
                      <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] font-semibold text-slate-500">
                        System
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions Matrix Detail for Selected Role */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            {/* Header of selected role */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: selectedRole.color }}
                  />
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'ar' ? selectedRole.nameAr : selectedRole.name}
                  </h3>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                    {selectedRole.permissions.length} / {permissions.length} {language === 'ar' ? 'صلاحية مفعلة' : 'permissions active'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
              </div>

              {!selectedRole.isSystem && canManageRoles && (
                <button
                  onClick={() => {
                    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الدور؟' : 'Delete this role?')) {
                      deleteRole(selectedRole.id);
                      setSelectedRole(roles[0]);
                    }
                  }}
                  className="flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {language === 'ar' ? 'حذف هذا الدور' : 'Delete Role'}
                </button>
              )}
            </div>

            {/* Permissions Checkbox Grid by Module */}
            <div className="mt-5 space-y-6">
              {categories.map((cat) => {
                const catPermissions = permissions.filter((p) => p.category === cat.id);
                const CatIcon = cat.icon;

                return (
                  <div key={cat.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60">
                      <CatIcon className="h-4 w-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-800">
                        {language === 'ar' ? cat.labelAr : cat.labelEn}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {catPermissions.map((perm) => {
                        const isGranted = selectedRole.permissions.includes(perm.key);

                        return (
                          <label
                            key={perm.key}
                            className={`flex items-start gap-3 rounded-xl p-2.5 border transition-all cursor-pointer ${
                              isGranted
                                ? 'bg-white border-indigo-200 shadow-2xs'
                                : 'bg-white/60 border-slate-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isGranted}
                              disabled={!canManageRoles || (selectedRole.id === 'role-super-admin' && perm.key === 'can_manage_roles')}
                              onChange={() => handleTogglePermission(selectedRole.id, perm.key)}
                              className="h-4 w-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <div>
                              <p className={`text-xs font-bold ${isGranted ? 'text-slate-900' : 'text-slate-600'}`}>
                                {language === 'ar' ? perm.labelAr : perm.labelEn}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                                {language === 'ar' ? perm.descriptionAr : perm.descriptionEn}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TEAM MEMBERS VIEW */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'ar' ? 'فريق العمل وتوزيع الأدوار' : 'Agency Team Members'}
            </h3>

            {canManageMembers && (
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-xs"
              >
                <UserPlus className="h-4 w-4" />
                {language === 'ar' ? 'إضافة موظف جديد' : 'New Member'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => {
              const userRolesList = roles.filter((r) => user.roleIds.includes(r.id));
              const mainRole = userRolesList[0];
              const isCurrent = user.id === currentUser.id;

              return (
                <div
                  key={user.id}
                  className={`flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition-all ${
                    isCurrent
                      ? 'border-indigo-400 bg-indigo-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900">{user.name}</h4>
                            {isCurrent && (
                              <span className="rounded bg-indigo-600 px-1 py-0.2 text-[9px] font-bold text-white">
                                {language === 'ar' ? 'أنت' : 'You'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          user.team === 'social'
                            ? 'bg-sky-100 text-sky-800'
                            : user.team === 'design'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#1b24f5]/10 text-[#1b24f5]'
                        }`}
                      >
                        {user.team === 'social' ? (language === 'ar' ? 'سوشيال ميديا' : 'Social') : user.team === 'design' ? (language === 'ar' ? 'جرافيك ديزاين' : 'Design') : (language === 'ar' ? 'إدارة' : 'Mgmt')}
                      </span>
                    </div>

                    {/* Role Tag */}
                    <div className="mt-3.5 flex flex-wrap gap-1">
                      {userRolesList.map((r) => (
                        <span
                          key={r.id}
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: r.color }} />
                          {language === 'ar' ? r.nameAr : r.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      onClick={() => setCurrentUser(user)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      title="تجربة النظام بصلاحيات هذا الموظف"
                    >
                      <Sparkles className="h-3 w-3" />
                      {language === 'ar' ? 'محاكاة الهوية' : 'Impersonate'}
                    </button>

                    {canManageMembers && !isCurrent && (
                      <button
                        onClick={() => {
                          if (window.confirm(`حذف المستخدم ${user.name}؟`)) {
                            deleteUser(user.id);
                          }
                        }}
                        className="rounded p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Role Modal */}
      {isAddRoleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'ar' ? 'إضافة دور وظيفي جديد (Custom Role)' : 'Create Custom Role'}
              </h3>
              <button
                onClick={() => setIsAddRoleOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {language === 'ar' ? 'اسم الدور بالعربية *' : 'Role Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={newRoleNameAr}
                  onChange={(e) => setNewRoleNameAr(e.target.value)}
                  placeholder="مثال: مهندس فحص جودة QA"
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {language === 'ar' ? 'اسم الدور بالإنجليزية (ID/Name) *' : 'Role Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. QA Automation Engineer"
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {language === 'ar' ? 'وصف المسؤوليات' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="مهام ومسؤوليات هذا الدور..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {language === 'ar' ? 'لون التمييز' : 'Badge Color'}
                </label>
                <input
                  type="color"
                  value={newRoleColor}
                  onChange={(e) => setNewRoleColor(e.target.value)}
                  className="h-8 w-16 rounded border border-slate-200 cursor-pointer p-0.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddRoleOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-xs"
                >
                  {language === 'ar' ? 'إنشاء وتفعيل الدور' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'ar' ? 'إضافة موظف جديد للفريق' : 'Add Team Member'}
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="مثال: يوسف كمال"
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="youssef@agencyhub.internal"
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'ar' ? 'الفريق' : 'Team'}
                  </label>
                  <select
                    value={userTeam}
                    onChange={(e) => setUserTeam(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none"
                  >
                    <option value="management">أكونت مانجر (Account Manager)</option>
                    <option value="social">سوشيال ميديا سبيشياليست (Social)</option>
                    <option value="design">جرافيك ديزاينر (Graphic Designer)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'ar' ? 'الدور الوظيفي' : 'Assigned Role'}
                  </label>
                  <select
                    value={userRoleId}
                    onChange={(e) => setUserRoleId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 text-slate-900 focus:outline-none"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {language === 'ar' ? r.nameAr : r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1b24f5] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#161dc2] shadow-xs"
                >
                  {language === 'ar' ? 'إضافة الموظف' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
