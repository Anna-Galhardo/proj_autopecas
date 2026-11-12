import prisma from '@/src/lib/prisma';
import { MovimentacaoEntity } from '../entities/MovimentacaoEntity';
import { HistoricoMovimentacao, MovimentacaoProps } from '../interfaces';

export class MovimentacaoRepository {
    // Histórico completo: produto, responsável e data
    async listarHistorico(): Promise<HistoricoMovimentacao[]> {
        const movs = await prisma.movimentacao.findMany({
            include: { produto: true, usuario: true },
            orderBy: [{ data_movimentacao: 'desc' }, { id: 'desc' }]
        });
        return movs.map(m => ({
            id: m.id,
            produto: m.produto.descricao,
            responsavel: m.usuario.nome,
            tipo: m.tipo,
            quantidade: m.quantidade,
            data: m.data_movimentacao
        }));
    }

    // Atualiza o saldo do produto e grava a movimentação na MESMA transação
    async registrar(props: MovimentacaoProps, novaQuantidade: number): Promise<MovimentacaoEntity> {
        const data = typeof props.data === 'string'
            ? new Date(`${props.data}T12:00:00`)
            : (props.data ?? new Date());

        const [, m] = await prisma.$transaction([
            prisma.produto.update({
                where: { id: props.produtoId },
                data: { quantidade: novaQuantidade }
            }),
            prisma.movimentacao.create({
                data: {
                    produto_id: props.produtoId,
                    usuario_id: props.usuarioId,
                    tipo: props.tipo,
                    quantidade: props.quantidade,
                    data_movimentacao: data
                }
            })
        ]);

        return new MovimentacaoEntity({
            id: m.id,
            produtoId: m.produto_id,
            usuarioId: m.usuario_id,
            tipo: m.tipo,
            quantidade: m.quantidade,
            data: m.data_movimentacao
        });
    }
}