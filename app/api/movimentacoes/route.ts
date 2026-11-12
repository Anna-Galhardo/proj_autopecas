import { NextResponse } from 'next/server';
import { MovimentacaoService } from '@/src/services/MovimentacaoService';
import { MovimentacaoRepository } from '@/src/repositories/MovimentacaoRepository';
import { ProdutoRepository } from '@/src/repositories/ProdutoRepository';

const service = new MovimentacaoService(new MovimentacaoRepository(), new ProdutoRepository());

// Histórico de movimentações (produto, responsável e data)
export async function GET() {
    try {
        return NextResponse.json(await service.historico(), { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ erro: e.message }, { status: 500 });
    }
}

// Registrar entrada ou saída
export async function POST(req: Request) {
    try {
        const body = await req.json();
        return NextResponse.json(await service.registrar(body), { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ erro: e.message }, { status: 400 });
    }
}