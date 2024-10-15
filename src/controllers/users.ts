import { PrismaClient } from '@prisma/client';
import { Express } from 'express';

export function rotasUsers(app: Express, prisma: PrismaClient) {
    // Listar usuários
    app.get('/users', async function (req: any, res: any) {
        const resultado = await prisma.user.findMany();
        res.send(resultado);
    });

    // Criar novo usuário
    app.post('/users', async function (req: any, res: any) {
        const { nome, email, senha, cpf } = req.body;

        if (!nome || !email || !senha || !cpf) {
            res.status(400);
            res.send('Dados em branco...');
            return;
        }

        const resultado = await prisma.user.create({
            data: {
                nome: nome,
                email: email,
                senha: senha,
                cpf: cpf,
            },
        });

        res.send(resultado);
    });

    // Atualizar usuário existente
    app.post('/users/:id', async function (req: any, res: any) {
        const id = req.params.id;
        const { nome, email, senha, cpf } = req.body;

        if (nome === '' || email === '' || senha === '' || cpf === '') {
            res.status(400);
            res.send('Dados em branco...');
            return;
        }

        const resultado = await prisma.user.update({
            where: {
                id: +id,
            },
            data: {
                nome: nome,
                email: email,
                senha: senha,
                cpf: cpf,
            },
        });

        res.send(resultado);
    });

    // Deletar usuário
    app.delete('/users/:id', async function (req: any, res: any) {
        const id = req.params.id;

        const resultado = await prisma.user.delete({
            where: {
                id: +id,
            },
        });

        res.send(resultado);
    });
}
