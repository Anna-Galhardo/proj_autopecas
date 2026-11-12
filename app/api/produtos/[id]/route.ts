import { NextResponse } from 'next/server';
import { ProdutoService } from '@/src/services/ProdutoService';
import { ProdutoRepository } from '@/src/repositories/ProdutoRepository';

const service = new ProdutoService(new ProdutoRepository());

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        return NextResponse.json(await service.buscar(Number(id)), { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ erro: e.message }, { status: 404 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        return NextResponse.json(await service.atualizar(Number(id), body), { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ erro: e.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await service.excluir(Number(id));
        return NextResponse.json({ mensagem: 'Produto excluído com sucesso.' }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ erro: e.message }, { status: 400 });
    }
}