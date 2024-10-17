import { PrismaClient, User } from "@prisma/client"; 
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./controllers/auth";

// Omitir apenas a senha
type UserWithoutPassword = Omit<User, 'senha'>;

export async function getUser(req: Request, res: Response, prisma: PrismaClient): 
    Promise<UserWithoutPassword | null> 
{
    const auth = req.headers.authorization;

    try {
        if (typeof auth !== 'string') {
            console.error('Cabeçalho Authorization ausente ou inválido.');
            return null;
        }

        const parts = auth.split(' ');
        if (parts[0] !== 'Bearer' || parts.length !== 2) {
            console.error('Formato do cabeçalho Authorization inválido.');
            return null;
        }

        const token = parts[1];
        const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

        if (!payload || typeof payload !== 'object' || !payload.email) {
            console.error('Token JWT inválido ou payload sem email.');
            return null;
        }

        // Buscar o usuário no banco de dados usando o email do payload
        const user = await prisma.user.findUnique({
            where: { email: payload.email },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,
                // A senha não é incluída
            },
        });

        if (!user) {
            console.error('Usuário não encontrado no banco de dados.');
            return null;
        }

        return user as UserWithoutPassword; // Retornando o tipo correto
    } catch (err) {
        console.error('Erro na verificação do token JWT:', err);
        return null;
    }
}
