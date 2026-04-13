import PageContainer from '@/components/layout/page-container';
import WelcomePage from '@/features/welcome/components/welcome-page';

export default function DashboardWelcomePage() {
  return (
    <PageContainer scrollable>
      <WelcomePage />
    </PageContainer>
  );
}
