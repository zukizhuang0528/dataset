'use client';

import { useState } from 'react';
import { IconLock, IconUserCircle } from '@tabler/icons-react';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const vendorProfileSections = [
  {
    step: '01',
    title: 'Business Profile',
    description: 'Basic registration details used for vendor review and account setup.',
    summary: 'Legal identity',
    fields: [
      { label: 'Legal Business Name', value: 'Northstar Data Operations LLC' },
      { label: 'DBA / Trade Name', value: 'Northstar Data' },
      { label: 'Entity Type', value: 'LLC' },
      { label: 'EIN / Federal Tax ID', value: '••-••••4821' },
      { label: 'Year Established', value: '2018' },
      { label: 'Company Website', value: 'https://northstardataops.com' },
      { label: 'Headquarters Country', value: 'United States' },
      { label: 'Headquarters State / Province', value: 'California' }
    ]
  },
  {
    step: '02',
    title: 'Primary Contact',
    description: 'The person responsible for vendor onboarding and project communication.',
    summary: 'Owner and address',
    fields: [
      { label: 'Contact Name', value: 'Avery Chen' },
      { label: 'Work Email', value: 'avery.chen@northstardataops.com' },
      { label: 'Phone Number', value: '+1 (415) 555-0138' },
      { label: 'Job Title', value: 'Director of Delivery Operations' },
      { label: 'Business Address', value: '455 Market St, Suite 1400, San Francisco, CA 94105' },
      { label: 'Timezone', value: 'Pacific Time' }
    ]
  },
  {
    step: '03',
    title: 'Service Capabilities',
    description: 'Capabilities used to match this vendor with annotation and data projects.',
    summary: 'Delivery fit',
    fields: [
      { label: 'Primary Business Type', value: 'Data Annotation' },
      { label: 'Coverage Region', value: 'North America' },
      { label: 'Annotation Specialty', value: 'Text, Image, Point Cloud, Video' },
      { label: 'Collection Specialty', value: 'On-site Collection, Panel Recruitment' },
      { label: 'Estimated Monthly Capacity', value: '75,000 tasks/month' },
      { label: 'Supported Languages', value: 'English, Spanish, French Canadian' }
    ]
  },
  {
    step: '04',
    title: 'Compliance & Documents',
    description: 'Documents and compliance signals used during vendor qualification.',
    summary: 'Risk readiness',
    fields: [
      { label: 'Compliance Readiness', value: 'NDA Available, W-9 Available, SOC 2' },
      { label: 'Data Security Contact', value: 'security@northstardataops.com' },
      { label: 'Supporting Materials', value: 'W-9, NDA, SOC 2 bridge letter, capability deck' }
    ]
  }
] as const;

