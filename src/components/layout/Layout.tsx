import { memo } from 'react';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen container m-auto py-4">
      <Outlet />
    </div>
  );
}

export default memo(Layout);
