'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { TableActionButton } from '@/components/ui/table-action-button';
import { recycleBinList, type RecycleBinItem } from '@/features/datasets/data/dataset-list-data';

export default function DatasetRecycleBinPage() {
  const [activeItem, setActiveItem] = useState<RecycleBinItem | null>(null);

  const rows = useMemo(() => recycleBinList, []);

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/dashboard/datasets'>Datasets</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Recycle Bin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className='text-foreground text-3xl font-semibold tracking-tight'>Recycle Bin</h1>
        </div>
      </div>

      <section className='overflow-hidden rounded-3xl border bg-white shadow-sm'>
        <Table className='!w-full min-w-[720px]'>
          <TableHeader className='bg-muted/30'>
            <TableRow>
              <TableHead>Dataset Name</TableHead>
              <TableHead>Dataset ID</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead>Retention Left</TableHead>
              <TableHead>Creator / Team</TableHead>
              <TableHead className='w-[140px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item) => (
              <TableRow key={item.id} className='hover:bg-muted/20'>
                <TableCell className='font-medium'>{item.name}</TableCell>
                <TableCell className='font-mono text-xs'>{item.id}</TableCell>
                <TableCell>{item.deletedAt}</TableCell>
                <TableCell>{item.retentionLeft}</TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    <div className='font-medium'>{item.owner}</div>
                    <div className='text-muted-foreground text-xs'>{item.team}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <TableActionButton
                    label='Restore dataset'
                    icon={<Icons.upload className='size-4' />}
                    onClick={() => setActiveItem(item)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className='max-w-xl rounded-3xl'>
          <DialogHeader>
            <DialogTitle>Restore Dataset</DialogTitle>
            <DialogDescription>
              Restoring the dataset returns it to the active dataset list. Downstream lifecycle
              status remains unchanged until the next operator decision.
            </DialogDescription>
          </DialogHeader>
          {activeItem && (
            <div className='grid gap-4 rounded-2xl border p-4 text-sm'>
              <InfoRow label='Dataset Name' value={activeItem.name} />
              <InfoRow label='Dataset ID' value={activeItem.id} mono />
              <InfoRow label='Deleted At' value={activeItem.deletedAt} />
              <InfoRow label='Retention Left' value={activeItem.retentionLeft} />
            </div>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => setActiveItem(null)}>
              Cancel
            </Button>
            <Button
              className='bg-brand-gradient border-transparent text-white hover:opacity-95'
              onClick={() => setActiveItem(null)}
            >
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className='grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4'>
      <span className='text-muted-foreground text-xs'>{label}</span>
      <span className={mono ? 'font-mono text-xs' : ''}>{value}</span>
    </div>
  );
}
