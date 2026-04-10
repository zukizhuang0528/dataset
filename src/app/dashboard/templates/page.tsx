import PageContainer from '@/components/layout/page-container';
import AdminPlaceholderPage from '@/features/admin/components/admin-placeholder-page';

export default function TemplatesPage() {
  return (
    <PageContainer
      scrollable
      pageTitle='标注模板管理'
      pageDescription='管理不同任务类型的标注规范与模板版本。'
    >
      <AdminPlaceholderPage
        eyebrow='Template governance'
        title='Annotation template management'
        description='This module is reserved for template configuration, taxonomy versions, schema reuse, and template assignment rules.'
      />
    </PageContainer>
  );
}
