import React from 'react';
import AdminNav from '../components/admin/AdminNav';

export const metadata = {
  title: 'eShoppy Admin',
  description: 'eShoppy.mn admin dashboard',
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
