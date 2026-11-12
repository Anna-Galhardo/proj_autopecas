import { ProdutoRepository } from '../repositories/ProdutoRepository';
import { ProdutoEntity } from '../entities/ProdutoEntity';
import { ProdutoProps } from '../interfaces';

export class ProdutoService {
    constructor(private repo: ProdutoRepository) {}

    private mapper(p: ProdutoEntity) {
        return {
            id: p.getId,
            codigo: p.getCodigo,
            descricao: p.getDescricao,
            marca: p.getMarca,
            modelo: p.getModelo,
            anoFabricacao: p.getAnoFabricacao,
            compatibilidade: p.getCompatibilidade,
            quantidade: p.getQuantidade,
            valorUnitario: p.getValorUnitario,
            estoqueMinimo: p.getEstoqueMinimo
        };
    }

    // Validação dos dados (requisito 6.1.6)
    private validar(p: ProdutoProps) {
        if (!p.codigo?.trim() || !p.descricao?.trim() || !p.marca?.trim() || !p.modelo?.trim() || !p.compatibilidade?.trim())
            throw new Error('Preencha código, descrição, marca, modelo e compatibilidade.');
        const anoMax = new Date().getFullYear() + 1;
        if (!Number.isInteger(p.anoFabricacao) || p.anoFabricacao < 1950 || p.anoFabricacao > anoMax)
            throw new Error(`Ano de fabricação inválido (entre 1950 e ${anoMax}).`);
        if (!Number.isInteger(p.quantidade) || p.quantidade < 0)
            throw new Error('A quantidade deve ser um número inteiro maior ou igual a zero.');
        if (!Number.isInteger(p.estoqueMinimo) || p.estoqueMinimo < 0)
            throw new Error('O estoque mínimo deve ser um número inteiro maior ou igual a zero.');
        if (!(p.valorUnitario > 0))
            throw new Error('O valor unitário deve ser maior que zero.');
    }

    private traduzirErro(e: any): never {
        if (e.code === 'P2002') throw new Error('Já existe um produto com este código.');
        if (e.code === 'P2003') throw new Error('Este produto possui movimentações e não pode ser excluído.');
        throw e;
    }

    async listar() {
        const lista = await this.repo.listarTodos();
        return lista.map(p => this.mapper(p));
    }

    async buscar(id: number) {
        const p = await this.repo.buscarPorId(id);
        if (!p) throw new Error('Produto não encontrado.');
        return this.mapper(p);
    }

    async cadastrar(props: ProdutoProps) {
        this.validar(props);
        try {
            return this.mapper(await this.repo.criar(props));
        } catch (e) {
            this.traduzirErro(e);
        }
    }

    async atualizar(id: number, props: ProdutoProps) {
        await this.buscar(id);
        this.validar(props);
        try {
            return this.mapper(await this.repo.atualizar(id, props));
        } catch (e) {
            this.traduzirErro(e);
        }
    }

    async excluir(id: number) {
        await this.buscar(id);
        try {
            await this.repo.excluir(id);
        } catch (e) {
            this.traduzirErro(e);
        }
    }
}