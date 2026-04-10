'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { navGroups } from '@/config/nav-config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '../icons';

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible='none' className='border-r border-slate-200 bg-white'>
      <SidebarHeader className='bg-white px-4 pt-4'>
        <div className='surface-brand-glow flex items-center gap-3 rounded-2xl border border-white/60 px-3 py-3'>
          <div className='bg-brand-gradient flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20'>
            <Icons.workspace className='size-5' />
          </div>
          <div className='min-w-0'>
            <div className='text-sm font-semibold tracking-tight'>Annotate Flow</div>
            <div className='text-muted-foreground text-xs'>Super admin console</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden bg-white px-4 pt-4'>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label || 'ungrouped'} className='px-0 py-0'>
            <SidebarMenu className='gap-3'>
              {group.items.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                const isActive = pathname === item.url;
                return item?.items && item.items.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className='group/collapsible'
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive}
                          className={
                            isActive
                              ? 'bg-primary/8 pr-6 font-bold text-slate-950 after:absolute after:top-0 after:right-0 after:bottom-0 after:w-2 after:rounded-r-md after:bg-[linear-gradient(180deg,var(--brand-gradient-start),var(--brand-gradient-end))]'
                              : 'pr-3 text-slate-600 hover:text-slate-950'
                          }
                        >
                          {item.icon && <Icon />}
                          <span>{item.title}</span>
                          <Icons.chevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className={
                        isActive
                          ? 'bg-primary/8 pr-6 font-bold text-slate-950 after:absolute after:top-0 after:right-0 after:bottom-0 after:w-2 after:rounded-r-md after:bg-[linear-gradient(180deg,var(--brand-gradient-start),var(--brand-gradient-end))]'
                          : 'pr-3 text-slate-600 hover:text-slate-950'
                      }
                    >
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className='bg-white px-4 pb-4' />
      <SidebarRail />
    </Sidebar>
  );
}
