'use client';

import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  IconCopy,
  IconDownload,
  IconGitBranch,
  IconHistory,
  IconServerCog
} from '@tabler/icons-react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  annotationDataTypes,
  annotationServiceModes,
  configurationAuditLogs,
  configurationLogOperationTypeOptions,
  initialVersionRecords,
  versionStatusOptions,
  type AnnotationDataTypeId,
  type AnnotationServiceModeId,
  type ConfigurationLogOperationType,
  type ConfigurationLogStatus,
  type ServiceModuleId,
  type VersionRecord,
  type VersionStatus
} from '@/features/configuration/data/configuration-management-data';

const configurationTabs = [
  {
    id: 'version-management',
    label: 'Version Management',
    icon: IconGitBranch
  },
  {
    id: 'service-configuration',
    label: 'Service Configuration',
    icon: IconServerCog
  },
  {
    id: 'configuration-logs',
    label: 'Configuration Logs',
    icon: IconHistory
  }
] as const;

type ConfigurationTabId = (typeof configurationTabs)[number]['id'];

const versionStatusClassName: Record<VersionStatus, string> = {
  Enabled: 'bg-emerald-50 text-emerald-700',
  Disabled: 'bg-slate-100 text-slate-600'
};

const configurationLogOperationTypeClassName: Record<ConfigurationLogOperationType, string> = {
  'Version Operation': 'bg-sky-50 text-sky-700',
  'Service Configuration': 'bg-primary/8 text-primary',
  'System Configuration': 'bg-orange-50 text-orange-700'
};

const configurationLogStatusClassName: Record<ConfigurationLogStatus, string> = {
  Success: 'bg-emerald-50 text-emerald-700',
  Failed: 'bg-red-50 text-red-700'
};

