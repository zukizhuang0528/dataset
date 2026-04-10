import { datasetList } from '@/features/datasets/data/dataset-list-data';

export type DatasetRecord = {
  id: string;
  name: string;
  createdAt?: string;
  domain: string;
  taskType: string;
  version: string;
  status: string;
  statusTone: 'brand' | 'success' | 'warning' | 'danger' | 'info';
  source: string;
  owner: string;
  team: string;
  updatedAt: string;
  files: number;
  size: string;
  throughput: string;
  description: string;
  tags: string[];
  summary: {
    importMethod: string;
    scope: string;
    storage: string;
    notes: string;
  };
  metrics: {
    autoPrecision: string;
    flaggedSamples: string;
    activeVersion: string;
  };
  lifecycle: Array<{
    code: string;
    title: string;
    description: string;
    state: 'done' | 'current' | 'upcoming';
  }>;
  resultVersions: Array<{
    id: string;
    title: string;
    meta: string;
    current?: boolean;
  }>;
  qualityStats: Array<{
    label: string;
    value: string;
  }>;
  config: {
    model: string;
    availableVersions: string[];
    selectedVersion: string;
    confidence: string;
    iou: string;
    classes: string[];
    scope: 'full' | 'directory';
    directories: Array<{
      name: string;
      selected: boolean;
      children: Array<{ name: string; selected: boolean }>;
    }>;
  };
};

