import PageContainer from '@/components/layout/page-container';
import DatasetRecycleBinPage from '@/features/datasets/components/dataset-recycle-bin-page';

export const metadata = {
  title: 'Dashboard: Dataset Recycle Bin'
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <DatasetRecycleBinPage />
    </PageContainer>
  );
}
