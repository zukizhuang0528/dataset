import PageContainer from '@/components/layout/page-container';
import AdminPlaceholderPage from '@/features/admin/components/admin-placeholder-page';

export default function VendorsPage() {
  return (
    <PageContainer
      scrollable
      pageTitle='供应商管理'
      pageDescription='供应商档案、协作状态与产能视图。'
    >
      <AdminPlaceholderPage
        eyebrow='Vendor network'
        title='Vendor management'
        description='This module will support vendor onboarding, qualification review, delivery tracking, capacity management, and cooperation status.'
      />
    </PageContainer>
  );
}