export const datasets: DatasetRecord[] = [
  {
    id: 'DS-20260325-000127',
    name: 'Campus obstacle detection set',
    domain: 'Autonomous driving',
    taskType: '2D object detection',
    version: 'V1.1',
    status: 'Auto labeling complete',
    statusTone: 'success',
    source: 'Client',
    owner: 'Mina Walker',
    team: 'Delivery Squad A',
    createdAt: '2026-03-25 10:12',
    updatedAt: '2026-03-26 09:46',
    files: 4860,
    size: '1.72 GB',
    throughput: '1.8k files/hr',
    description:
      'A high-priority validation dataset that has already completed preprocessing and auto labeling. The next decision is whether to retain the current output or route it to manual review.',
    tags: ['Campus', 'Obstacle', 'Validation'],
    summary: {
      importMethod: 'Local upload',
      scope: 'Two selected directories during activation',
      storage: 'D:\\datasets\\campus\\obstacle_detection\\v1',
      notes:
        'The active result version is currently suitable for visual inspection and decision review.'
    },
    metrics: {
      autoPrecision: '93.4%',
      flaggedSamples: '126 / 4,860',
      activeVersion: 'R3'
    },
    lifecycle: [
      {
        code: 'ING',
        title: 'Imported',
        description: 'Source package validated and mounted into the workspace.',
        state: 'done'
      },
      {
        code: 'ETL',
        title: 'Preprocessing',
        description: 'Workflow completed without blocking errors.',
        state: 'done'
      },
      {
        code: 'RDY',
        title: 'Ready',
        description: 'Dataset now follows the platform schema and storage layout.',
        state: 'done'
      },
      {
        code: 'AUTO',
        title: 'Auto labeling',
        description: 'R3 is the active result version and can be reviewed.',
        state: 'current'
      },
      {
        code: 'MAN',
        title: 'Manual review',
        description: 'Manual review has not started yet.',
        state: 'upcoming'
      }
    ],
    resultVersions: [
      {
        id: 'R3',
        title: 'Human-corrected result',
        meta: 'Created on 2026-03-28 16:20 · Active output version',
        current: true
      },
      {
        id: 'R2',
        title: 'YOLOv11 v11.3 review snapshot',
        meta: 'Created on 2026-03-27 11:08 · Available for comparison'
      },
      {
        id: 'R1',
        title: 'YOLOv11 v11.2 initial run',
        meta: 'Created on 2026-03-26 18:40 · Baseline result'
      }
    ],
    qualityStats: [
      { label: 'Missed objects', value: '54' },
      { label: 'Wrong class', value: '31' },
      { label: 'Geometry issues', value: '28' },
      { label: 'Other feedback', value: '13' }
    ],
    config: {
      model: 'YOLOv11',
      availableVersions: ['v11.2', 'v11.1', 'v11.0'],
      selectedVersion: 'v11.2',
      confidence: '0.45',
      iou: '0.50',
      classes: ['vehicle', 'pedestrian', 'cone'],
      scope: 'directory',
      directories: [
        {
          name: 'batch_01',
          selected: true,
          children: [
            { name: 'images_daytime', selected: true },
            { name: 'images_night', selected: false },
            { name: 'images_rainy', selected: true }
          ]
        },
        {
          name: 'batch_02',
          selected: false,
          children: [
            { name: 'images_crossroad', selected: false },
            { name: 'images_parking', selected: false }
          ]
        }
      ]
    }
  },
  {
    id: 'DS-20260401-000127',
    name: 'Lidar fusion production batch',
    domain: 'Autonomous driving',
    taskType: '4D sensor fusion',
    version: 'V1.0',
    status: 'Preprocessing in progress',
    statusTone: 'warning',
    source: 'Self-collected',
    owner: 'Noah Bennett',
    team: 'Delivery Squad B',
    createdAt: '2026-04-01 08:24',
    updatedAt: '2026-04-02 09:46',
    files: 12580,
    size: '6.84 GB',
    throughput: '2.4k files/hr',
    description:
      'A large fusion batch currently progressing through ETL. Recommended workflow has already been loaded, but final activation is still pending.',
    tags: ['Lidar', 'Fusion', 'Production'],
    summary: {
      importMethod: 'Bucket mount',
      scope: 'Full mounted directory',
      storage: '/mnt/production/lidar_fusion/batch_v1',
      notes:
        'Calibration parsing is still running and downstream auto labeling is not available yet.'
    },
    metrics: {
      autoPrecision: '—',
      flaggedSamples: 'Pending',
      activeVersion: 'Not generated'
    },
    lifecycle: [
      {
        code: 'ING',
        title: 'Imported',
        description: 'Source mounted successfully.',
        state: 'done'
      },
      {
        code: 'ETL',
        title: 'Preprocessing',
        description: 'Workflow is still executing on calibration-heavy nodes.',
        state: 'current'
      },
      {
        code: 'RDY',
        title: 'Ready',
        description: 'Readiness checkpoint is waiting on ETL completion.',
        state: 'upcoming'
      },
      {
        code: 'AUTO',
        title: 'Auto labeling',
        description: 'This stage will start after ETL completion.',
        state: 'upcoming'
      },
      {
        code: 'MAN',
        title: 'Manual review',
        description: 'Manual review is not yet applicable.',
        state: 'upcoming'
      }
    ],
    resultVersions: [],
    qualityStats: [
      { label: 'Current blocker', value: 'Calibration node load' },
      { label: 'Retry count', value: '1' },
      { label: 'Pending folders', value: '18' },
      { label: 'Escalations', value: '0' }
    ],
    config: {
      model: 'YOLOv11',
      availableVersions: ['v11.1', 'v11.0'],
      selectedVersion: 'v11.1',
      confidence: '0.42',
      iou: '0.46',
      classes: ['vehicle', 'cyclist'],
      scope: 'full',
      directories: [
        {
          name: 'full_dataset',
          selected: true,
          children: [
            { name: 'sensors_front', selected: true },
            { name: 'sensors_rear', selected: true }
          ]
        }
      ]
    }
  },
  {
    id: 'DS-20260324-000118',
    name: 'Roadside calibration recovery',
    domain: 'Autonomous driving',
    taskType: '3D perception',
    version: 'V0.9',
    status: 'ETL exception',
    statusTone: 'danger',
    source: 'Client',
    owner: 'Avery Turner',
    team: 'Calibration Unit',
    createdAt: '2026-03-23 16:30',
    updatedAt: '2026-03-24 15:12',
    files: 3120,
    size: '2.43 GB',
    throughput: '—',
    description:
      'A calibration parsing exception stopped the ETL flow. Field remapping and node rerun are required before the dataset can move downstream.',
    tags: ['Calibration', 'Recovery'],
    summary: {
      importMethod: 'Cloud download',
      scope: 'Three top-level folders imported',
      storage: '/mnt/recovery/calibration/roadside_v09',
      notes: 'This dataset is blocked by a field mapping exception in the calibration node.'
    },
    metrics: {
      autoPrecision: '—',
      flaggedSamples: 'Blocked',
      activeVersion: 'Not generated'
    },
    lifecycle: [
      {
        code: 'ING',
        title: 'Imported',
        description: 'Source package validated and extracted.',
        state: 'done'
      },
      {
        code: 'ETL',
        title: 'Preprocessing',
        description: 'A field remapping error is blocking workflow completion.',
        state: 'current'
      },
      {
        code: 'RDY',
        title: 'Ready',
        description: 'Readiness cannot be evaluated before ETL reruns.',
        state: 'upcoming'
      },
      {
        code: 'AUTO',
        title: 'Auto labeling',
        description: 'Unavailable until preprocessing succeeds.',
        state: 'upcoming'
      },
      {
        code: 'MAN',
        title: 'Manual review',
        description: 'Unavailable until the dataset has a retained result version.',
        state: 'upcoming'
      }
    ],
    resultVersions: [],
    qualityStats: [
      { label: 'Error type', value: 'Field remapping' },
      { label: 'Affected files', value: '2 / 6 calibration files' },
      { label: 'Last rerun', value: '2026-03-24 15:08' },
      { label: 'Suggested action', value: 'Open exception handler' }
    ],
    config: {
      model: 'YOLOX-Pose',
      availableVersions: ['v11.0'],
      selectedVersion: 'v11.0',
      confidence: '0.35',
      iou: '0.45',
      classes: ['vehicle', 'pedestrian'],
      scope: 'directory',
      directories: [
        {
          name: 'calibration',
          selected: true,
          children: [
            { name: 'front_camera', selected: true },
            { name: 'rear_camera', selected: false }
          ]
        }
      ]
    }
  }
];

