'use client';

import Link from 'next/link';
import React from 'react';
import { useAccount } from '@/hooks/useAccount';

const Header = () => {
  const { account } = useAccount();
  const name = account?.name || 'Usuário';
  const initial = name.charAt(0);

  return (
    <header className='bg-[#004D61] text-white shadow-md'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <Link href='/dashboard' className='text-xl font-bold'>
          ByteBank
        </Link>
        <div className='flex items-center'>
          <nav className='hidden md:block mr-6'>
            <ul className='flex space-x-6'>
              <li>
                <Link href='/dashboard' className='text-white hover:text-blue-200 transition-colors'>
                  Início
                </Link>
              </li>
              <li>
                <Link href='/transactions' className='text-white hover:text-blue-200 transition-colors'>
                  Transações
                </Link>
              </li>
            </ul>
          </nav>
          <div className='flex items-center space-x-2'>
            <span className='text-white'>{name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
