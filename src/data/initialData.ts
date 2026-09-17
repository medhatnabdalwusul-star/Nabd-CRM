import {
  Permission,
  Role,
  User,
  Client,
  Project,
  Task,
  ContentPost,
  Ticket,
  AppNotification,
  ActivityLogItem,
} from '../types';

export const SYSTEM_PERMISSIONS: Permission[] = [
  // CRM Permissions
  {
    id: 'p1',
    key: 'can_view_clients',
    labelAr: 'عرض بيانات العملاء',
    labelEn: 'View Clients',
    category: 'crm',
    descriptionAr: 'الاطلاع على قائمة العملاء وسجل التواصل والملفات',
    descriptionEn: 'View client list, communication history, and docs',
  },
  {
    id: 'p2',
    key: 'can_edit_clients',
    labelAr: 'إضافة وتعديل العملاء',
    labelEn: 'Create & Edit Clients',
    category: 'crm',
    descriptionAr: 'إنشاء ملف عميل جديد أو تعديل بيانات التعاقد',
    descriptionEn: 'Create new clients or edit agreement details',
  },
  {
    id: 'p3',
    key: 'can_delete_clients',
    labelAr: 'حذف وأرشفة العملاء',
    labelEn: 'Delete / Archive Clients',
    category: 'crm',
    descriptionAr: 'حذف العميل أو تحويل حالته إلى مغادر (Churned)',
    descriptionEn: 'Remove client profile or set to churned',
  },

  // Task & Project Permissions
  {
    id: 'p4',
    key: 'can_view_all_tasks',
    labelAr: 'عرض جميع مهام الفرق والمشاريع',
    labelEn: 'View All Tasks & Projects',
    category: 'tasks',
    descriptionAr: 'الوصول إلى لوحة الكانبان وكافة مهام ومشاريع الوكالة',
    descriptionEn: 'Access all team tasks across kanban board',
  },
  {
    id: 'p5',
    key: 'can_assign_tasks',
    labelAr: 'إنشاء وتكليف المهام والمشاريع',
    labelEn: 'Assign Tasks & Projects',
    category: 'tasks',
    descriptionAr: 'إنشاء مشاريع، تفكيكها لمهام، تعيين المنفذين وتحديد الديدلاين',
    descriptionEn: 'Create projects, break down tasks, assign with due dates',
  },
  {
    id: 'p6',
    key: 'can_edit_tasks',
    labelAr: 'تحديث حالة وتفاصيل المهام',
    labelEn: 'Edit Tasks & Progress',
    category: 'tasks',
    descriptionAr: 'تغيير حالة المهمة بالسحب والإفلات، إضافة تعليقات ومرفقات',
    descriptionEn: 'Update task progress, drag-and-drop, comments and attachments',
  },
  {
    id: 'p7',
    key: 'can_delete_tasks',
    labelAr: 'حذف المهام والمشاريع',
    labelEn: 'Delete Tasks & Projects',
    category: 'tasks',
    descriptionAr: 'إزالة المهام والمشاريع نهائيًا',
    descriptionEn: 'Remove tasks permanently',
  },
  {
    id: 'p10',
    key: 'can_upload_creative_assets',
    labelAr: 'رفع المرفقات والأصول البصرية',
    labelEn: 'Upload Attachments & Deliverables',
    category: 'tasks',
    descriptionAr: 'رفع ملفات العمل والتصاميم والمرفقات للمهام',
    descriptionEn: 'Upload work files, designs and task attachments',
  },

  // Content & Social Permissions
  {
    id: 'p8',
    key: 'can_approve_content',
    labelAr: 'اعتماد ومراجعة المحتوى والتصاميم',
    labelEn: 'Approve Content & Deliverables',
    category: 'social',
    descriptionAr: 'الموافقة على مخرجات المهام أو طلب تعديلات بملاحظات',
    descriptionEn: 'Approve deliverables or request revisions',
  },
  {
    id: 'p9',
    key: 'can_publish_posts',
    labelAr: 'جدولة ونشر المحتوى',
    labelEn: 'Publish & Schedule Content',
    category: 'social',
    descriptionAr: 'جدولة المنشورات والتسليم النهائي للعميل',
    descriptionEn: 'Schedule and deliver finalized content',
  },

  // Admin & System Permissions
  {
    id: 'p11',
    key: 'can_manage_roles',
    labelAr: 'إدارة الأدوار ومصفوفة الصلاحيات (RBAC)',
    labelEn: 'Manage Roles & RBAC Matrix',
    category: 'admin',
    descriptionAr: 'إنشاء وتعديل الأدوار والصلاحيات (محصورة بالسوبر أدمن)',
    descriptionEn: 'Create/modify roles and permissions (Super Admin only)',
  },
  {
    id: 'p12',
    key: 'can_manage_team_members',
    labelAr: 'إدارة المستخدمين وتسجيل أعضاء الفريق',
    labelEn: 'Manage Users & Onboarding',
    category: 'admin',
    descriptionAr: 'تسجيل مستخدمين جدد، تحديد كلمات المرور، وتعيين الأدوار',
    descriptionEn: 'Register new users, passwords, and assign roles',
  },
  {
    id: 'p13',
    key: 'can_view_reports',
    labelAr: 'عرض التقارير ومؤشرات الأداء',
    labelEn: 'View Reports & KPIs',
    category: 'admin',
    descriptionAr: 'الاطلاع على تقارير الإنتاجية ونسب إنجاز المشاريع',
    descriptionEn: 'Access productivity reports and project KPIs',
  },
  {
    id: 'p14',
    key: 'can_edit_financials',
    labelAr: 'إدارة العقود والماليات',
    labelEn: 'Manage Contracts & Financials',
    category: 'admin',
    descriptionAr: 'الاطلاع على تعاقدات العملاء وأسعار الباقات',
    descriptionEn: 'View and edit client contracts and retainer fees',
  },
];

