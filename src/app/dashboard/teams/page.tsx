import PageContainer from '@/components/layout/page-container';
import TeamManagementPage from '@/features/teams/components/team-management-page';

export default function TeamsPage() {
  return (
    <PageContainer scrollable>
      <TeamManagementPage />
    </PageContainer>
  );
}
