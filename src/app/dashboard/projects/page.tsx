import PageContainer from '@/components/layout/page-container';
import AdminPlaceholderPage from '@/features/admin/components/admin-placeholder-page';

export default function ProjectsPage() {
  return (
    <PageContainer
      scrollable
      pageTitle='项目管理'
      pageDescription='项目创建、生命周期控制与协同配置。'
    >
      <AdminPlaceholderPage
        eyebrow='Project operations'
        title='Project management'
        description='This module will hold project setup, progress tracking, ownership settings, and execution status across the full labeling pipeline.'
      />
    </PageContainer>
  );
}