// The 4 default roles requested by user
export const INITIAL_ROLES: Role[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    nameAr: 'المدير العام (سوبر أدمن)',
    description: 'Full system control: exclusive access to manage users, passwords, roles, RBAC matrix, and complete agency operations.',
    descriptionAr: 'تحكم كامل وشامل بالنظام: الصلاحية الحصرية لإدارة المستخدمين، كلمات المرور، مصفوفة الصلاحيات، وكافة المشاريع والعملاء.',
    isSystem: true,
    color: '#1b24f5',
    permissions: [
      'can_view_clients',
      'can_edit_clients',
      'can_delete_clients',
      'can_view_all_tasks',
      'can_assign_tasks',
      'can_edit_tasks',
      'can_delete_tasks',
      'can_approve_content',
      'can_publish_posts',
      'can_upload_creative_assets',
      'can_manage_roles',
      'can_manage_team_members',
      'can_view_reports',
      'can_edit_financials',
    ],
  },
  {
    id: 'role-operations-manager',
    name: 'Operations Manager',
    nameAr: 'مدير العمليات (Operations Manager)',
    description: 'Manages clients, breaks down projects into tasks, tracks kanban workflow, deadlines, and delivery.',
    descriptionAr: 'إدارة العملاء، تفكيك المشاريع إلى مهام، تكليف الفريق، ومتابعة لوحة الكانبان والالتزام بالديدلاين والتسليم.',
    isSystem: true,
    color: '#10b981',
    permissions: [
      'can_view_clients',
      'can_edit_clients',
      'can_view_all_tasks',
      'can_assign_tasks',
      'can_edit_tasks',
      'can_delete_tasks',
      'can_approve_content',
      'can_publish_posts',
      'can_upload_creative_assets',
      'can_view_reports',
    ],
  },
  {
    id: 'role-content-creator',
    name: 'Content Creator',
    nameAr: 'صانع محتوى وتصميم (Content Creator)',
    description: 'Creates content, designs creatives, updates assigned tasks, uploads deliverables, and interacts via comments.',
    descriptionAr: 'كتابة المحتوى، تصميم الأصول البصرية، تحديث حالة المهام المسندة إليه، رفع المرفقات، والتفاعل بالتعليقات.',
    isSystem: true,
    color: '#f59e0b',
    permissions: [
      'can_view_clients',
      'can_view_all_tasks',
      'can_edit_tasks',
      'can_upload_creative_assets',
      'can_publish_posts',
    ],
  },
  {
    id: 'role-developer',
    name: 'Developer',
    nameAr: 'مطور برمجيات (Developer)',
    description: 'Handles technical implementations, feature development, integration, and assigned developer tasks.',
    descriptionAr: 'التطوير البرمجي، الربط التقني، معالجة التذاكر البرمجية، وإنجاز المهام التقنية المسندة.',
    isSystem: true,
    color: '#6366f1',
    permissions: [
      'can_view_all_tasks',
      'can_edit_tasks',
      'can_upload_creative_assets',
    ],
  },
];

// Clean Real Production Users: Started clean with the Super Admin account (medhat.nabdalwusul@gmail.com)
export const INITIAL_USERS: User[] = [
  {
    id: 'user-super-admin',
    name: 'مدحت (المدير العام)',
    email: 'medhat.nabdalwusul@gmail.com',
    password: 'Admin@Password2026',
    roleIds: ['role-super-admin'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    team: 'management',
    createdAt: '2026-09-17',
  },
];

// All mock data cleaned to start 100% fresh from scratch
export const INITIAL_CLIENTS: Client[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_CONTENT_POSTS: ContentPost[] = [];
export const INITIAL_TICKETS: Ticket[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'act-init',
    userId: 'user-super-admin',
    userName: 'مدحت (المدير العام)',
    action: 'initialized production system',
    actionAr: 'قام بتهيئة النظام الحقيقي وإعداد قاعدة البيانات والأدوار الافتراضية',
    entityType: 'role',
    entityName: 'تهيئة بيئة العمل الحقيقية',
    details: 'تم مسح البيانات التجريبية، وتفعيل الأدوار الأربعة وحساب السوبر أدمن',
    createdAt: 'الآن',
  },
];