export function getDatasetById(id: string): DatasetRecord | undefined {
  const existing = datasets.find((dataset) => dataset.id === id);
  if (existing) return existing;

  const source = datasetList.find((dataset) => dataset.id === id);
  if (!source) return undefined;

  const toneMap = {
    blue: 'info',
    green: 'success',
    red: 'danger',
    gray: 'warning'
  } as const;

  const preprocessingState: 'current' | 'done' = source.status.includes('ETL') ? 'current' : 'done';
  const readyState: 'done' | 'upcoming' =
    source.status === 'Importing' || source.status === 'Import exception' ? 'upcoming' : 'done';
  const autoLabelingState: 'current' | 'done' | 'upcoming' = source.status.includes('Auto labeling')
    ? 'current'
    : source.status === 'Unlabeled'
      ? 'upcoming'
      : 'done';
  const manualReviewState: 'current' | 'done' | 'upcoming' =
    source.status.includes('Manual') ||
    source.status.includes('Quality review') ||
    source.status.includes('Rework')
      ? 'current'
      : source.status === 'Accepted' || source.status === 'Archived'
        ? 'done'
        : 'upcoming';

  return {
    id: source.id,
    name: source.name,
    domain: source.domain,
    taskType: source.taskType,
    version: source.version,
    status: source.status,
    statusTone: toneMap[source.statusTone],
    source: source.source,
    owner: source.owner,
    team: source.team,
    createdAt: `${source.updatedAt.slice(0, 10)} 10:12`,
    updatedAt: source.updatedAt,
    files: 2480,
    size: '1.28 GB',
    throughput: '1.2k files/hr',
    description:
      'This dataset was generated from list metadata to keep the detail route available during prototype verification. The structure follows the same operational pattern as the fully configured datasets.',
    tags: source.tags,
    summary: {
      importMethod:
        source.source === 'Client'
          ? 'Client package import'
          : source.source === 'Web'
            ? 'Web source import'
            : 'Local upload',
      scope: 'Current active dataset scope',
      storage: `/mnt/datasets/${source.id.toLowerCase()}`,
      notes: source.remarks
    },
    metrics: {
      autoPrecision: source.statusTone === 'green' ? '91.6%' : 'Pending',
      flaggedSamples: source.statusTone === 'red' ? 'Blocked' : '84 / 2,480',
      activeVersion: source.version
    },
    lifecycle: [
      {
        code: 'ING',
        title: 'Imported',
        description: 'Source package validated and registered.',
        state: 'done'
      },
      {
        code: 'ETL',
        title: 'Preprocessing',
        description: 'Preprocessing status follows the current dataset lifecycle.',
        state: preprocessingState
      },
      {
        code: 'RDY',
        title: 'Ready',
        description: 'Dataset schema activation has been completed.',
        state: readyState
      },
      {
        code: 'AUTO',
        title: 'Auto labeling',
        description: 'Auto-label execution reflects the current row state.',
        state: autoLabelingState
      },
      {
        code: 'MAN',
        title: 'Manual review',
        description: 'Manual review starts after an operator retention decision.',
        state: manualReviewState
      }
    ],
    resultVersions: [
      {
        id: 'R1',
        title: 'List-derived result snapshot',
        meta: `Generated from ${source.version} · Current route-compatible fallback`,
        current: true
      }
    ],
    qualityStats: [
      { label: 'Current status', value: source.status },
      { label: 'Owner', value: source.owner },
      { label: 'Team', value: source.team },
      { label: 'Source', value: source.source }
    ],
    config: {
      model: 'YOLOv11',
      availableVersions: ['v11.2', 'v11.1', 'v11.0'],
      selectedVersion: 'v11.2',
      confidence: '0.45',
      iou: '0.50',
      classes:
        source.taskType === '2D Pose Estimation'
          ? ['pedestrian', 'cyclist']
          : ['vehicle', 'pedestrian', 'cone'],
      scope: 'full',
      directories: [
        {
          name: 'full_dataset',
          selected: true,
          children: [
            { name: 'batch_01', selected: true },
            { name: 'batch_02', selected: true }
          ]
        }
      ]
    }
  };
}
