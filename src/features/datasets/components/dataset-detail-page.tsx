'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { type DatasetRecord } from '../data/mock-datasets';

const statusBadgeClasses = {
  brand: 'border-primary/20 bg-primary/8 text-primary',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-blue-200 bg-blue-50 text-blue-700',
  danger: 'border-red-200 bg-red-50 text-red-600',
  info: 'border-blue-200 bg-blue-50 text-blue-700'
} as const;

const stageLabels = [
  'Data Ingestion',
  'Data Preprocessing',
  'Automated Production',
  'Human Collaboration',
  'Asset Delivery'
] as const;

export default function DatasetDetailPage({ dataset }: { dataset: DatasetRecord }) {
  const normalizedStatus = normalizeStatus(dataset.status);
  const stageColumns = buildStageColumns(normalizedStatus);
  const createdAt = dataset.createdAt ?? dataset.updatedAt;
  const enteredManual =
    normalizedStatus === 'Manual labeling in progress' ||
    normalizedStatus === 'Quality review in progress' ||
    normalizedStatus === 'Rework in progress' ||
    normalizedStatus === 'Accepted' ||
    normalizedStatus === 'Archived';
  const accepted = normalizedStatus === 'Accepted' || normalizedStatus === 'Archived';
  const autoLabelProgress = getAutoLabelProgress(normalizedStatus, dataset.files);
  const issueStats = buildIssueStats(dataset.files);

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/dashboard/datasets'>Dataset Management</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{dataset.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className='rounded-3xl border bg-white p-6 shadow-sm'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-foreground text-[28px] font-semibold leading-none tracking-tight'>
              {dataset.name}
            </h1>
            <Badge
              variant='outline'
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold',
                statusBadgeClasses[dataset.statusTone]
              )}
            >
              {normalizedStatus}
            </Badge>
            <InlineMeta label='Version' value={dataset.version} />
            <InlineMeta label='Created At' value={createdAt} />
            <InlineMeta label='Updated At' value={dataset.updatedAt} />
            <InlineMeta label='Creator' value={dataset.owner} />
            <InlineMeta label='Team' value={dataset.team} />
          </div>
          <div className='text-muted-foreground font-mono mt-3 text-sm'>
            Dataset ID: {dataset.id}
          </div>
        </section>
      </div>

      <section className='rounded-3xl border bg-white shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4'>
          <span className='text-sm font-semibold'>Status Flow</span>
          <div className='flex flex-wrap items-center gap-3'>
            <Button className='bg-brand-gradient h-9 rounded-xl border-transparent px-4 text-white hover:opacity-95'>
              Push to manual
            </Button>
            <Button variant='outline' disabled className='h-9 rounded-xl px-4'>
              Export
            </Button>
          </div>
        </div>
        <div className='space-y-4 p-6'>
          <div className='grid gap-4 xl:grid-cols-5'>
            {stageColumns.map((column, index) => (
              <FlowStep
                key={column.id}
                index={index + 1}
                label={stageLabels[index]}
                items={column.items}
              />
            ))}
          </div>
        </div>
      </section>

      <section className='rounded-3xl border bg-white shadow-sm'>
        <Tabs defaultValue='overview' className='gap-0'>
          <TabsList className='h-auto w-full justify-start gap-8 rounded-none border-b bg-transparent px-6 pt-4 pb-0'>
            <TabsTrigger
              value='overview'
              className='text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none h-12 w-[180px] flex-none justify-center rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-center text-base font-semibold data-[state=active]:border-[var(--brand-gradient-start)] data-[state=active]:bg-transparent'
            >
              Overview & metadata
            </TabsTrigger>
            <TabsTrigger
              value='preprocessing'
              className='text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none h-12 w-[180px] flex-none justify-center rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-center text-base font-semibold data-[state=active]:border-[var(--brand-gradient-start)] data-[state=active]:bg-transparent'
            >
              Data preprocessing
            </TabsTrigger>
            <TabsTrigger
              value='auto-labeling'
              className='text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none h-12 w-[180px] flex-none justify-center rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-center text-base font-semibold data-[state=active]:border-[var(--brand-gradient-start)] data-[state=active]:bg-transparent'
            >
              Auto labeling
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-8 px-6 py-6'>
            <div className='grid gap-4 xl:grid-cols-2'>
              <SectionCard title='Basic information'>
                <SummaryList
                  items={[
                    {
                      label: 'Dataset name / ID / version',
                      value: `${dataset.name} / ${dataset.id} / ${dataset.version}`
                    },
                    {
                      label: 'Task domain / annotation task type',
                      value: `${dataset.domain} / ${dataset.taskType}`
                    },
                    {
                      label: 'Dataset source / client name',
                      value: `${dataset.source} / ${dataset.source === 'Client' ? dataset.team : 'Internal'}`
                    },
                    {
                      label: 'Creator / team',
                      value: `${dataset.owner} / ${dataset.team}`
                    },
                    {
                      label: 'Created At / updated At',
                      value: `${createdAt} / ${dataset.updatedAt}`
                    }
                  ]}
                />
              </SectionCard>

              <SectionCard title='Metadata and storage information'>
                <SummaryList
                  items={[
                    { label: 'Dataset tags', value: dataset.tags.join(', ') },
                    { label: 'Current access method', value: dataset.summary.importMethod },
                    { label: 'Storage path / mount info', value: dataset.summary.storage },
                    { label: 'Import scope summary', value: dataset.summary.scope },
                    {
                      label: 'Current effective result note',
                      value: dataset.summary.notes
                    }
                  ]}
                />
              </SectionCard>
            </div>

            <div className='grid gap-4 xl:grid-cols-2'>
              <SectionCard title='Data and label statistics'>
                <SummaryList
                  items={[
                    { label: 'Total files', value: dataset.files.toLocaleString() },
                    { label: 'Total data size', value: dataset.size },
                    { label: 'Annotation class statistics', value: 'Pending' }
                  ]}
                />
              </SectionCard>

              <SectionCard title='Quality review and acceptance summary'>
                <div className='space-y-4'>
                  <SummaryList
                    items={[
                      { label: 'Current status', value: normalizedStatus },
                      { label: 'Entered human collaboration', value: enteredManual ? 'Yes' : 'No' },
                      {
                        label: 'Quality review summary',
                        value: enteredManual
                          ? 'Available in manual review flow'
                          : 'Not in manual quality review'
                      },
                      { label: 'Accepted', value: accepted ? 'Yes' : 'No' }
                    ]}
                  />
                  <InfoNote>
                    {accepted
                      ? 'The current dataset has already completed downstream result decision.'
                      : 'The current dataset has completed or is approaching automatic production, but result decision is still pending.'}
                  </InfoNote>
                </div>
              </SectionCard>
            </div>
          </TabsContent>

          <TabsContent value='preprocessing' className='space-y-8 px-6 py-6'>
            <SectionCard title='Description'>
              <InfoNote>
                Data preprocessing is a pre-labeling step. Workflow configuration belongs to a
                dedicated configuration page.
              </InfoNote>
            </SectionCard>

            <SectionCard title='Processing progress and results'>
              <div className='text-muted-foreground text-sm'>
                {normalizedStatus === 'ETL in progress'
                  ? 'Current sample: preprocessing is in progress and the dataset has not yet reached the unlabeled state.'
                  : normalizedStatus === 'ETL exception'
                    ? 'Current sample: preprocessing is blocked by an ETL exception and requires operator intervention.'
                    : 'Current sample: preprocessing has been completed and the dataset has entered the unlabeled state.'}
              </div>
            </SectionCard>

            <SectionCard title='Processed directory structure'>
              <div className='pl-1'>
                <ul className='space-y-2 text-sm'>
                  <li className='font-medium'>processed_dataset</li>
                  <li className='pl-6 text-slate-600'>images</li>
                  <li className='pl-6 text-slate-600'>annotations</li>
                  <li className='pl-6 text-slate-600'>meta</li>
                </ul>
              </div>
            </SectionCard>

            <div className='flex flex-wrap justify-end gap-3'>
              <Button variant='outline' disabled className='h-9 rounded-xl px-4'>
                Start processing
              </Button>
              <Button variant='outline' disabled className='h-9 rounded-xl px-4'>
                Retry
              </Button>
              <Button variant='outline' className='h-9 rounded-xl px-4'>
                View logs
              </Button>
              <Button variant='outline' disabled className='h-9 rounded-xl px-4'>
                Browse raw data
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='auto-labeling' className='space-y-8 px-6 py-6'>
            <SectionCard title='Current configuration summary'>
              <div className='space-y-3'>
                <ConfigRow>
                  Annotation task type: {dataset.taskType} | Model: {dataset.config.model}{' '}
                  {dataset.config.selectedVersion}
                </ConfigRow>
                <ConfigRow>
                  Parameter summary: Confidence threshold {dataset.config.confidence}, IoU threshold{' '}
                  {dataset.config.iou}
                </ConfigRow>
                <ConfigRow>Target class filter: {dataset.config.classes.join(', ')}</ConfigRow>
              </div>
            </SectionCard>

            <SectionCard title='Execution progress and results'>
              <div className='space-y-4'>
                <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                  <span className='text-sm font-semibold'>
                    {autoLabelProgress.complete
                      ? 'Auto labeling has completed'
                      : autoLabelProgress.error
                        ? 'Auto labeling is blocked'
                        : 'Auto labeling is in progress'}
                  </span>
                  <Button className='bg-brand-gradient h-9 rounded-xl border-transparent px-4 text-white hover:opacity-95'>
                    Open visualization
                  </Button>
                </div>
                <div className='mb-2 flex items-center justify-between gap-3 text-sm'>
                  <span>Execution progress</span>
                  <span>
                    {autoLabelProgress.finished.toLocaleString()} / {dataset.files.toLocaleString()}{' '}
                    ({autoLabelProgress.percent}%)
                  </span>
                </div>
                <Progress
                  value={autoLabelProgress.percent}
                  className='h-2 [&>div]:bg-[linear-gradient(135deg,var(--brand-gradient-start),var(--brand-gradient-end))]'
                />
                <div
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm',
                    autoLabelProgress.error
                      ? 'bg-red-50 text-red-700'
                      : autoLabelProgress.complete
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-50 text-blue-700'
                  )}
                >
                  {autoLabelProgress.note}
                </div>
              </div>
            </SectionCard>

            <SectionCard title='Result versions'>
              <SummaryList
                items={dataset.resultVersions.map((version, index) => ({
                  label: version.id,
                  value: `${version.title} | ${extractDate(version.meta)} | ${
                    index === 0 ? 'Latest result version' : 'View'
                  }${version.current ? ' | Current effective result version' : ' | Set as effective version'}`
                }))}
              />
              <InfoNote className='mt-4'>
                The current result decision still applies to the currently effective result version.
              </InfoNote>
            </SectionCard>

            <SectionCard title='Issue feedback statistics'>
              <div className='space-y-4'>
                <InfoNote>
                  Current display is the issue feedback summary for the selected result version.
                </InfoNote>
                <SummaryList items={issueStats} />
              </div>
            </SectionCard>

            <SectionCard title='Result decision area'>
              <div className='space-y-4'>
                <InfoNote>
                  The current result decision still applies to the currently effective result
                  version.
                </InfoNote>
                <div className='space-y-3'>
                  <div className='text-sm font-semibold'>Step 1: Result retention decision</div>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <DecisionCard active>Keep result</DecisionCard>
                    <DecisionCard>Discard result</DecisionCard>
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='text-sm font-semibold'>Step 2: Follow-up routing decision</div>
                  <div className='flex flex-wrap gap-3'>
                    <Button className='bg-brand-gradient h-9 rounded-xl border-transparent px-4 text-white hover:opacity-95'>
                      Accept
                    </Button>
                    <Button variant='outline' className='h-9 rounded-xl px-4'>
                      Push to manual
                    </Button>
                  </div>
                </div>
              </div>
            </SectionCard>

            <div className='flex flex-wrap justify-end gap-3'>
              <Button variant='outline' disabled className='h-9 rounded-xl px-4'>
                Start auto labeling
              </Button>
              <Button variant='outline' className='h-9 rounded-xl px-4'>
                Reconfigure
              </Button>
              <Button variant='outline' disabled className='h-9 rounded-xl px-4'>
                Retry
              </Button>
              <Button variant='outline' className='h-9 rounded-xl px-4'>
                View logs
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function InlineMeta({ label, value }: { label: string; value: string }) {
  return (
    <span className='text-muted-foreground text-sm whitespace-nowrap'>
      {label}: <strong className='text-foreground font-medium'>{value}</strong>
    </span>
  );
}

