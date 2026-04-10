import PageContainer from '@/components/layout/page-container';
import ProjectManagementPage from '@/features/projects/components/project-management-page';

export default function ProjectsPage() {
  return (
    <PageContainer scrollable>
      <ProjectManagementPage />
    </PageContainer>
  );
}
