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
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { type DatasetRecord } from '../data/mock-datasets';

const statusBadgeClasses = {
  brand: 'border-primary/18 bg-primary/6 text-primary',
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
  const workflowStatus =
    dataset.id === 'DS-20260322-000115' ? 'Auto labeling complete' : normalizedStatus;
  const stageColumns = buildStageColumns(workflowStatus);
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
  const labelStats = buildLabelStats(dataset.config.classes, dataset.files);

  return (
    <div className='space-y-8 pb-8'>
      <div className='space-y-5'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/dashboard/datasets'>Dataset Management</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dataset Detail</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className='rounded-[28px] border border-border/80 bg-white px-8 py-7 shadow-sm'>
          <div className='flex flex-wrap items-start gap-4'>
            <div className='min-w-0 flex-1 space-y-5'>
              <div className='flex flex-wrap items-center gap-3'>
                <h1 className='text-foreground text-[28px] font-semibold leading-tight tracking-tight'>
                  {dataset.name}
                </h1>
                <Badge
                  variant='outline'
                  className={cn(
                    'rounded-full border px-4 py-1 text-xs font-semibold',
                    statusBadgeClasses[dataset.statusTone]
                  )}
                >
                  {normalizedStatus}
                </Badge>
              </div>

              <div className='grid gap-x-8 gap-y-5 md:grid-cols-3 xl:grid-cols-6'>
                <TopMeta label='Version' value={dataset.version} />
                <TopMeta label='Created' value={createdAt} />
                <TopMeta label='Updated' value={dataset.updatedAt} />
                <TopMeta label='Creator' value={dataset.owner} />
                <TopMeta label='Team' value={dataset.team} />
                <TopMeta label='Dataset ID' value={dataset.id} mono compact />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className='rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <h2 className='text-foreground text-xl font-semibold tracking-tight'>Status Workflow</h2>
          <div className='flex flex-wrap items-center gap-3'>
            <Button className='bg-primary h-10 rounded-xl border-transparent px-5 text-white shadow-sm hover:bg-primary/90'>
              Push to Manual
            </Button>
            <Button variant='outline' disabled className='h-10 rounded-xl px-5'>
              Export
            </Button>
          </div>
        </div>

        <div className='mt-8'>
          <div className='relative hidden lg:block'>
            <div className='absolute top-4 right-[8%] left-[8%] h-px bg-slate-200' />
          </div>
          <div className='grid gap-5 lg:grid-cols-5'>
            {stageColumns.map((column, index) => (
              <WorkflowStage
                key={column.id}
                index={index + 1}
                label={stageLabels[index]}
                items={column.items}
              />
            ))}
          </div>
        </div>
      </section>

      <section className='rounded-[28px] bg-transparent'>
        <Tabs defaultValue='overview' className='gap-0'>
          <TabsList className='h-auto w-full justify-start gap-8 rounded-none border-b border-border/80 bg-transparent px-0 pt-0 pb-0'>
            <DetailTab value='overview'>Overview & metadata</DetailTab>
            <DetailTab value='preprocessing'>Data preprocessing</DetailTab>
            <DetailTab value='auto-labeling'>Auto labeling</DetailTab>
          </TabsList>

          <TabsContent value='overview' className='px-0 pt-8'>
            <div className='grid gap-6 xl:grid-cols-2'>
              <ContentPanel
                icon={<Icons.info className='size-4' />}
                title='Basic Information'
                dense={false}
              >
                <DetailsGrid
                  items={[
                    {
                      label: 'Dataset Name / ID / Version',
                      value: `${dataset.name} / ${dataset.id} / ${dataset.version}`
                    },
                    {
                      label: 'Task Domain / Labeling Type',
                      value: `${dataset.domain} / ${dataset.taskType}`
                    },
                    {
                      label: 'Data Source / Client',
                      value: `${dataset.source} / ${dataset.source === 'Client' ? dataset.team : 'Internal'}`
                    },
                    {
                      label: 'Creator / Team',
                      value: `${dataset.owner} / ${dataset.team}`
                    },
                    {
                      label: 'Created Time / Updated Time',
                      value: `${createdAt} / ${dataset.updatedAt}`
                    }
                  ]}
                />
              </ContentPanel>

              <ContentPanel
                icon={<Icons.workspace className='size-4' />}
                title='Metadata & Storage Information'
              >
                <MetadataCodeBlock
                  lines={[
                    ['storagePath', dataset.summary.storage],
                    ['dataFormat', dataset.summary.importMethod],
                    ['scope', dataset.summary.scope],
                    ['tags', dataset.tags.join(', ')],
                    ['notes', dataset.summary.notes]
                  ]}
                />
              </ContentPanel>

              <ContentPanel
                icon={<Icons.galleryVerticalEnd className='size-4' />}
                title='Data & Label Statistics'
              >
                <div className='grid gap-4 sm:grid-cols-2'>
                  <StatBlock label='Total Files' value={dataset.files.toLocaleString()} />
                  <StatBlock label='Total Data Size' value={dataset.size} />
                </div>

                <div className='mt-6 space-y-3'>
                  <div className='text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase'>
                    Label classes statistics
                  </div>
                  <div className='space-y-3'>
                    {labelStats.map((item) => (
                      <div
                        key={item.label}
                        className='flex items-center justify-between gap-4 border-b border-dashed border-slate-200 pb-3 last:border-b-0 last:pb-0'
                      >
                        <div className='flex items-center gap-3 text-sm'>
                          <span className='bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full'>
                            <Icons.circle className='size-3.5 fill-current stroke-none' />
                          </span>
                          <span className='text-slate-700'>{item.label}</span>
                        </div>
                        <span className='text-foreground text-sm font-semibold'>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ContentPanel>

              <ContentPanel
                icon={<Icons.badgeCheck className='size-4' />}
                title='Quality Review & Acceptance Summary'
              >
                <NoticeBox tone={accepted ? 'success' : 'warning'}>
                  {accepted
                    ? 'The dataset has already passed downstream decision making and can proceed to delivery.'
                    : 'Automated labeling has completed. The dataset still requires human review or result decision before sign-off.'}
                </NoticeBox>

                <div className='mt-5 grid gap-4 sm:grid-cols-2'>
                  <MiniMetric
                    label='Reviewed Samples'
                    value={
                      enteredManual
                        ? `${dataset.files.toLocaleString()} / ${dataset.files.toLocaleString()}`
                        : `0 / ${dataset.files.toLocaleString()}`
                    }
                  />
                  <MiniMetric
                    label='Error Rate (Est.)'
                    value={accepted ? '0.7%' : (issueStats[1]?.value ?? '--')}
                  />
                </div>
              </ContentPanel>
            </div>
          </TabsContent>

          <TabsContent value='preprocessing' className='px-0 pt-8'>
            <div className='space-y-8'>
              <SimpleSection
                icon={<Icons.info className='size-4' />}
                title='Description'
                contentClassName='space-y-0'
              >
                <NoticeBox tone='warning'>
                  Data preprocessing is a prerequisite step before labeling. When configuring the
                  workflow, it automatically jumps to a dedicated configuration page.
                </NoticeBox>
              </SimpleSection>

              <SimpleSection
                icon={<Icons.circleCheck className='size-4' />}
                title='Processing Progress & Results'
                contentClassName='space-y-0'
              >
                <SoftCard className='flex items-center gap-3 px-5 py-4'>
                  <span className='flex size-3 items-center justify-center rounded-full bg-emerald-500' />
                  <p className='text-sm leading-7'>
                    <span className='text-foreground font-semibold'>Current status:</span>{' '}
                    {normalizedStatus === 'ETL in progress'
                      ? 'Preprocessing is still running and the dataset has not yet entered the unlabeled state.'
                      : normalizedStatus === 'ETL exception'
                        ? 'Preprocessing is blocked by an ETL exception and requires operator intervention.'
                        : 'Preprocessing is complete. Data has entered the unlabeled state.'}
                  </p>
                </SoftCard>
              </SimpleSection>

              <SimpleSection
                icon={<Icons.workspace className='size-4' />}
                title='Processed Directory Structure'
                contentClassName='space-y-0'
              >
                <SoftCard className='px-6 py-5'>
                  <div className='font-mono text-sm leading-8'>
                    <div className='flex items-center gap-3 text-slate-800'>
                      <Icons.workspace className='size-4 text-slate-400' />
                      processed_dataset
                    </div>
                    <div className='ml-8 border-l border-dashed border-slate-200 pl-6'>
                      <div className='flex items-center gap-3 text-slate-600'>
                        <Icons.workspace className='size-4 text-sky-400' />
                        images
                      </div>
                      <div className='flex items-center gap-3 text-slate-600'>
                        <Icons.workspace className='size-4 text-emerald-400' />
                        annotations
                      </div>
                      <div className='flex items-center gap-3 text-slate-600'>
                        <Icons.workspace className='size-4 text-primary/80' />
                        meta
                      </div>
                    </div>
                  </div>
                </SoftCard>
              </SimpleSection>

              <div className='flex flex-wrap justify-end gap-3'>
                <Button variant='outline' disabled className='h-10 rounded-xl px-5'>
                  Start Processing
                </Button>
                <Button variant='outline' disabled className='h-10 rounded-xl px-5'>
                  Retry
                </Button>
                <Button variant='outline' className='h-10 rounded-xl px-5'>
                  View Logs
                </Button>
                <Button className='bg-primary h-10 rounded-xl border-transparent px-5 text-white hover:bg-primary/90'>
                  Browse Raw Data
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='auto-labeling' className='px-0 pt-8'>
            <div className='space-y-8'>
              <SimpleSection
                icon={<Icons.settings className='size-4' />}
                title='Current Configuration Summary'
                contentClassName='space-y-0'
              >
                <SoftCard className='space-y-4 px-5 py-5'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <SummaryTile
                      label='Task Type & Model'
                      value={`${dataset.taskType} | ${dataset.config.model} ${dataset.config.selectedVersion}`}
                    />
                    <SummaryTile
                      label='Parameter Summary'
                      value={`Confidence ${dataset.config.confidence} | IoU ${dataset.config.iou}`}
                    />
                  </div>
                  <SummaryTile
                    label='Classes Filter'
                    value={dataset.config.classes.join(', ')}
                    full
                  />
                </SoftCard>
              </SimpleSection>

              <SimpleSection
                icon={<Icons.trendingUp className='size-4' />}
                title='Execution Progress & Results'
                contentClassName='space-y-0'
              >
                <SoftCard className='space-y-5 px-5 py-5'>
                  <div className='flex flex-wrap items-start justify-between gap-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-foreground text-[28px] font-semibold leading-none tracking-tight'>
                          {autoLabelProgress.complete
                            ? 'Auto Labeling Complete'
                            : autoLabelProgress.error
                              ? 'Auto Labeling Blocked'
                              : 'Auto Labeling In Progress'}
                        </h3>
                        {autoLabelProgress.complete ? (
                          <Icons.circleCheck className='size-5 text-emerald-500' />
                        ) : autoLabelProgress.error ? (
                          <Icons.warning className='size-5 text-red-500' />
                        ) : null}
                      </div>
                    </div>

                    <Button className='bg-primary h-10 rounded-xl border-transparent px-5 text-white hover:bg-primary/90'>
                      Enter Visualizer
                    </Button>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between gap-3 text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase'>
                      <span>Execution Progress</span>
                      <span>
                        {autoLabelProgress.finished.toLocaleString()} /{' '}
                        {dataset.files.toLocaleString()} ({autoLabelProgress.percent}%)
                      </span>
                    </div>
                    <Progress
                      value={autoLabelProgress.percent}
                      className='h-2.5 rounded-full bg-slate-100 [&>div]:bg-[linear-gradient(90deg,var(--brand-gradient-start),var(--brand-gradient-end))]'
                    />
                  </div>

                  <NoticeBox
                    tone={
                      autoLabelProgress.error
                        ? 'danger'
                        : autoLabelProgress.complete
                          ? 'success'
                          : 'info'
                    }
                  >
                    {autoLabelProgress.note}
                  </NoticeBox>
                </SoftCard>
              </SimpleSection>

              <SimpleSection
                icon={<Icons.clock className='size-4' />}
                title='Result Versions'
                contentClassName='space-y-0'
              >
                <SoftCard className='overflow-hidden px-0 py-0'>
                  <div className='divide-y divide-slate-100'>
                    {dataset.resultVersions.map((version, index) => (
                      <div
                        key={version.id}
                        className='flex flex-wrap items-center justify-between gap-4 px-5 py-4'
                      >
                        <div className='flex min-w-0 flex-1 items-center gap-4'>
                          <div className='text-foreground min-w-10 text-sm font-semibold'>
                            {version.id}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <div className='text-foreground text-sm font-medium'>
                              {version.title}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              {extractDate(version.meta)}
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-wrap items-center gap-2'>
                          {index === 0 && (
                            <Badge className='rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-none'>
                              Latest result
                            </Badge>
                          )}
                          {version.current && (
                            <Badge className='rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-none'>
                              Active version
                            </Badge>
                          )}
                          <button className='text-primary text-sm font-semibold'>View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='border-t border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-700'>
                    Currently inspecting a temporary result version. Decisions still apply to the
                    active output version.
                  </div>
                </SoftCard>
              </SimpleSection>

              <SimpleSection
                icon={<Icons.info className='size-4' />}
                title='Issue Feedback Statistics'
                contentClassName='space-y-0'
              >
                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
                  {issueStats.map((item) => (
                    <SoftCard key={item.label} className='px-4 py-4'>
                      <div className='text-muted-foreground text-[11px] font-semibold tracking-[0.16em] uppercase'>
                        {item.label}
                      </div>
                      <div className='text-foreground mt-3 text-base font-semibold'>
                        {item.value}
                      </div>
                    </SoftCard>
                  ))}
                </div>
              </SimpleSection>

              <SimpleSection
                icon={<Icons.fileTypeDoc className='size-4' />}
                title='Result Decision Area'
                contentClassName='space-y-0'
              >
                <SoftCard className='space-y-6 px-5 py-5'>
                  <div className='space-y-3'>
                    <div className='text-foreground text-sm font-semibold'>
                      Step 1: Result Retention Decision
                    </div>
                    <div className='grid gap-4 md:grid-cols-2'>
                      <DecisionPanel
                        active
                        title='Retain Result'
                        description='Keep the generated labels for this version.'
                      />
                      <DecisionPanel
                        title='Discard Result'
                        description='Delete all labels generated in this run.'
                      />
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='text-foreground text-sm font-semibold'>
                      Step 2: Subsequent Flow Decision
                    </div>
                    <div className='flex flex-wrap gap-3'>
                      <Button className='bg-primary h-10 rounded-xl border-transparent px-5 text-white hover:bg-primary/90'>
                        Pass Acceptance
                      </Button>
                      <Button variant='outline' className='h-10 rounded-xl px-5'>
                        Push to Manual
                      </Button>
                    </div>
                  </div>
                </SoftCard>
              </SimpleSection>

              <div className='flex flex-wrap justify-end gap-3'>
                <Button variant='outline' disabled className='h-10 rounded-xl px-5'>
                  Start Auto Labeling
                </Button>
                <Button variant='outline' className='h-10 rounded-xl px-5'>
                  Reconfigure
                </Button>
                <Button variant='outline' disabled className='h-10 rounded-xl px-5'>
                  Retry
                </Button>
                <Button variant='outline' className='h-10 rounded-xl px-5'>
                  View Logs
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function DetailTab({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className='text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none h-12 w-[180px] flex-none justify-center rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-3 text-center text-base font-semibold data-[state=active]:border-[var(--brand-gradient-start)] data-[state=active]:bg-transparent'
    >
      {children}
    </TabsTrigger>
  );
}

function TopMeta({
  label,
  value,
  mono,
  compact
}: {
  label: string;
  value: string;
  mono?: boolean;
  compact?: boolean;
}) {
  return (
    <div className='space-y-2'>
      <div className='text-muted-foreground text-[11px] font-semibold tracking-[0.16em] uppercase'>
        {label}
      </div>
      <div
        className={cn(
          'text-foreground text-[15px] leading-6 font-medium',
          mono && 'font-mono text-[13px]',
          compact && 'inline-flex rounded-lg bg-slate-50 px-3 py-1'
        )}
      >
        {value}
      </div>
    </div>
  );
}

function WorkflowStage({
  index,
  label,
  items
}: {
  index: number;
  label: string;
  items: Array<{ label: string; state: 'done' | 'active' | 'idle' | 'error' }>;
}) {
  const stageState = getStageState(items);

  return (
    <div className='space-y-4'>
      <div className='space-y-4'>
        <div className='relative flex justify-center'>
          <div
            className={cn(
              'relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-white text-xs font-semibold',
              stageState === 'done' && 'border-emerald-500 text-emerald-600',
              stageState === 'active' && 'border-primary text-primary',
              stageState === 'error' && 'border-red-500 text-red-600',
              stageState === 'idle' && 'border-slate-200 text-slate-400'
            )}
          >
            {stageState === 'done' ? <Icons.check className='size-4' /> : index}
          </div>
        </div>
        <div className='space-y-3 text-center'>
          <div
            className={cn(
              'text-sm font-semibold',
              stageState === 'done' && 'text-foreground',
              stageState === 'active' && 'text-primary',
              stageState === 'error' && 'text-red-600',
              stageState === 'idle' && 'text-slate-400'
            )}
          >
            {label}
          </div>
          <div
            className={cn(
              'h-0.5 rounded-full',
              stageState === 'done' && 'bg-emerald-500',
              stageState === 'active' && 'bg-primary',
              stageState === 'error' && 'bg-red-500',
              stageState === 'idle' && 'bg-slate-200'
            )}
          />
        </div>
      </div>

      <div className='space-y-2'>
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex min-h-10 items-center justify-center rounded-xl border px-3 text-center text-xs font-medium',
              item.state === 'done' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
              item.state === 'active' && 'border-blue-200 bg-blue-50 text-blue-700',
              item.state === 'idle' && 'border-slate-200 bg-white text-slate-400',
              item.state === 'error' && 'border-red-200 bg-red-50 text-red-600'
            )}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentPanel({
  icon,
  title,
  children,
  dense = true
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  dense?: boolean;
}) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-border/80 bg-white shadow-sm',
        dense ? 'p-6' : 'p-7'
      )}
    >
      <div className='mb-6 flex items-center gap-3'>
        <span className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full'>
          {icon}
        </span>
        <h3 className='text-foreground text-2xl font-semibold tracking-tight'>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function DetailsGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className='grid gap-x-8 gap-y-7 md:grid-cols-2'>
      {items.map((item) => (
        <div key={item.label} className='space-y-2'>
          <div className='text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase'>
            {item.label}
          </div>
          <div className='text-foreground text-[15px] leading-8'>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function MetadataCodeBlock({ lines }: { lines: Array<[string, string]> }) {
  return (
    <div className='rounded-2xl border border-slate-100 bg-slate-50 px-6 py-5 font-mono text-[14px] leading-8 text-slate-600'>
      <div>{'{'}</div>
      {lines.map(([key, value], index) => (
        <div key={key} className='pl-6'>
          <span className='text-slate-500'>"${key}"</span>: <span>"{value}"</span>
          {index < lines.length - 1 ? ',' : ''}
        </div>
      ))}
      <div>{'}'}</div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-5'>
      <div className='text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase'>
        {label}
      </div>
      <div className='text-foreground mt-3 text-[40px] font-semibold leading-none tracking-tight'>
        {value}
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-5'>
      <div className='text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase'>
        {label}
      </div>
      <div className='text-foreground mt-3 text-[28px] font-semibold leading-none tracking-tight'>
        {value}
      </div>
    </div>
  );
}

function SimpleSection({
  icon,
  title,
  children,
  contentClassName
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <section className='space-y-5'>
      <div className='flex items-center gap-3'>
        <span className='text-primary'>{icon}</span>
        <h3 className='text-foreground text-xs font-semibold tracking-[0.18em] uppercase'>
          {title}
        </h3>
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}

function SoftCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-[24px] border border-slate-100 bg-white shadow-sm', className)}>
      {children}
    </div>
  );
}

function SummaryTile({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-4',
        full && 'md:col-span-2'
      )}
    >
      <div className='text-muted-foreground text-[11px] font-semibold tracking-[0.16em] uppercase'>
        {label}
      </div>
      <div className='text-foreground mt-2 text-[15px] font-semibold leading-7'>{value}</div>
    </div>
  );
}

function DecisionPanel({
  title,
  description,
  active
}: {
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-5 py-5 transition-colors',
        active ? 'border-primary/50 bg-primary/4' : 'border-slate-200 bg-white'
      )}
    >
      <div className='flex items-start gap-3'>
        <span
          className={cn(
            'mt-0.5 flex size-8 items-center justify-center rounded-xl',
            active ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
          )}
        >
          {active ? <Icons.fileTypeDoc className='size-4' /> : <Icons.trash className='size-4' />}
        </span>
        <div className='space-y-1'>
          <div className={cn('text-sm font-semibold', active ? 'text-primary' : 'text-foreground')}>
            {title}
          </div>
          <div className='text-muted-foreground text-sm leading-6'>{description}</div>
        </div>
      </div>
    </div>
  );
}

function NoticeBox({
  children,
  tone
}: {
  children: React.ReactNode;
  tone: 'warning' | 'success' | 'danger' | 'info';
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-5 py-4 text-sm leading-7',
        tone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-800',
        tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        tone === 'danger' && 'border-red-200 bg-red-50 text-red-700',
        tone === 'info' && 'border-blue-200 bg-blue-50 text-blue-700'
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

function getStageState(items: Array<{ state: 'done' | 'active' | 'idle' | 'error' }>) {
  if (items.some((item) => item.state === 'error')) return 'error' as const;
  if (items.some((item) => item.state === 'active')) return 'active' as const;
  if (items.every((item) => item.state === 'done')) return 'done' as const;
  return 'idle' as const;
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
      note: 'Auto labeling results generated successfully. You can enter the visualizer for inspection.'
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
      label: 'Marked Samples',
      value: `${marked} / ${totalFiles.toLocaleString()}`
    },
    { label: 'Missed Objects', value: '54' },
    { label: 'Wrong Class', value: '31' },
    { label: 'Precision Issues', value: '28' },
    { label: 'Other', value: '13' }
  ];
}

function buildLabelStats(classes: string[], totalFiles: number) {
  return classes.map((label, index) => {
    const base = Math.max(1200, Math.floor(totalFiles * (0.26 - index * 0.04)));
    return {
      label,
      value: base.toLocaleString()
    };
  });
}

function extractDate(meta: string) {
  const match = meta.match(/\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/);
  return match?.[0] ?? meta;
}
