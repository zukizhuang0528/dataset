import { NavGroup } from '@/types';
export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Welcome',
        url: '/dashboard/welcome',
        icon: 'dashboard',
        shortcut: ['w', 'e'],
        isActive: false,
        items: []
      },
      {
        title: 'Dataset Management',
        url: '/dashboard/datasets',
        icon: 'workspace',
        shortcut: ['d', 's'],
        isActive: false,
        items: []
      },
      {
        title: 'User Management',
        url: '/dashboard/people',
        icon: 'teams',
        shortcut: ['p', 'e'],
        isActive: false,
        items: []
      },
      {
        title: 'Permission Management',
        url: '/dashboard/permissions',
        icon: 'lock',
        shortcut: ['p', 'm'],
        isActive: false,
        items: []
      },
      {
        title: 'Configuration Management',
        url: '/dashboard/configuration',
        icon: 'settings',
        shortcut: ['c', 'm'],
        isActive: false,
        items: []
      },
      {
        title: 'Team Management',
        url: '/dashboard/teams',
        icon: 'workspace',
        shortcut: ['t', 'e'],
        isActive: false,
        items: []
      },
      {
        title: 'Vendor Management',
        url: '/dashboard/vendors',
        icon: 'product',
        shortcut: ['v', 'e'],
        isActive: false,
        items: []
      },
      {
        title: 'Project Management',
        url: '/dashboard/projects',
        icon: 'kanban',
        shortcut: ['p', 'r'],
        isActive: false,
        items: []
      }
    ]
  }
];
