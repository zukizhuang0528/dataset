import Link from 'next/link';
import { IconMail } from '@tabler/icons-react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function GoogleMark() {
  return (
    <svg
      className='size-[18px]'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <path
        d='M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8445C13.6359 11.97 13.0018 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.2045Z'
        fill='#4285F4'
      />
      <path
        d='M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z'
        fill='#34A853'
      />
      <path
        d='M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z'
        fill='#FBBC05'
      />
      <path
        d='M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z'
        fill='#EA4335'
      />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <span className='grid size-[18px] grid-cols-2 gap-0.5' aria-hidden='true'>
      <span className='rounded-[1px] bg-[#F35325]' />
      <span className='rounded-[1px] bg-[#81BC06]' />
      <span className='rounded-[1px] bg-[#05A6F0]' />
      <span className='rounded-[1px] bg-[#FFBA08]' />
    </span>
  );
}

export default function SignInViewPage() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_22%,rgba(139,92,246,0.08),transparent_28rem),linear-gradient(180deg,#fbfbfe_0%,#f7f7fb_100%)] text-slate-950'>
      <div
        className='pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(217,70,239,0.09),transparent_34rem)]'
        aria-hidden='true'
      />

      <header className='relative z-10 flex items-center justify-between px-6 py-7 md:px-10'>
        <Link
          href='/dashboard/welcome'
          className='group flex items-center gap-3 text-slate-950 transition-colors hover:text-primary'
        >
          <span className='flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_14px_34px_rgba(139,92,246,0.22)] transition-transform group-hover:-translate-y-0.5'>
            <Icons.product className='size-5' stroke={1.8} />
          </span>
          <span className='text-lg font-semibold tracking-[-0.01em]'>Annotate Flow</span>
        </Link>

        <Link
          href='/dashboard/welcome'
          className='text-sm font-medium text-slate-500 transition-colors hover:text-slate-900'
        >
          Back to website
        </Link>
      </header>

      <section className='relative z-10 flex min-h-[calc(100vh-96px)] items-center justify-center px-5 pb-24 pt-12'>
        <div className='w-full max-w-[440px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.09)]'>
          <div className='h-1 bg-primary' />

          <div className='px-7 py-9 md:px-9'>
            <div className='space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-[-0.02em] text-slate-950'>
                Welcome back
              </h1>
              <p className='text-sm text-slate-500'>Sign in to your account to continue</p>
            </div>

            <div className='mt-9 grid gap-3'>
              <Button
                type='button'
                variant='outline'
                className='h-12 rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-none hover:bg-slate-50 hover:text-slate-950'
              >
                <GoogleMark />
                Continue with Google
              </Button>
              <Button
                type='button'
                variant='outline'
                className='h-12 rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-none hover:bg-slate-50 hover:text-slate-950'
              >
                <MicrosoftMark />
                Continue with Microsoft
              </Button>
            </div>

            <div className='my-8 flex items-center gap-3'>
              <div className='h-px flex-1 bg-slate-100' />
              <span className='text-xs font-medium text-slate-400'>Or continue with email</span>
              <div className='h-px flex-1 bg-slate-100' />
            </div>

            <form className='space-y-5'>
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-semibold text-slate-700'>
                  Email address
                </label>
                <div className='relative'>
                  <IconMail
                    className='absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400'
                    stroke={1.8}
                  />
                  <Input
                    id='email'
                    type='email'
                    placeholder='name@company.com'
                    className='h-12 rounded-xl border-slate-200 bg-white pl-11 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/15'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between gap-4'>
                  <label htmlFor='password' className='text-sm font-semibold text-slate-700'>
                    Password
                  </label>
                  <button
                    type='button'
                    className='text-xs font-semibold text-primary transition-colors hover:text-primary/80'
                  >
                    Forgot password?
                  </button>
                </div>
                <div className='relative'>
                  <Icons.lock className='absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400' />
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    className='h-12 rounded-xl border-slate-200 bg-white pl-11 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-primary/15'
                  />
                </div>
              </div>

              <Button
                type='button'
                className='h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-none hover:bg-primary/90'
                asChild
              >
                <Link href='/dashboard/welcome'>
                  Sign In
                  <Icons.arrowRight className='size-4' />
                </Link>
              </Button>
            </form>

            <p className='mt-9 text-center text-sm text-slate-500'>
              Don&apos;t have an account?{' '}
              <Link
                href='/auth/sign-up'
                className='font-semibold text-primary hover:text-primary/80'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>

      <footer className='pointer-events-none absolute inset-x-0 bottom-8 text-center text-xs text-slate-400'>
        © 2026 Annotate Flow Inc. All rights reserved.
      </footer>
    </main>
  );
}
