import { PrismaClient } from '@prisma/client';
import { Express } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const JWT_SECRET = 'segredo do jwt...';

export function rotasAuth(app: Express, prisma: PrismaClient) {
    app.post('/auth/signin', async function (req: any, res: any) {
        const { email, senha } = req.body;

        if (typeof email !== 'string' || typeof senha !== 'string') {
            res.status(400);
            res.send('Parâmetros inválidos');
            return;
        }

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        // Se o usuário não for encontrado ou a senha for null, retorne erro
        if (user === null || user.senha === null || !bcrypt.compareSync(senha, user.senha)) {
            res.status(401);
            res.send('Credenciais incorretas');
            return;
        }

        const payload = {
            email: user.email,
            cpf: user.cpf,  // Incluímos o cpf no payload
        };

        const token = jwt.sign(payload, JWT_SECRET);

        res.send({
            token,
            email: user.email,
            nome: user.nome,
            cpf: user.cpf,  // Incluímos o cpf na resposta
        });
    });

    // Rota de cadastro (signup)
    app.post('/auth/signup', async function (req: any, res: any) {
        const { nome, email, senha, cpf } = req.body;

        if (!nome || !email || !senha || !cpf) {
            res.status(400);
            res.send('Dados em branco...');
            return;
        }

        if (await prisma.user.findFirst({ where: { email } }) !== null) {
            res.status(400);
            res.send('E-mail já utilizado.');
            return;
        }

        if (await prisma.user.findFirst({ where: { cpf } }) !== null) {
            res.status(400);
            res.send('CPF já cadastrado.');
            return;
        }

        const resultado = await prisma.user.create({
            data: {
                nome: nome,
                email: email,
                senha: bcrypt.hashSync(senha, 10),
                cpf: cpf,  // Incluímos o cpf no cadastro
            },
        });

        res.send(resultado);
    });
}
