export type RoleStatus = 'Enabled' | 'Disabled';

export type PermissionRoleRecord = {
  id: string;
  sequence: number;
  name: string;
  description: string;
  assignedUsers: number;
  status: RoleStatus;
  createdAt: string;
};

export const roleStatusOptions = ['All Statuses', 'Enabled', 'Disabled'] as const;

export const initialPermissionRoles: PermissionRoleRecord[] = [
  {
    id: 'ROLE-001',
    sequence: 1,
    name: 'System Administrator',
    description: 'Owns platform-wide configuration and privileged access policies.',
    assignedUsers: 5,
    status: 'Enabled',
    createdAt: '2024-01-15'
  },
  {
    id: 'ROLE-002',
    sequence: 2,
    name: 'Project Owner',
    description: 'Leads project setup, staffing, delivery control, and approvals.',
    assignedUsers: 12,
    status: 'Enabled',
    createdAt: '2024-01-20'
  },
  {
    id: 'ROLE-003',
    sequence: 3,
    name: 'Task Assignee (Internal)',
    description: 'Executes internally assigned annotation and completion tasks.',
    assignedUsers: 8,
    status: 'Enabled',
    createdAt: '2024-02-01'
  },
  {
    id: 'ROLE-004',
    sequence: 4,
    name: 'Data Annotator',
    description: 'Performs structured data labeling and task completion work.',
    assignedUsers: 45,
    status: 'Enabled',
    createdAt: '2024-02-10'
  },
  {
    id: 'ROLE-005',
    sequence: 5,
    name: 'Quality Reviewer',
    description: 'Monitors quality checkpoints, escalations, and release readiness.',
    assignedUsers: 15,
    status: 'Enabled',
    createdAt: '2024-02-15'
  },
  {
    id: 'ROLE-006',
    sequence: 6,
    name: 'Audit Analyst',
    description: 'Reviews audit evidence, policy exceptions, and access history.',
    assignedUsers: 3,
    status: 'Enabled',
    createdAt: '2024-02-20'
  },
  {
    id: 'ROLE-007',
    sequence: 7,
    name: 'Data Operations Manager',
    description: 'Manages dataset access, intake routing, and operational visibility.',
    assignedUsers: 6,
    status: 'Disabled',
    createdAt: '2024-03-01'
  },
  {
    id: 'ROLE-008',
    sequence: 8,
    name: 'Vendor Operations Manager',
    description: 'Manages supplier coordination, onboarding, and vendor access rules.',
    assignedUsers: 4,
    status: 'Enabled',
    createdAt: '2024-03-05'
  }
];
