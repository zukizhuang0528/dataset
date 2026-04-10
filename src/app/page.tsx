import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  if (process.env.NEXT_PUBLIC_ENABLE_CLERK !== 'true') {
    redirect('/dashboard/datasets');
  }

  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/datasets');
  }
}
