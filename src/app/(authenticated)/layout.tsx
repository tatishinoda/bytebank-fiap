'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className='flex'>
        {/* Sidebar fixa para desktop, visível a partir de md */}
        <div className='hidden w-64 p-4 min-h-screen'>
          <Sidebar />
        </div>

        {/* Conteúdo principal */}
        <main className='container mx-auto px-4 py-8 flex-1'>
          {children}
        </main>

        {/* Sidebar mobile como overlay */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 xl:hidden
                     ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Overlay da sidebar mobile */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
          />
        )}
      </div>
    </>
  );
}
