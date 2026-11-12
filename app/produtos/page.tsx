'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../lib/api';
import { useAuth } from '../lib/useAuth';
import Swal from 'sweetalert2';

export default function ListaProdutos() {
    const usuario = useAuth();
    const [produtos, setProdutos] = useState<any[]>([]);
    const [busca, setBusca] = useState('');

    const carregar = async () => {
        const res = await api.get('/produtos');
        setProdutos(res.data);
    };
    useEffect(() => { carregar(); }, []);

    const excluir = async (id: number) => {
        const confirmacao = await Swal.fire({
            title: 'Confirmar exclusão?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Excluir',
            cancelButtonText: 'Cancelar'
        });
        if (!confirmacao.isConfirmed) return;
        try {
            await api.delete(`/produtos/${id}`);
            Swal.fire('Excluído!', 'Produto removido com sucesso.', 'success');
            carregar();
        } catch (error: any) {
            Swal.fire('Não foi possível excluir', error.response?.data?.erro || 'Erro ao excluir.', 'error');
        }
    };

    // Campo de busca (requisito 6.1.2)
    const termo = busca.toLowerCase();
    const filtrados = produtos.filter(p =>
        [p.codigo, p.descricao, p.marca, p.modelo, p.compatibilidade].join(' ').toLowerCase().includes(termo)
    );

    if (!usuario) return null;

    return (
        <div className='p-8 max-w-6xl mx-auto'>
            <div className='flex justify-between mb-6 items-center'>
                <h1 className='text-2xl font-bold'>Cadastro de Produtos</h1>
                <Link href='/dashboard' className='text-slate-500 hover:underline'>← Voltar ao menu</Link>
            </div>

            <div className='flex gap-4 mb-6'>
                <input
                    type='text'
                    placeholder='Buscar por código, descrição, marca, modelo ou compatibilidade...'
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    className='w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-400'
                />
                <Link href='/produtos/form' className='bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap hover:bg-blue-700'>
                    + Novo produto
                </Link>
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full bg-white shadow rounded border text-sm'>
                    <thead className='bg-slate-100 border-b'>
                        <tr>
                            <th className='p-3 text-left'>Código</th>
                            <th className='p-3 text-left'>Descrição</th>
                            <th className='p-3 text-left'>Marca</th>
                            <th className='p-3 text-left'>Modelo</th>
                            <th className='p-3 text-center'>Ano</th>
                            <th className='p-3 text-left'>Compatibilidade</th>
                            <th className='p-3 text-center'>Estoque</th>
                            <th className='p-3 text-center'>Mínimo</th>
                            <th className='p-3 text-center'>Ações</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y'>
                        {filtrados.map(p => (
                            <tr key={p.id} className={p.quantidade < p.estoqueMinimo ? 'bg-red-50' : ''}>
                                <td className='p-3'>{p.codigo}</td>
                                <td className='p-3 font-medium'>{p.descricao}</td>
                                <td className='p-3'>{p.marca}</td>
                                <td className='p-3'>{p.modelo}</td>
                                <td className='p-3 text-center'>{p.anoFabricacao}</td>
                                <td className='p-3'>{p.compatibilidade}</td>
                                <td className='p-3 text-center font-semibold'>{p.quantidade}</td>
                                <td className='p-3 text-center'>{p.estoqueMinimo}</td>
                                <td className='p-3 text-center space-x-4 whitespace-nowrap'>
                                    <Link href={`/produtos/form?id=${p.id}`} className='text-blue-500 font-medium'>Editar</Link>
                                    <button onClick={() => excluir(p.id)} className='text-red-500 font-medium'>Excluir</button>
                                </td>
                            </tr>
                        ))}
                        {filtrados.length === 0 && (
                            <tr><td colSpan={9} className='p-6 text-center text-slate-500'>Nenhum produto encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}