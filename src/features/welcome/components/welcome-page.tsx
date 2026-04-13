'use client';

import { useState } from 'react';
import { IconBuildingStore, IconEditCircle, IconUsersGroup } from '@tabler/icons-react';
import { Icons } from '@/components/icons';
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
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  annotationSpecialtyOptions,
  collectionSpecialtyOptions
} from '@/features/vendors/data/vendor-management-data';

const roleOptions = [
  {
    title: 'Self-managed Annotation User',
    eyebrow: 'Internal workflow',
    description:
      'Create tasks for your own team, assign work directly, and keep review quality under internal control.',
    icon: IconEditCircle
  },
  {
    title: 'Vendor',
    eyebrow: 'External delivery partner',
    description:
      'Receive outsourced annotation projects, coordinate delivery, and report progress back to platform owners.',
    icon: IconBuildingStore
  },
  {
    title: 'Crowdsourced Account',
    eyebrow: 'Distributed contributor network',
    description:
      'Join distributed task pools for high-volume annotation work with flexible intake and scalable execution.',
    icon: IconUsersGroup
  }
] as const;

const annotationOptions = annotationSpecialtyOptions.map((option) => ({
  label: option,
  value: option
}));

const collectionOptions = collectionSpecialtyOptions.map((option) => ({
  label: option,
  value: option
}));

const businessTypeOptions = [
  'Data Annotation',
  'Data Collection',
  'Model Evaluation',
  'Data Quality Assurance',
  'Workforce Operations',
  'Localization / Translation',
  'Other'
] as const;

const entityTypeOptions = [
  'LLC',
  'Corporation',
  'S Corporation',
  'Partnership',
  'Sole Proprietorship',
  'Nonprofit',
  'Other'
] as const;

const coverageOptions = [
  'United States',
  'Canada',
  'North America',
  'Nearshore Delivery',
  'Global Delivery'
] as const;

const complianceOptions = [
  { label: 'NDA Available', value: 'nda' },
  { label: 'W-9 Available', value: 'w9' },
  { label: 'Certificate of Insurance', value: 'coi' },
  { label: 'SOC 2', value: 'soc2' },
  { label: 'ISO 27001', value: 'iso27001' },
  { label: 'HIPAA-capable', value: 'hipaa' }
];

