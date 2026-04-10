import PageContainer from '@/components/layout/page-container';
import VendorManagementPage from '@/features/vendors/components/vendor-management-page';

export const metadata = {
  title: 'Dashboard: Vendors'
};

export default function VendorsPage() {
  return (
    <PageContainer scrollable>
      <VendorManagementPage />
    </PageContainer>
  );
}
