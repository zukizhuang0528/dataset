import PageContainer from '@/components/layout/page-container';
import DatasetManagementPage from '@/features/datasets/components/dataset-management-page';

export const metadata = {
  title: 'Dashboard: Datasets'
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <DatasetManagementPage />
    </PageContainer>
  );
}
