'use client';

import { useMemo, useState } from 'react';
import { Icons } from '@/components/icons';
import {
  AdminFilterLabel,
  AdminPageHero,
  AdminSectionHeader,
  AdminSurface
} from '@/components/layout/admin-page-primitives';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  annotationSpecialtyOptions,
  collectionSpecialtyOptions,
  resourceScopeOptions,
  specialResourceOptions,
  vendorBusinessTypeOptions,
  vendorRecords,
  vendorReviewTabs,
  type AnnotationSpecialty,
  type CollectionSpecialty,
  type SpecialResource,
  type VendorBusinessType,
  type VendorRecord,
  type VendorReviewStatus
} from '@/features/vendors/data/vendor-management-data';

type VendorFilters = {
  companyName: string;
  businessType: 'All' | VendorBusinessType;
  annotationTypes: AnnotationSpecialty[];
  collectionTypes: CollectionSpecialty[];
  contactName: string;
  contactPhone: string;
  resourceScope: 'All' | VendorRecord['resourceScope'];
  specialResource: 'All' | Exclude<SpecialResource, 'None'>;
};

const initialFilters: VendorFilters = {
  companyName: '',
  businessType: 'All',
  annotationTypes: [],
  collectionTypes: [],
  contactName: '',
  contactPhone: '',
  resourceScope: 'All',
  specialResource: 'All'
};

const reviewTone: Record<VendorReviewStatus, string> = {
  Approved: 'bg-emerald-500',
  'Pending Review': 'bg-blue-500',
  Rejected: 'bg-red-500'
};

const annotationOptions = annotationSpecialtyOptions.map((option) => ({
  label: option,
  value: option
}));

const collectionOptions = collectionSpecialtyOptions.map((option) => ({
  label: option,
  value: option
}));

