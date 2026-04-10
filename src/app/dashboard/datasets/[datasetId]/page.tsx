import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import DatasetDetailPage from '@/features/datasets/components/dataset-detail-page';
import { getDatasetById } from '@/features/datasets/data/mock-datasets';

export async function generateMetadata(props: { params: Promise<{ datasetId: string }> }) {
  const params = await props.params;
  const dataset = getDatasetById(params.datasetId);

  return {
    title: dataset ? `Dashboard: ${dataset.name}` : 'Dashboard: Dataset detail'
  };
}

export default async function Page(props: { params: Promise<{ datasetId: string }> }) {
  const params = await props.params;
  const dataset = getDatasetById(params.datasetId);

  if (!dataset) {
    notFound();
  }

  return (
    <PageContainer scrollable>
      <DatasetDetailPage dataset={dataset} />
    </PageContainer>
  );
}
