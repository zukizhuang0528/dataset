'use client';

import * as React from 'react';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type MultiSelectOption = {
  label: string;
  value: string;
};

export function MultiSelect({
  options,
  values,
  onChange,
  placeholder = 'Select',
  searchPlaceholder = 'Search...',
  className,
  triggerClassName,
  maxPreview = 2
}: {
  options: MultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  maxPreview?: number;
}) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = React.useMemo(
    () => options.filter((option) => values.includes(option.value)),
    [options, values]
  );

  const toggleValue = (nextValue: string) => {
    if (values.includes(nextValue)) {
      onChange(values.filter((value) => value !== nextValue));
      return;
    }

    onChange([...values, nextValue]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-10 w-full justify-between rounded-xl border-input px-3 text-left font-normal hover:bg-transparent',
            triggerClassName
          )}
        >
          <div className='flex min-w-0 flex-1 flex-wrap items-center gap-1.5'>
            {selectedOptions.length ? (
              <>
                {selectedOptions.slice(0, maxPreview).map((option) => (
                  <Badge
                    key={option.value}
                    variant='outline'
                    className='rounded-full border-primary/15 bg-primary/5 px-2 py-0 text-[11px] font-medium text-primary'
                  >
                    {option.label}
                  </Badge>
                ))}
                {selectedOptions.length > maxPreview ? (
                  <Badge
                    variant='outline'
                    className='rounded-full border-slate-200 bg-slate-50 px-2 py-0 text-[11px] font-medium text-slate-600'
                  >
                    +{selectedOptions.length - maxPreview}
                  </Badge>
                ) : null}
              </>
            ) : (
              <span className='text-muted-foreground truncate'>{placeholder}</span>
            )}
          </div>
          <Icons.chevronDown className='text-muted-foreground size-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className={cn(
          'w-[var(--radix-popover-trigger-width)] rounded-2xl border border-border/80 p-0 shadow-sm',
          className
        )}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const checked = values.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <Checkbox checked={checked} className='pointer-events-none' />
                    <span className='flex-1'>{option.label}</span>
                    {checked ? <Icons.check className='size-4 text-primary' /> : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {values.length ? (
            <div className='border-t border-slate-100 p-2'>
              <Button
                variant='ghost'
                className='h-8 w-full rounded-lg text-sm text-slate-600 hover:text-slate-900'
                onClick={() => onChange([])}
              >
                Clear selection
              </Button>
            </div>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
