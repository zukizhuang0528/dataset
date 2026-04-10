export type VendorReviewStatus = 'Approved' | 'Pending Review' | 'Rejected';

export type VendorBusinessType =
  | 'Finished Data Usage Transfer'
  | 'Data Annotation'
  | 'Data Collection'
  | 'Text Production'
  | 'Translation'
  | 'Human Resources'
  | 'Other';

export type AnnotationSpecialty =
  | '2D Image Annotation'
  | '3D Annotation'
  | 'Video Annotation'
  | 'NLP Annotation'
  | 'ASR Annotation'
  | 'OCR Annotation'
  | 'Other';

export type CollectionSpecialty =
  | 'Audio Collection'
  | 'TTS Collection'
  | 'Video Collection'
  | 'Image Collection'
  | 'Face Collection';

export type ResourceScope =
  | 'Domestic Resources'
  | 'Overseas Resources'
  | 'Domestic + Overseas Resources';

export type SpecialResource =
  | 'School / Government Partnerships'
  | 'Celebrity Resources'
  | 'Equipment Resources'
  | 'Other'
  | 'None';

export type VendorRecord = {
  id: string;
  sequence: number;
  companyName: string;
  unifiedCreditCode: string;
  establishedAt: string;
  fullTimeStaffCount: number;
  bachelorRatio: string;
  contactName: string;
  contactPhone: string;
  businessType: VendorBusinessType;
  annotationTypes: AnnotationSpecialty[];
  collectionTypes: CollectionSpecialty[];
  resourceScope: ResourceScope;
  specialResource: SpecialResource;
  reviewStatus: VendorReviewStatus;
};

