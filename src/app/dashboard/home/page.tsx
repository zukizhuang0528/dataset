import PageContainer from '@/components/layout/page-container';
import AdminPlaceholderPage from '@/features/admin/components/admin-placeholder-page';

export default function HomePage() {
  return (
    <PageContainer
      scrollable
      pageTitle='Home'
      pageDescription='Global overview and key operational entry points for super administrators.'
    >
      <AdminPlaceholderPage
        eyebrow='Admin overview'
        title='Super admin home'
        description='Use this landing page as the unified entry to platform-wide operations, key metrics, pending approvals, and cross-module alerts.'
      />
    </PageContainer>
  );
}
