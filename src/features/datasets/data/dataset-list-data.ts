export type DatasetStatusTone = 'blue' | 'green' | 'red' | 'gray';

export type DatasetListItem = {
  id: string;
  name: string;
  domain: 'Autonomous Driving' | 'Embodied Intelligence';
  taskType: '2D Object Detection' | '2D Semantic / Instance Segmentation' | '2D Pose Estimation';
  version: string;
  status: string;
  statusTone: DatasetStatusTone;
  source: 'Self-collected' | 'Web' | 'Client';
  updatedAt: string;
  owner: string;
  team: string;
  createdByMe: boolean;
  clientName: string;
  tags: string[];
  remarks: string;
  canManage: boolean;
  cloneAllowed: boolean;
  appendAllowed: boolean;
  deleteAllowed: boolean;
  disabledReason?: string;
};

export type RecycleBinItem = {
  id: string;
  name: string;
  deletedAt: string;
  retentionLeft: string;
  owner: string;
  team: string;
};

export const datasetFilterOptions = {
  domains: ['All', 'Autonomous Driving', 'Embodied Intelligence'],
  taskTypes: [
    'All',
    '2D Object Detection',
    '2D Semantic / Instance Segmentation',
    '2D Pose Estimation'
  ],
  statuses: [
    'All',
    'Importing',
    'Import exception',
    'Import complete',
    'ETL in progress',
    'ETL exception',
    'Unlabeled',
    'Auto labeling in progress',
    'Auto labeling exception',
    'Auto labeling complete',
    'Manual labeling in progress',
    'Quality review in progress',
    'Rework in progress',
    'Accepted',
    'Archived'
  ],
  sources: ['All', 'Self-collected', 'Web', 'Client']
} as const;

const baseDatasetList: DatasetListItem[] = [
  {
    id: 'DS-20260325-000127',
    name: 'Campus obstacle detection dataset',
    domain: 'Autonomous Driving',
    taskType: '2D Object Detection',
    version: 'V1.1',
    status: 'Accepted',
    statusTone: 'green',
    source: 'Client',
    updatedAt: '2026-03-25 14:23',
    owner: 'Mina Wang',
    team: 'Delivery Squad A',
    createdByMe: true,
    clientName: 'Smart Drive Client B',
    tags: ['Campus', 'Obstacle', 'Validation'],
    remarks: 'Used for first-phase auto-label model validation.',
    canManage: true,
    cloneAllowed: true,
    appendAllowed: true,
    deleteAllowed: true
  },
  {
    id: 'DS-20260325-000126',
    name: 'Indoor manipulator grasp segmentation set',
    domain: 'Embodied Intelligence',
    taskType: '2D Semantic / Instance Segmentation',
    version: 'V1.0',
    status: 'Auto labeling in progress',
    statusTone: 'blue',
    source: 'Self-collected',
    updatedAt: '2026-03-25 11:08',
    owner: 'Cheng Chen',
    team: 'Embodied Project Team',
    createdByMe: false,
    clientName: 'Internal',
    tags: ['Manipulator', 'Grasp', 'Indoor'],
    remarks: 'Ongoing segmentation benchmark for embodied workflows.',
    canManage: false,
    cloneAllowed: false,
    appendAllowed: false,
    deleteAllowed: false,
    disabledReason: 'You do not have permission to manage this dataset.'
  },
  {
    id: 'DS-20260324-000118',
    name: 'Urban crossing pose sample set',
    domain: 'Autonomous Driving',
    taskType: '2D Pose Estimation',
    version: 'V1.0',
    status: 'Unlabeled',
    statusTone: 'gray',
    source: 'Web',
    updatedAt: '2026-03-24 19:46',
    owner: 'Victor Liu',
    team: 'Vision Algorithm Team',
    createdByMe: false,
    clientName: 'Internal',
    tags: ['Crossing', 'Pose', 'Pedestrian'],
    remarks: 'Source samples waiting for first labeling pass.',
    canManage: false,
    cloneAllowed: false,
    appendAllowed: false,
    deleteAllowed: false,
    disabledReason: 'You do not have permission to manage this dataset.'
  },
  {
    id: 'DS-20260324-000113',
    name: 'Parking lot edge-case supplement',
    domain: 'Autonomous Driving',
    taskType: '2D Object Detection',
    version: 'V1.0',
    status: 'ETL exception',
    statusTone: 'red',
    source: 'Client',
    updatedAt: '2026-03-24 15:12',
    owner: 'Chang Liu',
    team: 'Client Delivery Team',
    createdByMe: false,
    clientName: 'Mobility Client A',
    tags: ['Parking', 'Edge case', 'Detection'],
    remarks: 'Blocked by calibration field remapping issue.',
    canManage: false,
    cloneAllowed: false,
    appendAllowed: false,
    deleteAllowed: false,
    disabledReason: 'You do not have permission to manage this dataset.'
  },
  {
    id: 'DS-20260323-000099',
    name: 'Warehouse transport segmentation import test',
    domain: 'Embodied Intelligence',
    taskType: '2D Semantic / Instance Segmentation',
    version: 'V1.0',
    status: 'Importing',
    statusTone: 'blue',
    source: 'Self-collected',
    updatedAt: '2026-03-23 10:32',
    owner: 'Mina Wang',
    team: 'Delivery Squad A',
    createdByMe: true,
    clientName: 'Internal',
    tags: ['Warehouse', 'Transport', 'Segmentation'],
    remarks: 'Activation validation pending after import probe.',
    canManage: true,
    cloneAllowed: false,
    appendAllowed: false,
    deleteAllowed: false,
    disabledReason: 'Current state does not support this action.'
  },
  {
    id: 'DS-20260322-000091',
    name: 'Depot pedestrian detection benchmark',
    domain: 'Autonomous Driving',
    taskType: '2D Object Detection',
    version: 'V1.2',
    status: 'Auto labeling complete',
    statusTone: 'green',
    source: 'Self-collected',
    updatedAt: '2026-03-22 17:40',
    owner: 'Alex Chen',
    team: 'Delivery Squad B',
    createdByMe: true,
    clientName: 'Internal',
    tags: ['Depot', 'Pedestrian', 'Benchmark'],
    remarks: 'Ready for review and retention decision.',
    canManage: true,
    cloneAllowed: true,
    appendAllowed: true,
    deleteAllowed: true
  },
  {
    id: 'DS-20260321-000082',
    name: 'Robot arm picking quality set',
    domain: 'Embodied Intelligence',
    taskType: '2D Pose Estimation',
    version: 'V0.9',
    status: 'Quality review in progress',
    statusTone: 'blue',
    source: 'Client',
    updatedAt: '2026-03-21 13:05',
    owner: 'Lena Xu',
    team: 'QA Robotics Team',
    createdByMe: false,
    clientName: 'Factory Robotics Client',
    tags: ['Robot arm', 'Pose', 'Review'],
    remarks: 'Manual review result under quality inspection.',
    canManage: false,
    cloneAllowed: false,
    appendAllowed: false,
    deleteAllowed: false,
    disabledReason: 'You do not have permission to manage this dataset.'
  },
  {
    id: 'DS-20260319-000061',
    name: 'Highway lane segmentation archive',
    domain: 'Autonomous Driving',
    taskType: '2D Semantic / Instance Segmentation',
    version: 'V2.0',
    status: 'Archived',
    statusTone: 'gray',
    source: 'Client',
    updatedAt: '2026-03-19 09:18',
    owner: 'Nina Zhao',
    team: 'Archive Team',
    createdByMe: false,
    clientName: 'Smart Road Client',
    tags: ['Highway', 'Lane', 'Archive'],
    remarks: 'Historical dataset retained for audit only.',
    canManage: true,
    cloneAllowed: true,
    appendAllowed: false,
    deleteAllowed: true,
    disabledReason: 'Archived datasets do not support append.'
  }
];

