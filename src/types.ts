export type PermissionKey =
  | 'can_view_clients'
  | 'can_edit_clients'
  | 'can_delete_clients'
  | 'can_view_all_tasks'
  | 'can_assign_tasks'
  | 'can_edit_tasks'
  | 'can_delete_tasks'
  | 'can_approve_content'
  | 'can_publish_posts'
  | 'can_upload_creative_assets'
  | 'can_manage_roles'
  | 'can_manage_team_members'
  | 'can_view_reports'
  | 'can_edit_financials';

export type PermissionCategory = 'crm' | 'tasks' | 'social' | 'admin';

export interface Permission {
  id: string;
  key: PermissionKey;
  labelAr: string;
  labelEn: string;
  category: PermissionCategory;
  descriptionAr: string;
  descriptionEn: string;
}

export interface Role {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  permissions: PermissionKey[];
  isSystem?: boolean; // System roles cannot be deleted
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For authentication and team member onboarding
  roleIds: string[]; // Supports multiple roles
  avatar: string;
  status: 'active' | 'inactive';
  team: 'social' | 'design' | 'management' | 'operations' | 'content' | 'developer';
  customPermissions?: PermissionKey[]; // Specific overrides
  createdAt: string;
}

export type ClientStatus = 'lead' | 'negotiation' | 'active' | 'paused' | 'churned';

export interface CommunicationLog {
  id: string;
  date: string;
  type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'note';
  summary: string;
  createdBy: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  url: string;
  size: string;
  uploadedAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  industry: string;
  status: ClientStatus;
  contactPerson: string;
  email: string;
  phone: string;
  monthlyRetainer: number;
  currency: string;
  packageTitle: string;
  notes: string;
  communicationLogs: CommunicationLog[];
  documents: ClientDocument[];
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  type: 'social_retainer' | 'branding' | 'marketing_campaign';
  status: 'active' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  startDate: string;
  endDate: string;
  teamType: 'social' | 'design' | 'both';
  progress: number;
}

export type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'changes_requested'
  | 'client_delivered'
  | 'done';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp?: string;
}

export type DeliverableCategory =
  | 'social_design'       // تصميم سوشيال
  | 'video_content'       // محتوى فيديو
  | 'creative_writing'    // كتابة إبداعية
  | 'motion_graphics'     // موشن جرافيك
  | 'branding_identity';  // هوية بصرية

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  teamType: 'social' | 'design';
  deliverableCategory?: DeliverableCategory;
  dimensions?: string;
  platform?: string;
  suggestedSubtasks: string[];
  badge?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface VisualAttachment {
  id: string;
  name: string;
  url?: string;
  type?: 'image' | 'video' | 'figma' | 'psd' | 'ai' | 'pdf';
  fileType?: 'image' | 'video' | 'figma' | 'psd' | 'ai' | 'pdf';
  dimension?: string; // e.g. "1080x1080", "1080x1350", "1080x1920"
  dimensions?: string;
  thumbnailUrl?: string;
  fileSize?: string;
  format?: string;
  uploadedBy?: string;
  uploadedAt: string;
  downloadUrl?: string;
}

export type VisualDeliverable = VisualAttachment;

export interface Task {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string[]; // User IDs
  createdBy: string;
  dueDate: string;
  teamType: 'social' | 'design';
  deliverableCategory?: DeliverableCategory;
  subtasks: Subtask[];
  comments: TaskComment[];
  visualAttachments?: VisualAttachment[];
  creativeSpecs?: {
    platform?: string;
    dimensions?: string;
    format?: string;
    sourceFileLink?: string;
  };
  createdAt: string;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'x' | 'twitter' | 'youtube';
export type MediaType = 'image' | 'video' | 'carousel' | 'reel' | 'story';
export type ContentStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published';

export interface ContentPost {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  platform: SocialPlatform;
  mediaType: MediaType;
  caption: string;
  hashtags: string[];
  status: ContentStatus;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  mediaUrl?: string;
  authorId: string;
  reviewerId?: string;
  feedbackNote?: string;
  createdAt: string;
}

export type TicketStatus = 'backlog' | 'in_dev' | 'testing' | 'deployed';
export type TicketSeverity = 'critical' | 'high' | 'medium' | 'low';
export type TicketType = 'bug' | 'feature' | 'infrastructure' | 'maintenance' | 'support';

export interface Ticket {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  description: string;
  status: TicketStatus;
  severity: TicketSeverity;
  type: TicketType;
  assignedTo?: string; // Developer user ID
  sprint?: string;
  branchOrPr?: string;
  createdBy: string;
  dueDate?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string; // target user, or 'all'
  title: string;
  message: string;
  type: 'task_assigned' | 'content_review' | 'content_approved' | 'deadline_warning';
  isRead: boolean;
  linkTab?: 'dashboard' | 'clients' | 'tasks' | 'social' | 'admin' | 'activity';
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  actionAr: string;
  entityType: 'client' | 'task' | 'content' | 'role' | 'member' | 'ticket';
  entityName: string;
  details?: string;
  createdAt: string;
}
