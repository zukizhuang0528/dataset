export type ProjectListStatus = 'In Progress' | 'Not Started' | 'Completed';
export type BatchStatus = 'In Progress' | 'Not Started' | 'Completed';

export type ProjectListItem = {
  id: string;
  name: string;
  status: ProjectListStatus;
  batchCount: number;
  owner: string;
  publishDate: string;
};

export type BatchItem = {
  id: string;
  name: string;
  status: BatchStatus;
  businessType: string;
  itemCount: number;
  totalCount: number;
  owner: string;
  date?: string;
  progress: number;
};

export type ProjectDetail = {
  id: string;
  title: string;
  batches: BatchItem[];
};

export const projectListStatusOptions: Array<'All Statuses' | ProjectListStatus> = [
  'All Statuses',
  'In Progress',
  'Not Started',
  'Completed'
];

export const projectListSortOptions = ['Publish Date', 'Project Name'] as const;
export const batchStatusOptions: Array<'All Statuses' | BatchStatus> = [
  'All Statuses',
  'In Progress',
  'Not Started',
  'Completed'
];
export const batchSortOptions = ['Default Sort', 'Latest Updated'] as const;

export const projectListItems: ProjectListItem[] = [
  {
    id: 'project-2054',
    name: '2401 - Point Cloud Fusion',
    status: 'In Progress',
    batchCount: 5,
    owner: 'Mason Brooks',
    publishDate: '2025-05-24'
  },
  {
    id: 'project-2055',
    name: '2410 - Streetlight Mapping',
    status: 'In Progress',
    batchCount: 4,
    owner: 'Ava Turner',
    publishDate: '2025-05-24'
  },
  {
    id: 'project-2680',
    name: '2680 - Warehouse Perception',
    status: 'Not Started',
    batchCount: 5,
    owner: 'Noah Bennett',
    publishDate: '2025-05-23'
  },
  {
    id: 'project-2145-a',
    name: '2145 - Intersection Review',
    status: 'Completed',
    batchCount: 5,
    owner: 'Sophia Carter',
    publishDate: '2025-05-22'
  },
  {
    id: 'project-2145-b',
    name: '2146 - Intersection Review',
    status: 'Completed',
    batchCount: 5,
    owner: 'James Collins',
    publishDate: '2025-05-22'
  },
  {
    id: 'project-2145-c',
    name: '2147 - Indoor Robotics',
    status: 'Completed',
    batchCount: 3,
    owner: 'Charlotte Rivera',
    publishDate: '2025-05-22'
  },
  {
    id: 'project-2145-d',
    name: '2148 - Dock Safety Audit',
    status: 'Completed',
    batchCount: 6,
    owner: 'Liam Foster',
    publishDate: '2025-05-22'
  }
];

export const projectDetails: Record<string, ProjectDetail> = {
  'project-2054': {
    id: 'project-2054',
    title: '2401 - Point Cloud Fusion',
    batches: [
      {
        id: 'batch-2401-a',
        name: 'Batch 001',
        status: 'Not Started',
        businessType: 'Point Cloud Fusion',
        itemCount: 200,
        totalCount: 2000,
        owner: 'Ethan Hall',
        progress: 0
      },
      {
        id: 'batch-2401-b',
        name: 'Batch 002',
        status: 'In Progress',
        businessType: 'Point Cloud Fusion',
        itemCount: 200,
        totalCount: 2000,
        owner: 'Ethan Hall',
        progress: 64
      },
      {
        id: 'batch-2401-c',
        name: 'Batch 003',
        status: 'In Progress',
        businessType: 'Point Cloud Fusion',
        itemCount: 200,
        totalCount: 2000,
        owner: 'Ethan Hall',
        date: '05/24-06/10',
        progress: 64
      },
      {
        id: 'batch-2401-d',
        name: 'Batch 004',
        status: 'Completed',
        businessType: 'Point Cloud Fusion',
        itemCount: 200,
        totalCount: 2000,
        owner: 'Ethan Hall',
        date: '05/24-06/10',
        progress: 100
      },
      {
        id: 'batch-2401-e',
        name: 'Batch 005',
        status: 'Completed',
        businessType: 'Point Cloud Fusion',
        itemCount: 200,
        totalCount: 2000,
        owner: 'Ethan Hall',
        date: '05/24-06/10',
        progress: 100
      }
    ]
  },
  'project-2055': {
    id: 'project-2055',
    title: '2410 - Streetlight Mapping',
    batches: [
      {
        id: 'batch-2055-a',
        name: 'Batch 001',
        status: 'In Progress',
        businessType: 'Streetlight Mapping',
        itemCount: 180,
        totalCount: 1800,
        owner: 'Lina Brooks',
        progress: 38
      }
    ]
  },
  'project-2680': {
    id: 'project-2680',
    title: '2680 - Warehouse Perception',
    batches: [
      {
        id: 'batch-2680-a',
        name: 'Batch 001',
        status: 'Not Started',
        businessType: 'Warehouse Perception',
        itemCount: 240,
        totalCount: 2400,
        owner: 'Caleb Brooks',
        progress: 0
      }
    ]
  },
  'project-2145-a': {
    id: 'project-2145-a',
    title: '2145 - Intersection Review',
    batches: [
      {
        id: 'batch-2145-a',
        name: 'Batch 001',
        status: 'Completed',
        businessType: 'Intersection Review',
        itemCount: 220,
        totalCount: 2200,
        owner: 'Olivia Turner',
        date: '05/24-06/10',
        progress: 100
      }
    ]
  }
};
