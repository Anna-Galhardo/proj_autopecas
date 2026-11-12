'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UsuarioLogado {
    id: number;
    nome: string;
    email: string;
}

export function useAuth() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

    useEffect(() => {
        const salvo = localStorage.getItem('userLogado');
        if (salvo) setUsuario(JSON.parse(salvo));
        else router.push('/login');
    }, [router]);

    return usuario;
}