export default function VendorManagementPage() {
  const [activeTab, setActiveTab] = useState<'All' | VendorReviewStatus>('All');
  const [draftFilters, setDraftFilters] = useState<VendorFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<VendorFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredVendors = useMemo(() => {
    return vendorRecords.filter((vendor) => {
      const matchesTab = activeTab === 'All' || vendor.reviewStatus === activeTab;
      const matchesCompanyName =
        !appliedFilters.companyName ||
        vendor.companyName.toLowerCase().includes(appliedFilters.companyName.trim().toLowerCase());
      const matchesBusinessType =
        appliedFilters.businessType === 'All' ||
        vendor.businessType === appliedFilters.businessType;
      const matchesAnnotationTypes =
        !appliedFilters.annotationTypes.length ||
        appliedFilters.annotationTypes.every((type) => vendor.annotationTypes.includes(type));
      const matchesCollectionTypes =
        !appliedFilters.collectionTypes.length ||
        appliedFilters.collectionTypes.every((type) => vendor.collectionTypes.includes(type));
      const matchesContactName =
        !appliedFilters.contactName ||
        vendor.contactName.toLowerCase().includes(appliedFilters.contactName.trim().toLowerCase());
      const matchesContactPhone =
        !appliedFilters.contactPhone ||
        vendor.contactPhone.includes(appliedFilters.contactPhone.trim());
      const matchesResourceScope =
        appliedFilters.resourceScope === 'All' ||
        vendor.resourceScope === appliedFilters.resourceScope;
      const matchesSpecialResource =
        appliedFilters.specialResource === 'All' ||
        vendor.specialResource === appliedFilters.specialResource;

      return (
        matchesTab &&
        matchesCompanyName &&
        matchesBusinessType &&
        matchesAnnotationTypes &&
        matchesCollectionTypes &&
        matchesContactName &&
        matchesContactPhone &&
        matchesResourceScope &&
        matchesSpecialResource
      );
    });
  }, [activeTab, appliedFilters]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedVendors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVendors.slice(start, start + pageSize);
  }, [currentPage, filteredVendors]);

  const allVisibleSelected =
    pagedVendors.length > 0 && pagedVendors.every((vendor) => selectedIds.includes(vendor.id));

  const partiallySelected =
    pagedVendors.some((vendor) => selectedIds.includes(vendor.id)) && !allVisibleSelected;

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
    setSelectedIds([]);
  };

  const resetFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(1);
    setSelectedIds([]);
  };

  return (
    <div className='min-w-0 max-w-full space-y-8 pb-8'>
      <AdminPageHero
        eyebrow='Vendor Operations'
        title='Vendor Management'
        description='Review qualified suppliers, search vendor capabilities, and monitor collaboration readiness from a single operational workspace.'
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as 'All' | VendorReviewStatus);
          setPage(1);
          setSelectedIds([]);
        }}
        className='max-w-full gap-0'
      >
        <TabsList className='h-auto w-full justify-start gap-8 rounded-none border-b border-slate-200 bg-transparent p-0'>
          {vendorReviewTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='h-12 flex-none rounded-none border-0 border-b-2 border-transparent px-0 text-[15px] font-semibold text-slate-500 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none'
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AdminSurface className='w-full max-w-full px-8 py-7'>
        <div className='grid gap-5 xl:grid-cols-4'>
          <FilterField label='Company Name'>
            <Input
              value={draftFilters.companyName}
              onChange={(event) =>
                setDraftFilters((current) => ({ ...current, companyName: event.target.value }))
              }
              placeholder='Enter company name'
              className='h-10 rounded-xl'
            />
          </FilterField>

          <FilterField label='Business Type'>
            <Select
              value={draftFilters.businessType}
              onValueChange={(value) =>
                setDraftFilters((current) => ({
                  ...current,
                  businessType: value as VendorFilters['businessType']
                }))
              }
            >
              <SelectTrigger className='h-10 w-full rounded-xl data-[size=default]:h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All business types</SelectItem>
                {vendorBusinessTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label='Annotation Specialty'>
            <MultiSelect
              options={annotationOptions}
              values={draftFilters.annotationTypes}
              onChange={(values) =>
                setDraftFilters((current) => ({
                  ...current,
                  annotationTypes: values as AnnotationSpecialty[]
                }))
              }
              placeholder='Select annotation specialties'
              searchPlaceholder='Search annotation types...'
            />
          </FilterField>

          <FilterField label='Collection Specialty'>
            <MultiSelect
              options={collectionOptions}
              values={draftFilters.collectionTypes}
              onChange={(values) =>
                setDraftFilters((current) => ({
                  ...current,
                  collectionTypes: values as CollectionSpecialty[]
                }))
              }
              placeholder='Select collection specialties'
              searchPlaceholder='Search collection types...'
            />
          </FilterField>
        </div>

        <div className='mt-5 grid gap-5 xl:grid-cols-4'>
          <FilterField label='Contact Name'>
            <Input
              value={draftFilters.contactName}
              onChange={(event) =>
                setDraftFilters((current) => ({ ...current, contactName: event.target.value }))
              }
              placeholder='Enter contact name'
              className='h-10 rounded-xl'
            />
          </FilterField>

          <FilterField label='Contact Phone'>
            <Input
              value={draftFilters.contactPhone}
              onChange={(event) =>
                setDraftFilters((current) => ({ ...current, contactPhone: event.target.value }))
              }
              placeholder='Enter contact phone'
              className='h-10 rounded-xl'
            />
          </FilterField>

          <FilterField label='Resource Scope'>
            <Select
              value={draftFilters.resourceScope}
              onValueChange={(value) =>
                setDraftFilters((current) => ({
                  ...current,
                  resourceScope: value as VendorFilters['resourceScope']
                }))
              }
            >
              <SelectTrigger className='h-10 w-full rounded-xl data-[size=default]:h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All scopes</SelectItem>
                {resourceScopeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label='Other Special Resources'>
            <Select
              value={draftFilters.specialResource}
              onValueChange={(value) =>
                setDraftFilters((current) => ({
                  ...current,
                  specialResource: value as VendorFilters['specialResource']
                }))
              }
            >
              <SelectTrigger className='h-10 w-full rounded-xl data-[size=default]:h-10'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All special resources</SelectItem>
                {specialResourceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        <div className='mt-6 flex flex-wrap items-end justify-end gap-3'>
          <Button variant='outline' className='h-10 rounded-xl px-5' onClick={resetFilters}>
            Reset
          </Button>
          <Button
            className='bg-primary h-10 rounded-xl border-transparent px-5 text-white shadow-sm hover:bg-primary/90'
            onClick={applyFilters}
          >
            Search
          </Button>
        </div>
      </AdminSurface>

      <AdminSurface className='w-full max-w-full overflow-hidden'>
        <AdminSectionHeader
          title='Vendor Directory'
          description={`${filteredVendors.length} vendors in the current result set`}
          action={
            selectedIds.length ? (
              <div className='text-sm font-medium text-slate-600'>
                {selectedIds.length} selected
              </div>
            ) : (
              <div className='text-muted-foreground text-xs font-medium'>
                Review state and capability coverage in one place
              </div>
            )
          }
        />

        <div className='max-w-full overflow-hidden'>
          <div className='pb-2'>
            <Table className='min-w-[1800px]'>
              <TableHeader className='bg-slate-50/80'>
                <TableRow>
                  <TableHead className='w-12 pl-6 text-sm'>
                    <Checkbox
                      checked={allVisibleSelected || (partiallySelected ? 'indeterminate' : false)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIds((current) => [
                            ...new Set([...current, ...pagedVendors.map((vendor) => vendor.id)])
                          ]);
                          return;
                        }

                        setSelectedIds((current) =>
                          current.filter((id) => !pagedVendors.some((vendor) => vendor.id === id))
                        );
                      }}
                      aria-label='Select all visible vendors'
                    />
                  </TableHead>
                  <TableHead className='text-sm'>Seq.</TableHead>
                  <TableHead className='text-sm'>Company Name</TableHead>
                  <TableHead className='text-sm'>Unified Credit Code</TableHead>
                  <TableHead className='text-sm'>Established</TableHead>
                  <TableHead className='text-sm'>Full-time Staff</TableHead>
                  <TableHead className='text-sm'>Bachelor+ Ratio</TableHead>
                  <TableHead className='text-sm'>Contact</TableHead>
                  <TableHead className='text-sm'>Phone</TableHead>
                  <TableHead className='text-sm'>Business Type</TableHead>
                  <TableHead className='text-sm'>Annotation Specialty</TableHead>
                  <TableHead className='text-sm'>Collection Specialty</TableHead>
                  <TableHead className='text-sm'>Resource Scope</TableHead>
                  <TableHead className='text-sm'>Special Resources</TableHead>
                  <TableHead className='text-sm'>Review Status</TableHead>
                  <TableHead className='pr-6 text-left text-sm'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedVendors.map((vendor) => {
                  const isSelected = selectedIds.includes(vendor.id);
                  return (
                    <TableRow key={vendor.id} className='text-sm hover:bg-slate-50/80'>
                      <TableCell className='pl-6'>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIds((current) => [...current, vendor.id]);
                              return;
                            }

                            setSelectedIds((current) => current.filter((id) => id !== vendor.id));
                          }}
                          aria-label={`Select ${vendor.companyName}`}
                        />
                      </TableCell>
                      <TableCell className='font-medium'>{vendor.sequence}</TableCell>
                      <TableCell className='min-w-[220px]'>
                        <div className='font-medium text-slate-900'>{vendor.companyName}</div>
                      </TableCell>
                      <TableCell className='min-w-[150px] font-mono text-sm text-slate-600'>
                        {vendor.unifiedCreditCode}
                      </TableCell>
                      <TableCell className='min-w-[112px] text-slate-600'>
                        {vendor.establishedAt}
                      </TableCell>
                      <TableCell>{vendor.fullTimeStaffCount}</TableCell>
                      <TableCell>{vendor.bachelorRatio}</TableCell>
                      <TableCell className='min-w-[132px] font-medium'>
                        {vendor.contactName}
                      </TableCell>
                      <TableCell className='min-w-[160px] text-slate-600'>
                        {vendor.contactPhone}
                      </TableCell>
                      <TableCell className='min-w-[180px] text-slate-700'>
                        {vendor.businessType}
                      </TableCell>
                      <TableCell className='min-w-[210px]'>
                        <ChipList items={vendor.annotationTypes} />
                      </TableCell>
                      <TableCell className='min-w-[210px]'>
                        <ChipList items={vendor.collectionTypes} />
                      </TableCell>
                      <TableCell className='min-w-[178px]'>{vendor.resourceScope}</TableCell>
                      <TableCell className='min-w-[190px]'>
                        {vendor.specialResource === 'None' ? 'None' : vendor.specialResource}
                      </TableCell>
                      <TableCell className='min-w-[138px]'>
                        <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                          <span
                            className={cn('size-2.5 rounded-full', reviewTone[vendor.reviewStatus])}
                          />
                          <span>{vendor.reviewStatus}</span>
                        </div>
                      </TableCell>
                      <TableCell className='min-w-[240px] pr-6'>
                        <div className='flex items-center justify-start gap-2'>
                          {vendor.reviewStatus !== 'Approved' ? (
                            <Button
                              size='sm'
                              className='bg-primary h-8 rounded-lg border-transparent px-3 text-white shadow-none hover:bg-primary/90'
                            >
                              Approve
                            </Button>
                          ) : null}
                          {vendor.reviewStatus !== 'Rejected' ? (
                            <Button
                              variant='outline'
                              size='sm'
                              className='h-8 rounded-lg border-red-200 bg-red-50 px-3 text-red-600 hover:bg-red-100'
                            >
                              Reject
                            </Button>
                          ) : null}
                          <Button
                            variant='outline'
                            size='sm'
                            className='h-8 rounded-lg px-3'
                            aria-label={`View ${vendor.companyName}`}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-8 py-5'>
          <div className='text-muted-foreground text-sm'>
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, filteredVendors.length)} of {filteredVendors.length}{' '}
            vendors
          </div>

          <div className='flex items-center gap-2'>
            <PaginationButton
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              ariaLabel='Previous page'
              icon={Icons.chevronLeft}
            />
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                variant='outline'
                className={cn(
                  'h-9 w-9 rounded-xl border-slate-200 px-0',
                  currentPage === pageNumber &&
                    'border-primary bg-primary text-white hover:bg-primary/90 hover:text-white'
                )}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <PaginationButton
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              ariaLabel='Next page'
              icon={Icons.chevronRight}
            />
          </div>
        </div>
      </AdminSurface>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='space-y-2.5'>
      <AdminFilterLabel>{label}</AdminFilterLabel>
      {children}
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className='flex max-w-[190px] flex-wrap gap-1.5'>
      {items.map((item) => (
        <Badge
          key={item}
          variant='outline'
          className='rounded-full border-primary/15 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary'
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

function PaginationButton({
  onClick,
  disabled,
  ariaLabel,
  icon: Icon
}: {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  icon: typeof Icons.chevronLeft;
}) {
  return (
    <Button
      variant='outline'
      size='icon'
      className='h-9 w-9 rounded-xl border-slate-200'
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <Icon className='size-4' />
    </Button>
  );
}
