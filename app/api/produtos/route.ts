import { NextResponse } from 'next/server';
import { ProdutoService } from '@/src/services/ProdutoService';
import { ProdutoRepository } from '@/src/repositories/ProdutoRepository';

const service = new ProdutoService(new ProdutoRepository());

export async function GET() {
    try {
        return NextResponse.json(await service.listar(), { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ erro: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        return NextResponse.json(await service.cadastrar(body), { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ erro: e.message }, { status: 400 });
    }
}