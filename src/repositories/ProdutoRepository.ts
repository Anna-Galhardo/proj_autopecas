import prisma from '@/src/lib/prisma';
import { Produto } from '@prisma/client';
import { ProdutoEntity } from '../entities/ProdutoEntity';
import { ProdutoProps } from '../interfaces';

export class ProdutoRepository {
    private toEntity(p: Produto): ProdutoEntity {
        return new ProdutoEntity({
            id: p.id,
            codigo: p.codigo,
            descricao: p.descricao,
            marca: p.marca,
            modelo: p.modelo,
            anoFabricacao: p.ano_fabricacao,
            compatibilidade: p.compatibilidade,
            quantidade: p.quantidade,
            valorUnitario: Number(p.valor_unitario),
            estoqueMinimo: p.estoque_minimo
        });
    }

    private toData(props: ProdutoProps) {
        return {
            codigo: props.codigo.trim(),
            descricao: props.descricao.trim(),
            marca: props.marca.trim(),
            modelo: props.modelo.trim(),
            ano_fabricacao: props.anoFabricacao,
            compatibilidade: props.compatibilidade.trim(),
            quantidade: props.quantidade,
            valor_unitario: props.valorUnitario,
            estoque_minimo: props.estoqueMinimo
        };
    }

    // Ordem alfabética (requisito 7.1.1)
    async listarTodos(): Promise<ProdutoEntity[]> {
        const prods = await prisma.produto.findMany({ orderBy: { descricao: 'asc' } });
        return prods.map(p => this.toEntity(p));
    }

    async buscarPorId(id: number): Promise<ProdutoEntity | null> {
        const p = await prisma.produto.findUnique({ where: { id } });
        return p ? this.toEntity(p) : null;
    }

    async criar(props: ProdutoProps): Promise<ProdutoEntity> {
        const p = await prisma.produto.create({ data: this.toData(props) });
        return this.toEntity(p);
    }

    async atualizar(id: number, props: ProdutoProps): Promise<ProdutoEntity> {
        const p = await prisma.produto.update({ where: { id }, data: this.toData(props) });
        return this.toEntity(p);
    }

    async excluir(id: number): Promise<void> {
        await prisma.produto.delete({ where: { id } });
    }
}