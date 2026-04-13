export type RoleStatus = 'Enabled' | 'Disabled';
export type DataPermissionScope =
  | 'all-data'
  | 'owned-project-data'
  | 'owned-team-data'
  | 'personal-data';
export type AuditOperationType =
  | 'Role Operation'
  | 'Permission Change'
  | 'User Binding'
  | 'System Operation';
export type AuditStatus = 'Success' | 'Failed';

export type PermissionRoleRecord = {
  id: string;
  sequence: number;
  name: string;
  description: string;
  assignedUsers: number;
  status: RoleStatus;
  createdAt: string;
};

export type PermissionAuditLogRecord = {
  id: string;
  operatedAt: string;
  operator: string;
  operationType: AuditOperationType;
  content: string;
  ipAddress: string;
  status: AuditStatus;
};

export const roleStatusOptions = ['All Statuses', 'Enabled', 'Disabled'] as const;
export const auditOperationTypeOptions = [
  'All Types',
  'Role Operation',
  'Permission Change',
  'User Binding',
  'System Operation'
] as const;

export const dataPermissionScopes: {
  id: DataPermissionScope;
  title: string;
  description: string;
  helper: string;
}[] = [
  {
    id: 'all-data',
    title: 'All Data',
    description: 'Access all datasets across the platform.',
    helper: 'Can view every project, team, dataset, and task.'
  },
  {
    id: 'owned-project-data',
    title: 'Owned Project Data',
    description: 'Access datasets for projects this role owns.',
    helper: 'Can view datasets attached to owned projects.'
  },
  {
    id: 'owned-team-data',
    title: 'Owned Team Data',
    description: 'Access datasets within this role’s team scope.',
    helper: 'Can view datasets assigned to owned teams.'
  },
  {
    id: 'personal-data',
    title: 'Personal Data',
    description: 'Access only self-created or assigned task data.',
    helper: 'Can view personal submissions and assigned tasks.'
  }
];

export const permissionAuditLogs: PermissionAuditLogRecord[] = [
  {
    id: 'AUD-001',
    operatedAt: '2024-04-20 10:30:25',
    operator: 'Mina Walker',
    operationType: 'Role Operation',
    content: 'Created role: Pilot Reviewer',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: 'AUD-002',
    operatedAt: '2024-04-20 10:25:18',
    operator: 'Noah Bennett',
    operationType: 'Permission Change',
    content: 'Updated role permission: Data Owner',
    ipAddress: '192.168.1.101',
    status: 'Success'
  },
  {
    id: 'AUD-003',
    operatedAt: '2024-04-20 10:20:05',
    operator: 'Ava Turner',
    operationType: 'User Binding',
    content: 'Bound user role: jacob.mills -> Data Annotator',
    ipAddress: '192.168.1.102',
    status: 'Success'
  },
  {
    id: 'AUD-004',
    operatedAt: '2024-04-20 10:15:42',
    operator: 'Sophia Carter',
    operationType: 'Role Operation',
    content: 'Disabled role: Pilot Viewer',
    ipAddress: '192.168.1.103',
    status: 'Success'
  },
  {
    id: 'AUD-005',
    operatedAt: '2024-04-20 10:10:30',
    operator: 'Lucas Bennett',
    operationType: 'System Operation',
    content: 'Updated permission configuration defaults',
    ipAddress: '192.168.1.104',
    status: 'Success'
  },
  {
    id: 'AUD-006',
    operatedAt: '2024-04-20 10:05:15',
    operator: 'Charlotte Rivera',
    operationType: 'Permission Change',
    content: 'Batch assigned data scope permissions',
    ipAddress: '192.168.1.105',
    status: 'Success'
  },
  {
    id: 'AUD-007',
    operatedAt: '2024-04-20 10:00:00',
    operator: 'Mason Brooks',
    operationType: 'User Binding',
    content: 'Unbound user role: ethan.reed -> Vendor User',
    ipAddress: '192.168.1.106',
    status: 'Success'
  },
  {
    id: 'AUD-008',
    operatedAt: '2024-04-20 09:55:48',
    operator: 'Olivia Stone',
    operationType: 'Role Operation',
    content: 'Maintained role: Reporting Viewer',
    ipAddress: '192.168.1.107',
    status: 'Success'
  }
];

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
