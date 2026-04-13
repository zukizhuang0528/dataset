'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { TableActionButton } from '@/components/ui/table-action-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  batchSortOptions,
  batchStatusOptions,
  projectDetails,
  projectListItems,
  projectListSortOptions,
  projectListStatusOptions,
  type BatchItem,
  type BatchStatus,
  type ProjectListStatus
} from '@/features/projects/data/project-management-data';

const projectStatusStyles: Record<ProjectListStatus, string> = {
  'In Progress': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'Not Started': 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
};

const batchStatusStyles: Record<BatchStatus, string> = {
  'In Progress': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'Not Started': 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
};

const batchDataTypes = [
  { label: 'Image', icon: Icons.media },
  { label: 'Audio', icon: Icons.music },
  { label: 'Video', icon: Icons.video },
  { label: 'Point Cloud', icon: Icons.galleryVerticalEnd },
  { label: 'Text', icon: Icons.text }
] as const;

const annotationTemplates = [
  {
    id: 'scene-image',
    title: 'Scene Image',
    imageUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000f?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Downtown street scene with lane markings and vehicles',
    description:
      '3D scene annotation for lane lines, traffic signs, parked vehicles, pedestrians, obstacles, 3D boxes, semantic boundaries, category attributes, and orientation labels.'
  },
  {
    id: '4d-lane',
    title: '4D Lane',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Open roadway with clear lane structure',
    description:
      'Lane-level annotation for static and dynamic scenes, including lane topology, drivable space, curb structure, and scene attributes.'
  },
  {
    id: 'point-cloud-segmentation',
    title: 'Point Cloud Segmentation',
    imageUrl:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'City light trails suggesting spatial sensing data',
    description:
      'Fine-grained segmentation for point cloud scenes, including object-level labeling, semantic regions, and high-precision 3D boundary output.'
  }
] as const;

const batchCreationSteps = [
  'Basic Information Setup',
  'Data Upload',
  'Template Configuration'
] as const;

type BatchCreationStep = 0 | 1 | 2;

const configurationMethods = [
  {
    title: 'Use Default Template',
    description: 'Start from the selected annotation type and adjust fields below.'
  },
  {
    title: 'Copy from Existing Batch',
    description: 'Reuse a proven schema from another project batch.'
  },
  {
    title: 'Custom Configuration',
    description: 'Build a schema manually for this batch.'
  }
] as const;

type ConfigurationMethodTitle = (typeof configurationMethods)[number]['title'];

type BatchTaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Suspended' | 'Unable to Annotate';

const batchTaskStatusStyles: Record<BatchTaskStatus, string> = {
  Pending: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Suspended: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  'Unable to Annotate': 'bg-red-50 text-red-700 ring-1 ring-red-200'
};

const uploadedDatasetFiles = [
  {
    name: 'urban-lane-camera-0001.jpg',
    path: 'datasets/north-park/lane-camera/0001.jpg',
    size: '8.4 MB',
    status: 'Ready'
  },
  {
    name: 'urban-lane-camera-0002.jpg',
    path: 'datasets/north-park/lane-camera/0002.jpg',
    size: '8.1 MB',
    status: 'Ready'
  },
  {
    name: 'intersection-sensor-frame-0148.jpg',
    path: 'datasets/north-park/intersection/0148.jpg',
    size: '9.6 MB',
    status: 'Ready'
  },
  {
    name: 'delivery-zone-camera-0219.jpg',
    path: 'datasets/north-park/delivery-zone/0219.jpg',
    size: '7.8 MB',
    status: 'Ready'
  },
  {
    name: 'night-route-camera-0337.jpg',
    path: 'datasets/north-park/night-route/0337.jpg',
    size: '8.9 MB',
    status: 'Ready'
  }
] as const;

const batchDetailTasks = [
  {
    id: '000001',
    sequence: 1,
    taskName: '20250624.001_20250...',
    thumbnail:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000f?auto=format&fit=crop&w=240&q=70',
    status: 'Pending' as BatchTaskStatus,
    objectCount: 0,
    annotator: '-',
    frameCount: 10
  },
  {
    id: '000002',
    sequence: 2,
    taskName: '20250624.002',
    thumbnail:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=240&q=70',
    status: 'In Progress' as BatchTaskStatus,
    objectCount: 10,
    annotator: 'Mason Brooks',
    frameCount: 10
  },
  {
    id: '000003',
    sequence: 3,
    taskName: '20250624.003',
    thumbnail:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=240&q=70',
    status: 'Completed' as BatchTaskStatus,
    objectCount: 10,
    annotator: 'Mason Brooks',
    frameCount: 10
  },
  {
    id: '000004',
    sequence: 4,
    taskName: '20250624.004',
    thumbnail:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=240&q=70',
    status: 'Suspended' as BatchTaskStatus,
    objectCount: 10,
    annotator: 'Ava Turner',
    frameCount: 10
  },
  {
    id: '000005',
    sequence: 5,
    taskName: '20250624.005',
    thumbnail:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=240&q=70',
    status: 'Unable to Annotate' as BatchTaskStatus,
    objectCount: 10,
    annotator: 'Ava Turner',
    frameCount: 10
  }
] as const;

