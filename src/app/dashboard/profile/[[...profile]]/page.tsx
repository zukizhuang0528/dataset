import ProfileViewPage from '@/features/profile/components/profile-view-page';
import PageContainer from '@/components/layout/page-container';

export const metadata = {
  title: 'Dashboard : Profile'
};

export default async function Page() {
  return (
    <PageContainer scrollable>
      <ProfileViewPage />
    </PageContainer>
  );
}
