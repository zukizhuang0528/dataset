'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { datasets } from '../data/mock-datasets';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { TableActionButton } from '@/components/ui/table-action-button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

const toneClasses = {
  brand: 'border-primary/15 bg-primary/8 text-primary',
  success: 'border-emerald-500/15 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  warning: 'border-amber-500/15 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  danger: 'border-red-500/15 bg-red-500/10 text-red-700 dark:text-red-300',
  info: 'border-secondary/15 bg-secondary/10 text-secondary dark:text-secondary'
} as const;

export default function DatasetListingPage() {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<'All' | 'Autonomous driving' | 'Embodied intelligence'>(
    'All'
  );
  const [onlyMine, setOnlyMine] = useState(false);

  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchDomain = domain === 'All' || dataset.domain === domain;
      const matchMine = !onlyMine || dataset.owner === 'Mina Walker';
      const haystack =
        `${dataset.name} ${dataset.id} ${dataset.owner} ${dataset.team}`.toLowerCase();
      const matchQuery = !query || haystack.includes(query.toLowerCase());

      return matchDomain && matchMine && matchQuery;
    });
  }, [domain, onlyMine, query]);

  return (
    <div className='flex flex-1 flex-col gap-6'>
      <Card className='surface-brand-glow overflow-hidden border-primary/10 shadow-lg'>
        <CardHeader className='relative gap-4'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='max-w-3xl space-y-3'>
              <Badge
                variant='outline'
                className='border-primary/20 bg-background/80 text-primary rounded-full px-3 py-1'
              >
                Dataset operations hub
              </Badge>
              <CardTitle className='text-4xl leading-tight font-semibold tracking-tight text-balance'>
                Monitor import, preprocessing, and labeling from one place
              </CardTitle>
              <CardDescription className='max-w-2xl text-sm leading-7 md:text-base'>
                This page is rebuilt on top of the starter&apos;s existing shadcn layout and theme
                system. It keeps the dashboard skeleton while shifting the product language toward a
                light, precise AI data operations platform.
              </CardDescription>
            </div>
            <div className='bg-brand-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20'>
              <Icons.workspace className='size-6' />
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <Badge className='bg-brand-gradient rounded-full px-3 py-1 text-white shadow-primary/20'>
              {datasets.length} active datasets
            </Badge>
            <Badge variant='outline' className='rounded-full px-3 py-1'>
              1 ETL exception
            </Badge>
            <Badge variant='outline' className='rounded-full px-3 py-1'>
              1 dataset ready for decision
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {[
          {
            label: 'Live datasets',
            value: '128',
            note: 'Sorted by last updated time'
          },
          {
            label: 'Import throughput',
            value: '2.1k',
            note: 'Average files per hour'
          },
          {
            label: 'Auto-label accuracy',
            value: '91.7%',
            note: 'Rolling benchmark'
          },
          {
            label: 'Manual review queue',
            value: '14',
            note: 'Waiting for human decision'
          }
        ].map((metric) => (
          <Card key={metric.label} className='border-border/80 shadow-md'>
            <CardHeader className='gap-2 pb-2'>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className='text-3xl font-semibold'>{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border-border/80 shadow-md'>
        <CardHeader className='gap-4'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='space-y-1'>
              <CardTitle>Filter datasets</CardTitle>
              <CardDescription>
                Keep the list dense and readable. Short English labels and semantic filters work
                better than verbose control bars.
              </CardDescription>
            </div>
            <Button
              variant={onlyMine ? 'default' : 'outline'}
              className={cn(
                'rounded-full',
                onlyMine && 'bg-brand-gradient border-transparent text-white hover:opacity-95'
              )}
              onClick={() => setOnlyMine((current) => !current)}
            >
              {onlyMine ? 'Showing my datasets' : 'Only my datasets'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]'>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search by dataset, ID, owner, or team'
            className='h-11 rounded-xl'
          />
          <div className='flex flex-wrap items-center gap-2'>
            {(['All', 'Autonomous driving', 'Embodied intelligence'] as const).map((value) => (
              <Button
                key={value}
                variant={domain === value ? 'default' : 'outline'}
                className={cn(
                  'rounded-full',
                  domain === value &&
                    'bg-brand-gradient border-transparent text-white hover:opacity-95'
                )}
                onClick={() => setDomain(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className='border-border/80 shadow-md'>
        <CardHeader className='gap-4'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='space-y-1'>
              <CardTitle>Dataset list</CardTitle>
              <CardDescription>
                This list is the entry point to the detail and configuration flow. Actions stay
                compact while the row remains scan-friendly.
              </CardDescription>
            </div>
            <Badge variant='outline' className='rounded-full px-3 py-1 text-xs font-semibold'>
              {filteredDatasets.length} datasets
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-hidden rounded-2xl border'>
            <Table className='!w-full min-w-[920px]'>
              <TableHeader className='bg-muted/60'>
                <TableRow>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Domain / task</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Run health</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDatasets.map((dataset) => (
                  <TableRow key={dataset.id} className='hover:bg-muted/40'>
                    <TableCell className='align-top'>
                      <div className='space-y-1'>
                        <div className='font-medium'>{dataset.name}</div>
                        <div className='text-muted-foreground font-mono text-xs'>{dataset.id}</div>
                      </div>
                    </TableCell>
                    <TableCell className='align-top'>
                      <div className='space-y-1'>
                        <div className='font-medium'>{dataset.domain}</div>
                        <div className='text-muted-foreground text-xs'>{dataset.taskType}</div>
                      </div>
                    </TableCell>
                    <TableCell>{dataset.version}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn(
                          'rounded-full px-2.5 py-0.5',
                          toneClasses[dataset.statusTone]
                        )}
                      >
                        {dataset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{dataset.source}</TableCell>
                    <TableCell className='align-top'>
                      <div className='space-y-1'>
                        <div className='font-medium'>{dataset.throughput}</div>
                        <div className='text-muted-foreground text-xs'>
                          {dataset.metrics.activeVersion}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='align-top'>
                      <div className='space-y-1'>
                        <div className='font-medium'>{dataset.owner}</div>
                        <div className='text-muted-foreground text-xs'>{dataset.team}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-end gap-2'>
                        <TableActionButton
                          label='Open dataset'
                          icon={<Icons.externalLink className='size-4' />}
                          asChild
                        >
                          <Link
                            href={`/dashboard/datasets/${dataset.id}`}
                            aria-label='Open dataset'
                          >
                            <Icons.externalLink className='size-4' />
                          </Link>
                        </TableActionButton>
                        <TableActionButton
                          label='Review dataset'
                          icon={<Icons.eyeOff className='size-4' />}
                          asChild
                        >
                          <Link
                            href={`/dashboard/datasets/${dataset.id}`}
                            aria-label='Review dataset'
                          >
                            <Icons.eyeOff className='size-4' />
                          </Link>
                        </TableActionButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