export default function ProjectManagementPage() {
  const [selectedProjectId, setSelectedProjectId] = useState(projectListItems[0]?.id ?? '');
  const [projectKeyword, setProjectKeyword] = useState('');
  const [projectStatus, setProjectStatus] =
    useState<(typeof projectListStatusOptions)[number]>('All Statuses');
  const [projectSort, setProjectSort] =
    useState<(typeof projectListSortOptions)[number]>('Publish Date');
  const [batchKeyword, setBatchKeyword] = useState('');
  const [batchStatus, setBatchStatus] =
    useState<(typeof batchStatusOptions)[number]>('All Statuses');
  const [batchSort, setBatchSort] = useState<(typeof batchSortOptions)[number]>('Default Sort');
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchDataType, setBatchDataType] =
    useState<(typeof batchDataTypes)[number]['label']>('Image');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(annotationTemplates[0].id);
  const [batchDescription, setBatchDescription] = useState('');
  const [activeBatchStep, setActiveBatchStep] = useState<BatchCreationStep>(0);
  const [datasetUrl, setDatasetUrl] = useState('');
  const [itemsPerPackage, setItemsPerPackage] = useState('10');
  const [isDatasetUploaded, setIsDatasetUploaded] = useState(false);
  const [selectedBatchDetail, setSelectedBatchDetail] = useState<BatchItem | null>(null);

  const visibleProjects = useMemo(() => {
    const filtered = projectListItems.filter((project) => {
      const matchesKeyword =
        !projectKeyword || project.name.toLowerCase().includes(projectKeyword.trim().toLowerCase());
      const matchesStatus = projectStatus === 'All Statuses' || project.status === projectStatus;
      return matchesKeyword && matchesStatus;
    });

    return filtered.toSorted((a, b) => {
      if (projectSort === 'Project Name') {
        return a.name.localeCompare(b.name);
      }
      return b.publishDate.localeCompare(a.publishDate);
    });
  }, [projectKeyword, projectSort, projectStatus]);

  const selectedProject = projectDetails[selectedProjectId] ??
    projectDetails[visibleProjects[0]?.id] ?? {
      id: '',
      title: '',
      batches: []
    };

  const selectedProjectListItem =
    visibleProjects.find((project) => project.id === selectedProject.id) ?? visibleProjects[0];

  const visibleBatches = useMemo(() => {
    const filtered = selectedProject.batches.filter((batch) => {
      const matchesKeyword =
        !batchKeyword || batch.name.toLowerCase().includes(batchKeyword.trim().toLowerCase());
      const matchesStatus = batchStatus === 'All Statuses' || batch.status === batchStatus;
      return matchesKeyword && matchesStatus;
    });

    return filtered.toSorted((a, b) => {
      if (batchSort === 'Latest Updated') {
        return (b.date ?? '').localeCompare(a.date ?? '');
      }
      return a.name.localeCompare(b.name);
    });
  }, [batchKeyword, batchSort, batchStatus, selectedProject.batches]);

  return (
    <div className='space-y-6 pb-8'>
      <div className='rounded-[28px] border border-border/80 bg-white shadow-sm'>
        <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-8 py-6'>
          <h1 className='text-foreground text-[30px] font-semibold tracking-tight'>
            Project Management
          </h1>
          <div className='text-muted-foreground flex items-center gap-6 text-sm'>
            <button className='inline-flex items-center gap-1.5 font-medium text-slate-600'>
              Mina Walker (Project Owner)
              <Icons.chevronDown className='h-4 w-4' />
            </button>
            <button className='inline-flex items-center gap-1.5 font-medium text-slate-600'>
              English
              <Icons.chevronDown className='h-4 w-4' />
            </button>
          </div>
        </div>

        <div className='grid min-w-0 lg:grid-cols-[376px_minmax(0,1fr)]'>
          <aside className='border-r border-slate-200 bg-slate-50/60'>
            <div className='space-y-4 p-6'>
              <div className='flex items-center justify-between gap-3'>
                <div className='text-foreground text-[22px] font-semibold leading-none'>
                  Project List
                </div>
                <span className='text-muted-foreground text-base'>({23})</span>
              </div>

              <div className='space-y-3'>
                <Button className='bg-primary h-10 rounded-xl px-4 text-white hover:bg-primary/90'>
                  New Project
                </Button>
                <div className='relative min-w-0'>
                  <Input
                    value={projectKeyword}
                    onChange={(event) => setProjectKeyword(event.target.value)}
                    placeholder='Enter project name'
                    className='h-10 rounded-xl pr-10'
                  />
                  <Icons.search className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <Select
                  value={projectStatus}
                  onValueChange={(value) =>
                    setProjectStatus(value as (typeof projectListStatusOptions)[number])
                  }
                >
                  <SelectTrigger className='h-9 rounded-xl border-slate-200 bg-white text-sm'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectListStatusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={projectSort}
                  onValueChange={(value) =>
                    setProjectSort(value as (typeof projectListSortOptions)[number])
                  }
                >
                  <SelectTrigger className='h-9 rounded-xl border-slate-200 bg-white text-sm'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectListSortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-3'>
                {visibleProjects.map((project) => {
                  const isActive = project.id === selectedProject.id;
                  return (
                    <button
                      key={project.id}
                      type='button'
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setSelectedBatchDetail(null);
                        setIsCreatingBatch(false);
                      }}
                      className={cn(
                        'group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-primary/35 hover:bg-slate-50/80',
                        isActive && 'border-primary ring-1 ring-primary/25'
                      )}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='min-w-0 space-y-3'>
                          <div className='space-y-2'>
                            <span
                              className={cn(
                                'inline-flex h-8 whitespace-nowrap items-center rounded-full px-3 text-xs font-semibold',
                                projectStatusStyles[project.status]
                              )}
                            >
                              {project.status}
                            </span>
                            <div className='truncate text-[17px] font-semibold text-slate-900'>
                              {project.name}
                            </div>
                          </div>

                          <div className='text-sm text-slate-600'>
                            Total {project.batchCount} batches
                          </div>

                          <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500'>
                            <span className='inline-flex items-center gap-2'>
                              <Icons.user className='h-4 w-4' />
                              {project.owner}
                            </span>
                            <span className='inline-flex items-center gap-2'>
                              <Icons.calendar className='h-4 w-4' />
                              {project.publishDate}
                            </span>
                          </div>
                        </div>

                        <div className='flex items-center gap-2 pt-1 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100'>
                          <span className='rounded-full bg-white p-1.5 shadow-sm ring-1 ring-slate-200'>
                            <Icons.chevronUp className='h-4 w-4' />
                          </span>
                          <span className='rounded-full bg-white p-1.5 shadow-sm ring-1 ring-slate-200'>
                            <Icons.settings className='h-4 w-4' />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className='min-w-0 bg-white p-6 md:p-8'>
            {selectedBatchDetail ? (
              <BatchDetailsPanel
                batch={selectedBatchDetail}
                onBack={() => setSelectedBatchDetail(null)}
              />
            ) : isCreatingBatch ? (
              <NewBatchPanel
                batchName={batchName}
                batchDescription={batchDescription}
                batchDataType={batchDataType}
                selectedTemplateId={selectedTemplateId}
                onBack={() => setIsCreatingBatch(false)}
                onBatchNameChange={setBatchName}
                onBatchDescriptionChange={setBatchDescription}
                onBatchDataTypeChange={setBatchDataType}
                onTemplateChange={setSelectedTemplateId}
                onCancel={() => setIsCreatingBatch(false)}
                activeStep={activeBatchStep}
                datasetUrl={datasetUrl}
                itemsPerPackage={itemsPerPackage}
                isDatasetUploaded={isDatasetUploaded}
                onStepChange={setActiveBatchStep}
                onDatasetUrlChange={setDatasetUrl}
                onItemsPerPackageChange={setItemsPerPackage}
                onUploadComplete={() => setIsDatasetUploaded(true)}
                onUploadReset={() => setIsDatasetUploaded(false)}
              />
            ) : (
              <div className='space-y-5'>
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <h2 className='text-foreground text-[24px] font-semibold tracking-tight'>
                    {selectedProjectListItem?.name ?? selectedProject.title}
                  </h2>
                  <Button
                    className='bg-primary h-10 rounded-xl px-5 text-white hover:bg-primary/90'
                    onClick={() => {
                      setSelectedBatchDetail(null);
                      setIsCreatingBatch(true);
                    }}
                  >
                    New Batch
                  </Button>
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                  <div className='relative min-w-[240px] flex-1'>
                    <Input
                      value={batchKeyword}
                      onChange={(event) => setBatchKeyword(event.target.value)}
                      placeholder='Enter batch name'
                      className='h-10 rounded-xl pr-10'
                    />
                    <Icons.search className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
                  </div>

                  <Select
                    value={batchStatus}
                    onValueChange={(value) =>
                      setBatchStatus(value as (typeof batchStatusOptions)[number])
                    }
                  >
                    <SelectTrigger className='h-10 w-[160px] rounded-xl'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {batchStatusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={batchSort}
                    onValueChange={(value) =>
                      setBatchSort(value as (typeof batchSortOptions)[number])
                    }
                  >
                    <SelectTrigger className='h-10 w-[160px] rounded-xl'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {batchSortOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid gap-6 xl:grid-cols-2'>
                  {visibleBatches.map((batch) => (
                    <BatchCard
                      key={batch.id}
                      batch={batch}
                      onOpen={() => setSelectedBatchDetail(batch)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function NewBatchPanel({
  batchName,
  batchDescription,
  batchDataType,
  selectedTemplateId,
  onBack,
  onBatchNameChange,
  onBatchDescriptionChange,
  onBatchDataTypeChange,
  onTemplateChange,
  onCancel,
  activeStep,
  datasetUrl,
  itemsPerPackage,
  isDatasetUploaded,
  onStepChange,
  onDatasetUrlChange,
  onItemsPerPackageChange,
  onUploadComplete,
  onUploadReset
}: {
  batchName: string;
  batchDescription: string;
  batchDataType: (typeof batchDataTypes)[number]['label'];
  selectedTemplateId: string;
  onBack: () => void;
  onBatchNameChange: (value: string) => void;
  onBatchDescriptionChange: (value: string) => void;
  onBatchDataTypeChange: (value: (typeof batchDataTypes)[number]['label']) => void;
  onTemplateChange: (value: string) => void;
  onCancel: () => void;
  activeStep: BatchCreationStep;
  datasetUrl: string;
  itemsPerPackage: string;
  isDatasetUploaded: boolean;
  onStepChange: (value: BatchCreationStep) => void;
  onDatasetUrlChange: (value: string) => void;
  onItemsPerPackageChange: (value: string) => void;
  onUploadComplete: () => void;
  onUploadReset: () => void;
}) {
  const canContinueFromUpload = activeStep !== 1 || isDatasetUploaded;

  return (
    <form
      className='-m-6 flex min-h-[calc(100vh-180px)] flex-col md:-m-8'
      onSubmit={(event) => event.preventDefault()}
    >
      <div className='space-y-5 border-b border-slate-200 px-6 py-5 md:px-8'>
        <Button type='button' variant='outline' className='h-9 rounded-xl px-5' onClick={onBack}>
          Back
        </Button>

        <div className='space-y-1'>
          <h2 className='text-foreground text-[24px] font-semibold tracking-tight'>New Batch</h2>
          <p className='max-w-2xl text-sm leading-6 text-slate-500'>
            Set the batch basics first, then upload data and choose the labeling template.
          </p>
        </div>
      </div>

      <BatchCreationStepper activeStep={activeStep} onStepChange={onStepChange} />

      <div className='flex-1 space-y-8 px-6 py-8 md:px-8 lg:px-10'>
        {activeStep === 0 ? (
          <BasicBatchInfoStep
            batchName={batchName}
            batchDescription={batchDescription}
            batchDataType={batchDataType}
            selectedTemplateId={selectedTemplateId}
            onBatchNameChange={onBatchNameChange}
            onBatchDescriptionChange={onBatchDescriptionChange}
            onBatchDataTypeChange={onBatchDataTypeChange}
            onTemplateChange={onTemplateChange}
          />
        ) : null}

        {activeStep === 1 ? (
          <DataUploadStep
            datasetUrl={datasetUrl}
            itemsPerPackage={itemsPerPackage}
            isDatasetUploaded={isDatasetUploaded}
            onDatasetUrlChange={onDatasetUrlChange}
            onItemsPerPackageChange={onItemsPerPackageChange}
            onUploadComplete={onUploadComplete}
            onUploadReset={onUploadReset}
          />
        ) : null}

        {activeStep === 2 ? (
          <TemplateConfigurationStep selectedTemplateId={selectedTemplateId} />
        ) : null}
      </div>

      <div className='flex flex-wrap justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 md:px-8'>
        <Button type='button' variant='outline' className='h-10 rounded-xl px-6' onClick={onCancel}>
          Cancel
        </Button>
        {activeStep > 0 && activeStep < 2 ? (
          <Button
            type='button'
            variant='outline'
            className='h-10 rounded-xl px-6'
            onClick={() => onStepChange((activeStep - 1) as BatchCreationStep)}
          >
            Previous
          </Button>
        ) : null}
        {activeStep < 2 ? (
          <Button
            type='button'
            disabled={!canContinueFromUpload}
            className='h-10 rounded-xl bg-primary px-6 text-white hover:bg-primary/90'
            onClick={() => onStepChange((activeStep + 1) as BatchCreationStep)}
          >
            Next
          </Button>
        ) : (
          <>
            <Button type='button' variant='outline' className='h-10 rounded-xl px-6'>
              Preview
            </Button>
            <Button type='button' variant='outline' className='h-10 rounded-xl px-6'>
              Save
            </Button>
            <Button
              type='submit'
              className='h-10 rounded-xl bg-primary px-6 text-white hover:bg-primary/90'
            >
              Publish
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

function BatchCreationStepper({
  activeStep,
  onStepChange,
  className
}: {
  activeStep: BatchCreationStep;
  onStepChange: (value: BatchCreationStep) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid border-b border-slate-200 bg-white px-6 py-5 md:grid-cols-3 md:px-8',
        className
      )}
    >
      {batchCreationSteps.map((step, index) => {
        const stepIndex = index as BatchCreationStep;
        const active = stepIndex === activeStep;
        const complete = stepIndex < activeStep;
        return (
          <button
            key={step}
            type='button'
            onClick={() => onStepChange(stepIndex)}
            className={cn(
              'relative flex items-center gap-3 py-2 text-left text-sm font-semibold',
              index < 2
                ? "after:absolute after:top-1/2 after:left-9 after:hidden after:h-px after:w-[calc(100%-2.25rem)] after:bg-slate-200 after:content-[''] md:after:block"
                : '',
              active ? 'text-slate-950' : 'text-slate-500'
            )}
          >
            <span
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white text-xs',
                active && 'border-primary text-primary shadow-[0_0_0_3px_rgba(139,92,246,0.08)]',
                complete && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                !active && !complete && 'border-slate-200 text-slate-400'
              )}
            >
              {complete ? <Icons.check className='h-4 w-4' /> : index + 1}
            </span>
            <span className='relative z-10 bg-white pr-3'>{step}</span>
          </button>
        );
      })}
    </div>
  );
}

function BasicBatchInfoStep({
  batchName,
  batchDescription,
  batchDataType,
  selectedTemplateId,
  onBatchNameChange,
  onBatchDescriptionChange,
  onBatchDataTypeChange,
  onTemplateChange
}: {
  batchName: string;
  batchDescription: string;
  batchDataType: (typeof batchDataTypes)[number]['label'];
  selectedTemplateId: string;
  onBatchNameChange: (value: string) => void;
  onBatchDescriptionChange: (value: string) => void;
  onBatchDataTypeChange: (value: (typeof batchDataTypes)[number]['label']) => void;
  onTemplateChange: (value: string) => void;
}) {
  return (
    <div className='space-y-7'>
      <div className='space-y-2'>
        <label
          htmlFor='batch-name'
          className='block whitespace-nowrap text-sm font-semibold text-slate-700'
        >
          <span className='mr-1 text-red-500'>*</span>
          Batch Name
        </label>
        <Input
          id='batch-name'
          value={batchName}
          onChange={(event) => onBatchNameChange(event.target.value)}
          placeholder='Suggested format: time - batch name'
          className='h-11 max-w-[420px] rounded-xl'
        />
      </div>

      <div className='space-y-3'>
        <div className='whitespace-nowrap text-sm font-semibold text-slate-700'>
          <span className='mr-1 text-red-500'>*</span>
          Data Type
        </div>
        <div className='flex flex-wrap gap-2'>
          {batchDataTypes.map((type) => {
            const TypeIcon = type.icon;
            const active = batchDataType === type.label;
            return (
              <button
                key={type.label}
                type='button'
                onClick={() => onBatchDataTypeChange(type.label)}
                className={cn(
                  'inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors',
                  active
                    ? 'border-primary bg-primary/8 text-primary ring-1 ring-primary/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary/35 hover:bg-slate-50'
                )}
              >
                {active ? <Icons.check className='h-4 w-4' /> : <TypeIcon className='h-4 w-4' />}
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className='space-y-3'>
        <div className='whitespace-nowrap text-sm font-semibold text-slate-700'>
          <span className='mr-1 text-red-500'>*</span>
          Annotation Type
        </div>
        <div className='grid auto-rows-fr gap-5 xl:grid-cols-3'>
          {annotationTemplates.map((template) => {
            const active = selectedTemplateId === template.id;
            return (
              <button
                key={template.id}
                type='button'
                onClick={() => onTemplateChange(template.id)}
                className={cn(
                  'group relative flex h-[360px] flex-col overflow-hidden rounded-2xl border bg-white text-left transition-colors',
                  active
                    ? 'border-primary ring-1 ring-primary/25'
                    : 'border-slate-200 hover:border-primary/35'
                )}
              >
                <div className='relative h-36 shrink-0 overflow-hidden bg-[linear-gradient(135deg,#f8fafc,#eef2f7)]'>
                  <Image
                    src={template.imageUrl}
                    alt={template.imageAlt}
                    fill
                    unoptimized
                    sizes='(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw'
                    className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent' />
                </div>
                <span
                  className={cn(
                    'absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border',
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-slate-300 bg-white text-transparent group-hover:border-primary/50'
                  )}
                >
                  <Icons.check className='h-4 w-4' />
                </span>
                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <div className='text-base font-semibold text-slate-950'>{template.title}</div>
                  <p className='line-clamp-5 text-sm leading-6 text-slate-600'>
                    {template.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className='space-y-2'>
        <label
          htmlFor='batch-description'
          className='block whitespace-nowrap text-sm font-semibold text-slate-700'
        >
          Batch Description
        </label>
        <div className='relative'>
          <Textarea
            id='batch-description'
            value={batchDescription}
            maxLength={100}
            onChange={(event) => onBatchDescriptionChange(event.target.value)}
            placeholder='Enter a short batch description'
            className='min-h-[220px] resize-none rounded-xl pr-16 pb-10'
          />
          <div className='absolute right-4 bottom-3 text-sm text-slate-500'>
            {batchDescription.length}/100
          </div>
        </div>
      </div>

      <div>
        <Button type='button' variant='outline' className='h-10 rounded-xl px-5'>
          Invite Collaborators
        </Button>
      </div>
    </div>
  );
}

function DataUploadStep({
  datasetUrl,
  itemsPerPackage,
  isDatasetUploaded,
  onDatasetUrlChange,
  onItemsPerPackageChange,
  onUploadComplete,
  onUploadReset,
  itemsPerPackageLocked = false,
  showClearUploadAction = true
}: {
  datasetUrl: string;
  itemsPerPackage: string;
  isDatasetUploaded: boolean;
  onDatasetUrlChange: (value: string) => void;
  onItemsPerPackageChange: (value: string) => void;
  onUploadComplete: () => void;
  onUploadReset: () => void;
  itemsPerPackageLocked?: boolean;
  showClearUploadAction?: boolean;
}) {
  const dataQuantity = isDatasetUploaded ? 50 : 0;
  const datasetSize = isDatasetUploaded ? '400.00 MB' : 'Pending';
  const packageCount =
    isDatasetUploaded && Number(itemsPerPackage) > 0
      ? Math.ceil(dataQuantity / Number(itemsPerPackage))
      : 0;

  return (
    <div className='space-y-8'>
      <div className='space-y-1'>
        <h3 className='text-xl font-semibold text-slate-950'>Data Upload</h3>
        <p className='max-w-3xl text-sm leading-6 text-slate-500'>
          {itemsPerPackageLocked
            ? 'The dataset has already been parsed. Additional files can be added, while the package split rule remains locked for this in-progress batch.'
            : 'Connect the dataset first. Quantity and total size are generated after parsing, while items per package controls how the workload is split for annotators.'}
        </p>
      </div>

      <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <div className='space-y-5'>
          <div className='space-y-2'>
            <label
              htmlFor='dataset-url'
              className='block whitespace-nowrap text-sm font-semibold text-slate-700'
            >
              Dataset URL
            </label>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Input
                id='dataset-url'
                value={datasetUrl}
                onChange={(event) => onDatasetUrlChange(event.target.value)}
                placeholder='https://storage.example.com/datasets/north-park.zip'
                className='h-11 rounded-xl'
              />
              <Button type='button' variant='outline' className='h-11 rounded-xl px-5'>
                Add URL
              </Button>
            </div>
          </div>

          <div className='rounded-[24px] border border-dashed border-slate-300 bg-white p-8'>
            <div className='mx-auto flex max-w-xl flex-col items-center gap-4 text-center'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary'>
                <Icons.upload className='h-6 w-6' />
              </div>
              <div className='space-y-1'>
                <div className='text-base font-semibold text-slate-950'>
                  Upload local files or import from a dataset URL
                </div>
                <p className='text-sm leading-6 text-slate-500'>
                  Files are parsed before the batch can move forward. The file table appears after a
                  successful upload.
                </p>
              </div>
              <div className='flex flex-wrap justify-center gap-3'>
                <Button type='button' variant='outline' className='h-10 rounded-xl px-5'>
                  Upload More Files
                </Button>
                <Button
                  type='button'
                  className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'
                  onClick={onUploadComplete}
                >
                  {isDatasetUploaded ? 'Parse Added Files' : 'Simulate Successful Upload'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-4 rounded-[24px] border border-slate-200 bg-slate-50/60 p-5'>
          <div className='text-sm font-semibold text-slate-950'>Batch Split Settings</div>
          <div className='space-y-2'>
            <label
              htmlFor='items-per-package'
              className='block whitespace-nowrap text-sm font-medium text-slate-700'
            >
              Items per Package
            </label>
            <Input
              id='items-per-package'
              type='number'
              min='1'
              value={itemsPerPackage}
              disabled={itemsPerPackageLocked}
              onChange={(event) => onItemsPerPackageChange(event.target.value)}
              className='h-11 rounded-xl bg-white disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500'
            />
            <p className='text-xs leading-5 text-slate-500'>
              {itemsPerPackageLocked
                ? 'Locked because this batch is already in progress.'
                : 'Smaller packages are easier to review. Larger packages reduce assignment overhead.'}
            </p>
          </div>

          <div className='grid gap-3 border-t border-slate-200 pt-4'>
            <UploadMetric
              label='Data Quantity'
              value={isDatasetUploaded ? `${dataQuantity}` : 'Pending'}
            />
            <UploadMetric label='Dataset Size' value={datasetSize} />
            <UploadMetric
              label='Estimated Packages'
              value={isDatasetUploaded ? `${packageCount}` : 'Pending'}
            />
          </div>
        </div>
      </div>

      {isDatasetUploaded ? (
        <UploadedDatasetState
          itemsPerPackage={itemsPerPackage}
          onUploadReset={onUploadReset}
          showClearUploadAction={showClearUploadAction}
        />
      ) : (
        <BeforeUploadState />
      )}
    </div>
  );
}

function UploadMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 text-sm'>
      <span className='text-slate-500'>{label}</span>
      <span className='font-semibold text-slate-950'>{value}</span>
    </div>
  );
}

function BeforeUploadState() {
  return (
    <div className='rounded-[24px] border border-slate-200 bg-white p-8'>
      <div className='mx-auto flex max-w-lg flex-col items-center gap-3 text-center'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500'>
          <Icons.page className='h-5 w-5' />
        </div>
        <div className='text-base font-semibold text-slate-950'>No files parsed yet</div>
        <p className='text-sm leading-6 text-slate-500'>
          Upload files or add a dataset URL. After parsing succeeds, this area will show the file
          list, upload status, and generated dataset statistics.
        </p>
      </div>
    </div>
  );
}

function UploadedDatasetState({
  itemsPerPackage,
  onUploadReset,
  showClearUploadAction = true
}: {
  itemsPerPackage: string;
  onUploadReset: () => void;
  showClearUploadAction?: boolean;
}) {
  const packageCount = Math.ceil(50 / Math.max(Number(itemsPerPackage) || 1, 1));

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='space-y-1'>
          <div className='text-base font-semibold text-slate-950'>Files</div>
          <p className='text-sm text-slate-500'>
            50 files parsed successfully across {packageCount} estimated packages.
          </p>
        </div>
        {showClearUploadAction ? (
          <Button
            type='button'
            variant='outline'
            className='h-10 rounded-xl px-5'
            onClick={onUploadReset}
          >
            Clear Upload
          </Button>
        ) : null}
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-2xl border border-slate-200 bg-white p-5'>
          <div className='text-sm text-slate-500'>Data Quantity</div>
          <div className='mt-2 text-2xl font-semibold text-slate-950'>50</div>
        </div>
        <div className='rounded-2xl border border-slate-200 bg-white p-5'>
          <div className='text-sm text-slate-500'>Dataset Size</div>
          <div className='mt-2 text-2xl font-semibold text-slate-950'>400.00 MB</div>
        </div>
        <div className='rounded-2xl border border-slate-200 bg-white p-5'>
          <div className='text-sm text-slate-500'>Upload Progress</div>
          <div className='mt-3 space-y-2'>
            <Progress value={100} className='h-2' />
            <div className='text-sm font-semibold text-emerald-700'>Complete</div>
          </div>
        </div>
      </div>

      <div className='overflow-hidden rounded-[24px] border border-slate-200 bg-white'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[760px] text-sm'>
            <thead className='bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.04em] text-slate-500'>
              <tr>
                <th className='px-5 py-4'>File Name</th>
                <th className='px-5 py-4'>Storage Path</th>
                <th className='px-5 py-4'>Size</th>
                <th className='px-5 py-4'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {uploadedDatasetFiles.map((file) => (
                <tr key={file.path} className='text-slate-700'>
                  <td className='px-5 py-4 font-medium text-slate-950'>{file.name}</td>
                  <td className='px-5 py-4 text-slate-500'>{file.path}</td>
                  <td className='px-5 py-4'>{file.size}</td>
                  <td className='px-5 py-4'>
                    <span className='inline-flex h-7 items-center rounded-full bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200'>
                      {file.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TemplateConfigurationStep({
  selectedTemplateId,
  readOnlyConfigurationMethod = false,
  configurationMethod = 'Use Default Template'
}: {
  selectedTemplateId: string;
  readOnlyConfigurationMethod?: boolean;
  configurationMethod?: ConfigurationMethodTitle;
}) {
  const selectedTemplate = annotationTemplates.find(
    (template) => template.id === selectedTemplateId
  );
  const selectedConfigurationMethod =
    configurationMethods.find((method) => method.title === configurationMethod) ??
    configurationMethods[0];

  return (
    <div className='space-y-8'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='space-y-1'>
          <h3 className='text-xl font-semibold text-slate-950'>Template Configuration</h3>
          <p className='max-w-3xl text-sm leading-6 text-slate-500'>
            Define the attributes annotators will see. Global attributes describe the whole asset;
            segment attributes describe each labeled object or region.
          </p>
        </div>
        <div className='rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200'>
          Base template:{' '}
          <span className='font-semibold text-slate-900'>{selectedTemplate?.title}</span>
        </div>
      </div>

      <section className='space-y-3'>
        <div className='whitespace-nowrap text-sm font-semibold text-slate-700'>
          Configuration Method
        </div>
        {readOnlyConfigurationMethod ? (
          <div className='max-w-xl rounded-2xl border border-slate-200 bg-white p-5'>
            <div className='space-y-2'>
              <div className='text-sm font-semibold text-slate-950'>
                {selectedConfigurationMethod.title}
              </div>
              <p className='text-sm leading-6 text-slate-500'>
                {selectedConfigurationMethod.description}
              </p>
            </div>
          </div>
        ) : (
          <div className='grid gap-3 lg:grid-cols-3'>
            {configurationMethods.map((method, index) => (
              <button
                key={method.title}
                type='button'
                className={cn(
                  'rounded-2xl border bg-white p-5 text-left transition-colors',
                  index === 0
                    ? 'border-primary ring-1 ring-primary/20'
                    : 'border-slate-200 hover:border-primary/35'
                )}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='space-y-2'>
                    <div className='text-sm font-semibold text-slate-950'>{method.title}</div>
                    <p className='text-sm leading-6 text-slate-500'>{method.description}</p>
                  </div>
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                      index === 0
                        ? 'border-primary bg-primary text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    )}
                  >
                    <Icons.check className='h-3.5 w-3.5' />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <GlobalAttributesEditor />
      <SegmentAttributesEditor />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className='block whitespace-nowrap text-sm font-medium text-slate-700'>{children}</label>
  );
}

function OptionRow({
  name,
  value,
  showDefault,
  checked
}: {
  name: string;
  value: string;
  showDefault?: boolean;
  checked?: boolean;
}) {
  return (
    <div className='grid gap-3 rounded-2xl bg-slate-50/70 p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'>
      <div className='space-y-2'>
        <FieldLabel>Option Name</FieldLabel>
        <Input defaultValue={name} className='h-10 rounded-xl bg-white' />
      </div>
      <div className='space-y-2'>
        <FieldLabel>Option Value</FieldLabel>
        <Input defaultValue={value} className='h-10 rounded-xl bg-white' />
      </div>
      {showDefault ? (
        <div className='flex items-end gap-2 pb-2 text-sm font-medium text-slate-600'>
          <Checkbox defaultChecked={checked} aria-label={`Set ${name} as default option`} />
          <span>Default</span>
        </div>
      ) : (
        <div className='hidden md:block' />
      )}
    </div>
  );
}

function GlobalAttributesEditor() {
  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div className='space-y-1'>
          <h4 className='text-lg font-semibold text-slate-950'>Global Attributes</h4>
          <p className='max-w-3xl text-sm leading-6 text-slate-500'>
            These fields apply to the entire uploaded asset, such as scene conditions or data
            quality.
          </p>
        </div>
      </div>

      <div className='rounded-[24px] border border-slate-200 bg-white p-5'>
        <div className='grid gap-4 lg:grid-cols-2'>
          <div className='space-y-2'>
            <FieldLabel>Attribute Name</FieldLabel>
            <Input defaultValue='Scene Condition' className='h-11 rounded-xl' />
          </div>
          <div className='space-y-2'>
            <FieldLabel>Key</FieldLabel>
            <Input defaultValue='scene_condition' className='h-11 rounded-xl' />
          </div>
        </div>

        <div className='mt-5 space-y-3'>
          <div className='text-sm font-semibold text-slate-700'>Options</div>
          <OptionRow name='Daytime' value='daytime' />
          <OptionRow name='Night' value='night' />
          <Button type='button' variant='outline' className='h-9 rounded-xl px-4'>
            Add Option
          </Button>
        </div>
      </div>
    </section>
  );
}

function SegmentAttributesEditor() {
  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div className='space-y-1'>
          <h4 className='text-lg font-semibold text-slate-950'>Segment Attributes</h4>
          <p className='max-w-3xl text-sm leading-6 text-slate-500'>
            These fields apply to each labeled object, region, or segment created by annotators.
          </p>
        </div>
      </div>

      <div className='space-y-5 rounded-[24px] border border-slate-200 bg-white p-5'>
        <div className='grid gap-4 xl:grid-cols-4'>
          <div className='space-y-2'>
            <FieldLabel>Attribute Name</FieldLabel>
            <Input defaultValue='Vehicle Type' className='h-11 rounded-xl' />
          </div>
          <div className='space-y-2'>
            <FieldLabel>Key</FieldLabel>
            <Input defaultValue='vehicle_type' className='h-11 rounded-xl' />
          </div>
          <div className='space-y-2'>
            <FieldLabel>Annotation Method</FieldLabel>
            <Select defaultValue='box'>
              <SelectTrigger className='h-11 rounded-xl'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='box'>Bounding Box</SelectItem>
                <SelectItem value='polygon'>Polygon</SelectItem>
                <SelectItem value='polyline'>Polyline</SelectItem>
                <SelectItem value='point'>Point</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <FieldLabel>Attribute Type</FieldLabel>
            <Select defaultValue='single-select'>
              <SelectTrigger className='h-11 rounded-xl'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='single-select'>Single Select</SelectItem>
                <SelectItem value='multi-select'>Multi Select</SelectItem>
                <SelectItem value='text'>Text</SelectItem>
                <SelectItem value='number'>Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-3'>
          <div className='text-sm font-semibold text-slate-700'>Options</div>
          <OptionRow name='Passenger Car' value='passenger_car' showDefault checked />
          <OptionRow name='Truck' value='truck' showDefault />
          <OptionRow name='Bus' value='bus' showDefault />
          <Button type='button' variant='outline' className='h-9 rounded-xl px-4'>
            Add Option
          </Button>
        </div>
      </div>

      <div className='flex justify-start'>
        <Button type='button' variant='outline' className='h-10 rounded-xl px-5'>
          Add Attribute
        </Button>
      </div>
    </section>
  );
}

function BatchDetailsPanel({ batch, onBack }: { batch: BatchItem; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'data' | 'configuration'>('data');
  const [activeConfigurationStep, setActiveConfigurationStep] = useState<BatchCreationStep>(0);

  return (
    <div className='-m-6 min-h-[calc(100vh-180px)] bg-white md:-m-8'>
      <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 md:px-8'>
        <div className='flex items-center gap-4'>
          <Button type='button' variant='outline' className='h-9 rounded-xl px-5' onClick={onBack}>
            Back
          </Button>
          <h2 className='text-foreground text-[24px] font-semibold tracking-tight'>
            Batch Details
          </h2>
        </div>
        <div className='flex items-center gap-6 text-sm text-slate-600'>
          <button className='inline-flex items-center gap-1.5 font-medium'>
            Mina Walker
            <Icons.chevronDown className='h-4 w-4' />
          </button>
          <button className='inline-flex items-center gap-1.5 font-medium'>
            English
            <Icons.chevronDown className='h-4 w-4' />
          </button>
        </div>
      </div>

      <div className='flex gap-8 border-b border-slate-200 px-6 md:px-8'>
        <button
          type='button'
          onClick={() => setActiveTab('data')}
          className={cn(
            'h-14 border-b-2 px-1 text-base font-semibold transition-colors',
            activeTab === 'data'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          Batch Data
        </button>
        <button
          type='button'
          onClick={() => setActiveTab('configuration')}
          className={cn(
            'h-14 border-b-2 px-1 text-base font-semibold transition-colors',
            activeTab === 'configuration'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'
          )}
        >
          Batch Configuration
        </button>
      </div>

      <div className='space-y-6 px-6 py-6 md:px-8'>
        {activeTab === 'data' ? (
          <>
            <BatchDetailsSummary batch={batch} />

            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='relative min-w-[260px] max-w-[360px] flex-1'>
                <Input placeholder='Enter task name' className='h-10 rounded-xl pr-10' />
                <Icons.search className='pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-500' />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'>
                    Export
                    <Icons.chevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56 rounded-xl border-slate-200'>
                  <DropdownMenuItem className='rounded-lg text-sm'>
                    Selected Annotation Results
                  </DropdownMenuItem>
                  <DropdownMenuItem className='rounded-lg text-sm'>
                    All Annotation Results
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <BatchTaskTable />
          </>
        ) : (
          <BatchConfigurationPanel
            batch={batch}
            activeStep={activeConfigurationStep}
            onStepChange={setActiveConfigurationStep}
          />
        )}
      </div>
    </div>
  );
}

function BatchDetailsSummary({ batch }: { batch: BatchItem }) {
  const progressColor = '#8B5CF6';
  const remainderColor = '#d7d7dc';

  return (
    <section className='rounded-[24px] bg-slate-50/80 px-7 py-6'>
      <div className='grid gap-6 lg:grid-cols-[1fr_1fr_180px]'>
        <div className='space-y-6'>
          <span
            className={cn(
              'inline-flex h-8 whitespace-nowrap items-center rounded-full px-3 text-xs font-semibold',
              batchStatusStyles[batch.status]
            )}
          >
            {batch.status}
          </span>
          <div>
            <div className='text-sm text-slate-500'>Item Quantity</div>
            <div className='mt-1 text-xl font-semibold text-slate-800'>200</div>
          </div>
        </div>

        <div className='space-y-6'>
          <div>
            <div className='text-sm text-slate-500'>Annotators</div>
            <div className='mt-1 text-xl font-semibold text-slate-800'>
              Mason Brooks, Ava Turner
            </div>
          </div>
          <div>
            <div className='text-sm text-slate-500'>Total Frames</div>
            <div className='mt-1 text-xl font-semibold text-slate-800'>200</div>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center gap-3'>
          <div
            className='relative h-24 w-24 rounded-full'
            style={{
              background: `conic-gradient(${progressColor} 0 72%, ${remainderColor} 72% 100%)`
            }}
          >
            <div className='absolute inset-[18px] flex items-center justify-center rounded-full bg-slate-50 text-sm font-semibold text-primary'>
              72%
            </div>
          </div>
          <div className='text-sm font-semibold text-slate-700'>Annotated</div>
        </div>
      </div>
    </section>
  );
}

function BatchTaskTable() {
  return (
    <div className='overflow-hidden rounded-[24px] border border-slate-200 bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[1120px] text-sm'>
          <thead className='bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.04em] text-slate-500'>
            <tr>
              <th className='w-12 px-4 py-4'>
                <Checkbox aria-label='Select all tasks' />
              </th>
              <th className='px-4 py-4'>No.</th>
              <th className='px-4 py-4'>Package ID</th>
              <th className='px-4 py-4'>Task Name</th>
              <th className='px-4 py-4'>Thumbnail</th>
              <th className='px-4 py-4'>Task Status</th>
              <th className='px-4 py-4'>Objects</th>
              <th className='px-4 py-4'>Annotator</th>
              <th className='px-4 py-4'>Frames</th>
              <th className='px-4 py-4'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {batchDetailTasks.map((task) => (
              <tr key={task.id} className='text-slate-700'>
                <td className='px-4 py-3'>
                  <Checkbox aria-label={`Select task ${task.id}`} />
                </td>
                <td className='px-4 py-3'>{task.sequence}</td>
                <td className='px-4 py-3 font-medium text-slate-700'>{task.id}</td>
                <td className='max-w-[180px] px-4 py-3 text-slate-700'>{task.taskName}</td>
                <td className='px-4 py-3'>
                  <div className='relative h-10 w-16 overflow-hidden rounded-lg bg-slate-100'>
                    <Image
                      src={task.thumbnail}
                      alt={`${task.taskName} thumbnail`}
                      fill
                      unoptimized
                      sizes='64px'
                      className='object-cover'
                    />
                  </div>
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={cn(
                      'inline-flex h-7 whitespace-nowrap items-center rounded-full px-3 text-xs font-semibold',
                      batchTaskStatusStyles[task.status]
                    )}
                  >
                    {task.status}
                  </span>
                </td>
                <td className='px-4 py-3 font-semibold text-primary'>{task.objectCount}</td>
                <td className='px-4 py-3'>{task.annotator}</td>
                <td className='px-4 py-3'>{task.frameCount}</td>
                <td className='px-4 py-3'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <TableActionButton
                      label='Annotate'
                      onClick={() => {}}
                      icon={<Icons.edit className='size-4' />}
                    />
                    <TableActionButton
                      label='View'
                      onClick={() => {}}
                      icon={<Icons.externalLink className='size-4' />}
                    />
                    <TableActionButton
                      label='Export annotation result'
                      onClick={() => {}}
                      icon={<Icons.upload className='size-4' />}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BatchConfigurationPanel({
  batch,
  activeStep,
  onStepChange
}: {
  batch: BatchItem;
  activeStep: BatchCreationStep;
  onStepChange: (step: BatchCreationStep) => void;
}) {
  const invitedCollaboratorAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=70',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=70'
  ];
  const [configurationDatasetUrl, setConfigurationDatasetUrl] = useState(
    'https://storage.example.com/datasets/north-park-lane-camera.zip'
  );
  const [configurationItemsPerPackage, setConfigurationItemsPerPackage] = useState('10');
  const [isConfigurationDatasetUploaded, setIsConfigurationDatasetUploaded] = useState(true);

  return (
    <div className='space-y-7'>
      <BatchCreationStepper
        activeStep={activeStep}
        onStepChange={onStepChange}
        className='rounded-none border-t border-slate-200'
      />

      {activeStep === 0 ? (
        <>
          <section className='space-y-2'>
            <FieldLabel>Batch Name</FieldLabel>
            <Input
              defaultValue={`${batch.businessType} - ${batch.name}`}
              className='h-11 max-w-[420px] rounded-xl'
            />
          </section>

          <section className='space-y-3'>
            <div className='whitespace-nowrap text-sm font-semibold text-slate-700'>Data Type</div>
            <div className='flex flex-wrap gap-2'>
              {batchDataTypes.map((type) => {
                const TypeIcon = type.icon;
                const active = type.label === 'Image';
                return (
                  <button
                    key={type.label}
                    type='button'
                    disabled
                    className={cn(
                      'inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold',
                      active
                        ? 'border-primary bg-primary/8 text-primary ring-1 ring-primary/20'
                        : 'border-slate-200 bg-white text-slate-400 opacity-70'
                    )}
                  >
                    {active ? (
                      <Icons.check className='h-4 w-4' />
                    ) : (
                      <TypeIcon className='h-4 w-4' />
                    )}
                    {type.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className='space-y-3'>
            <div className='whitespace-nowrap text-sm font-semibold text-slate-700'>
              Annotation Type
            </div>
            <div className='grid auto-rows-fr gap-5 xl:grid-cols-3'>
              {annotationTemplates.map((template) => {
                const active = template.id === 'scene-image';
                return (
                  <button
                    key={template.id}
                    type='button'
                    disabled
                    className={cn(
                      'group relative flex h-[360px] flex-col overflow-hidden rounded-2xl border bg-white text-left',
                      active
                        ? 'border-primary ring-1 ring-primary/25'
                        : 'border-slate-200 opacity-75'
                    )}
                  >
                    <div className='relative h-36 shrink-0 overflow-hidden bg-[linear-gradient(135deg,#f8fafc,#eef2f7)]'>
                      <Image
                        src={template.imageUrl}
                        alt={template.imageAlt}
                        fill
                        unoptimized
                        sizes='(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw'
                        className='object-cover'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent' />
                    </div>
                    <span
                      className={cn(
                        'absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full border',
                        active
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      )}
                    >
                      <Icons.check className='h-4 w-4' />
                    </span>
                    <div className='flex flex-1 flex-col gap-3 p-5'>
                      <div className='text-base font-semibold text-slate-950'>{template.title}</div>
                      <p className='line-clamp-5 text-sm leading-6 text-slate-600'>
                        {template.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className='space-y-2'>
            <FieldLabel>Batch Description</FieldLabel>
            <div className='relative'>
              <Textarea
                defaultValue='Operational batch for reviewing lane imagery and scene-level annotation quality.'
                maxLength={100}
                className='min-h-[220px] resize-none rounded-xl pr-16 pb-10'
              />
              <div className='absolute right-4 bottom-3 text-sm text-slate-500'>72/100</div>
            </div>
          </section>

          <div className='flex flex-wrap items-center gap-3'>
            <div className='flex -space-x-2'>
              {invitedCollaboratorAvatars.map((avatar) => (
                <div
                  key={avatar}
                  className='relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-slate-100'
                >
                  <Image
                    src={avatar}
                    alt='Assigned collaborator'
                    fill
                    unoptimized
                    className='object-cover'
                  />
                </div>
              ))}
            </div>
            <Button type='button' variant='outline' className='h-10 rounded-xl px-5'>
              Invite Collaborators
            </Button>
          </div>
        </>
      ) : activeStep === 1 ? (
        <DataUploadStep
          datasetUrl={configurationDatasetUrl}
          itemsPerPackage={configurationItemsPerPackage}
          isDatasetUploaded={isConfigurationDatasetUploaded}
          onDatasetUrlChange={setConfigurationDatasetUrl}
          onItemsPerPackageChange={setConfigurationItemsPerPackage}
          onUploadComplete={() => setIsConfigurationDatasetUploaded(true)}
          onUploadReset={() => setIsConfigurationDatasetUploaded(false)}
          itemsPerPackageLocked
          showClearUploadAction={false}
        />
      ) : activeStep === 2 ? (
        <TemplateConfigurationStep
          selectedTemplateId='scene-image'
          readOnlyConfigurationMethod
          configurationMethod='Copy from Existing Batch'
        />
      ) : (
        <BatchConfigurationStepPlaceholder step={batchCreationSteps[activeStep]} />
      )}

      <div className='flex justify-end gap-3 border-t border-slate-100 pt-5'>
        <Button type='button' variant='outline' className='h-10 rounded-xl px-6'>
          Cancel
        </Button>
        <Button type='button' variant='outline' className='h-10 rounded-xl px-6'>
          Preview
        </Button>
        <Button className='h-10 rounded-xl bg-primary px-6 text-white hover:bg-primary/90'>
          Confirm
        </Button>
        {activeStep === 2 ? (
          <Button className='h-10 rounded-xl bg-primary px-6 text-white hover:bg-primary/90'>
            Save as Template
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function BatchConfigurationStepPlaceholder({ step }: { step: string }) {
  return (
    <section className='rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center'>
      <div className='mx-auto flex max-w-md flex-col items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500'>
          <Icons.page className='h-5 w-5' />
        </div>
        <div className='text-base font-semibold text-slate-950'>{step}</div>
        <p className='text-sm leading-6 text-slate-500'>
          This step is reserved for the next configuration pass.
        </p>
      </div>
    </section>
  );
}

function BatchCard({ batch, onOpen }: { batch: BatchItem; onOpen: () => void }) {
  const progressColor = batch.status === 'Completed' ? '#22c55e' : '#8B5CF6';
  const remainderColor = '#d4d4d8';

  return (
    <article
      className='cursor-pointer overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50/50 shadow-sm transition-colors hover:border-primary/35 hover:bg-slate-50'
      role='button'
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <div className='grid min-h-[176px] md:grid-cols-[minmax(0,1fr)_172px]'>
        <div className='space-y-5 px-7 py-6'>
          <div className='flex items-center gap-3'>
            <span
              className={cn(
                'inline-flex h-8 whitespace-nowrap items-center rounded-full px-3 text-xs font-semibold',
                batchStatusStyles[batch.status]
              )}
            >
              {batch.status}
            </span>
            <h3 className='text-lg font-semibold text-slate-900'>{batch.name}</h3>
          </div>

          <div className='grid gap-3 text-sm text-slate-600 sm:grid-cols-2'>
            <div>
              <div className='text-slate-500'>Business Type</div>
              <div className='mt-1 font-medium text-slate-800'>{batch.businessType}</div>
            </div>
            <div>
              <div className='text-slate-500'>Bar Count</div>
              <div className='mt-1 font-medium text-slate-800'>{batch.itemCount}</div>
            </div>
            <div>
              <div className='text-slate-500'>Total Data</div>
              <div className='mt-1 font-medium text-slate-800'>{batch.totalCount}</div>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-slate-500'>
            <span className='inline-flex items-center gap-2'>
              <Icons.user className='h-4 w-4' />
              {batch.owner}
            </span>
            {batch.date ? (
              <span className='inline-flex items-center gap-2'>
                <Icons.calendar className='h-4 w-4' />
                {batch.date}
              </span>
            ) : null}
          </div>
        </div>

        <div className='border-t border-slate-200 bg-white px-6 py-5 md:border-t-0 md:border-l'>
          <div className='space-y-4'>
            <div className='text-sm font-medium text-slate-500'>Annotation Progress</div>
            <div className='flex justify-center'>
              <div
                className='relative h-18 w-18 rounded-full'
                style={{
                  background:
                    batch.progress === 0
                      ? remainderColor
                      : `conic-gradient(${progressColor} 0 ${batch.progress}%, ${remainderColor} ${batch.progress}% 100%)`
                }}
              >
                <div className='absolute inset-[10px] rounded-full bg-white' />
              </div>
            </div>
            <div className='text-center text-sm font-semibold text-slate-600'>
              {batch.progress}%
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
