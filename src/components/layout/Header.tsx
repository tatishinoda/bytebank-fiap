'use client';

import { useAccount } from '@/hooks/useAccount';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import React from 'react'; // Importe React para usar React.FC

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { account } = useAccount();
  const name = account?.name || 'Usuário';
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className='bg-[#004D61] text-white shadow-md'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
          {/* Botão do Hambúrguer - visível apenas em telas menores que md */}
          <button onClick={toggleSidebar} className='md:hidden'>
            <Menu className='h-6 w-6' />
          </button>
          <Link href='/dashboard' className='text-xl font-bold'>
            ByteBank
          </Link>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-sm text-white hidden md:block'>{name}</span>
          <div className='h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold text-sm'>
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