export default function ConfigurationManagementPage() {
  const [activeTab, setActiveTab] = useState<ConfigurationTabId>('version-management');
  const [versions, setVersions] = useState(initialVersionRecords);
  const [selectedConfigVersionId, setSelectedConfigVersionId] = useState(
    initialVersionRecords[1]?.id ?? ''
  );
  const [enabledModules, setEnabledModules] = useState<ServiceModuleId[]>([
    'collection',
    'annotation',
    'model-training'
  ]);
  const [selectedAnnotationModes, setSelectedAnnotationModes] = useState<AnnotationServiceModeId[]>(
    ['self-managed', 'subcontracted']
  );
  const [selectedAnnotationDataTypes, setSelectedAnnotationDataTypes] = useState<
    AnnotationDataTypeId[]
  >([
    'text-qa-optimization',
    'text-intent-relation',
    'text-classification',
    'text-question-generation',
    'text-statistical-definition',
    'text-multi-text',
    'speech-transcription',
    'speech-speaker-labeling',
    'speech-timestamp',
    'speech-synthetic-audio',
    'speech-text',
    'speech-diarization',
    'speech-intent',
    'image-bounding-box',
    'image-mask'
  ]);
  const [draftKeyword, setDraftKeyword] = useState('');
  const [draftStatus, setDraftStatus] =
    useState<(typeof versionStatusOptions)[number]>('All Statuses');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<(typeof versionStatusOptions)[number]>('All Statuses');
  const [isCreateVersionOpen, setIsCreateVersionOpen] = useState(false);
  const [draftVersionName, setDraftVersionName] = useState('');
  const [draftVersionDescription, setDraftVersionDescription] = useState('');
  const [draftBaseVersion, setDraftBaseVersion] = useState('new-version');

  const filteredVersions = useMemo(() => {
    return versions.filter((record) => {
      const search = keyword.trim().toLowerCase();
      const matchesKeyword =
        !search ||
        record.name.toLowerCase().includes(search) ||
        record.version.toLowerCase().includes(search);
      const matchesStatus = status === 'All Statuses' || record.status === status;

      return matchesKeyword && matchesStatus;
    });
  }, [keyword, status, versions]);

  function applyFilters() {
    setKeyword(draftKeyword);
    setStatus(draftStatus);
  }

  function resetFilters() {
    setDraftKeyword('');
    setDraftStatus('All Statuses');
    setKeyword('');
    setStatus('All Statuses');
  }

  function toggleVersionStatus(id: string) {
    setVersions((current) =>
      current.map((record) =>
        record.id === id
          ? { ...record, status: record.status === 'Enabled' ? 'Disabled' : 'Enabled' }
          : record
      )
    );
  }

  function duplicateVersion(record: VersionRecord) {
    const nextSequence = Math.max(...versions.map((item) => item.sequence)) + 1;
    const duplicate: VersionRecord = {
      ...record,
      id: `VER-${String(nextSequence).padStart(3, '0')}`,
      sequence: nextSequence,
      name: `${record.name} Copy`,
      status: 'Disabled',
      createdAt: '2024-04-24',
      updatedAt: '2024-04-24'
    };

    setVersions((current) => [duplicate, ...current]);
  }

  function deleteVersion(id: string) {
    setVersions((current) => current.filter((record) => record.id !== id));
  }

  function createVersion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextSequence = Math.max(...versions.map((item) => item.sequence)) + 1;
    const nextId = `VER-${String(nextSequence).padStart(3, '0')}`;
    const createdAt = '2024-04-24';
    const nextVersion: VersionRecord = {
      id: nextId,
      sequence: nextSequence,
      name: draftVersionName.trim(),
      version: draftBaseVersion === 'new-version' ? '1.0.0' : `${nextSequence}.0.0`,
      status: 'Disabled',
      createdAt,
      updatedAt: createdAt
    };

    setVersions((current) => [nextVersion, ...current]);
    setSelectedConfigVersionId(nextId);
    setDraftVersionName('');
    setDraftVersionDescription('');
    setDraftBaseVersion('new-version');
    setIsCreateVersionOpen(false);
  }

  return (
    <div className='space-y-8 pb-8'>
      <section className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-foreground text-[28px] font-semibold tracking-tight'>
            Configuration Management
          </h1>
          <p className='text-muted-foreground text-sm leading-6'>
            Manage system version modules and operational configuration sets.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ConfigurationTabId)}
          className='gap-0'
        >
          <TabsList className='h-auto w-full justify-start gap-8 rounded-none border-b border-slate-200 bg-transparent p-0'>
            {configurationTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className='h-12 flex-none rounded-none border-0 border-b-2 border-transparent px-0 text-[15px] font-semibold text-slate-500 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none'
                >
                  <span className='inline-flex items-center gap-2'>
                    <TabIcon className='size-4' stroke={1.8} />
                    <span>{tab.label}</span>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value='version-management' className='mt-8'>
            <section className='overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm'>
              <div className='space-y-6 px-8 py-8'>
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <div className='space-y-1'>
                    <h2 className='text-foreground text-[22px] font-semibold'>Version List</h2>
                    <p className='text-muted-foreground text-sm'>
                      Review version packages, lifecycle state, and update timing.
                    </p>
                  </div>

                  <Button
                    className='bg-primary h-10 rounded-xl border-transparent px-5 text-white shadow-sm hover:bg-primary/90'
                    onClick={() => setIsCreateVersionOpen(true)}
                  >
                    <Icons.add className='size-4' />
                    Create Version
                  </Button>
                </div>

                <div className='flex flex-col gap-3 xl:flex-row xl:items-center'>
                  <div className='relative min-w-0 flex-1'>
                    <Input
                      value={draftKeyword}
                      onChange={(event) => setDraftKeyword(event.target.value)}
                      placeholder='Search version name...'
                      className='h-10 rounded-xl pr-10'
                    />
                    <Icons.search className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2' />
                  </div>

                  <div className='flex flex-col gap-3 sm:flex-row'>
                    <Select
                      value={draftStatus}
                      onValueChange={(value) =>
                        setDraftStatus(value as (typeof versionStatusOptions)[number])
                      }
                    >
                      <SelectTrigger className='h-10 w-full rounded-xl sm:w-[168px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {versionStatusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant='outline'
                      className='h-10 rounded-xl px-5'
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                    <Button
                      className='bg-primary h-10 rounded-xl border-transparent px-5 text-white hover:bg-primary/90'
                      onClick={applyFilters}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>

              <Table className='!w-full min-w-[940px]'>
                <TableHeader>
                  <TableRow className='border-t border-slate-100 bg-white hover:bg-white'>
                    <TableHead className='pl-8'>Version Name</TableHead>
                    <TableHead>Version Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Updated Date</TableHead>
                    <TableHead className='pr-8'>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVersions.map((record) => (
                    <TableRow key={record.id} className='hover:bg-slate-50/60'>
                      <TableCell className='min-w-[220px] pl-8'>
                        <div className='flex items-center gap-3'>
                          <div className='flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
                            <IconGitBranch className='size-4' stroke={1.8} />
                          </div>
                          <div className='space-y-1'>
                            <div className='text-foreground font-medium'>{record.name}</div>
                            <div className='text-muted-foreground text-xs'>{record.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='min-w-[140px] font-mono text-[13px] text-slate-600'>
                        {record.version}
                      </TableCell>
                      <TableCell className='min-w-[120px]'>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                            versionStatusClassName[record.status]
                          )}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell className='min-w-[140px] font-mono text-[13px] text-slate-600'>
                        {record.createdAt}
                      </TableCell>
                      <TableCell className='min-w-[140px] font-mono text-[13px] text-slate-600'>
                        {record.updatedAt}
                      </TableCell>
                      <TableCell className='min-w-[320px] pr-8'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <TableActionButton
                            label='Edit version'
                            onClick={() => {}}
                            icon={<Icons.edit className='size-4' />}
                          />
                          <TableActionButton
                            label={
                              record.status === 'Enabled' ? 'Disable version' : 'Enable version'
                            }
                            onClick={() => toggleVersionStatus(record.id)}
                            icon={<Icons.adjustments className='size-4' />}
                          />
                          <TableActionButton
                            label='Copy version'
                            onClick={() => duplicateVersion(record)}
                            icon={<IconCopy className='size-4' stroke={1.8} />}
                          />
                          <TableActionButton
                            label='Delete version'
                            onClick={() => deleteVersion(record.id)}
                            icon={<Icons.trash className='size-4' />}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className='flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-8 py-5'>
                <div className='text-muted-foreground text-sm'>
                  Showing 1-{filteredVersions.length} of {filteredVersions.length} versions
                </div>

                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='icon' className='h-9 w-9 rounded-xl' disabled>
                    <Icons.chevronLeft className='size-4' />
                  </Button>
                  <Button variant='outline' size='icon' className='h-9 w-9 rounded-xl' disabled>
                    <Icons.chevronRight className='size-4' />
                  </Button>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value='service-configuration' className='mt-8'>
            <ServiceConfigurationPanel
              versions={versions}
              selectedVersionId={selectedConfigVersionId}
              enabledModules={enabledModules}
              selectedAnnotationModes={selectedAnnotationModes}
              selectedAnnotationDataTypes={selectedAnnotationDataTypes}
              onVersionChange={setSelectedConfigVersionId}
              onEnabledModulesChange={setEnabledModules}
              onAnnotationModesChange={setSelectedAnnotationModes}
              onAnnotationDataTypesChange={setSelectedAnnotationDataTypes}
            />
          </TabsContent>

          <TabsContent value='configuration-logs' className='mt-8'>
            <ConfigurationLogsPanel />
          </TabsContent>
        </Tabs>
      </section>

      <CreateVersionDialog
        open={isCreateVersionOpen}
        versions={versions}
        versionName={draftVersionName}
        versionDescription={draftVersionDescription}
        baseVersion={draftBaseVersion}
        onOpenChange={setIsCreateVersionOpen}
        onVersionNameChange={setDraftVersionName}
        onVersionDescriptionChange={setDraftVersionDescription}
        onBaseVersionChange={setDraftBaseVersion}
        onSubmit={createVersion}
      />
    </div>
  );
}

