'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

type UserStatus = 'Enabled' | 'Disabled';
type PlatformRole = 'Super Admin' | 'Data Admin' | 'Operations Admin' | 'Audit Admin';
type ProjectRole = 'Project Manager' | 'Annotator' | 'Reviewer' | 'QA Lead' | 'Delivery Lead';

type UserRecord = {
  id: string;
  sequence: number;
  name: string;
  mobile: string;
  email: string;
  account: string;
  platformRole: PlatformRole;
  projectRole: ProjectRole;
  isVendor: 'Yes' | 'No';
  vendorName: string;
  recentLoginAt: string;
  registeredAt: string;
  status: UserStatus;
};

type Filters = {
  name: string;
  mobile: string;
  email: string;
  account: string;
  platformRole: string;
  projectRole: string;
};

type SortKey =
  | 'sequence'
  | 'name'
  | 'mobile'
  | 'email'
  | 'account'
  | 'projectRole'
  | 'isVendor'
  | 'vendorName'
  | 'recentLoginAt'
  | 'registeredAt'
  | 'status';

const platformRoleOptions: PlatformRole[] = [
  'Super Admin',
  'Data Admin',
  'Operations Admin',
  'Audit Admin'
];

const projectRoleOptions: ProjectRole[] = [
  'Project Manager',
  'Annotator',
  'Reviewer',
  'QA Lead',
  'Delivery Lead'
];