function FlowStep({
  index,
  label,
  items
}: {
  index: number;
  label: string;
  items: Array<{ label: string; state: 'done' | 'active' | 'idle' | 'error' }>;
}) {
  const allDone = items.every((item) => item.state === 'done');
  const hasActive = items.some((item) => item.state === 'active' || item.state === 'error');

  return (
    <div
      className={cn(
        'rounded-2xl border p-4',
        allDone && 'border-emerald-200 bg-emerald-50/40',
        hasActive && 'border-blue-200 bg-blue-50/40',
        !allDone && !hasActive && 'border-slate-200 bg-slate-50/60'
      )}
    >
      <div className='mb-4 grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
            allDone && 'bg-emerald-600 text-white',
            hasActive && 'bg-blue-600 text-white',
            !allDone && !hasActive && 'bg-slate-200 text-slate-600'
          )}
        >
          {allDone ? '✓' : index}
        </div>
        <div className='text-sm font-semibold'>{label}</div>
      </div>
      <div className='ml-[44px] flex min-h-[72px] flex-wrap content-start gap-2'>
        {items.map((item) => (
          <span
            key={item.label}
            className={cn(
              'inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-medium',
              item.state === 'done' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
              item.state === 'active' && 'border-blue-200 bg-blue-50 text-blue-700 font-semibold',
              item.state === 'idle' && 'border-slate-200 bg-slate-50 text-slate-500',
              item.state === 'error' && 'border-red-200 bg-red-50 text-red-600 font-semibold'
            )}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='space-y-4'>
      <div className='space-y-2'>
        <h3 className='text-foreground text-base font-semibold'>{title}</h3>
        <div className='bg-border h-px w-full' />
      </div>
      <div>{children}</div>
    </section>
  );
}

function SummaryList({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className='space-y-3'>
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={cn(
            'grid gap-3 text-sm md:grid-cols-[180px_minmax(0,1fr)]',
            index < items.length - 1 && 'border-b border-dashed pb-3'
          )}
        >
          <div className='text-muted-foreground leading-6'>{item.label}</div>
          <div className='text-foreground leading-6 font-medium'>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function InfoNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800',
        className
      )}
    >
      {children}
    </div>
  );
}

