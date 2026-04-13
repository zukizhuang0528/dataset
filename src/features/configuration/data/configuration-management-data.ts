export type VersionStatus = 'Enabled' | 'Disabled';
export type ServiceModuleId = 'collection' | 'annotation' | 'model-training';
export type AnnotationServiceModeId = 'self-managed' | 'subcontracted' | 'crowdsourced';
export type ConfigurationLogOperationType =
  | 'Version Operation'
  | 'Service Configuration'
  | 'System Configuration';
export type ConfigurationLogStatus = 'Success' | 'Failed';
export type AnnotationDataTypeId =
  | 'text-qa-optimization'
  | 'text-intent-relation'
  | 'text-classification'
  | 'text-question-generation'
  | 'text-statistical-definition'
  | 'text-multi-text'
  | 'speech-transcription'
  | 'speech-speaker-labeling'
  | 'speech-timestamp'
  | 'speech-synthetic-audio'
  | 'speech-text'
  | 'speech-diarization'
  | 'speech-intent'
  | 'image-bounding-box'
  | 'image-mask'
  | 'image-semantic'
  | 'point-cloud-fusion'
  | 'point-cloud-segmentation'
  | 'point-cloud-4d-lane'
  | 'video-subtitle'
  | 'vla-target';

export type VersionRecord = {
  id: string;
  sequence: number;
  name: string;
  version: string;
  status: VersionStatus;
  createdAt: string;
  updatedAt: string;
};

export type ConfigurationLogRecord = {
  id: string;
  operatedAt: string;
  operator: string;
  operationType: ConfigurationLogOperationType;
  content: string;
  ipAddress: string;
  status: ConfigurationLogStatus;
};

export const versionStatusOptions = ['All Statuses', 'Enabled', 'Disabled'] as const;
export const configurationLogOperationTypeOptions = [
  'All Types',
  'Version Operation',
  'Service Configuration',
  'System Configuration'
] as const;

export const serviceModules: {
  id: ServiceModuleId;
  title: string;
  description: string;
}[] = [
  {
    id: 'collection',
    title: 'Data Collection Service',
    description: 'Enable collection workflows for source intake, task routing, and field capture.'
  },
  {
    id: 'annotation',
    title: 'Annotation Service',
    description: 'Configure annotation service modes and supported data types.'
  },
  {
    id: 'model-training',
    title: 'Model Training Service',
    description: 'Enable training workflows for model iteration, evaluation, and release support.'
  }
];

export const annotationServiceModes: {
  id: AnnotationServiceModeId;
  title: string;
  description: string;
}[] = [
  {
    id: 'self-managed',
    title: 'Self-managed Annotation',
    description: 'Internal team annotation service.'
  },
  {
    id: 'subcontracted',
    title: 'Subcontracted Service',
    description: 'Vendor-delivered annotation service.'
  },
  {
    id: 'crowdsourced',
    title: 'Crowdsourced Service',
    description: 'Distributed workforce annotation service.'
  }
];

export const annotationDataTypes: {
  group:
    | 'Text Annotation'
    | 'Speech Annotation'
    | 'Image Annotation'
    | 'Point Cloud Annotation'
    | 'Video Annotation'
    | 'VLA Annotation';
  items: {
    id: AnnotationDataTypeId;
    label: string;
  }[];
}[] = [
  {
    group: 'Text Annotation',
    items: [
      { id: 'text-qa-optimization', label: 'QA Optimization Annotation' },
      { id: 'text-intent-relation', label: 'Intent Relation Annotation' },
      { id: 'text-classification', label: 'Classification Annotation' },
      { id: 'text-question-generation', label: 'Question Generation Annotation' },
      { id: 'text-statistical-definition', label: 'Statistical Definition Annotation' },
      { id: 'text-multi-text', label: 'Multi-text Annotation' }
    ]
  },
  {
    group: 'Speech Annotation',
    items: [
      { id: 'speech-transcription', label: 'Recording Transcription' },
      { id: 'speech-speaker-labeling', label: 'Speaker Labeling' },
      { id: 'speech-timestamp', label: 'Timestamp Annotation' },
      { id: 'speech-synthetic-audio', label: 'Synthetic Audio Annotation' },
      { id: 'speech-text', label: 'Text Annotation' },
      { id: 'speech-diarization', label: 'Speaker Diarization Annotation' },
      { id: 'speech-intent', label: 'Intent Annotation' }
    ]
  },
  {
    group: 'Image Annotation',
    items: [
      { id: 'image-bounding-box', label: 'Bounding Box Annotation' },
      { id: 'image-mask', label: 'Mask Annotation' },
      { id: 'image-semantic', label: 'Semantic Segmentation' }
    ]
  },
  {
    group: 'Point Cloud Annotation',
    items: [
      { id: 'point-cloud-fusion', label: 'Point Cloud Fusion' },
      { id: 'point-cloud-segmentation', label: 'Point Cloud Segmentation' },
      { id: 'point-cloud-4d-lane', label: '4D Lane Annotation' }
    ]
  },
  {
    group: 'Video Annotation',
    items: [{ id: 'video-subtitle', label: 'Video Subtitle Annotation' }]
  },
  {
    group: 'VLA Annotation',
    items: [{ id: 'vla-target', label: 'VLA Target Annotation' }]
  }
];

