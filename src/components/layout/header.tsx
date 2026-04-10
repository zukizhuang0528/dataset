import React from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
          <span className='text-foreground text-sm font-semibold'>Mina Wang</span>
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
      </div>
    </header>
  );
}
