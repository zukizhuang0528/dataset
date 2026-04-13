'use client';

import { useMemo, useState } from 'react';
import {
  IconCopy,
  IconDeviceFloppy,
  IconDownload,
  IconFolder,
  IconHistory,
  IconTableAlias,
  IconUser,
  IconUsersGroup,
  IconWorld
} from '@tabler/icons-react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  auditOperationTypeOptions,
  dataPermissionScopes,
  initialPermissionRoles,
  permissionAuditLogs,
  roleStatusOptions,
  type AuditStatus,
  type DataPermissionScope,
  type PermissionRoleRecord,
  type RoleStatus
} from '@/features/permissions/data/permission-management-data';

const statusPillClassName: Record<RoleStatus, string> = {
  Enabled: 'bg-emerald-50 text-emerald-700',
  Disabled: 'bg-slate-100 text-slate-600'
};

const auditStatusClassName: Record<AuditStatus, string> = {
  Success: 'bg-emerald-50 text-emerald-700',
  Failed: 'bg-red-50 text-red-600'
};

const permissionTabs = [
  {
    id: 'role-management',
    label: 'Role Management',
    icon: Icons.teams
  },
  {
    id: 'data-permission-management',
    label: 'Data Permission Management',
    icon: IconTableAlias
  },
  {
    id: 'audit-log',
    label: 'Audit Log',
    icon: IconHistory
  }
] as const;

type PermissionTabId = (typeof permissionTabs)[number]['id'];

const dataScopeIcons: Record<DataPermissionScope, typeof IconWorld> = {
  'all-data': IconWorld,
  'owned-project-data': IconFolder,
  'owned-team-data': IconUsersGroup,
  'personal-data': IconUser
};

const rolePermissionModules = [
  {
    id: 'project-management',
    label: 'Project Management',
    icon: IconFolder,
    groups: [
      {
        id: 'new-project',
        label: 'New Project',
        actions: ['Create Project', 'Edit Project', 'Delete Project', 'View Project']
      },
      {
        id: 'new-batch',
        label: 'New Batch',
        actions: ['Create Batch', 'Edit Batch', 'Delete Batch', 'View Batch']
      },
      {
        id: 'project-configuration',
        label: 'Project Configuration',
        actions: ['Edit Configuration', 'Save Template', 'Invite Collaborators']
      }
    ]
  },
  {
    id: 'task-management',
    label: 'Task Management',
    icon: IconTableAlias,
    groups: [
      {
        id: 'task-actions',
        label: 'Task Actions',
        actions: ['Assign Task', 'Annotate Task', 'Review Task', 'Export Result']
      }
    ]
  },
  {
    id: 'data-management',
    label: 'Data Management',
    icon: IconFolder,
    groups: [
      {
        id: 'dataset-actions',
        label: 'Dataset Actions',
        actions: ['Upload Dataset', 'Edit Dataset', 'Archive Dataset', 'Restore Dataset']
      }
    ]
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: IconUsersGroup,
    groups: [
      {
        id: 'user-actions',
        label: 'User Actions',
        actions: ['Create User', 'Edit User', 'Disable User', 'Bind Role']
      }
    ]
  }
] as const;

