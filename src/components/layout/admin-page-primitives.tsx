import * as React from 'react';
import { cn } from '@/lib/utils';

export function AdminSurface({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn('rounded-[28px] border border-border/80 bg-white shadow-sm', className)}>
      {children}
    </section>
  );
}

export function AdminPageHero({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <AdminSurface className='px-8 py-7'>
      <div className='flex flex-wrap items-start justify-between gap-5'>
        <div className='space-y-2'>
          <div className='text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase'>
            {eyebrow}
          </div>
          <h1 className='text-foreground text-[28px] font-semibold leading-tight tracking-tight'>
            {title}
          </h1>
          {description ? (
            <p className='text-muted-foreground max-w-2xl text-sm leading-7'>{description}</p>
          ) : null}
        </div>
        {actions ? <div className='flex flex-wrap items-center gap-3'>{actions}</div> : null}
      </div>
    </AdminSurface>
  );
}

export function AdminSectionHeader({
  title,
  description,
  action,
  className
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-8 py-5',
        className
      )}
    >
      <div className='space-y-1'>
        <div className='text-foreground text-lg font-semibold'>{title}</div>
        {description ? <div className='text-muted-foreground text-sm'>{description}</div> : null}
      </div>
      {action ? action : null}
    </div>
  );
}

export function AdminFilterLabel({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-muted-foreground text-[11px] font-semibold tracking-[0.16em] uppercase',
        className
      )}
    >
      {children}
    </span>
  );
}