function ConfigRow({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-b border-dashed pb-3 text-sm leading-6 last:border-b-0 last:pb-0'>
      {children}
    </div>
  );
}

function DecisionCard({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className={cn(
        'border-b pb-3 text-sm font-semibold',
        active ? 'border-primary text-primary' : 'border-border text-foreground'
      )}
    >
      {children}
    </div>
  );
}

function normalizeStatus(status: string) {
  if (status === 'Preprocessing in progress') return 'ETL in progress';
  if (status === 'Preprocessing exception') return 'ETL exception';
  return status;
}

function buildStageColumns(status: string) {
  const sequence = [
    'Importing',
    'Import complete',
    'ETL in progress',
    'Unlabeled',
    'Auto labeling in progress',
    'Auto labeling complete',
    'Manual labeling in progress',
    'Quality review in progress',
    'Rework in progress',
    'Accepted',
    'Archived'
  ];

  const activeIndex = sequence.indexOf(status);

  const stageGroups = [
    {
      id: 'ingestion',
      items: ['Importing', 'Import complete']
    },
    {
      id: 'preprocessing',
      items: ['ETL in progress', 'Unlabeled']
    },
    {
      id: 'automation',
      items: ['Auto labeling in progress', 'Auto labeling complete']
    },
    {
      id: 'human',
      items: ['Manual labeling in progress', 'Quality review in progress', 'Rework in progress']
    },
    {
      id: 'delivery',
      items: ['Accepted', 'Archived']
    }
  ] as const;

  const errorMap: Record<string, { groupId: string; label: string }> = {
    'Import exception': { groupId: 'ingestion', label: 'Import exception' },
    'ETL exception': { groupId: 'preprocessing', label: 'ETL exception' },
    'Auto labeling exception': { groupId: 'automation', label: 'Auto labeling exception' }
  };

  return stageGroups.map((group) => {
    const defaultItems = group.items.map((label) => {
      const index = sequence.indexOf(label);
      let state: 'done' | 'active' | 'idle' = 'idle';
      if (activeIndex !== -1 && index < activeIndex) state = 'done';
      if (label === status) state = 'active';
      return { label, state };
    });

    const error = errorMap[status];
    if (error && error.groupId === group.id) {
      return {
        id: group.id,
        items: [...defaultItems, { label: error.label, state: 'error' as const }]
      };
    }

    return { id: group.id, items: defaultItems };
  });
}

