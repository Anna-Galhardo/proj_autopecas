import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { UsuarioProps } from '../interfaces';

export class UsuarioService {
    constructor(private repo: UsuarioRepository) {}

    // Login: informa o MOTIVO da falha (requisito 4.1)
    async autenticar(email: string, senha: string) {
        if (!email?.trim() || !senha) throw new Error('Informe o e-mail e a senha.');
        const user = await this.repo.buscarPorEmail(email.trim());
        if (!user) throw new Error('Usuário não encontrado.');
        if (user.getSenha !== senha) throw new Error('Senha incorreta.');
        return { id: user.getId, nome: user.getNome, email: user.getEmail };
    }

    async listar() {
        const usuarios = await this.repo.listarTodos();
        return usuarios.map(u => ({ id: u.getId, nome: u.getNome, email: u.getEmail }));
    }

    async buscar(id: number) {
        const u = await this.repo.buscarPorId(id);
        if (!u) throw new Error('Usuário não encontrado.');
        return { id: u.getId, nome: u.getNome, email: u.getEmail };
    }

    async cadastrar(props: UsuarioProps) {
        if (!props.nome?.trim() || !props.email?.trim() || !props.senha)
            throw new Error('Nome, e-mail e senha são obrigatórios.');
        try {
            const u = await this.repo.criar({ ...props, nome: props.nome.trim(), email: props.email.trim() });
            return { id: u.getId, nome: u.getNome, email: u.getEmail };
        } catch (e: any) {
            if (e.code === 'P2002') throw new Error('Já existe um usuário com este e-mail.');
            throw e;
        }
    }

    async atualizar(id: number, props: Partial<UsuarioProps>) {
        await this.buscar(id);
        const u = await this.repo.atualizar(id, props);
        return { id: u.getId, nome: u.getNome, email: u.getEmail };
    }

    async excluir(id: number) {
        await this.buscar(id);
        try {
            await this.repo.excluir(id);
        } catch (e: any) {
            if (e.code === 'P2003') throw new Error('Este usuário possui movimentações e não pode ser excluído.');
            throw e;
        }
    }
}