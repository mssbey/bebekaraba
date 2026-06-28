'use client';

import { useAdmin } from './AdminProvider';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from './CommandPalette';
import ToastViewport from './ToastViewport';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { theme } = useAdmin();

  return (
    <div className={`admin-root ${theme === 'dark' ? 'dark' : ''} min-h-screen flex`}>
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <CommandPalette />
      <ToastViewport />
    </div>
  );
}