export default function PermissionManagementPage() {
  const [activeTab, setActiveTab] = useState<PermissionTabId>('role-management');
  const [roles, setRoles] = useState(initialPermissionRoles);
  const [selectedRoleId, setSelectedRoleId] = useState(initialPermissionRoles[1]?.id ?? '');
  const [selectedDataScope, setSelectedDataScope] =
    useState<DataPermissionScope>('owned-project-data');
  const [draftKeyword, setDraftKeyword] = useState('');
  const [draftStatus, setDraftStatus] =
    useState<(typeof roleStatusOptions)[number]>('All Statuses');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<(typeof roleStatusOptions)[number]>('All Statuses');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const search = keyword.trim().toLowerCase();
      const matchesKeyword =
        !search ||
        role.name.toLowerCase().includes(search) ||
        role.description.toLowerCase().includes(search);
      const matchesStatus = status === 'All Statuses' || role.status === status;
      return matchesKeyword && matchesStatus;
    });
  }, [keyword, roles, status]);
  const editingRole = roles.find((role) => role.id === editingRoleId) ?? null;

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

  function toggleRoleStatus(id: string) {
    setRoles((current) =>
      current.map((role) =>
        role.id === id
          ? { ...role, status: role.status === 'Enabled' ? 'Disabled' : 'Enabled' }
          : role
      )
    );
  }

  function duplicateRole(record: PermissionRoleRecord) {
    const nextSequence = Math.max(...roles.map((role) => role.sequence)) + 1;
    const duplicate: PermissionRoleRecord = {
      ...record,
      id: `ROLE-${String(nextSequence).padStart(3, '0')}`,
      sequence: nextSequence,
      name: `${record.name} Copy`,
      assignedUsers: 0,
      status: 'Disabled',
      createdAt: '2024-03-12'
    };

    setRoles((current) => [duplicate, ...current]);
  }

  function deleteRole(id: string) {
    setRoles((current) => current.filter((role) => role.id !== id));
  }

  return (
    <div className='space-y-8 pb-8'>
      <section className='space-y-6'>
        <div className='space-y-2'>
          <h1 className='text-foreground text-[28px] font-semibold tracking-tight'>
            Permission Management
          </h1>
          <p className='text-muted-foreground text-sm leading-6'>
            Manage system roles, permission allocation, and user bindings.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as PermissionTabId)}
          className='gap-0'
        >
          <TabsList className='h-auto w-full justify-start gap-8 rounded-none border-b border-slate-200 bg-transparent p-0'>
            {permissionTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className='h-12 flex-none rounded-none border-0 border-b-2 border-transparent px-0 text-[15px] font-semibold text-slate-500 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none'
                >
                  <span className='inline-flex items-center gap-2'>
                    <TabIcon className='size-4' />
                    <span>{tab.label}</span>
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value='role-management' className='mt-8'>
            {editingRole ? (
              <RoleEditSection role={editingRole} onBack={() => setEditingRoleId(null)} />
            ) : (
              <section className='overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm'>
                <div className='space-y-6 px-8 py-8'>
                  <div className='flex flex-wrap items-center justify-between gap-4'>
                    <div className='space-y-1'>
                      <h2 className='text-foreground text-[22px] font-semibold'>Role Directory</h2>
                      <p className='text-muted-foreground text-sm'>
                        Review role definitions, user coverage, and lifecycle controls.
                      </p>
                    </div>

                    <Button className='bg-primary h-10 rounded-xl border-transparent px-5 text-white shadow-sm hover:bg-primary/90'>
                      <Icons.add className='size-4' />
                      Create Role
                    </Button>
                  </div>

                  <div className='flex flex-col gap-3 xl:flex-row xl:items-center'>
                    <div className='relative min-w-0 flex-1'>
                      <Input
                        value={draftKeyword}
                        onChange={(event) => setDraftKeyword(event.target.value)}
                        placeholder='Search role name...'
                        className='h-10 rounded-xl pr-10'
                      />
                      <Icons.search className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2' />
                    </div>

                    <div className='flex flex-col gap-3 sm:flex-row'>
                      <Select
                        value={draftStatus}
                        onValueChange={(value) =>
                          setDraftStatus(value as (typeof roleStatusOptions)[number])
                        }
                      >
                        <SelectTrigger className='h-10 w-full rounded-xl sm:w-[168px]'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleStatusOptions.map((option) => (
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

                <Table className='min-w-[1240px]'>
                  <TableHeader>
                    <TableRow className='border-t border-slate-100 bg-white hover:bg-white'>
                      <TableHead className='pl-8'>Role Name</TableHead>
                      <TableHead>Role Description</TableHead>
                      <TableHead>User Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className='pr-8'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id} className='hover:bg-slate-50/60'>
                        <TableCell className='min-w-[280px] pl-8'>
                          <div className='flex items-center gap-3'>
                            <div className='flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <Icons.teams className='size-4' />
                            </div>
                            <div className='space-y-1'>
                              <div className='text-foreground font-medium'>{role.name}</div>
                              <div className='text-muted-foreground text-xs'>{role.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='min-w-[280px] text-slate-600'>
                          {role.description}
                        </TableCell>
                        <TableCell className='min-w-[120px] text-slate-700'>
                          {role.assignedUsers} users
                        </TableCell>
                        <TableCell className='min-w-[120px]'>
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                              statusPillClassName[role.status]
                            )}
                          >
                            {role.status}
                          </span>
                        </TableCell>
                        <TableCell className='min-w-[140px] font-mono text-[13px] text-slate-600'>
                          {role.createdAt}
                        </TableCell>
                        <TableCell className='min-w-[360px] pr-8'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <TableActionButton
                              label='Edit role'
                              onClick={() => setEditingRoleId(role.id)}
                              icon={<Icons.edit className='size-4' />}
                            />
                            <TableActionButton
                              label={role.status === 'Enabled' ? 'Disable role' : 'Enable role'}
                              onClick={() => toggleRoleStatus(role.id)}
                              icon={<Icons.adjustments className='size-4' />}
                            />
                            <TableActionButton
                              label='Quick duplicate role'
                              onClick={() => duplicateRole(role)}
                              icon={<IconCopy className='size-4' stroke={1.8} />}
                            />
                            <TableActionButton
                              label='Delete role'
                              onClick={() => deleteRole(role.id)}
                              icon={<Icons.trash className='size-4' />}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            )}
          </TabsContent>

          <TabsContent value='data-permission-management' className='mt-8'>
            <DataPermissionPanel
              roles={roles}
              selectedRoleId={selectedRoleId}
              selectedDataScope={selectedDataScope}
              onRoleChange={setSelectedRoleId}
              onScopeChange={setSelectedDataScope}
            />
          </TabsContent>

          <TabsContent value='audit-log' className='mt-8'>
            <AuditLogPanel />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function RoleEditSection({ role, onBack }: { role: PermissionRoleRecord; onBack: () => void }) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(['project-management'])
  );
  const selectedPermissionCount = 6;

  function toggleModule(moduleId: string) {
    setExpandedModules((current) => {
      const next = new Set(current);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  function expandAll() {
    setExpandedModules(new Set(rolePermissionModules.map((module) => module.id)));
  }

  function collapseAll() {
    setExpandedModules(new Set());
  }

  return (
    <section className='space-y-6'>
      <div className='flex flex-wrap items-center gap-4'>
        <Button type='button' variant='outline' className='h-9 rounded-xl px-4' onClick={onBack}>
          <Icons.chevronLeft className='size-4' />
          Back
        </Button>
        <div>
          <h2 className='text-foreground text-[24px] font-semibold tracking-tight'>Edit Role</h2>
          <p className='text-muted-foreground text-sm'>
            Update role details and configure module-level permissions.
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        <section className='rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm'>
          <div className='space-y-1'>
            <h3 className='text-foreground text-lg font-semibold'>Basic Information</h3>
            <p className='text-muted-foreground text-sm'>
              Define how this role appears across user assignment and audit views.
            </p>
          </div>

          <div className='mt-6 space-y-5'>
            <div className='space-y-2'>
              <label htmlFor='edit-role-name' className='text-sm font-medium text-slate-700'>
                Role Name <span className='text-red-500'>*</span>
              </label>
              <Input id='edit-role-name' defaultValue={role.name} className='h-11 rounded-xl' />
            </div>

            <div className='space-y-2'>
              <label htmlFor='edit-role-description' className='text-sm font-medium text-slate-700'>
                Role Description
              </label>
              <Textarea
                id='edit-role-description'
                defaultValue={role.description}
                className='min-h-28 resize-none rounded-xl'
              />
            </div>

            <div className='space-y-2'>
              <div className='text-sm font-medium text-slate-700'>Status</div>
              <Select defaultValue={role.status}>
                <SelectTrigger className='h-11 rounded-xl data-[size=default]:h-11'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Enabled'>Enabled</SelectItem>
                  <SelectItem value='Disabled'>Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className='rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='space-y-1'>
              <h3 className='text-foreground text-lg font-semibold'>Permission Configuration</h3>
              <p className='text-muted-foreground text-sm'>
                Choose the modules and granular actions available to this role.
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button
                type='button'
                variant='outline'
                className='h-9 rounded-xl px-4'
                onClick={expandAll}
              >
                <Icons.chevronsDown className='size-4' />
                Expand All
              </Button>
              <Button
                type='button'
                variant='outline'
                className='h-9 rounded-xl px-4'
                onClick={collapseAll}
              >
                <Icons.chevronsRight className='size-4' />
                Collapse All
              </Button>
            </div>
          </div>

          <div className='mt-6 overflow-hidden rounded-2xl border border-slate-200'>
            {rolePermissionModules.map((module, moduleIndex) => {
              const ModuleIcon = module.icon;
              const isExpanded = expandedModules.has(module.id);

              return (
                <div key={module.id} className={cn(moduleIndex > 0 && 'border-t border-slate-100')}>
                  <div className='flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-4'>
                    <button
                      type='button'
                      className='flex min-w-0 items-center gap-3 text-left'
                      onClick={() => toggleModule(module.id)}
                    >
                      {isExpanded ? (
                        <Icons.chevronDown className='size-4 shrink-0 text-slate-500' />
                      ) : (
                        <Icons.chevronRight className='size-4 shrink-0 text-slate-500' />
                      )}
                      <ModuleIcon className='size-5 shrink-0 text-primary' stroke={1.8} />
                      <span className='font-semibold text-slate-900'>{module.label}</span>
                    </button>

                    <div className='flex items-center gap-2 text-sm font-medium text-slate-500'>
                      <span>Select all</span>
                      <Checkbox aria-label={`Select all ${module.label} permissions`} />
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className='space-y-3 bg-slate-50/70 px-5 py-4'>
                      {module.groups.map((group, groupIndex) => (
                        <div
                          key={group.id}
                          className='rounded-2xl bg-white p-4 ring-1 ring-slate-200'
                        >
                          <div className='flex flex-wrap items-center justify-between gap-3'>
                            <div className='flex items-center gap-3'>
                              <span className='flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                {groupIndex + 1}
                              </span>
                              <span className='text-sm font-semibold text-slate-900'>
                                {group.label}
                              </span>
                            </div>
                            <div className='flex items-center gap-2 text-sm font-medium text-slate-500'>
                              <span>Select group</span>
                              <Checkbox aria-label={`Select ${group.label} permissions`} />
                            </div>
                          </div>

                          <div className='mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-4'>
                            {group.actions.map((action, actionIndex) => (
                              <div
                                key={action}
                                className='flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700'
                              >
                                <Checkbox
                                  defaultChecked={
                                    module.id === 'project-management' && actionIndex < 2
                                  }
                                  aria-label={action}
                                />
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
            <p className='text-sm text-slate-500'>
              Selected{' '}
              <span className='font-semibold text-slate-900'>{selectedPermissionCount}</span>{' '}
              permissions
            </p>
            <Button
              type='button'
              variant='outline'
              className='h-9 rounded-xl px-4 text-red-600 hover:text-red-700'
            >
              Clear Selection
            </Button>
          </div>
        </section>
      </div>

      <div className='flex justify-end border-t border-slate-100 pt-2'>
        <Button className='bg-primary h-10 rounded-xl px-5 text-white hover:bg-primary/90'>
          <IconDeviceFloppy className='size-4' stroke={1.8} />
          Save Changes
        </Button>
      </div>
    </section>
  );
}

function AuditLogPanel() {
  const [keyword, setKeyword] = useState('');
  const [operationType, setOperationType] =
    useState<(typeof auditOperationTypeOptions)[number]>('All Types');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLogs = useMemo(() => {
    return permissionAuditLogs.filter((log) => {
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
            <h2 className='text-foreground text-[22px] font-semibold'>Permission Audit Log</h2>
            <p className='text-muted-foreground text-sm'>
              Track permission changes, role activity, user bindings, and administrative events.
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
              setOperationType(value as (typeof auditOperationTypeOptions)[number])
            }
          >
            <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {auditOperationTypeOptions.map((option) => (
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
              <TableCell className='min-w-[170px]'>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                    'bg-primary/8 text-primary'
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
                    auditStatusClassName[log.status]
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

function DataPermissionPanel({
  roles,
  selectedRoleId,
  selectedDataScope,
  onRoleChange,
  onScopeChange
}: {
  roles: PermissionRoleRecord[];
  selectedRoleId: string;
  selectedDataScope: DataPermissionScope;
  onRoleChange: (roleId: string) => void;
  onScopeChange: (scope: DataPermissionScope) => void;
}) {
  return (
    <section className='rounded-[24px] border border-slate-200 bg-white px-8 py-8 shadow-sm'>
      <div className='space-y-8'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='space-y-1'>
            <h2 className='text-foreground text-[22px] font-semibold'>
              Data Permission Configuration
            </h2>
            <p className='text-muted-foreground text-sm'>
              Select a role and define the dataset visibility range for that role.
            </p>
          </div>

          <Button className='bg-primary h-10 rounded-xl border-transparent px-5 text-white shadow-sm hover:bg-primary/90'>
            <IconDeviceFloppy className='size-4' stroke={1.8} />
            Save Configuration
          </Button>
        </div>

        <div className='space-y-3'>
          <div className='text-foreground text-sm font-semibold'>Select Role</div>
          <Select value={selectedRoleId} onValueChange={onRoleChange}>
            <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-4'>
          <div className='space-y-1'>
            <h3 className='text-foreground text-sm font-semibold'>Data Scope</h3>
            <p className='text-muted-foreground text-sm'>
              Choose the broadest data range available to users with this role.
            </p>
          </div>

          <RadioGroup
            value={selectedDataScope}
            onValueChange={(value) => onScopeChange(value as DataPermissionScope)}
            className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'
          >
            {dataPermissionScopes.map((scope) => {
              const ScopeIcon = dataScopeIcons[scope.id];
              const isSelected = selectedDataScope === scope.id;

              return (
                <div
                  key={scope.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => onScopeChange(scope.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onScopeChange(scope.id);
                    }
                  }}
                  className={cn(
                    'group flex min-h-[132px] cursor-pointer flex-col justify-between rounded-2xl border bg-white p-6 transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/4 ring-1 ring-primary/20'
                      : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50'
                  )}
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex min-w-0 items-start gap-4'>
                      <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                        <ScopeIcon className='size-5' stroke={1.8} />
                      </div>
                      <div className='min-w-0 space-y-1.5'>
                        <div className='text-foreground text-[17px] font-semibold'>
                          {scope.title}
                        </div>
                        <div className='text-muted-foreground text-sm leading-5'>
                          {scope.description}
                        </div>
                      </div>
                    </div>
                    <RadioGroupItem value={scope.id} className='mt-1 size-5' />
                  </div>

                  <div className='mt-5 flex items-start gap-2 text-sm text-slate-600'>
                    <span className='mt-1 size-2 shrink-0 rounded-full bg-emerald-500' />
                    <span>{scope.helper}</span>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </section>
  );
}
