'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/useAuth';

export default function Dashboard() {
    const usuario = useAuth();
    const router = useRouter();

    const sair = () => {
        localStorage.removeItem('userLogado');
        router.push('/login');
    };

    if (!usuario) return null;

    return (
        <div className='min-h-screen bg-slate-50 p-8'>
            <header className='flex justify-between items-center bg-white p-4 rounded shadow mb-8 max-w-4xl mx-auto'>
                <h1 className='text-xl font-bold text-slate-800'>Usuário logado: {usuario.nome}</h1>
                <button onClick={sair} className='text-red-500 hover:text-red-700 font-medium'>Sair</button>
            </header>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
                <Link href='/produtos' className='p-8 bg-white rounded-xl shadow hover:shadow-md border-t-4 border-blue-500 text-center transition'>
                    <h2 className='text-2xl font-bold text-slate-800'>📦 Cadastro de Produto</h2>
                </Link>
                <Link href='/movimentacao' className='p-8 bg-white rounded-xl shadow hover:shadow-md border-t-4 border-emerald-500 text-center transition'>
                    <h2 className='text-2xl font-bold text-slate-800'>🔄 Gestão de Estoque</h2>
                </Link>
            </div>
        </div>
    );
}