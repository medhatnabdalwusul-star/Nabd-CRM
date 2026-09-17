import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Permission,
  PermissionKey,
  Client,
  Project,
  Task,
  TaskStatus,
  ContentPost,
  ContentStatus,
  Ticket,
  TicketStatus,
  AppNotification,
  ActivityLogItem,
  CommunicationLog,
  ToastNotification,
} from '../types';
import {
  SYSTEM_PERMISSIONS,
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_CONTENT_POSTS,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/initialData';

interface AppContextType {
  // State
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  roles: Role[];
  permissions: Permission[];
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  contentPosts: ContentPost[];
  tickets: Ticket[];
  notifications: AppNotification[];
  activityLogs: ActivityLogItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;

  // RBAC Helper
  hasPermission: (key: PermissionKey) => boolean;
  getUserRoles: (user?: User) => Role[];

  // Client Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'communicationLogs' | 'documents'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addCommunicationLog: (clientId: string, log: Omit<CommunicationLog, 'id' | 'date' | 'createdBy'>) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id'>) => void;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'comments'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  addTaskComment: (taskId: string, content: string) => void;

  // Social Content Actions
  addContentPost: (post: Omit<ContentPost, 'id' | 'createdAt' | 'status'>) => void;
  updateContentPost: (id: string, updates: Partial<ContentPost>) => void;
  submitPostForReview: (postId: string) => void;
  approvePost: (postId: string) => void;
  requestChangesPost: (postId: string, feedbackNote: string) => void;
  publishPost: (postId: string) => void;

  // Tech Ticket Actions
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;

  // Admin & RBAC Actions
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRolePermissions: (roleId: string, permissions: PermissionKey[]) => void;
  updateRole: (roleId: string, updates: Partial<Role>) => void;
  deleteRole: (roleId: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;

  // Notifications & Audit
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  logActivity: (actionAr: string, actionEn: string, entityType: ActivityLogItem['entityType'], entityName: string) => void;

  // Toast Notifications
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Reset demo
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'nabd_production_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage or default
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USERS[0]; // Omar Al-Sharif (Super Admin)
  });

  const [roles, setRoles] = useState<Role[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_roles`);
      return saved ? JSON.parse(saved) : INITIAL_ROLES;
    } catch {
      return INITIAL_ROLES;
    }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_clients`);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [contentPosts, setContentPosts] = useState<ContentPost[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
      return saved ? JSON.parse(saved) : INITIAL_CONTENT_POSTS;
    } catch {
      return INITIAL_CONTENT_POSTS;
    }
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tickets`);
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_roles`, JSON.stringify(roles));
      localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(clients));
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(contentPosts));
      localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
      localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(activityLogs));
    } catch {
      // Storage quota or disabled
    }
  }, [users, currentUser, roles, clients, projects, tasks, contentPosts, tickets, notifications, activityLogs]);

  // Keep HTML lang and dir synced
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Roles helper
  const getUserRoles = (targetUser?: User): Role[] => {
    const u = targetUser || currentUser;
    if (!u) return [];
    return roles.filter((r) => u.roleIds.includes(r.id));
  };

  // Dynamic RBAC Permission Check
  const hasPermission = (key: PermissionKey): boolean => {
    if (!currentUser || currentUser.status === 'inactive') return false;

    // Direct custom permission overrides
    if (currentUser.customPermissions?.includes(key)) return true;

    // Check all roles assigned to user
    const userRoles = getUserRoles(currentUser);
    for (const r of userRoles) {
      if (r.id === 'role-super-admin') return true;
      if (r.permissions.includes(key)) return true;
    }

    return false;
  };

  const logActivity = (
    actionAr: string,
    actionEn: string,
    entityType: ActivityLogItem['entityType'],
    entityName: string
  ) => {
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action: actionEn,
      actionAr: actionAr,
      entityType,
      entityName,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Notifications
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: 'الآن',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastNotification = {
      ...toast,
      id,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Clients
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'communicationLogs' | 'documents'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      communicationLogs: [],
      documents: [],
    };
    setClients((prev) => [newClient, ...prev]);
    logActivity('أضاف عميلاً جديداً', 'added a new client', 'client', newClient.name);
    addNotification({
      userId: 'all',
      title: 'عميل جديد في النظام',
      message: `تمت إضافة العميل "${newClient.name}" بنجاح بواسطة ${currentUser.name}.`,
      type: 'task_assigned',
      linkTab: 'clients',
    });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    const client = clients.find((c) => c.id === id);
    logActivity('حدّث بيانات العميل', 'updated client info', 'client', client?.name || id);
  };

  const deleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    logActivity('حذف عميلاً', 'deleted a client', 'client', client?.name || id);
  };

  const addCommunicationLog = (clientId: string, log: Omit<CommunicationLog, 'id' | 'date' | 'createdBy'>) => {
    const newLog: CommunicationLog = {
      ...log,
      id: `comm-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      createdBy: currentUser.name,
    };
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, communicationLogs: [newLog, ...c.communicationLogs] } : c))
    );
    const client = clients.find((c) => c.id === clientId);
    logActivity('سجّل محادثة/ملاحظة تواصل', 'logged communication note', 'client', client?.name || clientId);
  };

  // Projects
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  // Tasks
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'subtasks' | 'comments'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity('أنشأ مهمة جديدة', 'created a task', 'task', newTask.title);

    // Notify assigned users
    newTask.assignedTo.forEach((uid) => {
      addNotification({
        userId: uid,
        title: 'تم تكليفك بمهمة جديدة 📌',
        message: `تم تكليفك بمهمة: "${newTask.title}" من قبل ${currentUser.name}.`,
        type: 'task_assigned',
        linkTab: 'tasks',
      });
    });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    const task = tasks.find((t) => t.id === taskId);
    logActivity(`غيّر حالة المهمة إلى ${status}`, `updated task status to ${status}`, 'task', task?.title || taskId);

    // Toast triggers for team workflow awareness
    if (status === 'done') {
      showToast({
        type: 'success',
        title: 'اكتمال المهمة بنجاح! 🎯',
        message: `تم إنجاز المهمة: "${task?.title || 'مهمة تصميم/محتوى'}" واعتمادها بالكامل.`,
      });
    } else if (status === 'client_delivered') {
      showToast({
        type: 'success',
        title: 'تم التسليم للعميل 🚀',
        message: `تم تسليم أصول وتصاميم: "${task?.title || 'المهمة'}" للعميل بنجاح.`,
      });
    } else if (status === 'review') {
      showToast({
        type: 'info',
        title: 'مهمة جاهزة للمراجعة 🔍',
        message: `المهمة "${task?.title || 'مهمة'}" جاهزة لتدقيق الأكونت مانجر.`,
      });
    } else if (status === 'changes_requested') {
      showToast({
        type: 'warning',
        title: 'ملاحظات وتعديلات مطلوبة ⚠️',
        message: `تم إرجاع المهمة "${task?.title || 'مهمة'}" لإجراء تعديلات مطلوبة.`,
      });
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    logActivity('حذف مهمة', 'deleted a task', 'task', task?.title || id);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)),
        };
      })
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    const newSubtask = { id: `sub-${Date.now()}`, title, completed: false };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t))
    );
  };

  const addTaskComment = (taskId: string, content: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t))
    );
  };

  // Social Content
  const addContentPost = (postData: Omit<ContentPost, 'id' | 'createdAt' | 'status'>) => {
    const newPost: ContentPost = {
      ...postData,
      id: `post-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setContentPosts((prev) => [newPost, ...prev]);
    logActivity('أنشأ مسودة محتوى سوشيال', 'drafted social post', 'content', newPost.title);
  };

  const updateContentPost = (id: string, updates: Partial<ContentPost>) => {
    setContentPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const submitPostForReview = (postId: string) => {
    setContentPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'review', feedbackNote: undefined } : p))
    );
    const post = contentPosts.find((p) => p.id === postId);
    logActivity('أرسل المنشور للمراجعة والاعتماد', 'submitted post for review', 'content', post?.title || postId);

    // Notify social managers
    const socialManagers = users.filter((u) => u.roleIds.includes('role-social-manager') || u.roleIds.includes('role-super-admin'));
    socialManagers.forEach((m) => {
      addNotification({
        userId: m.id,
        title: 'مراجعة محتوى مطلوبة ✍️',
        message: `طلب ${currentUser.name} مراجعة واعتماد منشور "${post?.title || 'منشور جديد'}".`,
        type: 'content_review',
        linkTab: 'social',
      });
    });
  };

  const approvePost = (postId: string) => {
    setContentPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'approved', reviewerId: currentUser.id } : p))
    );
    const post = contentPosts.find((p) => p.id === postId);
    logActivity('اعتمد المنشور بنجاح', 'approved social post', 'content', post?.title || postId);

    if (post?.authorId) {
      addNotification({
        userId: post.authorId,
        title: 'تم اعتماد منشورك! 🎉',
        message: `قام ${currentUser.name} باعتماد المنشور "${post.title}".`,
        type: 'content_approved',
        linkTab: 'social',
      });
    }

    showToast({
      type: 'success',
      title: 'تم اعتماد المنشور بنجاح! ✍️',
      message: `تم اعتماد منشور "${post?.title || 'المحتوى'}" وجاهز للنشر والجدولة.`,
    });
  };

  const requestChangesPost = (postId: string, feedbackNote: string) => {
    setContentPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'draft', feedbackNote, reviewerId: currentUser.id } : p))
    );
    const post = contentPosts.find((p) => p.id === postId);
    logActivity('طلب تعديلات على المنشور', 'requested changes on post', 'content', post?.title || postId);

    if (post?.authorId) {
      addNotification({
        userId: post.authorId,
        title: 'مطلوب تعديل على المنشور ✏️',
        message: `طلب ${currentUser.name} تعديلات: "${feedbackNote}"`,
        type: 'content_review',
        linkTab: 'social',
      });
    }

    showToast({
      type: 'warning',
      title: 'طلب تعديل على المحتوى ⚠️',
      message: `تمت إعادة منشور "${post?.title || 'المحتوى'}" مع ملاحظات التعديل.`,
    });
  };

  const publishPost = (postId: string) => {
    setContentPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'published' } : p))
    );
    const post = contentPosts.find((p) => p.id === postId);
    logActivity('قام بتحديد المنشور كمنشور فعلياً', 'marked post as published', 'content', post?.title || postId);

    showToast({
      type: 'success',
      title: 'تم نشر المحتوى بنجاح! 🚀',
      message: `تم إطلاق البوست "${post?.title || 'منشور'}" على ${post?.platform.toUpperCase() || 'المنصة'}.`,
    });
  };

  // Tech Tickets
  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `tkt-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTickets((prev) => [newTicket, ...prev]);
    logActivity('فتح تذكرة برمجية جديدة', 'created tech ticket', 'ticket', newTicket.title);

    if (newTicket.assignedTo) {
      addNotification({
        userId: newTicket.assignedTo,
        title: 'تذكرة تقنية مكلّفة لك 🛠️',
        message: `تم تكليفك بتذكرة (${newTicket.severity}): "${newTicket.title}"`,
        type: 'task_assigned',
        linkTab: 'tasks',
      });
    }
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status } : t)));
    const ticket = tickets.find((t) => t.id === ticketId);
    logActivity(`حدّث حالة التذكرة إلى ${status}`, `updated ticket status to ${status}`, 'ticket', ticket?.title || ticketId);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTicket = (id: string) => {
    const ticket = tickets.find((t) => t.id === id);
    setTickets((prev) => prev.filter((t) => t.id !== id));
    logActivity('حذف تذكرة تقنية', 'deleted tech ticket', 'ticket', ticket?.title || id);
  };

  // Admin & Dynamic Roles
  const addRole = (roleData: Omit<Role, 'id'>) => {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
    };
    setRoles((prev) => [...prev, newRole]);
    logActivity('أنشأ دوراً ديناميكياً جديداً', 'created a new dynamic role', 'role', newRole.name);
  };

  const updateRolePermissions = (roleId: string, newPermissions: PermissionKey[]) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: newPermissions } : r))
    );
    const role = roles.find((r) => r.id === roleId);
    logActivity('عدّل صلاحيات الدور', 'updated role permissions', 'role', role?.name || roleId);
  };

  const updateRole = (roleId: string, updates: Partial<Role>) => {
    setRoles((prev) => prev.map((r) => (r.id === roleId ? { ...r, ...updates } : r)));
  };

  const deleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role?.isSystem) return; // Prevent deleting system roles
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    // Remove role from users who had it
    setUsers((prev) =>
      prev.map((u) => ({ ...u, roleIds: u.roleIds.filter((rid) => rid !== roleId) }))
    );
    logActivity('حذف دوراً', 'deleted a role', 'role', role?.name || roleId);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUsers((prev) => [...prev, newUser]);
    logActivity('أضاف عضواً جديداً للفريق', 'added a new team member', 'member', newUser.name);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  };

  const deleteUser = (userId: string) => {
    const u = users.find((item) => item.id === userId);
    // Protect Super Admin from being deleted
    if (u?.email === 'medhat.nabdalwusul@gmail.com' || u?.roleIds.includes('role-super-admin')) {
      showToast({
        type: 'error',
        title: 'لا يمكن حذف حساب السوبر أدمن الرئيسي',
        message: 'حساب المدير العام محمي من الحذف للحفاظ على صلاحيات النظام.',
      });
      return;
    }
    setUsers((prev) => prev.filter((item) => item.id !== userId));
    logActivity('حذف حساب عضو الفريق', 'deleted team member account', 'member', u?.name || userId);
    showToast({
      type: 'info',
      title: 'تم حذف الحساب',
      message: `تم حذف حساب "${u?.name || userId}" بنجاح.`,
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newStatus = u.status === 'active' ? 'inactive' : 'active';
        return { ...u, status: newStatus };
      })
    );
    const u = users.find((item) => item.id === userId);
    logActivity(
      u?.status === 'active' ? 'قام بتعطيل حساب العضو' : 'قام بتفعيل حساب العضو',
      'toggled member active status',
      'member',
      u?.name || userId
    );
  };

  const resetDemoData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setRoles(INITIAL_ROLES);
    setClients(INITIAL_CLIENTS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setContentPosts(INITIAL_CONTENT_POSTS);
    setTickets(INITIAL_TICKETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        roles,
        permissions: SYSTEM_PERMISSIONS,
        clients,
        projects,
        tasks,
        contentPosts,
        tickets,
        notifications,
        activityLogs,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        hasPermission,
        getUserRoles,
        addClient,
        updateClient,
        deleteClient,
        addCommunicationLog,
        addProject,
        addTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        addTaskComment,
        addContentPost,
        updateContentPost,
        submitPostForReview,
        approvePost,
        requestChangesPost,
        publishPost,
        addTicket,
        updateTicketStatus,
        updateTicket,
        deleteTicket,
        addRole,
        updateRolePermissions,
        updateRole,
        deleteRole,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        logActivity,
        toasts,
        showToast,
        dismissToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