function getAutoLabelProgress(status: string, totalFiles: number) {
  if (status === 'Auto labeling exception') {
    return {
      finished: Math.floor(totalFiles * 0.44),
      percent: 44,
      complete: false,
      error: true,
      note: 'Auto labeling is blocked and requires operator intervention before visualization can continue.'
    };
  }

  if (
    status === 'Auto labeling complete' ||
    status === 'Manual labeling in progress' ||
    status === 'Quality review in progress' ||
    status === 'Rework in progress' ||
    status === 'Accepted' ||
    status === 'Archived'
  ) {
    return {
      finished: totalFiles,
      percent: 100,
      complete: true,
      error: false,
      note: 'Auto labeling results have been generated and are available in the visualization layer.'
    };
  }

  if (status === 'Auto labeling in progress') {
    return {
      finished: Math.floor(totalFiles * 0.75),
      percent: 75,
      complete: false,
      error: false,
      note: 'Auto labeling is currently running and partial output is still being generated.'
    };
  }

  return {
    finished: 0,
    percent: 0,
    complete: false,
    error: false,
    note: 'Auto labeling has not started yet for this dataset.'
  };
}

function buildIssueStats(totalFiles: number) {
  const marked = Math.min(126, totalFiles);
  return [
    {
      label: 'Marked samples',
      value: `${marked} / ${totalFiles.toLocaleString()} (${((marked / totalFiles) * 100).toFixed(2)}%)`
    },
    { label: 'Missed objects', value: '54 (42.86%)' },
    { label: 'Wrong class', value: '31 (24.60%)' },
    { label: 'Annotation precision', value: '28 (22.22%)' },
    { label: 'Other', value: '13 (10.32%)' }
  ];
}

function extractDate(meta: string) {
  const match = meta.match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/);
  return match?.[0] ?? meta;
}