const initialUsers: UserRecord[] = [
  {
    id: 'USR-001',
    sequence: 1,
    name: 'Lina Brooks',
    mobile: '13800138001',
    email: 'lina.brooks@example.com',
    account: 'lbrooks',
    platformRole: 'Data Admin',
    projectRole: 'Annotator',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-12 15:30:45',
    registeredAt: '2025-12-01 09:15:22',
    status: 'Enabled'
  },
  {
    id: 'USR-002',
    sequence: 2,
    name: 'Mason Clark',
    mobile: '13800138002',
    email: 'mason.clark@example.com',
    account: 'mclark',
    platformRole: 'Operations Admin',
    projectRole: 'Project Manager',
    isVendor: 'Yes',
    vendorName: 'CoreData Services',
    recentLoginAt: '2026-01-12 14:20:18',
    registeredAt: '2025-11-15 16:45:33',
    status: 'Enabled'
  },
  {
    id: 'USR-003',
    sequence: 3,
    name: 'Olivia Turner',
    mobile: '13800138003',
    email: 'olivia.turner@example.com',
    account: 'oturner',
    platformRole: 'Audit Admin',
    projectRole: 'Reviewer',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-11 18:12:06',
    registeredAt: '2025-10-22 13:10:44',
    status: 'Disabled'
  },
  {
    id: 'USR-004',
    sequence: 4,
    name: 'Ethan Hall',
    mobile: '13800138004',
    email: 'ethan.hall@example.com',
    account: 'ehall',
    platformRole: 'Data Admin',
    projectRole: 'QA Lead',
    isVendor: 'Yes',
    vendorName: 'Vertex Annotation',
    recentLoginAt: '2026-01-13 09:08:17',
    registeredAt: '2025-09-30 11:42:10',
    status: 'Enabled'
  },
  {
    id: 'USR-005',
    sequence: 5,
    name: 'Ava Reed',
    mobile: '13800138005',
    email: 'ava.reed@example.com',
    account: 'areed',
    platformRole: 'Operations Admin',
    projectRole: 'Delivery Lead',
    isVendor: 'Yes',
    vendorName: 'Skyline Data Works',
    recentLoginAt: '2026-01-10 10:55:39',
    registeredAt: '2025-12-18 08:20:51',
    status: 'Enabled'
  },
  {
    id: 'USR-006',
    sequence: 6,
    name: 'Noah Foster',
    mobile: '13800138006',
    email: 'noah.foster@example.com',
    account: 'nfoster',
    platformRole: 'Super Admin',
    projectRole: 'Project Manager',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-14 08:46:12',
    registeredAt: '2025-08-05 15:31:28',
    status: 'Enabled'
  },
  {
    id: 'USR-007',
    sequence: 7,
    name: 'Sophia Carter',
    mobile: '13800138007',
    email: 'sophia.carter@example.com',
    account: 'scarter',
    platformRole: 'Audit Admin',
    projectRole: 'Reviewer',
    isVendor: 'Yes',
    vendorName: 'Prime Label Studio',
    recentLoginAt: '2026-01-09 21:04:16',
    registeredAt: '2025-07-21 17:58:13',
    status: 'Disabled'
  },
  {
    id: 'USR-008',
    sequence: 8,
    name: 'Lucas Bennett',
    mobile: '13800138008',
    email: 'lucas.bennett@example.com',
    account: 'lbennett',
    platformRole: 'Data Admin',
    projectRole: 'Annotator',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-12 07:18:40',
    registeredAt: '2025-11-02 10:05:02',
    status: 'Enabled'
  },
  {
    id: 'USR-009',
    sequence: 9,
    name: 'Mia Adams',
    mobile: '13800138009',
    email: 'mia.adams@example.com',
    account: 'madams',
    platformRole: 'Operations Admin',
    projectRole: 'Annotator',
    isVendor: 'Yes',
    vendorName: 'CoreData Services',
    recentLoginAt: '2026-01-11 16:22:34',
    registeredAt: '2025-06-18 12:14:19',
    status: 'Enabled'
  },
  {
    id: 'USR-010',
    sequence: 10,
    name: 'James Collins',
    mobile: '13800138010',
    email: 'james.collins@example.com',
    account: 'jcollins',
    platformRole: 'Data Admin',
    projectRole: 'QA Lead',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-08 14:47:03',
    registeredAt: '2025-05-29 19:41:56',
    status: 'Disabled'
  },
  {
    id: 'USR-011',
    sequence: 11,
    name: 'Charlotte Rivera',
    mobile: '13800138011',
    email: 'charlotte.rivera@example.com',
    account: 'crivera',
    platformRole: 'Audit Admin',
    projectRole: 'Reviewer',
    isVendor: 'Yes',
    vendorName: 'Vertex Annotation',
    recentLoginAt: '2026-01-13 12:33:27',
    registeredAt: '2025-12-05 09:50:14',
    status: 'Enabled'
  },
  {
    id: 'USR-012',
    sequence: 12,
    name: 'Benjamin Gray',
    mobile: '13800138012',
    email: 'benjamin.gray@example.com',
    account: 'bgray',
    platformRole: 'Operations Admin',
    projectRole: 'Delivery Lead',
    isVendor: 'Yes',
    vendorName: 'Nova Vendor Group',
    recentLoginAt: '2026-01-07 11:09:48',
    registeredAt: '2025-04-26 14:22:37',
    status: 'Enabled'
  },
  {
    id: 'USR-013',
    sequence: 13,
    name: 'Amelia Scott',
    mobile: '13800138013',
    email: 'amelia.scott@example.com',
    account: 'ascott',
    platformRole: 'Data Admin',
    projectRole: 'Project Manager',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-12 17:52:05',
    registeredAt: '2025-09-18 10:18:09',
    status: 'Enabled'
  },
  {
    id: 'USR-014',
    sequence: 14,
    name: 'Henry Morgan',
    mobile: '13800138014',
    email: 'henry.morgan@example.com',
    account: 'hmorgan',
    platformRole: 'Super Admin',
    projectRole: 'QA Lead',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-14 09:27:58',
    registeredAt: '2025-03-17 11:44:50',
    status: 'Enabled'
  },
  {
    id: 'USR-015',
    sequence: 15,
    name: 'Evelyn Ward',
    mobile: '13800138015',
    email: 'evelyn.ward@example.com',
    account: 'eward',
    platformRole: 'Audit Admin',
    projectRole: 'Reviewer',
    isVendor: 'Yes',
    vendorName: 'Skyline Data Works',
    recentLoginAt: '2026-01-10 13:01:29',
    registeredAt: '2025-07-08 08:55:46',
    status: 'Disabled'
  },
  {
    id: 'USR-016',
    sequence: 16,
    name: 'Daniel Price',
    mobile: '13800138016',
    email: 'daniel.price@example.com',
    account: 'dprice',
    platformRole: 'Operations Admin',
    projectRole: 'Annotator',
    isVendor: 'Yes',
    vendorName: 'Prime Label Studio',
    recentLoginAt: '2026-01-09 08:36:11',
    registeredAt: '2025-10-03 09:41:08',
    status: 'Enabled'
  },
  {
    id: 'USR-017',
    sequence: 17,
    name: 'Harper Murphy',
    mobile: '13800138017',
    email: 'harper.murphy@example.com',
    account: 'hmurphy',
    platformRole: 'Data Admin',
    projectRole: 'Delivery Lead',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-13 20:15:42',
    registeredAt: '2025-11-11 13:24:20',
    status: 'Enabled'
  },
  {
    id: 'USR-018',
    sequence: 18,
    name: 'Alexander Cook',
    mobile: '13800138018',
    email: 'alexander.cook@example.com',
    account: 'acook',
    platformRole: 'Audit Admin',
    projectRole: 'Reviewer',
    isVendor: 'Yes',
    vendorName: 'Nova Vendor Group',
    recentLoginAt: '2026-01-06 19:48:35',
    registeredAt: '2025-08-28 16:19:31',
    status: 'Disabled'
  },
  {
    id: 'USR-019',
    sequence: 19,
    name: 'Ella Richardson',
    mobile: '13800138019',
    email: 'ella.richardson@example.com',
    account: 'erichardson',
    platformRole: 'Data Admin',
    projectRole: 'Annotator',
    isVendor: 'No',
    vendorName: '-',
    recentLoginAt: '2026-01-14 07:40:54',
    registeredAt: '2025-12-20 07:57:22',
    status: 'Enabled'
  },
  {
    id: 'USR-020',
    sequence: 20,
    name: 'Michael Hughes',
    mobile: '13800138020',
    email: 'michael.hughes@example.com',
    account: 'mhughes',
    platformRole: 'Operations Admin',
    projectRole: 'Project Manager',
    isVendor: 'Yes',
    vendorName: 'Vertex Annotation',
    recentLoginAt: '2026-01-08 09:14:26',
    registeredAt: '2025-06-12 18:07:43',
    status: 'Enabled'
  }
];

