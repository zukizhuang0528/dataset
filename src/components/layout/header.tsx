import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../breadcrumbs';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { totalUnreadBadgeCount } from '@/features/notifications/data/message-center-data';

export default function Header() {
  return (
    <header className='bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4'>
      <div className='flex min-w-0 items-center gap-2'>
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='h-9 w-9 border border-slate-200'>
            <AvatarFallback className='bg-primary/10 text-primary text-sm font-semibold'>
              MW
            </AvatarFallback>
          </Avatar>
          <span className='text-foreground text-sm font-semibold'>Mina Walker</span>
        </div>

        <Select defaultValue='en'>
          <SelectTrigger className='text-muted-foreground h-9 w-[132px] rounded-xl border-slate-200 text-sm data-[size=default]:h-9'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='en'>English</SelectItem>
            <SelectItem value='zh'>简体中文</SelectItem>
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
  );
}
