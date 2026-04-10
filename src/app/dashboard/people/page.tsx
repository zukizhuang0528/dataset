import PageContainer from '@/components/layout/page-container';
import UserManagementPage from '@/features/people/components/user-management-page';

export default function PeoplePage() {
  return (
    <PageContainer scrollable>
      <UserManagementPage />
    </PageContainer>
  );
}
