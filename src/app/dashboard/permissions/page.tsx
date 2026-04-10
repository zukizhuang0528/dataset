import PageContainer from '@/components/layout/page-container';
import PermissionManagementPage from '@/features/permissions/components/permission-management-page';

export default function PermissionsPage() {
  return (
    <PageContainer scrollable>
      <PermissionManagementPage />
    </PageContainer>
  );
}
