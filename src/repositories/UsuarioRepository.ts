import prisma from '@/src/lib/prisma';
import { Usuario } from '@prisma/client';
import { UsuarioEntity } from '../entities/UsuarioEntity';
import { UsuarioProps } from '../interfaces';

export class UsuarioRepository {
    private toEntity(u: Usuario): UsuarioEntity {
        return new UsuarioEntity({ id: u.id, nome: u.nome, email: u.email, senha: u.senha });
    }

    async listarTodos(): Promise<UsuarioEntity[]> {
        const usuarios = await prisma.usuario.findMany({ orderBy: { nome: 'asc' } });
        return usuarios.map(u => this.toEntity(u));
    }

    async buscarPorId(id: number): Promise<UsuarioEntity | null> {
        const u = await prisma.usuario.findUnique({ where: { id } });
        return u ? this.toEntity(u) : null;
    }

    async buscarPorEmail(email: string): Promise<UsuarioEntity | null> {
        const u = await prisma.usuario.findUnique({ where: { email } });
        return u ? this.toEntity(u) : null;
    }

    async criar(props: UsuarioProps): Promise<UsuarioEntity> {
        const u = await prisma.usuario.create({
            data: { nome: props.nome, email: props.email, senha: props.senha! }
        });
        return this.toEntity(u);
    }

    async atualizar(id: number, props: Partial<UsuarioProps>): Promise<UsuarioEntity> {
        const u = await prisma.usuario.update({
            where: { id },
            data: { nome: props.nome, email: props.email, senha: props.senha }
        });
        return this.toEntity(u);
    }

    async excluir(id: number): Promise<void> {
        await prisma.usuario.delete({ where: { id } });
    }
}