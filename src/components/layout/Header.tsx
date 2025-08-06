'use client';

import { useAccount } from '@/hooks/useAccount';
import Link from 'next/link';

const Header = () => {
  const { account } = useAccount();
  const name = account?.name || 'Usuário';

  return (
    <header className='bg-[#004D61] text-white shadow-md'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        <Link href='/dashboard' className='text-xl font-bold'>
          ByteBank
        </Link>
        <div className='flex items-center'>

          <div className='flex items-center space-x-2'>
            <span className='text-white'>{name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
