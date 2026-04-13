import PageContainer from '@/components/layout/page-container';
import AdminPlaceholderPage from '@/features/admin/components/admin-placeholder-page';

export default function TemplatesPage() {
  return (
    <PageContainer
      scrollable
      pageTitle='Annotation Template Management'
      pageDescription='Manage annotation guidelines and template versions for different task types.'
    >
      <AdminPlaceholderPage
        eyebrow='Template governance'
        title='Annotation template management'
        description='This module is reserved for template configuration, taxonomy versions, schema reuse, and template assignment rules.'
      />
    </PageContainer>
  );
}
