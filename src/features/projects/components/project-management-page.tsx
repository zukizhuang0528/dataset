'use client';

import { useMemo, useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
                      onClick={() => setSelectedProjectId(project.id)}
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
            <div className='space-y-5'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <h2 className='text-foreground text-[24px] font-semibold tracking-tight'>
                  {selectedProjectListItem?.name ?? selectedProject.title}
                </h2>
                <Button className='bg-primary h-10 rounded-xl px-5 text-white hover:bg-primary/90'>
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
                  <BatchCard key={batch.id} batch={batch} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function BatchCard({ batch }: { batch: BatchItem }) {
  const progressColor = batch.status === 'Completed' ? '#22c55e' : '#8B5CF6';
  const remainderColor = '#d4d4d8';

  return (
    <article className='overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50/50 shadow-sm'>
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
