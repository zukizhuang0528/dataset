'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconArrowsExchange, IconKey } from '@tabler/icons-react';
import { Breadcrumbs } from '../breadcrumbs';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { totalUnreadBadgeCount } from '@/features/notifications/data/message-center-data';

export default function Header() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  return (
    <>
      <header className='bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4'>
        <div className='flex min-w-0 items-center gap-2'>
          <Breadcrumbs />
        </div>

        <div className='flex items-center gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-10 rounded-2xl px-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 data-[state=open]:bg-slate-100'
              >
                <Avatar className='h-9 w-9 border border-slate-200'>
                  <AvatarFallback className='bg-primary/10 text-primary text-sm font-semibold'>
                    MW
                  </AvatarFallback>
                </Avatar>
                <span className='text-foreground hidden text-sm font-semibold sm:inline'>
                  Mina Walker
                </span>
                <Icons.chevronDown className='size-4 text-slate-400' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              sideOffset={10}
              className='w-64 rounded-2xl border-slate-200 p-2 shadow-lg'
            >
              <DropdownMenuLabel className='px-3 py-2.5 font-normal'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='space-y-1'>
                    <div className='text-xs font-medium text-slate-400'>Current Role</div>
                    <div className='text-sm font-semibold text-slate-900'>Project Owner</div>
                  </div>
                  <div className='flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500'>
                    <IconArrowsExchange className='size-4' stroke={1.8} />
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className='my-1 bg-slate-100' />
              <DropdownMenuItem
                className='h-10 rounded-xl px-3 text-sm font-medium text-slate-700 focus:bg-slate-100 focus:text-slate-950'
                asChild
              >
                <Link href='/dashboard/profile'>
                  <Icons.account className='mr-2 size-4 text-slate-500' />
                  Personal Center
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='h-10 rounded-xl px-3 text-sm font-medium text-slate-700 focus:bg-slate-100 focus:text-slate-950'
                onSelect={() => setPasswordDialogOpen(true)}
              >
                <IconKey className='mr-2 size-4 text-slate-500' stroke={1.8} />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator className='my-1 bg-slate-100' />
              <DropdownMenuItem
                className='h-10 rounded-xl px-3 text-sm font-medium text-slate-700 focus:bg-slate-100 focus:text-slate-950'
                asChild
              >
                <Link href='/auth/sign-in'>
                  <Icons.logout className='mr-2 size-4 text-slate-500' />
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select defaultValue='en'>
            <SelectTrigger className='text-muted-foreground h-9 w-[132px] rounded-xl border-slate-200 text-sm data-[size=default]:h-9'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en'>English</SelectItem>
              <SelectItem value='zh'>Simplified Chinese</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant='ghost'
            size='icon'
            className='relative h-9 w-9 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            asChild
          >
            <Link href='/dashboard/notifications'>
              <Icons.notification className='h-4 w-4' />
              {totalUnreadBadgeCount > 0 ? (
                <span className='absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white'>
                  {totalUnreadBadgeCount}
                </span>
              ) : null}
              <span className='sr-only'>Open message center</span>
            </Link>
          </Button>
        </div>
      </header>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className='gap-0 overflow-hidden rounded-2xl border-slate-200 p-0 shadow-xl sm:max-w-[560px]'>
          <DialogHeader className='border-b border-slate-100 px-6 py-5'>
            <DialogTitle className='text-[18px] font-semibold text-slate-900'>
              Change Password
            </DialogTitle>
          </DialogHeader>

          <form
            className='space-y-5 px-6 py-6'
            onSubmit={(event) => {
              event.preventDefault();
              setPasswordDialogOpen(false);
            }}
          >
            <div className='space-y-2'>
              <label htmlFor='current-password' className='text-sm font-medium text-slate-700'>
                Current Password
              </label>
              <input
                id='current-password'
                type='password'
                className='h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/12'
              />
            </div>
            <div className='space-y-2'>
              <label htmlFor='new-password' className='text-sm font-medium text-slate-700'>
                New Password
              </label>
              <input
                id='new-password'
                type='password'
                className='h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/12'
              />
            </div>
            <div className='space-y-2'>
              <label htmlFor='confirm-password' className='text-sm font-medium text-slate-700'>
                Confirm Password
              </label>
              <input
                id='confirm-password'
                type='password'
                className='h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/12'
              />
            </div>

            <DialogFooter className='pt-2'>
              <Button
                type='button'
                variant='outline'
                className='h-10 rounded-xl px-5'
                onClick={() => setPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'
              >
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