export const initialVersionRecords: VersionRecord[] = [
  {
    id: 'VER-001',
    sequence: 1,
    name: 'Foundation Plan',
    version: '1.0.0',
    status: 'Enabled',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'VER-002',
    sequence: 2,
    name: 'Standard Plan',
    version: '2.0.0',
    status: 'Enabled',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-15'
  },
  {
    id: 'VER-003',
    sequence: 3,
    name: 'Professional Plan',
    version: '3.0.0',
    status: 'Disabled',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05'
  },
  {
    id: 'VER-004',
    sequence: 4,
    name: 'Enterprise Plan',
    version: '4.0.0',
    status: 'Enabled',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-10'
  },
  {
    id: 'VER-005',
    sequence: 5,
    name: 'Pilot Plan',
    version: '5.0.0-beta',
    status: 'Disabled',
    createdAt: '2024-04-20',
    updatedAt: '2024-04-20'
  }
];

export const configurationAuditLogs: ConfigurationLogRecord[] = [
  {
    id: 'CFG-AUD-001',
    operatedAt: '2024-04-20 10:30:25',
    operator: 'Mina Walker',
    operationType: 'Version Operation',
    content: 'Created version: Pilot Plan',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: 'CFG-AUD-002',
    operatedAt: '2024-04-20 10:25:18',
    operator: 'Noah Bennett',
    operationType: 'Service Configuration',
    content: 'Updated annotation service configuration',
    ipAddress: '192.168.1.101',
    status: 'Success'
  },
  {
    id: 'CFG-AUD-003',
    operatedAt: '2024-04-20 10:20:05',
    operator: 'Ava Turner',
    operationType: 'Service Configuration',
    content: 'Enabled crowdsourced annotation service',
    ipAddress: '192.168.1.102',
    status: 'Success'
  },
  {
    id: 'CFG-AUD-004',
    operatedAt: '2024-04-20 10:15:42',
    operator: 'Sophia Carter',
    operationType: 'Version Operation',
    content: 'Published version: Enterprise Plan',
    ipAddress: '192.168.1.103',
    status: 'Success'
  },
  {
    id: 'CFG-AUD-005',
    operatedAt: '2024-04-20 10:10:30',
    operator: 'Lucas Bennett',
    operationType: 'System Configuration',
    content: 'Updated system configuration defaults',
    ipAddress: '192.168.1.104',
    status: 'Success'
  },
  {
    id: 'CFG-AUD-006',
    operatedAt: '2024-04-20 10:05:15',
    operator: 'Charlotte Rivera',
    operationType: 'Service Configuration',
    content: 'Changed collection service endpoint URL',
    ipAddress: '192.168.1.105',
    status: 'Success'
  },
  {
    id: 'CFG-AUD-007',
    operatedAt: '2024-04-20 10:00:00',
    operator: 'Mason Brooks',
    operationType: 'Version Operation',
    content: 'Rolled back version: Professional Plan',
    ipAddress: '192.168.1.106',
    status: 'Success'
  },
  {
    id: 'CFG-AUD-008',
    operatedAt: '2024-04-20 09:55:48',
    operator: 'Olivia Stone',
    operationType: 'Service Configuration',
    content: 'Updated model training service allocation',
    ipAddress: '192.168.1.107',
    status: 'Success'
  }
];