export default function ProfileViewPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [vendorIsEditing, setVendorIsEditing] = useState(false);

  return (
    <div className='space-y-8 pb-8'>
      <section className='space-y-2'>
        <h1 className='text-foreground text-[28px] font-semibold tracking-tight'>
          Personal Center
        </h1>
        <p className='text-muted-foreground max-w-3xl text-sm leading-6'>
          Manage your avatar, nickname, and optional profile details. Account, registered phone, and
          registered email are identity credentials and cannot be edited here.
        </p>
      </section>

      <Tabs defaultValue='basic-information' className='gap-0'>
        <TabsList className='h-auto w-full justify-start gap-8 rounded-none border-b border-slate-200 bg-transparent p-0'>
          <TabsTrigger
            value='basic-information'
            className='h-12 flex-none rounded-none border-0 border-b-2 border-transparent px-0 text-[15px] font-semibold text-slate-500 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none'
          >
            Basic Information
          </TabsTrigger>
          <TabsTrigger
            value='vendor-information'
            className='h-12 flex-none rounded-none border-0 border-b-2 border-transparent px-0 text-[15px] font-semibold text-slate-500 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none'
          >
            Vendor Information
          </TabsTrigger>
          <TabsTrigger
            value='crowdsourcing-information'
            disabled
            className='h-12 flex-none rounded-none border-0 border-b-2 border-transparent px-0 text-[15px] font-semibold text-slate-400 shadow-none disabled:opacity-50'
          >
            Crowdsourcing Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value='basic-information' className='mt-8'>
          <section className='rounded-[24px] border border-primary/10 bg-white shadow-sm'>
            <div className='flex flex-wrap items-start justify-between gap-4 px-8 py-7'>
              <div className='space-y-1'>
                <h2 className='text-[22px] font-semibold text-slate-950'>Basic Information</h2>
                <p className='text-sm leading-6 text-slate-500'>
                  This information appears in collaboration, task routing, and notifications.
                  Account, registered phone, and registered email are locked; the remaining fields
                  are optional.
                </p>
              </div>

              {isEditing ? (
                <div className='flex flex-wrap gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-10 rounded-xl px-5'
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='button'
                    className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'
                    onClick={() => setIsEditing(false)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  type='button'
                  className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'
                  onClick={() => setIsEditing(true)}
                >
                  <Icons.edit className='size-4' />
                  Edit
                </Button>
              )}
            </div>

            <div className='grid gap-8 px-8 pb-8 xl:grid-cols-[280px_1fr]'>
              <aside className='space-y-5'>
                <div className='rounded-3xl border border-primary/10 bg-white p-6 text-center'>
                  <Avatar className='mx-auto size-24 border border-primary/15'>
                    <AvatarFallback className='bg-primary/10 text-primary'>
                      <IconUserCircle className='size-12' stroke={1.6} />
                    </AvatarFallback>
                  </Avatar>
                  <div className='mt-4 space-y-1'>
                    <div className='text-lg font-semibold text-slate-950'>Mina Walker</div>
                    <div className='text-sm text-slate-500'>Project Owner</div>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={!isEditing}
                    className='mt-5 h-10 w-full rounded-xl'
                  >
                    <Icons.upload className='size-4' />
                    Upload Avatar
                  </Button>
                </div>

                <div className='rounded-3xl border border-primary/10 bg-primary/5 p-5'>
                  <div className='flex items-start gap-3'>
                    <div className='flex size-9 items-center justify-center rounded-xl bg-white text-primary'>
                      <IconLock className='size-4' stroke={1.8} />
                    </div>
                    <div className='space-y-1'>
                      <div className='text-sm font-semibold text-slate-900'>
                        Protected Login Information
                      </div>
                      <p className='text-xs leading-5 text-slate-500'>
                        Account, registered phone, and registered email are identity credentials and
                        require a secure verification flow to change.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              <form
                className='space-y-8'
                onSubmit={(event) => {
                  event.preventDefault();
                  setIsEditing(false);
                }}
              >
                <FormSection title='Locked Information'>
                  <div className='grid gap-5 md:grid-cols-2'>
                    <ProfileField label='Account'>
                      <Input defaultValue='mina.walker' disabled className='h-11 rounded-xl' />
                    </ProfileField>
                    <ProfileField label='Registered Email'>
                      <Input
                        defaultValue='mina.walker@example.com'
                        disabled
                        className='h-11 rounded-xl'
                      />
                    </ProfileField>
                    <ProfileField label='Registered Phone'>
                      <Input
                        defaultValue='+1 (415) 555-0184'
                        disabled
                        className='h-11 rounded-xl'
                      />
                    </ProfileField>
                  </div>
                </FormSection>

                <FormSection title='Editable Information (Optional)'>
                  <div className='grid gap-5 md:grid-cols-2'>
                    <ProfileField label='Nickname'>
                      <Input
                        defaultValue='Mina'
                        disabled={!isEditing}
                        className='h-11 rounded-xl'
                        placeholder='Enter nickname'
                      />
                    </ProfileField>
                    <ProfileField label='Gender'>
                      <Select defaultValue='not-specified' disabled={!isEditing}>
                        <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='not-specified'>Prefer not to say</SelectItem>
                          <SelectItem value='female'>Female</SelectItem>
                          <SelectItem value='male'>Male</SelectItem>
                          <SelectItem value='non-binary'>Non-binary</SelectItem>
                        </SelectContent>
                      </Select>
                    </ProfileField>
                    <ProfileField label='Birthday'>
                      <Input disabled={!isEditing} type='date' className='h-11 rounded-xl' />
                    </ProfileField>
                    <ProfileField label='Location'>
                      <Input
                        defaultValue='San Francisco, CA'
                        disabled={!isEditing}
                        className='h-11 rounded-xl'
                        placeholder='Enter location'
                      />
                    </ProfileField>
                    <ProfileField label='Position / Role'>
                      <Input
                        defaultValue='Project Owner'
                        disabled={!isEditing}
                        className='h-11 rounded-xl'
                        placeholder='Enter position or role'
                      />
                    </ProfileField>
                    <ProfileField label='Timezone'>
                      <Select defaultValue='pacific' disabled={!isEditing}>
                        <SelectTrigger className='h-11 w-full rounded-xl data-[size=default]:h-11'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='pacific'>Pacific Time</SelectItem>
                          <SelectItem value='mountain'>Mountain Time</SelectItem>
                          <SelectItem value='central'>Central Time</SelectItem>
                          <SelectItem value='eastern'>Eastern Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </ProfileField>
                  </div>
                  <ProfileField label='Bio'>
                    <Textarea
                      disabled={!isEditing}
                      defaultValue='Owns autonomous annotation project coordination, delivery rhythm, and vendor collaboration.'
                      className='min-h-[112px] rounded-xl'
                      placeholder='Enter a short bio'
                    />
                  </ProfileField>
                </FormSection>
              </form>
            </div>
          </section>
        </TabsContent>

        <TabsContent value='vendor-information' className='mt-8'>
          <section className='rounded-[24px] border border-primary/10 bg-white shadow-sm'>
            <div className='flex flex-wrap items-start justify-between gap-4 px-8 py-7'>
              <div className='max-w-3xl space-y-1'>
                <h2 className='text-[22px] font-semibold text-slate-950'>Vendor Information</h2>
                <p className='text-sm leading-6 text-slate-500'>
                  This tab mirrors the Vendor Information Registration form so the submitted vendor
                  profile stays consistent across onboarding and account management.
                </p>
              </div>

              {vendorIsEditing ? (
                <div className='flex flex-wrap gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-10 rounded-xl px-5'
                    onClick={() => setVendorIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='button'
                    className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'
                    onClick={() => setVendorIsEditing(false)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  type='button'
                  className='h-10 rounded-xl bg-primary px-5 text-white hover:bg-primary/90'
                  onClick={() => setVendorIsEditing(true)}
                >
                  <Icons.edit className='size-4' />
                  Edit
                </Button>
              )}
            </div>

            <div className='space-y-5 px-8 pb-8'>
              <div className='grid gap-4 lg:grid-cols-[1fr_280px]'>
                <div className='rounded-3xl border border-primary/10 bg-white p-6'>
                  <div className='flex flex-wrap items-start justify-between gap-4'>
                    <div className='space-y-2'>
                      <div className='text-xs font-semibold tracking-[0.14em] text-primary uppercase'>
                        Vendor account
                      </div>
                      <h3 className='text-lg font-semibold text-slate-950'>
                        Northstar Data Operations LLC
                      </h3>
                      <p className='max-w-2xl text-sm leading-6 text-slate-500'>
                        External delivery partner for annotation, collection, and data quality
                        programs across North America.
                      </p>
                    </div>
                    <span className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100'>
                      <span className='size-1.5 rounded-full bg-emerald-500' />
                      Approved
                    </span>
                  </div>
                </div>

                <div className='rounded-3xl border border-primary/10 bg-primary/5 p-6'>
                  <div className='text-xs font-medium text-slate-500'>Last updated</div>
                  <div className='mt-1 text-sm font-semibold text-slate-900'>Apr 8, 2026</div>
                  <div className='mt-4 text-xs leading-5 text-slate-500'>
                    Changes made here should match the registration data used during vendor
                    qualification.
                  </div>
                </div>
              </div>

              <form
                className='space-y-5'
                onSubmit={(event) => {
                  event.preventDefault();
                  setVendorIsEditing(false);
                }}
              >
                {vendorProfileSections.map((section) => (
                  <VendorProfileSection
                    key={section.title}
                    section={section}
                    isEditing={vendorIsEditing}
                  />
                ))}
              </form>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='space-y-4'>
      <h3 className='text-sm font-semibold tracking-[0.08em] text-slate-500 uppercase'>{title}</h3>
      {children}
    </section>
  );
}

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='space-y-2'>
      <span className='block text-sm font-semibold text-slate-800'>{label}</span>
      {children}
    </label>
  );
}

function VendorProfileSection({
  section,
  isEditing
}: {
  section: (typeof vendorProfileSections)[number];
  isEditing: boolean;
}) {
  return (
    <section className='rounded-3xl border border-primary/10 bg-white p-6 shadow-sm'>
      <div className='grid gap-5 lg:grid-cols-[220px_1fr]'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary'>
              {section.step}
            </div>
            <div className='text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase'>
              {section.summary}
            </div>
          </div>
          <div className='space-y-1.5'>
            <h3 className='text-base font-semibold text-slate-950'>{section.title}</h3>
            <p className='text-sm leading-6 text-slate-500'>{section.description}</p>
          </div>
        </div>

        <div className='grid gap-5 md:grid-cols-2'>
          {section.fields.map((field) => (
            <ProfileField key={field.label} label={field.label}>
              {field.label === 'Business Address' || field.label === 'Supporting Materials' ? (
                <Textarea
                  defaultValue={field.value}
                  disabled={!isEditing}
                  className='min-h-[92px] rounded-xl'
                />
              ) : (
                <Input
                  defaultValue={field.value}
                  disabled={!isEditing}
                  className='h-11 rounded-xl'
                />
              )}
            </ProfileField>
          ))}
        </div>
      </div>
    </section>
  );
}