const emptyFilters: Filters = {
  name: '',
  mobile: '',
  email: '',
  account: '',
  platformRole: '',
  projectRole: ''
};

function SortButton({
  label,
  active,
  direction,
  onClick
}: {
  label: string;
  active: boolean;
  direction: 'asc' | 'desc';
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='text-foreground hover:text-primary inline-flex items-center gap-1 text-left font-medium'
    >
      <span>{label}</span>
      {active ? (
        direction === 'asc' ? (
          <Icons.chevronUp className='size-4' />
        ) : (
          <Icons.chevronDown className='size-4' />
        )
      ) : (
        <Icons.chevronsUpDown className='text-muted-foreground size-4' />
      )}
    </button>
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [draftFilters, setDraftFilters] = useState<Filters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters);
  const [sortKey, setSortKey] = useState<SortKey>('sequence');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [roleFilterOpen, setRoleFilterOpen] = useState(false);
  const [headerRoleDraft, setHeaderRoleDraft] = useState('');
  const [headerRoleApplied, setHeaderRoleApplied] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesName =
        !appliedFilters.name ||
        user.name.toLowerCase().includes(appliedFilters.name.trim().toLowerCase());
      const matchesMobile =
        !appliedFilters.mobile || user.mobile.includes(appliedFilters.mobile.trim());
      const matchesEmail =
        !appliedFilters.email ||
        user.email.toLowerCase().includes(appliedFilters.email.trim().toLowerCase());
      const matchesAccount =
        !appliedFilters.account ||
        user.account.toLowerCase().includes(appliedFilters.account.trim().toLowerCase());
      const matchesPlatformRole =
        !appliedFilters.platformRole || user.platformRole === appliedFilters.platformRole;
      const matchesProjectRole =
        !appliedFilters.projectRole || user.projectRole === appliedFilters.projectRole;
      const matchesHeaderRole = !headerRoleApplied || user.platformRole === headerRoleApplied;

      return (
        matchesName &&
        matchesMobile &&
        matchesEmail &&
        matchesAccount &&
        matchesPlatformRole &&
        matchesProjectRole &&
        matchesHeaderRole
      );
    });
  }, [appliedFilters, headerRoleApplied, users]);

  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];

    list.sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];

      const comparison =
        sortKey === 'sequence'
          ? Number(leftValue) - Number(rightValue)
          : String(leftValue).localeCompare(String(rightValue), 'en', { numeric: true });

      return sortDirection === 'asc' ? comparison : comparison * -1;
    });

    return list;
  }, [filteredUsers, sortDirection, sortKey]);

  const selectedCount = sortedUsers.filter((user) => selectedIds.includes(user.id)).length;
  const allVisibleSelected = sortedUsers.length > 0 && selectedCount === sortedUsers.length;

  function updateDraft<K extends keyof Filters>(key: K, value: Filters[K]) {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  }

  function toggleRowSelection(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked ? [...current, id] : current.filter((selectedId) => selectedId !== id)
    );
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedIds(checked ? sortedUsers.map((user) => user.id) : []);
  }

  function handleBulkDisable() {
    if (selectedIds.length === 0) return;

    setUsers((current) =>
      current.map((user) =>
        selectedIds.includes(user.id) ? { ...user, status: 'Disabled' } : user
      )
    );
    setSelectedIds([]);
  }

  function handleSingleDisable(id: string) {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, status: 'Disabled' } : user))
    );
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-foreground text-3xl font-semibold tracking-tight'>User Management</h1>
        <p className='text-muted-foreground text-sm'>
          Manage profile information and status for all platform users.
        </p>
      </div>

      <div className='rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-primary/8 backdrop-blur-sm'>
        <div className='grid gap-4 md:grid-cols-3'>
          <FilterField label='Name'>
            <Input
              value={draftFilters.name}
              onChange={(event) => updateDraft('name', event.target.value)}
              placeholder='Enter name'
              className='h-11 rounded-xl'
            />
          </FilterField>
          <FilterField label='Mobile'>
            <Input
              value={draftFilters.mobile}
              onChange={(event) => updateDraft('mobile', event.target.value)}
              placeholder='Enter mobile'
              className='h-11 rounded-xl'
            />
          </FilterField>
          <FilterField label='Email'>
            <Input
              value={draftFilters.email}
              onChange={(event) => updateDraft('email', event.target.value)}
              placeholder='Enter email'
              className='h-11 rounded-xl'
            />
          </FilterField>
          <FilterField label='Account'>
            <Input
              value={draftFilters.account}
              onChange={(event) => updateDraft('account', event.target.value)}
              placeholder='Enter account'
              className='h-11 rounded-xl'
            />
          </FilterField>
          <FilterField label='Platform Role'>
            <Select
              value={draftFilters.platformRole || 'all'}
              onValueChange={(value) => updateDraft('platformRole', value === 'all' ? '' : value)}
            >
              <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                {platformRoleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label='Project Role'>
            <Select
              value={draftFilters.projectRole || 'all'}
              onValueChange={(value) => updateDraft('projectRole', value === 'all' ? '' : value)}
            >
              <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                {projectRoleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        <div className='mt-5 flex justify-end gap-3'>
          <Button
            variant='outline'
            className='rounded-xl'
            onClick={() => {
              setDraftFilters(emptyFilters);
              setAppliedFilters(emptyFilters);
              setHeaderRoleDraft('');
              setHeaderRoleApplied('');
              setSelectedIds([]);
            }}
          >
            Reset
          </Button>
          <Button
            className='bg-brand-gradient rounded-xl border-transparent text-white hover:opacity-95'
            onClick={() => setAppliedFilters(draftFilters)}
          >
            Search
          </Button>
        </div>
      </div>

      <div className='flex items-center justify-between gap-3'>
        <Button
          variant='outline'
          className='rounded-xl disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:shadow-none'
          disabled={selectedIds.length === 0}
          onClick={handleBulkDisable}
        >
          Bulk Disable
        </Button>

        <Button className='bg-brand-gradient rounded-xl border-transparent text-white hover:opacity-95'>
          <Icons.add className='size-4' />
          Create Account
        </Button>
      </div>

      <div className='overflow-hidden rounded-3xl border bg-white shadow-md'>
        <Table>
          <TableHeader className='bg-muted/40'>
            <TableRow>
              <TableHead className='w-16 pl-6'>
                <Checkbox
                  className='size-5 rounded-[4px] border-slate-400 shadow-none data-[state=checked]:border-primary'
                  checked={allVisibleSelected}
                  onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                  aria-label='Select all users'
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='No.'
                  active={sortKey === 'sequence'}
                  direction={sortDirection}
                  onClick={() => handleSort('sequence')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Name'
                  active={sortKey === 'name'}
                  direction={sortDirection}
                  onClick={() => handleSort('name')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Mobile'
                  active={sortKey === 'mobile'}
                  direction={sortDirection}
                  onClick={() => handleSort('mobile')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Email'
                  active={sortKey === 'email'}
                  direction={sortDirection}
                  onClick={() => handleSort('email')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Account'
                  active={sortKey === 'account'}
                  direction={sortDirection}
                  onClick={() => handleSort('account')}
                />
              </TableHead>
              <TableHead>
                <Popover open={roleFilterOpen} onOpenChange={setRoleFilterOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type='button'
                      className='text-foreground hover:text-primary inline-flex items-center gap-1 text-left font-medium'
                    >
                      <span>Platform Role</span>
                      <Icons.chevronsUpDown className='text-muted-foreground size-4' />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='w-72 rounded-2xl p-4'>
                    <div className='space-y-4'>
                      <Select
                        value={headerRoleDraft || 'all'}
                        onValueChange={(value) => setHeaderRoleDraft(value === 'all' ? '' : value)}
                      >
                        <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All Roles</SelectItem>
                          {platformRoleOptions.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='ghost'
                          onClick={() => {
                            setHeaderRoleDraft(headerRoleApplied);
                            setRoleFilterOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className='bg-brand-gradient border-transparent text-white hover:opacity-95'
                          onClick={() => {
                            setHeaderRoleApplied(headerRoleDraft);
                            setRoleFilterOpen(false);
                          }}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableHead>
              <TableHead>
                <SortButton
                  label='Project Role'
                  active={sortKey === 'projectRole'}
                  direction={sortDirection}
                  onClick={() => handleSort('projectRole')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Vendor User'
                  active={sortKey === 'isVendor'}
                  direction={sortDirection}
                  onClick={() => handleSort('isVendor')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Affiliated Vendor'
                  active={sortKey === 'vendorName'}
                  direction={sortDirection}
                  onClick={() => handleSort('vendorName')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Recent Login Time'
                  active={sortKey === 'recentLoginAt'}
                  direction={sortDirection}
                  onClick={() => handleSort('recentLoginAt')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Registration Time'
                  active={sortKey === 'registeredAt'}
                  direction={sortDirection}
                  onClick={() => handleSort('registeredAt')}
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label='Status'
                  active={sortKey === 'status'}
                  direction={sortDirection}
                  onClick={() => handleSort('status')}
                />
              </TableHead>
              <TableHead className='pr-6'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id} className='hover:bg-muted/20'>
                <TableCell className='pl-6'>
                  <Checkbox
                    className='size-5 rounded-[4px] border-slate-400 shadow-none data-[state=checked]:border-primary'
                    checked={selectedIds.includes(user.id)}
                    onCheckedChange={(checked) => toggleRowSelection(user.id, Boolean(checked))}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell>{user.sequence}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.account}</TableCell>
                <TableCell>{user.platformRole}</TableCell>
                <TableCell>{user.projectRole}</TableCell>
                <TableCell>{user.isVendor}</TableCell>
                <TableCell>{user.vendorName}</TableCell>
                <TableCell>{user.recentLoginAt}</TableCell>
                <TableCell>{user.registeredAt}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                      user.status === 'Enabled'
                        ? 'bg-emerald-500/12 text-emerald-700'
                        : 'bg-slate-200 text-slate-700'
                    )}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className='pr-6'>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      disabled={user.status === 'Disabled'}
                      onClick={() => handleSingleDisable(user.id)}
                    >
                      <Icons.circleX className='size-4' />
                      Disable
                    </Button>
                    <Button variant='ghost' size='sm'>
                      <Icons.edit className='size-4' />
                      Edit
                    </Button>
                    <Button variant='ghost' size='sm'>
                      <Icons.externalLink className='size-4' />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='space-y-2'>
      <span className='text-foreground text-sm font-medium'>{label}</span>
      {children}
    </label>
  );
}