export default function WelcomePage() {
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [annotationTypes, setAnnotationTypes] = useState<string[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<string[]>([]);
  const [complianceItems, setComplianceItems] = useState<string[]>([]);

  return (
    <>
      <div className='space-y-10 pb-8'>
        <section className='space-y-3'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200'>
            <Icons.sparkles className='size-3.5 text-primary' />
            Platform onboarding
          </div>
          <div className='max-w-3xl space-y-2'>
            <h1 className='text-foreground text-[30px] font-semibold tracking-tight'>
              Hi, welcome.
            </h1>
            <p className='text-muted-foreground text-sm leading-6'>
              Start by choosing the role that matches how you will work in the integrated annotation
              platform. Each option represents a different operating model, from internal task
              management to external delivery and large-scale contributor workflows.
            </p>
          </div>
        </section>

        <section className='grid gap-6 xl:grid-cols-3'>
          {roleOptions.map((role) => {
            const RoleIcon = role.icon;
            const isVendor = role.title === 'Vendor';

            return (
              <article
                key={role.title}
                className='group relative min-h-[248px] overflow-hidden rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:shadow-md'
              >
                <div className='absolute right-0 bottom-0 h-28 w-28 translate-x-8 translate-y-8 rounded-full bg-primary/8 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10' />

                <div className='relative flex h-full flex-col justify-between gap-7'>
                  <div className='flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-white/15 group-hover:text-white'>
                    <RoleIcon className='size-5' stroke={1.8} />
                  </div>

                  <div className='space-y-3'>
                    <div className='text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase transition-colors group-hover:text-white/70'>
                      {role.eyebrow}
                    </div>
                    <h2 className='text-[18px] font-semibold text-slate-950 transition-colors group-hover:text-white'>
                      {role.title}
                    </h2>
                    <p className='text-sm leading-6 text-slate-500 transition-colors group-hover:text-white/78'>
                      {role.description}
                    </p>
                  </div>

                  <Button
                    className='h-10 w-fit rounded-xl bg-primary px-5 text-white shadow-none transition-colors hover:bg-primary/90 group-hover:bg-white group-hover:text-primary group-hover:hover:bg-white/95'
                    onClick={() => {
                      if (isVendor) {
                        setVendorDialogOpen(true);
                      }
                    }}
                  >
                    Select
                  </Button>
                </div>
              </article>
            );
          })}
        </section>
      </div>

      <Dialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen}>
        <DialogContent className='max-h-[88vh] gap-0 overflow-hidden rounded-3xl border-primary/10 bg-white p-0 shadow-xl sm:max-w-[960px]'>
          <DialogHeader className='bg-white px-8 pt-7 pb-6'>
            <div className='flex flex-wrap items-start justify-between gap-4 pr-8'>
              <div className='max-w-2xl space-y-2'>
                <div className='text-xs font-semibold tracking-[0.14em] text-primary uppercase'>
                  Vendor onboarding
                </div>
                <DialogTitle className='text-[22px] font-semibold text-slate-950'>
                  Vendor Information Registration
                </DialogTitle>
                <DialogDescription className='text-sm leading-6 text-slate-500'>
                  Share the business, contact, capability, and compliance details needed for vendor
                  qualification.
                </DialogDescription>
              </div>
              <div className='rounded-2xl bg-primary/5 px-4 py-3 text-right ring-1 ring-primary/10'>
                <div className='text-xs font-medium text-slate-400'>Review status</div>
                <div className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
                  <span className='size-2 rounded-full bg-blue-500' />
                  Draft
                </div>
              </div>
            </div>
          </DialogHeader>

          <form
            className='max-h-[calc(88vh-164px)] space-y-5 overflow-y-auto px-8 py-6'
            onSubmit={(event) => {
              event.preventDefault();
              setVendorDialogOpen(false);
            }}
          >
            <FormSection
              step='01'
              title='Business Profile'
              description='Basic registration details used for vendor review and account setup.'
              summary='Legal identity'
            >
              <div className='grid gap-5 md:grid-cols-2'>
                <FormField label='Legal Business Name'>
                  <Input className='h-11 rounded-xl' placeholder='Enter legal entity name' />
                </FormField>
                <FormField label='DBA / Trade Name'>
                  <Input className='h-11 rounded-xl' placeholder='Optional operating name' />
                </FormField>
                <FormField label='Entity Type'>
                  <Select>
                    <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                      <SelectValue placeholder='Select entity type' />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label='EIN / Federal Tax ID'>
                  <Input className='h-11 rounded-xl' placeholder='Enter EIN or tax ID' />
                </FormField>
                <FormField label='Year Established'>
                  <Input className='h-11 rounded-xl' type='number' placeholder='Example: 2019' />
                </FormField>
                <FormField label='Company Website'>
                  <Input className='h-11 rounded-xl' placeholder='https://example.com' />
                </FormField>
                <FormField label='Headquarters Country'>
                  <Select>
                    <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                      <SelectValue placeholder='Select country' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='United States'>United States</SelectItem>
                      <SelectItem value='Canada'>Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label='Headquarters State / Province'>
                  <Input className='h-11 rounded-xl' placeholder='Example: California' />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              step='02'
              title='Primary Contact'
              description='The person responsible for vendor onboarding and project communication.'
              summary='Owner and address'
            >
              <div className='grid gap-5 md:grid-cols-2'>
                <FormField label='Contact Name'>
                  <Input className='h-11 rounded-xl' placeholder='Enter contact name' />
                </FormField>
                <FormField label='Work Email'>
                  <Input className='h-11 rounded-xl' type='email' placeholder='name@company.com' />
                </FormField>
                <FormField label='Phone Number'>
                  <Input className='h-11 rounded-xl' placeholder='+1 (555) 000-0000' />
                </FormField>
                <FormField label='Job Title'>
                  <Input className='h-11 rounded-xl' placeholder='Example: Operations Manager' />
                </FormField>
                <FormField label='Business Address'>
                  <Textarea
                    className='min-h-[92px] rounded-xl'
                    placeholder='Street, city, state/province, postal code'
                  />
                </FormField>
                <FormField label='Timezone'>
                  <Input className='h-11 rounded-xl' placeholder='Example: Pacific Time' />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              step='03'
              title='Service Capabilities'
              description='Capabilities used to match this vendor with annotation and data projects.'
              summary='Delivery fit'
            >
              <div className='grid gap-5 md:grid-cols-2'>
                <FormField label='Primary Business Type'>
                  <Select>
                    <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                      <SelectValue placeholder='Select business type' />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label='Coverage Region'>
                  <Select>
                    <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                      <SelectValue placeholder='Select delivery coverage' />
                    </SelectTrigger>
                    <SelectContent>
                      {coverageOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label='Annotation Specialty'>
                  <MultiSelect
                    options={annotationOptions}
                    values={annotationTypes}
                    onChange={setAnnotationTypes}
                    placeholder='Select annotation specialties'
                    searchPlaceholder='Search annotation types...'
                    triggerClassName='h-11'
                  />
                </FormField>
                <FormField label='Collection Specialty'>
                  <MultiSelect
                    options={collectionOptions}
                    values={collectionTypes}
                    onChange={setCollectionTypes}
                    placeholder='Select collection specialties'
                    searchPlaceholder='Search collection types...'
                    triggerClassName='h-11'
                  />
                </FormField>
                <FormField label='Estimated Monthly Capacity'>
                  <Input className='h-11 rounded-xl' placeholder='Example: 50,000 tasks/month' />
                </FormField>
                <FormField label='Supported Languages'>
                  <Input className='h-11 rounded-xl' placeholder='Example: English, Spanish' />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              step='04'
              title='Compliance & Documents'
              description='Documents and compliance signals used during vendor qualification.'
              summary='Risk readiness'
            >
              <div className='grid gap-5 md:grid-cols-2'>
                <FormField label='Compliance Readiness'>
                  <MultiSelect
                    options={complianceOptions}
                    values={complianceItems}
                    onChange={setComplianceItems}
                    placeholder='Select available items'
                    searchPlaceholder='Search compliance items...'
                    triggerClassName='h-11'
                  />
                </FormField>
                <FormField label='Data Security Contact'>
                  <Input className='h-11 rounded-xl' placeholder='security@company.com' />
                </FormField>
              </div>
              <label
                htmlFor='vendor-supporting-materials'
                className='mt-5 flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/25 bg-white px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5'
              >
                <Icons.upload className='size-6 text-slate-400' />
                <div className='space-y-1'>
                  <div className='text-sm font-medium text-slate-700'>
                    Click or drag files here to upload
                  </div>
                  <div className='text-xs text-slate-400'>
                    W-9, insurance certificate, NDA, compliance evidence, or capability deck.
                  </div>
                </div>
                <span className='rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white'>
                  Choose File
                </span>
                <input id='vendor-supporting-materials' type='file' className='sr-only' multiple />
              </label>
            </FormSection>

            <DialogFooter className='sticky bottom-0 -mx-8 -mb-6 border-t border-slate-100 bg-white/95 px-8 py-5 backdrop-blur'>
              <Button
                type='button'
                variant='outline'
                className='h-10 rounded-xl px-5'
                onClick={() => setVendorDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'
              >
                Submit Registration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormSection({
  step,
  title,
  description,
  summary,
  children
}: {
  step: string;
  title: string;
  description: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <section className='rounded-3xl border border-primary/10 bg-white p-6 shadow-sm'>
      <div className='grid gap-5 lg:grid-cols-[220px_1fr]'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary'>
              {step}
            </div>
            <div className='text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase'>
              {summary}
            </div>
          </div>
          <div className='space-y-1.5'>
            <h3 className='text-base font-semibold text-slate-950'>{title}</h3>
            <p className='text-sm leading-6 text-slate-500'>{description}</p>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-semibold text-slate-800'>{label}</label>
      {children}
    </div>
  );
}
