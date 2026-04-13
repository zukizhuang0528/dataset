'use client';

import { useEffect, useMemo, useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { TableActionButton } from '@/components/ui/table-action-button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

type MemberStatus = 'Enabled' | 'Disabled';
type Gender = 'Female' | 'Male';

type TeamMember = {
  id: string;
  name: string;
  account: string;
  gender: Gender;
  status: MemberStatus;
};

type TeamRecord = {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
};

const memberPools = {
  dataCollection: {
    firstNames: ['Lina', 'Mason', 'Ethan', 'Aiden', 'Ivy', 'Caleb', 'Nora', 'Jason', 'Eva', 'Ryan'],
    lastNames: [
      'Brooks',
      'Clark',
      'Hall',
      'Parker',
      'Foster',
      'Turner',
      'Price',
      'Ward',
      'Bennett',
      'Stone'
    ],
    accountPrefix: 'collect'
  },
  annotation: {
    firstNames: ['Ava', 'Lucas', 'Mia', 'Ella', 'Noah', 'Harper', 'Leah', 'Owen', 'Zoe', 'Dylan'],
    lastNames: [
      'Reed',
      'Bennett',
      'Adams',
      'Richardson',
      'Cook',
      'Murphy',
      'Green',
      'Carter',
      'Morgan',
      'Fleming'
    ],
    accountPrefix: 'annotate'
  },
  quality: {
    firstNames: [
      'Olivia',
      'Sophia',
      'Alexander',
      'Grace',
      'Henry',
      'Abigail',
      'Logan',
      'Chloe',
      'Isaac',
      'Claire'
    ],
    lastNames: [
      'Turner',
      'Carter',
      'Cook',
      'Scott',
      'Morgan',
      'Howard',
      'Mills',
      'Porter',
      'Evans',
      'Diaz'
    ],
    accountPrefix: 'quality'
  }
};

function createMembers(
  teamKey: keyof typeof memberPools,
  size: number,
  disabledEvery: number
): TeamMember[] {
  const pool = memberPools[teamKey];
  return Array.from({ length: size }, (_, index) => {
    const first = pool.firstNames[index % pool.firstNames.length];
    const last = pool.lastNames[Math.floor(index / pool.firstNames.length) % pool.lastNames.length];
    const memberNumber = index + 1;
    return {
      id: `${teamKey}-${memberNumber}`,
      name: `${first} ${last}`,
      account: `${pool.accountPrefix}${String(memberNumber).padStart(2, '0')}`,
      gender: index % 2 === 0 ? 'Female' : 'Male',
      status: memberNumber % disabledEvery === 0 ? 'Disabled' : 'Enabled'
    };
  });
}

const initialTeams: TeamRecord[] = [
  {
    id: 'data-collection',
    name: 'Data Collection Team',
    description:
      'Responsible for dataset sourcing and preprocessing to ensure completeness and availability.',
    members: createMembers('dataCollection', 50, 5)
  },
  {
    id: 'annotation',
    name: 'Data Annotation Team',
    description:
      'Responsible for image and text annotation execution, taxonomy compliance, and task throughput.',
    members: createMembers('annotation', 50, 6)
  },
  {
    id: 'quality',
    name: 'Data Quality Team',
    description:
      'Responsible for review workflows, exception checks, and final quality acceptance before delivery.',
    members: createMembers('quality', 50, 4)
  }
];

export default function TeamManagementPage() {
  const [teams, setTeams] = useState<TeamRecord[]>(initialTeams);
  const [activeTeamId, setActiveTeamId] = useState(initialTeams[0].id);
  const [pageSize, setPageSize] = useState('20');
  const [page, setPage] = useState(1);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
  const [inviteDuration, setInviteDuration] = useState('60');

  const activeTeam = useMemo(
    () => teams.find((team) => team.id === activeTeamId) ?? teams[0] ?? initialTeams[0],
    [activeTeamId, teams]
  );

  const totalPages = Math.max(1, Math.ceil(activeTeam.members.length / Number(pageSize)));

  useEffect(() => {
    setPage(1);
  }, [activeTeamId, pageSize]);

  const pagedMembers = useMemo(() => {
    const start = (page - 1) * Number(pageSize);
    return activeTeam.members.slice(start, start + Number(pageSize));
  }, [activeTeam.members, page, pageSize]);

  const inviteLink = useMemo(() => {
    return `https://annotateflow.example.com/invite/${activeTeam.id}?token=team-${activeTeam.id}-2026`;
  }, [activeTeam.id]);

  function handleCreateTeamSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = newTeamName.trim();
    const description = newTeamDescription.trim();

    if (!name || !description) return;

    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const teamId = id || `team-${Date.now()}`;
    const uniqueTeamId = teams.some((team) => team.id === teamId)
      ? `${teamId}-${Date.now()}`
      : teamId;
    const nextTeam: TeamRecord = {
      id: uniqueTeamId,
      name,
      description,
      members: []
    };

    setTeams((current) => [...current, nextTeam]);
    setActiveTeamId(nextTeam.id);
    setNewTeamName('');
    setNewTeamDescription('');
    setCreateTeamOpen(false);
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='space-y-1'>
          <h1 className='text-foreground text-3xl font-semibold tracking-tight'>Team Management</h1>
          <p className='text-muted-foreground text-sm'>
            Manage information and membership for all platform teams.
          </p>
        </div>

        <div className='grid gap-6 xl:grid-cols-[288px_minmax(0,1fr)]'>
          <section className='rounded-3xl border bg-white p-6 shadow-md'>
            <div className='mb-4 space-y-4'>
              <h2 className='text-lg font-semibold'>Team Management</h2>
              <Button
                className='bg-primary h-10 rounded-xl border-transparent px-4 text-white shadow-sm hover:bg-primary/90'
                onClick={() => setCreateTeamOpen(true)}
              >
                <Icons.add className='size-4' />
                Create
              </Button>
            </div>

            <div className='space-y-3'>
              {teams.map((team) => {
                const isActive = team.id === activeTeamId;
                return (
                  <button
                    key={team.id}
                    type='button'
                    onClick={() => setActiveTeamId(team.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors',
                      isActive
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    )}
                  >
                    <div className='flex min-w-0 items-center gap-3'>
                      <Icons.workspace
                        className={cn('size-5', isActive ? 'text-primary' : 'text-slate-500')}
                      />
                      <span
                        className={cn(
                          'truncate text-sm',
                          isActive ? 'font-semibold text-primary' : 'font-medium text-slate-700'
                        )}
                      >
                        {team.name}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-primary'>
                        <Icons.edit className='size-4' />
                      </span>
                      <span className='text-red-500'>
                        <Icons.trash className='size-4' />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className='rounded-3xl border bg-white p-6 shadow-md'>
            <div className='mb-6 flex items-start justify-between gap-4'>
              <div className='space-y-2'>
                <h2 className='text-2xl font-semibold'>{activeTeam.name}</h2>
                <p className='text-muted-foreground max-w-2xl text-sm leading-7'>
                  {activeTeam.description}
                </p>
              </div>

              <Button
                className='bg-primary h-10 rounded-xl border-transparent px-5 text-white shadow-sm hover:bg-primary/90'
                onClick={() => setInviteMemberOpen(true)}
              >
                <Icons.teams className='size-4' />
                Invite Member
              </Button>
            </div>

            <div className='overflow-hidden rounded-2xl border'>
              <Table className='!w-full min-w-[640px]'>
                <TableHeader className='bg-muted/40'>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedMembers.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>{(page - 1) * Number(pageSize) + index + 1}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.account}</TableCell>
                      <TableCell>{member.gender}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-3 py-1 text-xs font-medium',
                            member.status === 'Enabled'
                              ? 'bg-emerald-500/12 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          )}
                        >
                          {member.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <TableActionButton
                          label='Delete member'
                          icon={<Icons.trash className='size-4' />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className='mt-4 flex flex-wrap items-center justify-between gap-4'>
              <div className='flex items-center gap-3 text-sm'>
                <span>Total {activeTeam.members.length}</span>
                <span>{pageSize} / page</span>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className='h-10 w-[88px] rounded-xl data-[size=default]:h-10'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='20'>20</SelectItem>
                    <SelectItem value='40'>40</SelectItem>
                    <SelectItem value='60'>60</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-10 w-10 rounded-xl'
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <Icons.chevronLeft className='size-4' />
                </Button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  const active = page === pageNumber;
                  return (
                    <Button
                      key={pageNumber}
                      variant={active ? 'default' : 'outline'}
                      className={cn(
                        'h-10 min-w-10 rounded-xl',
                        active && 'bg-primary text-white hover:bg-primary/90'
                      )}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                <Button
                  variant='outline'
                  size='icon'
                  className='h-10 w-10 rounded-xl'
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  <Icons.chevronRight className='size-4' />
                </Button>
              </div>

              <div className='flex items-center gap-2 text-sm'>
                <span>Go to</span>
                <div className='flex h-10 min-w-11 items-center justify-center rounded-xl border px-3'>
                  {page}
                </div>
                <span>page</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
        <DialogContent className='gap-0 overflow-hidden rounded-[22px] border-slate-200 p-0 shadow-xl sm:max-w-[600px]'>
          <DialogHeader className='border-b border-slate-100 px-7 py-6'>
            <DialogTitle className='text-[18px] font-semibold text-slate-900'>
              Create Team
            </DialogTitle>
            <DialogDescription className='max-w-[460px] text-sm leading-6 text-slate-500'>
              Add a team profile before assigning members and managing delivery ownership.
            </DialogDescription>
          </DialogHeader>

          <form className='px-7 py-7' onSubmit={handleCreateTeamSubmit}>
            <div className='space-y-6'>
              <label htmlFor='team-name' className='grid gap-2.5'>
                <span className='text-sm font-semibold text-slate-800'>Team Name</span>
                <Input
                  id='team-name'
                  required
                  value={newTeamName}
                  onChange={(event) => setNewTeamName(event.target.value)}
                  placeholder='Enter team name'
                  className='h-11 rounded-xl'
                />
              </label>

              <label htmlFor='team-description' className='grid gap-2.5'>
                <span className='text-sm font-semibold text-slate-800'>Team Description</span>
                <Textarea
                  id='team-description'
                  required
                  value={newTeamDescription}
                  onChange={(event) => setNewTeamDescription(event.target.value)}
                  placeholder='Describe the team responsibilities'
                  className='min-h-[132px] rounded-xl'
                />
              </label>
            </div>

            <DialogFooter className='mt-7 border-t border-slate-100 pt-5'>
              <Button
                type='button'
                variant='outline'
                className='h-10 rounded-xl px-5'
                onClick={() => setCreateTeamOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'
              >
                Create Team
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteMemberOpen} onOpenChange={setInviteMemberOpen}>
        <DialogContent className='gap-0 overflow-hidden rounded-[22px] border-slate-200 p-0 shadow-xl sm:max-w-[600px]'>
          <DialogHeader className='border-b border-slate-100 px-7 py-6'>
            <DialogTitle className='text-[18px] font-semibold text-slate-900'>Invite</DialogTitle>
            <DialogDescription className='max-w-[480px] text-sm leading-6 text-slate-500'>
              Copy the invitation link and send it to the person you want to invite. After they
              register through the link, they can join the task workflow for this team.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 px-7 py-7'>
            <label htmlFor='invite-duration' className='grid gap-2.5'>
              <span className='text-sm font-semibold text-slate-800'>Valid Duration</span>
              <div className='flex items-center gap-3'>
                <Input
                  id='invite-duration'
                  type='number'
                  min='1'
                  value={inviteDuration}
                  onChange={(event) => setInviteDuration(event.target.value)}
                  className='h-11 rounded-xl'
                />
                <span className='text-sm font-medium text-slate-500'>minutes</span>
              </div>
            </label>

            <label htmlFor='invite-link' className='grid gap-2.5'>
              <span className='text-sm font-semibold text-slate-800'>Invitation Link</span>
              <div className='grid gap-3 sm:grid-cols-[1fr_auto]'>
                <Input
                  id='invite-link'
                  readOnly
                  value={inviteLink}
                  className='h-11 rounded-xl font-mono text-[13px]'
                />
                <Button
                  type='button'
                  variant='outline'
                  className='h-11 rounded-xl px-5'
                  onClick={() => {
                    void navigator.clipboard?.writeText(inviteLink);
                  }}
                >
                  Copy
                </Button>
              </div>
            </label>

            <DialogFooter className='border-t border-slate-100 pt-5'>
              <Button
                type='button'
                variant='outline'
                className='h-10 rounded-xl px-5'
                onClick={() => setInviteMemberOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