const ownerNames = [
  'Mina Wang',
  'Cheng Chen',
  'Victor Liu',
  'Chang Liu',
  'Alex Chen',
  'Lena Xu',
  'Nina Zhao',
  'Leo Yang',
  'Eva Sun',
  'Jason He'
] as const;

const teamNames = [
  'Delivery Squad A',
  'Embodied Project Team',
  'Vision Algorithm Team',
  'Client Delivery Team',
  'Delivery Squad B',
  'QA Robotics Team',
  'Archive Team',
  'Data Ops Team'
] as const;

const datasetNameSuffixes = [
  'dataset',
  'batch',
  'sample set',
  'benchmark',
  'supplement',
  'archive',
  'validation set',
  'review pack'
] as const;

export const datasetList: DatasetListItem[] = Array.from({ length: 30 }, (_, index) => {
  const template = baseDatasetList[index % baseDatasetList.length];
  if (index < baseDatasetList.length) return template;

  const serial = String(127 - index).padStart(6, '0');
  const day = String(25 - (index % 9)).padStart(2, '0');
  const hour = String(9 + (index % 10)).padStart(2, '0');
  const minute = String((index * 7) % 60).padStart(2, '0');
  const nameSuffix = datasetNameSuffixes[index % datasetNameSuffixes.length];
  const owner = ownerNames[index % ownerNames.length];
  const team = teamNames[index % teamNames.length];

  return {
    ...template,
    id: `DS-202603${day}-${serial}`,
    name: `${template.name.replace(/ dataset| set| benchmark| archive/i, '')} ${nameSuffix}`,
    version: `V${1 + (index % 3)}.${index % 4}`,
    updatedAt: `2026-03-${day} ${hour}:${minute}`,
    owner,
    team,
    createdByMe: index % 3 === 0,
    clientName: template.source === 'Client' ? `Client ${(index % 6) + 1}` : template.clientName,
    tags: [...template.tags.slice(0, 2), `Batch ${index + 1}`],
    remarks: `${template.remarks} Generated sample row ${index + 1}.`
  };
});

export const recycleBinList: RecycleBinItem[] = [
  {
    id: 'DS-20260325-000127',
    name: 'Campus obstacle detection dataset',
    deletedAt: '2026-04-01 10:18',
    retentionLeft: '6 days 23 hours',
    owner: 'Mina Wang',
    team: 'Delivery Squad A'
  },
  {
    id: 'DS-20260318-000084',
    name: 'Embodied grasp verification set V2',
    deletedAt: '2026-03-31 16:42',
    retentionLeft: '6 days 06 hours',
    owner: 'Leo Yang',
    team: 'Delivery Squad B'
  }
];
