import PageContainer from '@/components/layout/page-container';
import AdminPlaceholderPage from '@/features/admin/components/admin-placeholder-page';

export default function HomePage() {
  return (
    <PageContainer scrollable pageTitle='首页' pageDescription='超级管理员全局总览与核心运营入口。'>
      <AdminPlaceholderPage
        eyebrow='Admin overview'
        title='Super admin home'
        description='Use this landing page as the unified entry to platform-wide operations, key metrics, pending approvals, and cross-module alerts.'
      />
    </PageContainer>
  );
}