function CreateVersionDialog({
  open,
  versions,
  versionName,
  versionDescription,
  baseVersion,
  onOpenChange,
  onVersionNameChange,
  onVersionDescriptionChange,
  onBaseVersionChange,
  onSubmit
}: {
  open: boolean;
  versions: VersionRecord[];
  versionName: string;
  versionDescription: string;
  baseVersion: string;
  onOpenChange: (open: boolean) => void;
  onVersionNameChange: (value: string) => void;
  onVersionDescriptionChange: (value: string) => void;
  onBaseVersionChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='flex max-w-none flex-col overflow-hidden rounded-[24px] p-0 sm:max-w-none'
        style={{
          width: 'min(640px, calc((100vh - 64px) * 4 / 3), calc(100vw - 32px))',
          height: 'min(480px, calc(100vh - 64px), calc((100vw - 32px) * 3 / 4))'
        }}
      >
        <form onSubmit={onSubmit} className='flex min-h-0 flex-1 flex-col'>
          <DialogHeader className='shrink-0 space-y-2 border-b border-slate-100 px-7 py-6 text-left'>
            <DialogTitle className='text-xl font-semibold text-slate-950'>
              Create Version
            </DialogTitle>
            <DialogDescription className='text-sm leading-6 text-slate-500'>
              Create a version package and choose whether it starts from scratch or inherits an
              existing configuration.
            </DialogDescription>
          </DialogHeader>

          <div className='min-h-0 flex-1 space-y-5 overflow-y-auto px-7 py-6'>
            <div className='space-y-2'>
              <label htmlFor='create-version-name' className='text-sm font-medium text-slate-700'>
                Version Name <span className='text-red-500'>*</span>
              </label>
              <Input
                id='create-version-name'
                value={versionName}
                onChange={(event) => onVersionNameChange(event.target.value)}
                placeholder='Enterprise Plan'
                className='h-11 rounded-xl'
                required
              />
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='create-version-description'
                className='text-sm font-medium text-slate-700'
              >
                Version Description
              </label>
              <Textarea
                id='create-version-description'
                value={versionDescription}
                onChange={(event) => onVersionDescriptionChange(event.target.value)}
                placeholder='Describe the service modules and configuration scope for this version.'
                className='min-h-28 resize-none rounded-xl'
              />
            </div>

            <div className='space-y-2'>
              <div className='text-sm font-medium text-slate-700'>Based On Version</div>
              <Select value={baseVersion} onValueChange={onBaseVersionChange}>
                <SelectTrigger className='h-11 rounded-xl data-[size=default]:h-11'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='new-version'>New Version</SelectItem>
                  {versions.slice(0, 4).map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name} / {version.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className='shrink-0 border-t border-slate-100 px-7 py-5 sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              className='h-10 rounded-xl px-6'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-primary h-10 rounded-xl px-6 text-white hover:bg-primary/90'
              disabled={!versionName.trim()}
            >
              Create Version
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ConfigurationLogsPanel() {
  const [keyword, setKeyword] = useState('');
  const [operationType, setOperationType] =
    useState<(typeof configurationLogOperationTypeOptions)[number]>('All Types');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLogs = useMemo(() => {
    return configurationAuditLogs.filter((log) => {
      const search = keyword.trim().toLowerCase();
      const logDate = log.operatedAt.slice(0, 10);
      const matchesKeyword =
        !search ||
        log.operator.toLowerCase().includes(search) ||
        log.content.toLowerCase().includes(search) ||
        log.ipAddress.includes(search);
      const matchesType = operationType === 'All Types' || log.operationType === operationType;
      const matchesStartDate = !startDate || logDate >= startDate;
      const matchesEndDate = !endDate || logDate <= endDate;

      return matchesKeyword && matchesType && matchesStartDate && matchesEndDate;
    });
  }, [endDate, keyword, operationType, startDate]);

  return (
    <section className='overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm'>
      <div className='space-y-8 px-8 py-8'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='space-y-1'>
            <h2 className='text-foreground text-[22px] font-semibold'>Configuration Audit Log</h2>
            <p className='text-muted-foreground text-sm'>
              Track version changes, service configuration updates, and system configuration
              activity.
            </p>
          </div>

          <Button variant='outline' className='h-10 rounded-xl px-5'>
            <IconDownload className='size-4' stroke={1.8} />
            Export Log
          </Button>
        </div>

        <div className='grid gap-4 xl:grid-cols-4'>
          <div className='relative min-w-0'>
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder='Search activity...'
              className='h-11 rounded-xl pr-10'
            />
            <Icons.search className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2' />
          </div>

          <Select
            value={operationType}
            onValueChange={(value) =>
              setOperationType(value as (typeof configurationLogOperationTypeOptions)[number])
            }
          >
            <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {configurationLogOperationTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type='date'
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className='h-11 rounded-xl'
            aria-label='Start date'
          />

          <Input
            type='date'
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className='h-11 rounded-xl'
            aria-label='End date'
          />
        </div>
      </div>

      <Table className='min-w-[1280px]'>
        <TableHeader>
          <TableRow className='border-t border-slate-100 bg-white hover:bg-white'>
            <TableHead className='pl-8'>Operation Time</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead>Operation Type</TableHead>
            <TableHead>Operation Content</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className='pr-8'>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id} className='hover:bg-slate-50/60'>
              <TableCell className='min-w-[200px] pl-8 font-mono text-[13px] text-slate-600'>
                {log.operatedAt}
              </TableCell>
              <TableCell className='min-w-[150px] font-medium text-slate-800'>
                {log.operator}
              </TableCell>
              <TableCell className='min-w-[190px]'>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                    configurationLogOperationTypeClassName[log.operationType]
                  )}
                >
                  {log.operationType}
                </span>
              </TableCell>
              <TableCell className='min-w-[420px] text-slate-600'>{log.content}</TableCell>
              <TableCell className='min-w-[160px] font-mono text-[13px] text-slate-600'>
                {log.ipAddress}
              </TableCell>
              <TableCell className='min-w-[120px] pr-8'>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                    configurationLogStatusClassName[log.status]
                  )}
                >
                  {log.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function ServiceConfigurationPanel({
  versions,
  selectedVersionId,
  enabledModules,
  selectedAnnotationModes,
  selectedAnnotationDataTypes,
  onVersionChange,
  onEnabledModulesChange,
  onAnnotationModesChange,
  onAnnotationDataTypesChange
}: {
  versions: VersionRecord[];
  selectedVersionId: string;
  enabledModules: ServiceModuleId[];
  selectedAnnotationModes: AnnotationServiceModeId[];
  selectedAnnotationDataTypes: AnnotationDataTypeId[];
  onVersionChange: (versionId: string) => void;
  onEnabledModulesChange: (modules: ServiceModuleId[]) => void;
  onAnnotationModesChange: (modes: AnnotationServiceModeId[]) => void;
  onAnnotationDataTypesChange: (dataTypes: AnnotationDataTypeId[]) => void;
}) {
  const selectedVersion = versions.find((version) => version.id === selectedVersionId);
  const collectionEnabled = enabledModules.includes('collection');
  const annotationEnabled = enabledModules.includes('annotation');
  const modelTrainingEnabled = enabledModules.includes('model-training');

  function toggleModule(moduleId: ServiceModuleId) {
    onEnabledModulesChange(
      enabledModules.includes(moduleId)
        ? enabledModules.filter((item) => item !== moduleId)
        : [...enabledModules, moduleId]
    );
  }

  function toggleAnnotationMode(modeId: AnnotationServiceModeId) {
    onAnnotationModesChange(
      selectedAnnotationModes.includes(modeId)
        ? selectedAnnotationModes.filter((item) => item !== modeId)
        : [...selectedAnnotationModes, modeId]
    );
  }

  function toggleAnnotationGroup(ids: AnnotationDataTypeId[]) {
    const allSelected = ids.every((id) => selectedAnnotationDataTypes.includes(id));

    onAnnotationDataTypesChange(
      allSelected
        ? selectedAnnotationDataTypes.filter((id) => !ids.includes(id))
        : [...new Set([...selectedAnnotationDataTypes, ...ids])]
    );
  }

  function toggleAnnotationDataType(dataTypeId: AnnotationDataTypeId) {
    onAnnotationDataTypesChange(
      selectedAnnotationDataTypes.includes(dataTypeId)
        ? selectedAnnotationDataTypes.filter((item) => item !== dataTypeId)
        : [...selectedAnnotationDataTypes, dataTypeId]
    );
  }

  return (
    <section className='rounded-[24px] border border-slate-200 bg-white shadow-sm'>
      <div className='space-y-8 px-8 py-8'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='space-y-1'>
            <h2 className='text-foreground text-[22px] font-semibold'>Service Configuration</h2>
            <p className='text-muted-foreground text-sm'>
              Configure service modules for an existing version and export a startup-ready
              configuration file.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            <Button variant='outline' className='h-10 rounded-xl px-5'>
              <IconDownload className='size-4' stroke={1.8} />
              Export Configuration
            </Button>
            <Button className='bg-primary h-10 rounded-xl border-transparent px-5 text-white shadow-sm hover:bg-primary/90'>
              <Icons.badgeCheck className='size-4' />
              Save Configuration
            </Button>
          </div>
        </div>

        <div className='space-y-3'>
          <div className='text-foreground text-sm font-semibold'>Select Version</div>
          <Select value={selectedVersionId} onValueChange={onVersionChange}>
            <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
              <SelectValue placeholder='Select version' />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  {version.name} / {version.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className='text-muted-foreground text-xs'>
            Current version: {selectedVersion?.name ?? 'No version selected'} /{' '}
            <span className='font-mono'>{selectedVersion?.version ?? '-'}</span>
          </div>
        </div>

        <ServiceBlock
          icon={<Icons.upload className='size-4' />}
          title='Data Collection Service'
          description='Enable collection workflows for source intake and capture tasks.'
          enabled={collectionEnabled}
          onToggle={() => toggleModule('collection')}
        />

        <div className='space-y-7 rounded-[20px] border border-slate-200 bg-white p-6'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='flex items-start gap-3'>
              <div className='flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                <Icons.edit className='size-4' />
              </div>
              <div className='space-y-1'>
                <h3 className='text-[17px] font-semibold text-slate-900'>Annotation Service</h3>
                <p className='text-sm text-slate-500'>
                  Configure annotation service mode and detailed service data types.
                </p>
              </div>
            </div>
            <Switch
              checked={annotationEnabled}
              onCheckedChange={() => toggleModule('annotation')}
              aria-label='Toggle annotation service'
            />
          </div>

          <div className={cn('space-y-7', !annotationEnabled && 'pointer-events-none opacity-50')}>
            <div className='space-y-3'>
              <div className='text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase'>
                Annotation Service Mode
              </div>
              <div className='grid gap-3 lg:grid-cols-3'>
                {annotationServiceModes.map((mode) => {
                  const selected = selectedAnnotationModes.includes(mode.id);

                  return (
                    <div
                      key={mode.id}
                      role='button'
                      tabIndex={0}
                      onClick={() => toggleAnnotationMode(mode.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          toggleAnnotationMode(mode.id);
                        }
                      }}
                      className={cn(
                        'cursor-pointer rounded-2xl border bg-white p-5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none',
                        selected
                          ? 'border-primary bg-primary/4 ring-1 ring-primary/20'
                          : 'border-slate-200 hover:border-primary/40'
                      )}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='space-y-1'>
                          <div className='font-semibold text-slate-900'>{mode.title}</div>
                          <div className='text-sm leading-5 text-slate-500'>{mode.description}</div>
                        </div>
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleAnnotationMode(mode.id)}
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`Toggle ${mode.title}`}
                          className='mt-1 size-5'
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase'>
                Annotation Service Data Type
              </div>
              <div className='grid gap-x-12 gap-y-6 lg:grid-cols-2'>
                {annotationDataTypes.map((group) => {
                  const itemIds = group.items.map((item) => item.id);
                  const groupChecked = itemIds.every((id) =>
                    selectedAnnotationDataTypes.includes(id)
                  );

                  return (
                    <div key={group.group} className='space-y-3'>
                      <label className='flex items-center gap-3 text-sm font-semibold text-slate-900'>
                        <Checkbox
                          checked={groupChecked}
                          onCheckedChange={() => toggleAnnotationGroup(itemIds)}
                          aria-label={`Toggle ${group.group}`}
                          className='size-5'
                        />
                        <span>{group.group}</span>
                      </label>
                      <div className='grid gap-3 pl-8 sm:grid-cols-2'>
                        {group.items.map((item) => {
                          const selected = selectedAnnotationDataTypes.includes(item.id);

                          return (
                            <label
                              key={item.id}
                              className='flex items-center gap-3 text-sm text-slate-600'
                            >
                              <Checkbox
                                checked={selected}
                                onCheckedChange={() => toggleAnnotationDataType(item.id)}
                                aria-label={`Toggle ${item.label}`}
                                className='size-4'
                              />
                              <span>{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <ServiceBlock
          icon={<IconServerCog className='size-4' stroke={1.8} />}
          title='Model Training Service'
          description='Enable model training workflows for evaluation and release support.'
          enabled={modelTrainingEnabled}
          onToggle={() => toggleModule('model-training')}
        />
      </div>
    </section>
  );
}

function ServiceBlock({
  icon,
  title,
  description,
  enabled,
  onToggle
}: {
  icon: ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className='rounded-[20px] border border-slate-200 bg-white p-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <div className='flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary'>
            {icon}
          </div>
          <div className='space-y-1'>
            <h3 className='text-[17px] font-semibold text-slate-900'>{title}</h3>
            <p className='text-sm text-slate-500'>{description}</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} aria-label={`Toggle ${title}`} />
      </div>
    </div>
  );
}