export const vendorReviewTabs: Array<{
  label: string;
  value: 'All' | VendorReviewStatus;
}> = [
  { label: 'All', value: 'All' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Pending Review', value: 'Pending Review' },
  { label: 'Rejected', value: 'Rejected' }
];

export const vendorBusinessTypeOptions: VendorBusinessType[] = [
  'Finished Data Usage Transfer',
  'Data Annotation',
  'Data Collection',
  'Text Production',
  'Translation',
  'Human Resources',
  'Other'
];

export const annotationSpecialtyOptions: AnnotationSpecialty[] = [
  '2D Image Annotation',
  '3D Annotation',
  'Video Annotation',
  'NLP Annotation',
  'ASR Annotation',
  'OCR Annotation',
  'Other'
];

export const collectionSpecialtyOptions: CollectionSpecialty[] = [
  'Audio Collection',
  'TTS Collection',
  'Video Collection',
  'Image Collection',
  'Face Collection'
];

export const resourceScopeOptions: ResourceScope[] = [
  'Domestic Resources',
  'Overseas Resources',
  'Domestic + Overseas Resources'
];

export const specialResourceOptions: SpecialResource[] = [
  'School / Government Partnerships',
  'Celebrity Resources',
  'Equipment Resources',
  'Other'
];

export const vendorRecords: VendorRecord[] = [
  {
    id: 'VDR-001',
    sequence: 1,
    companyName: 'North Harbor Annotation Labs',
    unifiedCreditCode: '84-3819021',
    establishedAt: '2018-05-12',
    fullTimeStaffCount: 200,
    bachelorRatio: '85%',
    contactName: 'Ethan Brooks',
    contactPhone: '+1 (415) 555-0184',
    businessType: 'Data Annotation',
    annotationTypes: ['3D Annotation', 'Video Annotation'],
    collectionTypes: ['Image Collection'],
    resourceScope: 'Domestic Resources',
    specialResource: 'None',
    reviewStatus: 'Pending Review'
  },
  {
    id: 'VDR-002',
    sequence: 2,
    companyName: 'Blue Ridge Capture Services',
    unifiedCreditCode: '92-4701168',
    establishedAt: '2019-03-20',
    fullTimeStaffCount: 150,
    bachelorRatio: '78%',
    contactName: 'Ava Carter',
    contactPhone: '+1 (646) 555-0128',
    businessType: 'Data Collection',
    annotationTypes: ['OCR Annotation'],
    collectionTypes: ['Audio Collection', 'TTS Collection'],
    resourceScope: 'Domestic + Overseas Resources',
    specialResource: 'Celebrity Resources',
    reviewStatus: 'Rejected'
  },
  {
    id: 'VDR-003',
    sequence: 3,
    companyName: 'Pacific Vertex Engineering',
    unifiedCreditCode: '11-6284134',
    establishedAt: '2020-08-05',
    fullTimeStaffCount: 300,
    bachelorRatio: '90%',
    contactName: 'Noah Mitchell',
    contactPhone: '+1 (206) 555-0143',
    businessType: 'Data Annotation',
    annotationTypes: ['3D Annotation', 'Video Annotation'],
    collectionTypes: ['Video Collection', 'Image Collection'],
    resourceScope: 'Domestic Resources',
    specialResource: 'Equipment Resources',
    reviewStatus: 'Approved'
  },
  {
    id: 'VDR-004',
    sequence: 4,
    companyName: 'Linguaforge West Studio',
    unifiedCreditCode: '36-5910438',
    establishedAt: '2017-11-18',
    fullTimeStaffCount: 96,
    bachelorRatio: '82%',
    contactName: 'Sophia Bennett',
    contactPhone: '+1 (312) 555-0171',
    businessType: 'Translation',
    annotationTypes: ['NLP Annotation', 'ASR Annotation'],
    collectionTypes: ['Audio Collection'],
    resourceScope: 'Overseas Resources',
    specialResource: 'School / Government Partnerships',
    reviewStatus: 'Approved'
  },
  {
    id: 'VDR-005',
    sequence: 5,
    companyName: 'TextCraft Editorial Works',
    unifiedCreditCode: '47-2069183',
    establishedAt: '2021-01-14',
    fullTimeStaffCount: 118,
    bachelorRatio: '76%',
    contactName: 'Mia Robinson',
    contactPhone: '+1 (617) 555-0160',
    businessType: 'Text Production',
    annotationTypes: ['OCR Annotation', 'NLP Annotation'],
    collectionTypes: ['Image Collection'],
    resourceScope: 'Domestic Resources',
    specialResource: 'None',
    reviewStatus: 'Pending Review'
  },
  {
    id: 'VDR-006',
    sequence: 6,
    companyName: 'TalentMesh Human Services',
    unifiedCreditCode: '75-3306812',
    establishedAt: '2016-07-08',
    fullTimeStaffCount: 260,
    bachelorRatio: '71%',
    contactName: 'Liam Turner',
    contactPhone: '+1 (404) 555-0155',
    businessType: 'Human Resources',
    annotationTypes: ['2D Image Annotation'],
    collectionTypes: ['Face Collection'],
    resourceScope: 'Domestic + Overseas Resources',
    specialResource: 'Celebrity Resources',
    reviewStatus: 'Approved'
  },
  {
    id: 'VDR-007',
    sequence: 7,
    companyName: 'Nova Collect Intelligence',
    unifiedCreditCode: '61-2950471',
    establishedAt: '2019-09-27',
    fullTimeStaffCount: 182,
    bachelorRatio: '80%',
    contactName: 'Chloe Foster',
    contactPhone: '+1 (469) 555-0116',
    businessType: 'Data Collection',
    annotationTypes: ['2D Image Annotation', 'OCR Annotation'],
    collectionTypes: ['Image Collection', 'Face Collection'],
    resourceScope: 'Domestic Resources',
    specialResource: 'Equipment Resources',
    reviewStatus: 'Pending Review'
  },
  {
    id: 'VDR-008',
    sequence: 8,
    companyName: 'ArchiveShare Asset Partners',
    unifiedCreditCode: '58-1704429',
    establishedAt: '2015-02-06',
    fullTimeStaffCount: 64,
    bachelorRatio: '74%',
    contactName: 'Lucas Reed',
    contactPhone: '+1 (213) 555-0192',
    businessType: 'Finished Data Usage Transfer',
    annotationTypes: ['2D Image Annotation'],
    collectionTypes: ['Image Collection'],
    resourceScope: 'Overseas Resources',
    specialResource: 'Other',
    reviewStatus: 'Rejected'
  },
  {
    id: 'VDR-009',
    sequence: 9,
    companyName: 'SignalFlow Audio Labs',
    unifiedCreditCode: '23-8849710',
    establishedAt: '2018-10-30',
    fullTimeStaffCount: 138,
    bachelorRatio: '83%',
    contactName: 'Grace Walker',
    contactPhone: '+1 (512) 555-0139',
    businessType: 'Data Collection',
    annotationTypes: ['ASR Annotation'],
    collectionTypes: ['Audio Collection', 'TTS Collection'],
    resourceScope: 'Domestic + Overseas Resources',
    specialResource: 'Equipment Resources',
    reviewStatus: 'Approved'
  },
  {
    id: 'VDR-010',
    sequence: 10,
    companyName: 'VisionSpan Media Systems',
    unifiedCreditCode: '66-1034827',
    establishedAt: '2022-04-11',
    fullTimeStaffCount: 92,
    bachelorRatio: '88%',
    contactName: 'Harper Collins',
    contactPhone: '+1 (720) 555-0107',
    businessType: 'Data Annotation',
    annotationTypes: ['Video Annotation', 'OCR Annotation'],
    collectionTypes: ['Video Collection'],
    resourceScope: 'Domestic Resources',
    specialResource: 'School / Government Partnerships',
    reviewStatus: 'Pending Review'
  },
  {
    id: 'VDR-011',
    sequence: 11,
    companyName: 'Polyglot Source Partners',
    unifiedCreditCode: '31-4428005',
    establishedAt: '2017-06-15',
    fullTimeStaffCount: 210,
    bachelorRatio: '79%',
    contactName: 'Ella James',
    contactPhone: '+1 (917) 555-0180',
    businessType: 'Translation',
    annotationTypes: ['NLP Annotation', 'OCR Annotation'],
    collectionTypes: ['Audio Collection'],
    resourceScope: 'Overseas Resources',
    specialResource: 'Celebrity Resources',
    reviewStatus: 'Approved'
  },
  {
    id: 'VDR-012',
    sequence: 12,
    companyName: 'MetaEdge Vendor Services',
    unifiedCreditCode: '14-7295536',
    establishedAt: '2020-12-03',
    fullTimeStaffCount: 174,
    bachelorRatio: '86%',
    contactName: 'Owen Parker',
    contactPhone: '+1 (305) 555-0146',
    businessType: 'Other',
    annotationTypes: ['Other'],
    collectionTypes: ['Image Collection'],
    resourceScope: 'Domestic Resources',
    specialResource: 'Other',
    reviewStatus: 'Rejected'
  }
];
