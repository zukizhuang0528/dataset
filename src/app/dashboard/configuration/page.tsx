import PageContainer from '@/components/layout/page-container';
import ConfigurationManagementPage from '@/features/configuration/components/configuration-management-page';

export default function ConfigurationPage() {
  return (
    <PageContainer scrollable>
      <ConfigurationManagementPage />
    </PageContainer>
  );
}
