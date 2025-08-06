'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'; // Importe React

interface SidebarProps {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isSidebarOpen = false, 
  toggleSidebar = () => {} 
}) => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <>
      {/* Botão de fechar para o menu mobile */}
      {/* Visível apenas quando o menu está aberto */}
      {isSidebarOpen && (
        <div className="p-4 flex justify-end md:hidden">
          <button onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>
      )}
      
      {/* Navegação da Sidebar */}
      <nav className='p-4'>
        <ul className='space-y-2'>
          <li>
            <Link 
              href='/dashboard' 
              onClick={toggleSidebar}
              className={`block py-2 px-4 ${isActive('/dashboard') 
                ? 'text-[#004D61] font-medium border-l-4 border-[#004D61]' 
                : 'text-gray-600 hover:text-[#004D61] hover:bg-gray-50'}`}
            >
              Início
            </Link>
          </li>
          <li>
            <Link 
              href='/transactions' 
              onClick={toggleSidebar}
              className={`block py-2 px-4 ${isActive('/transactions') 
                ? 'text-[#004D61] font-medium border-l-4 border-[#004D61]' 
                : 'text-gray-600 hover:text-[#004D61] hover:bg-gray-50'}`}
            >
              Transferências
            </Link>
          </li>
          <li>
            <Link 
              href='#' 
              onClick={toggleSidebar}
              className='block py-2 px-4 text-gray-600 hover:text-[#004D61] hover:bg-gray-50'
            >
              Investimentos
            </Link>
          </li>
          <li>
            <Link 
              href='#' 
              onClick={toggleSidebar}
              className='block py-2 px-4 text-gray-600 hover:text-[#004D61] hover:bg-gray-50'
            >
              Outros serviços
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;