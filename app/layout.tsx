import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Controle de Estoque - Autopeças',
  description: 'Gestão de almoxarifado de autopeças',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='pt-BR'>
      <body className='bg-slate-50 min-h-screen text-slate-900 antialiased'>
        {children}
      </body>
    </html>
  );
}