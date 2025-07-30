import type { Metadata } from 'next';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'ByteBank - Gerenciamento Financeiro',
  description: 'Aplicação de gerenciamento financeiro',
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className='container mx-auto px-4 py-8'>
        {children}
      </main>
    </>
  );
}
