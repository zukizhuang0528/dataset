'use client';

import { useMemo, useState } from 'react';
import { IconCopy, IconHistory, IconTableAlias } from '@tabler/icons-react';
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
import { cn } from '@/lib/utils';
import {
  initialPermissionRoles,
  roleStatusOptions,
  type PermissionRoleRecord,
  type RoleStatus
} from '@/features/permissions/data/permission-management-data';

const statusPillClassName: Record<RoleStatus, string> = {
  Enabled: 'bg-emerald-50 text-emerald-700',
  Disabled: 'bg-slate-100 text-slate-600'
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

export default function PermissionManagementPage() {
  const [activeTab, setActiveTab] = useState<PermissionTabId>('role-management');
  const [roles, setRoles] = useState(initialPermissionRoles);
  const [draftKeyword, setDraftKeyword] = useState('');
  const [draftStatus, setDraftStatus] =
    useState<(typeof roleStatusOptions)[number]>('All Statuses');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<(typeof roleStatusOptions)[number]>('All Statuses');

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
                            onClick={() => {}}
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
          </TabsContent>

          <TabsContent value='data-permission-management' className='mt-8'>
            <PlaceholderSurface
              title='Data Permission Management'
              description='Review dataset-level access rules, permission bundles, and assignment coverage from a single control surface.'
            />
          </TabsContent>

          <TabsContent value='audit-log' className='mt-8'>
            <PlaceholderSurface
              title='Audit Log'
              description='Track permission changes, role activity, and administrative events with a complete operational trail.'
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function PlaceholderSurface({ title, description }: { title: string; description: string }) {
  return (
    <section className='rounded-[24px] border border-slate-200 bg-white px-8 py-12 shadow-sm'>
      <div className='max-w-2xl space-y-2'>
        <h2 className='text-foreground text-[22px] font-semibold'>{title}</h2>
        <p className='text-muted-foreground text-sm leading-6'>{description}</p>
      </div>
    </section>
  );
}
