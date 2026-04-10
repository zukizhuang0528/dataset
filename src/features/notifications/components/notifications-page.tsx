'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  globalNoticeMessages,
  messageRoles,
  type MessageItem,
  type MessageRoleId
} from '@/features/notifications/data/message-center-data';

export default function NotificationsPage() {
  const [activeRole, setActiveRole] = useState<MessageRoleId>('task-assignee');

  return (
    <PageContainer scrollable>
      <div className='space-y-8 pb-8'>
        <div className='space-y-8'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='space-y-2'>
              <div>
                <h1 className='text-foreground text-[28px] font-semibold tracking-tight'>
                  Message Center
                </h1>
                <p className='text-muted-foreground text-sm leading-6'>
                  Review platform-wide notices and role-specific updates from one operational inbox.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Tabs
              value={activeRole}
              onValueChange={(value) => setActiveRole(value as MessageRoleId)}
              className='gap-0'
            >
              <div className='flex flex-wrap items-end justify-between gap-4 border-b border-slate-200'>
                <TabsList className='h-auto w-full justify-start gap-8 rounded-none bg-transparent p-0 md:w-auto'>
                  {messageRoles.map((role) => (
                    <TabsTrigger
                      key={role.id}
                      value={role.id}
                      className='h-12 flex-none rounded-none border-0 border-b-2 border-transparent px-0 text-[15px] font-semibold text-slate-500 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none'
                    >
                      <span className='inline-flex items-center gap-2'>
                        <span>{role.label}</span>
                        {role.unreadCount > 0 ? (
                          <span className='inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white'>
                            {role.unreadCount}
                          </span>
                        ) : null}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <Button variant='outline' className='mb-2 h-10 rounded-xl px-5'>
                  <Icons.check className='mr-2 h-4 w-4' />
                  Mark all as read
                </Button>
              </div>

              {messageRoles.map((role) => (
                <TabsContent key={role.id} value={role.id} className='mt-8 space-y-8'>
                  <MessageSection title='Global Notices' items={globalNoticeMessages} />

                  <MessageSection title={`${role.label} Messages`} items={role.roleMessages} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function MessageSection({ title, items }: { title: string; items: MessageItem[] }) {
  return (
    <section className='space-y-6 rounded-[24px] bg-white px-6 py-6 shadow-sm ring-1 ring-slate-200/70'>
      <div className='flex items-center gap-3 border-b border-slate-100 pb-6 text-sm font-medium text-slate-500'>
        <Icons.notification className='text-primary h-5 w-5' />
        <span>{title}</span>
      </div>

      <div className='space-y-6'>
        {items.map((item, index) => (
          <article
            key={item.id}
            className={index === items.length - 1 ? '' : 'border-b border-slate-100 pb-6'}
          >
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div className='min-w-0 flex-1 space-y-2.5'>
                <div className='flex flex-wrap items-center gap-3'>
                  <h3 className='text-[16px] font-semibold text-slate-900'>{item.title}</h3>
                  <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'>
                    {item.badge}
                  </span>
                </div>
                <p className='text-sm leading-6 text-slate-600'>{item.body}</p>
              </div>

              <div className='flex items-center gap-4 pt-1 text-sm'>
                <span className='text-slate-400'>{item.timestamp}</span>
                <button className='font-semibold text-primary hover:text-primary/80'>
                  Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
