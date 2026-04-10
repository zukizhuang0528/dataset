'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icons } from '@/components/icons';
import {
  AdminFilterLabel,
  AdminPageHero,
  AdminSectionHeader,
  AdminSurface
} from '@/components/layout/admin-page-primitives';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { TableActionButton } from '@/components/ui/table-action-button';
import { cn } from '@/lib/utils';
import {
  datasetFilterOptions,
  datasetList,
  type DatasetListItem
} from '@/features/datasets/data/dataset-list-data';

type DialogType = 'edit' | 'clone' | 'append' | 'delete' | null;

const statusClasses = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  gray: 'bg-slate-100 text-slate-600 border-slate-200'
} as const;

export default function DatasetManagementPage() {
  const [domain, setDomain] = useState('All');
  const [taskType, setTaskType] = useState('All');
  const [status, setStatus] = useState('All');
  const [source, setSource] = useState('All');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [activeDataset, setActiveDataset] = useState<DatasetListItem | null>(null);

  const filteredDatasets = useMemo(() => {
    return datasetList.filter((dataset) => {
      const matchesDomain = domain === 'All' || dataset.domain === domain;
      const matchesTaskType = taskType === 'All' || dataset.taskType === taskType;
      const matchesStatus = status === 'All' || dataset.status === status;
      const matchesSource = source === 'All' || dataset.source === source;
      const matchesMine = !onlyMine || dataset.createdByMe;
      const searchValue =
        `${dataset.name} ${dataset.id} ${dataset.owner} ${dataset.team}`.toLowerCase();
      const matchesQuery =
        !submittedQuery || searchValue.includes(submittedQuery.trim().toLowerCase());
      return (
        matchesDomain &&
        matchesTaskType &&
        matchesStatus &&
        matchesSource &&
        matchesMine &&
        matchesQuery
      );
    });
  }, [domain, onlyMine, source, status, submittedQuery, taskType]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredDatasets.length / pageSize));

  const pagedDatasets = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredDatasets.slice(start, start + pageSize);
  }, [filteredDatasets, page]);

  const openDialog = (type: Exclude<DialogType, null>, dataset: DatasetListItem) => {
    setActiveDataset(dataset);
    setDialogType(type);
  };

  const closeDialog = () => {
    setDialogType(null);
    setActiveDataset(null);
  };

  return (
    <div className='space-y-8 pb-8'>
      <AdminPageHero
        eyebrow='Data Operations'
        title='Dataset Management'
        description='Search datasets, monitor lifecycle state, and manage downstream operational actions from a single list view.'
        actions={
          <>
            <Button variant='outline' className='h-10 rounded-xl px-5' asChild>
              <Link href='/dashboard/datasets/recycle-bin'>Recycle Bin</Link>
            </Button>
            <Button className='bg-primary h-10 rounded-xl border-transparent px-5 text-white shadow-sm hover:bg-primary/90'>
              New / Import Dataset
            </Button>
          </>
        }
      />

      <AdminSurface className='px-8 py-7'>
        <div className='grid gap-5 xl:grid-cols-4'>
          <FilterBlock label='Task Domain'>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className='h-10 w-full rounded-xl data-[size=default]:h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {datasetFilterOptions.domains.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBlock>
          <FilterBlock label='Annotation Task Type'>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger className='h-10 w-full rounded-xl data-[size=default]:h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {datasetFilterOptions.taskTypes.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBlock>
          <FilterBlock label='Dataset Status'>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='h-10 w-full rounded-xl data-[size=default]:h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {datasetFilterOptions.statuses.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBlock>
          <FilterBlock label='Dataset Source'>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className='h-10 w-full rounded-xl data-[size=default]:h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {datasetFilterOptions.sources.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterBlock>
        </div>

        <div className='mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_auto] xl:items-end'>
          <div className='grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end'>
            <FilterBlock label='Keyword Search'>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Search dataset name / ID'
                className='h-10 rounded-xl'
              />
            </FilterBlock>
            <Button
              className='bg-primary h-10 rounded-xl border-transparent px-5 text-white hover:bg-primary/90'
              onClick={() => {
                setSubmittedQuery(query);
                setPage(1);
              }}
            >
              Search
            </Button>
          </div>

          <div className='flex flex-wrap items-end justify-end gap-3'>
            <label
              htmlFor='dataset-created-by-me'
              className='text-muted-foreground flex h-10 items-center gap-3 text-sm'
            >
              <Switch id='dataset-created-by-me' checked={onlyMine} onCheckedChange={setOnlyMine} />
              <span>Only datasets created by me</span>
            </label>
            <Button
              variant='outline'
              className='h-10 rounded-xl px-5'
              onClick={() => {
                setDomain('All');
                setTaskType('All');
                setStatus('All');
                setSource('All');
                setQuery('');
                setSubmittedQuery('');
                setOnlyMine(false);
                setPage(1);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </AdminSurface>

      <AdminSurface className='overflow-hidden'>
        <AdminSectionHeader
          title='Dataset Directory'
          description={`${filteredDatasets.length} datasets in the current result set`}
          action={
            <div className='text-muted-foreground text-xs font-medium'>
              Default sorting: most recently updated first
            </div>
          }
        />

        <Table className='!w-full min-w-[980px]'>
          <TableHeader className='bg-slate-50/80'>
            <TableRow>
              <TableHead className='pl-6'>Dataset Name</TableHead>
              <TableHead>Task Domain</TableHead>
              <TableHead>Current Version</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead>Dataset Source</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Creator / Team</TableHead>
              <TableHead className='pr-6'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedDatasets.map((dataset) => (
              <TableRow key={dataset.id} className='hover:bg-slate-50/80'>
                <TableCell className='pl-6'>
                  <div className='space-y-1'>
                    <div className='max-w-[220px] truncate font-medium'>{dataset.name}</div>
                    <div className='text-muted-foreground font-mono text-xs'>{dataset.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    <div className='font-medium'>{dataset.domain}</div>
                    <div className='text-muted-foreground max-w-[220px] truncate text-xs'>
                      {dataset.taskType}
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-mono text-[13px]'>{dataset.version}</TableCell>
                <TableCell>
                  <Badge
                    variant='outline'
                    className={cn(
                      'rounded-full border px-2.5 py-1 font-medium',
                      statusClasses[dataset.statusTone]
                    )}
                  >
                    {dataset.status}
                  </Badge>
                </TableCell>
                <TableCell>{dataset.source}</TableCell>
                <TableCell className='text-slate-600'>{dataset.updatedAt}</TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    <div className='font-medium'>{dataset.owner}</div>
                    <div className='text-muted-foreground text-xs'>{dataset.team}</div>
                  </div>
                </TableCell>
                <TableCell className='pr-6'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <TableActionButton
                      label='View details'
                      icon={<Icons.externalLink className='size-4' />}
                      asChild
                    >
                      <Link href={`/dashboard/datasets/${dataset.id}`} aria-label='View details'>
                        <Icons.externalLink className='size-4' />
                      </Link>
                    </TableActionButton>
                    <TableActionButton
                      label='Edit dataset info'
                      icon={<Icons.edit className='size-4' />}
                      disabled={!dataset.canManage}
                      onClick={() => openDialog('edit', dataset)}
                    />
                    <TableActionButton
                      label='Clone dataset'
                      icon={<Icons.share className='size-4' />}
                      disabled={!dataset.cloneAllowed}
                      onClick={() => openDialog('clone', dataset)}
                    />
                    <TableActionButton
                      label='Append data'
                      icon={<Icons.add className='size-4' />}
                      disabled={!dataset.appendAllowed}
                      onClick={() => openDialog('append', dataset)}
                    />
                    <TableActionButton
                      label='Delete dataset'
                      icon={<Icons.trash className='size-4' />}
                      disabled={!dataset.deleteAllowed}
                      onClick={() => openDialog('delete', dataset)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className='flex items-center justify-between px-8 py-5 text-xs text-slate-500'>
          <span>10 items per page</span>
          <div className='flex items-center gap-2'>
            <PageButton
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <Icons.chevronLeft className='size-4' />
            </PageButton>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <PageButton
                  key={pageNumber}
                  active={pageNumber === page}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </PageButton>
              );
            })}
            <PageButton
              disabled={page === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              <Icons.chevronRight className='size-4' />
            </PageButton>
          </div>
        </div>
      </AdminSurface>

      <DatasetActionDialog type={dialogType} dataset={activeDataset} onClose={closeDialog} />
    </div>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='space-y-2'>
      <AdminFilterLabel>{label}</AdminFilterLabel>
      {children}
    </label>
  );
}

function PageButton({
  children,
  active,
  disabled,
  onClick
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-8 min-w-8 items-center justify-center rounded-lg border px-3 text-sm',
        active
          ? 'border-primary/30 bg-primary/10 font-semibold text-primary'
          : 'border-slate-200 bg-white text-slate-700',
        disabled && 'cursor-not-allowed opacity-40'
      )}
    >
      {children}
    </button>
  );
}

