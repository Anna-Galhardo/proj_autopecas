import { MovimentacaoRepository } from '../repositories/MovimentacaoRepository';
import { ProdutoRepository } from '../repositories/ProdutoRepository';
import { MovimentacaoProps } from '../interfaces';

export class MovimentacaoService {
    constructor(
        private movRepo: MovimentacaoRepository,
        private prodRepo: ProdutoRepository
    ) {}

    async registrar(props: MovimentacaoProps) {
        if (!props.produtoId) throw new Error('Selecione um produto.');
        if (!props.usuarioId) throw new Error('Usuário responsável não identificado. Faça login novamente.');
        if (props.tipo !== 'ENTRADA' && props.tipo !== 'SAIDA') throw new Error('Tipo de movimentação inválido.');
        if (!Number.isInteger(props.quantidade) || props.quantidade <= 0)
            throw new Error('A quantidade deve ser um número inteiro maior que zero.');
        if (!props.data || isNaN(new Date(props.data).getTime()))
            throw new Error('Informe uma data válida para a movimentação.');

        const produto = await this.prodRepo.buscarPorId(props.produtoId);
        if (!produto) throw new Error('Produto não encontrado.');

        if (props.tipo === 'SAIDA' && produto.getQuantidade < props.quantidade) {
            throw new Error(`Estoque insuficiente. Saldo atual: ${produto.getQuantidade}.`);
        }

        const novoEstoque = props.tipo === 'ENTRADA'
            ? produto.getQuantidade + props.quantidade
            : produto.getQuantidade - props.quantidade;

        produto.setQuantidade = novoEstoque;
        await this.movRepo.registrar(props, novoEstoque);

        // Alerta de estoque abaixo do mínimo (requisito 7.1.4)
        if (produto.isEstoqueBaixo()) {
            return {
                sucesso: true,
                alerta: `Atenção: o estoque de "${produto.getDescricao}" está em ${novoEstoque} unidade(s), abaixo do mínimo configurado (${produto.getEstoqueMinimo}).`
            };
        }

        return { sucesso: true, alerta: null };
    }

    async historico() {
        return await this.movRepo.listarHistorico();
    }
}