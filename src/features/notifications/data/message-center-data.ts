export type MessageRoleId = 'task-assignee' | 'reviewer' | 'project-owner';

export type MessageItem = {
  id: string;
  title: string;
  badge: string;
  body: string;
  timestamp: string;
};

export type MessageRole = {
  id: MessageRoleId;
  label: string;
  subtitle: string;
  unreadCount: number;
  icon: 'user' | 'checks' | 'workspace';
  roleMessages: MessageItem[];
};

export const globalNoticeMessages: MessageItem[] = [
  {
    id: 'global-1',
    title: 'Release Notice',
    badge: 'Platform Admin',
    body: 'The March 18 production release is scheduled for 6:00 PM. Please save your work before the annotation toolkit update begins.',
    timestamp: '10 minutes ago'
  },
  {
    id: 'global-2',
    title: 'Release Notice',
    badge: 'Platform Admin',
    body: 'The February 25 maintenance release has completed successfully. The dataset annotation utilities are now available in the latest version.',
    timestamp: '1 day ago'
  }
];

export const messageRoles: MessageRole[] = [
  {
    id: 'task-assignee',
    label: 'Task Assignee',
    subtitle: 'Internal',
    unreadCount: 12,
    icon: 'user',
    roleMessages: [
      {
        id: 'assignee-1',
        title: 'New Annotation Task',
        badge: 'Project Owner',
        body: 'Mason Brooks assigned you to Batch 001 for the Point Cloud Fusion project.',
        timestamp: '30 minutes ago'
      },
      {
        id: 'assignee-2',
        title: 'Batch Priority Updated',
        badge: 'Project Owner',
        body: 'Batch 003 was moved to high priority. Please complete the remaining 82 items before end of day.',
        timestamp: '2 hours ago'
      }
    ]
  },
  {
    id: 'reviewer',
    label: 'Reviewer',
    subtitle: 'Quality review queue',
    unreadCount: 5,
    icon: 'checks',
    roleMessages: [
      {
        id: 'reviewer-1',
        title: 'Review Queue Ready',
        badge: 'QA Lead',
        body: 'Batch 004 is ready for quality review with 200 completed annotations waiting for validation.',
        timestamp: '45 minutes ago'
      },
      {
        id: 'reviewer-2',
        title: 'Sampling Requirement Updated',
        badge: 'QA Lead',
        body: 'The quality sampling requirement for the Streetlight Mapping project is now set to 15%.',
        timestamp: '4 hours ago'
      }
    ]
  },
  {
    id: 'project-owner',
    label: 'Project Owner',
    subtitle: 'Delivery and orchestration',
    unreadCount: 8,
    icon: 'workspace',
    roleMessages: [
      {
        id: 'owner-1',
        title: 'Batch Delivery Complete',
        badge: 'Delivery Lead',
        body: 'Batch 005 for Intersection Review has been completed and is ready for downstream acceptance.',
        timestamp: '15 minutes ago'
      },
      {
        id: 'owner-2',
        title: 'Client Feedback Received',
        badge: 'Client Review',
        body: 'Northstar Mobility requested a revised sample pack for the Warehouse Perception project.',
        timestamp: '1 hour ago'
      }
    ]
  }
];

export const totalUnreadBadgeCount = 3;