function InfoField({
  label,
  value,
  readOnly,
  full
}: {
  label: string;
  value: React.ReactNode;
  readOnly?: boolean;
  full?: boolean;
}) {
  return (
    <div className={cn('space-y-2', full && 'md:col-span-2')}>
      <div className='text-muted-foreground text-xs'>{label}</div>
      <div
        className={cn(
          'flex min-h-10 items-center rounded-xl border px-3 text-sm',
          readOnly ? 'bg-slate-50 text-slate-500' : 'bg-white'
        )}
      >
        {value}
      </div>
    </div>
  );
}

function DatasetActionDialog({
  type,
  dataset,
  onClose
}: {
  type: DialogType;
  dataset: DatasetListItem | null;
  onClose: () => void;
}) {
  const open = !!type && !!dataset;
  if (!dataset) return null;

  const cloneSuggestedTask =
    dataset.taskType === '2D Object Detection'
      ? '2D Semantic / Instance Segmentation'
      : '2D Object Detection';

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className='max-w-3xl rounded-3xl'>
        {type === 'edit' && (
          <>
            <DialogHeader>
              <DialogTitle>Edit Dataset Info</DialogTitle>
              <DialogDescription>
                Task domain and annotation task type are not editable. Saving keeps you on the list
                page and refreshes the current row.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 md:grid-cols-2'>
              <InfoField label='Dataset Name' value={dataset.name} />
              <InfoField label='Dataset ID' value={dataset.id} readOnly />
              <InfoField label='Dataset Source' value={dataset.source} />
              <InfoField label='Client Name' value={dataset.clientName} />
              <div className='space-y-2 md:col-span-2'>
                <div className='text-muted-foreground text-xs'>Dataset Tags</div>
                <div className='flex flex-wrap gap-2 rounded-xl border px-3 py-3'>
                  {dataset.tags.map((tag) => (
                    <Badge key={tag} variant='outline' className='rounded-full px-3 py-1'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <InfoField label='Remarks' value={dataset.remarks} full />
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button
                className='bg-primary border-transparent text-white hover:bg-primary/90'
                onClick={onClose}
              >
                Save
              </Button>
            </DialogFooter>
          </>
        )}

        {type === 'clone' && (
          <>
            <DialogHeader>
              <DialogTitle>Clone Dataset</DialogTitle>
              <DialogDescription>
                Reuse source data or preprocessed data, but do not inherit auto-labeling, manual
                collaboration, quality review, or export results.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 md:grid-cols-2'>
              <InfoField label='Original Dataset Name' value={dataset.name} readOnly />
              <InfoField label='Original Task Type' value={dataset.taskType} readOnly />
              <InfoField label='New Dataset Name' value={`${dataset.name} - Clone`} />
              <InfoField label='New Annotation Task Type' value={cloneSuggestedTask} />
              <div className='space-y-2 md:col-span-2'>
                <div className='text-muted-foreground text-xs'>Dataset Tags</div>
                <div className='flex flex-wrap gap-2 rounded-xl border px-3 py-3'>
                  {dataset.tags.map((tag) => (
                    <Badge key={tag} variant='outline' className='rounded-full px-3 py-1'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <InfoField label='Client Name' value={dataset.clientName} />
              <InfoField
                label='Remarks'
                value='Extend a new annotation task from the same source data.'
              />
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button
                className='bg-primary border-transparent text-white hover:bg-primary/90'
                onClick={onClose}
              >
                Confirm Clone
              </Button>
            </DialogFooter>
          </>
        )}

        {type === 'append' && (
          <>
            <DialogHeader>
              <DialogTitle>Append Data</DialogTitle>
              <DialogDescription>
                Confirmation first runs probe validation. Data is appended only when validation
                succeeds and the dataset then follows the version progression rules.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 md:grid-cols-2'>
              <InfoField label='Current Dataset' value={dataset.name} readOnly />
              <InfoField label='Current Version' value={dataset.version} readOnly />
              <div className='space-y-2 md:col-span-2'>
                <div className='text-muted-foreground text-xs'>Data Ingestion Method</div>
                <div className='flex flex-wrap gap-2 rounded-xl border px-3 py-3'>
                  {['Local Upload', 'Cloud Download', 'Bucket Mount'].map((method) => (
                    <Badge key={method} variant='outline' className='rounded-full px-3 py-1'>
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
              <InfoField label='Selected Upload Method' value='Local Upload' readOnly full />
              <InfoField label='Local Upload File' value='park_detect_batch_02.zip' full />
              <InfoField
                label='Upload Notes'
                value='Upload behavior follows the New / Import Dataset flow and includes a probe validation before appending.'
                readOnly
                full
              />
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button
                className='bg-primary border-transparent text-white hover:bg-primary/90'
                onClick={onClose}
              >
                Confirm Append
              </Button>
            </DialogFooter>
          </>
        )}

        {type === 'delete' && (
          <>
            <DialogHeader>
              <DialogTitle>Delete Dataset</DialogTitle>
              <DialogDescription className='leading-7'>
                Confirm deleting this dataset? Deleted data moves to the recycle bin for 7 days and
                can be restored during that period. While the dataset stays in the recycle bin, the
                creator receives one email reminder per day. If the dataset already produced result
                assets, those assets move to the recycle bin state together with the dataset.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={onClose}>
                Confirm Delete
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
