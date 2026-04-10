import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type TableActionButtonProps = {
  label: string;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  asChild?: boolean;
  children?: React.ReactNode;
};

export function TableActionButton({
  label,
  icon,
  className,
  disabled,
  onClick,
  asChild = false,
  children
}: TableActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='secondary'
          size='sm'
          aria-label={label}
          title={label}
          disabled={disabled}
          onClick={onClick}
          asChild={asChild}
          className={cn(
            'text-foreground hover:text-foreground h-8 rounded-lg bg-slate-100 px-2.5 shadow-none hover:bg-slate-200 [&_svg]:text-inherit',
            className
          )}
        >
          {asChild ? children : icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className='[--tooltip-bg:var(--color-slate-200)] [--tooltip-fg:var(--color-slate-900)]'>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
