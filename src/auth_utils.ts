import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./controllers/auth";

// Omitir o campo googleId explicitamente na tipagem
type UserWithoutPasswordAndGoogleId = Omit<User, 'senha' | 'googleId'>;

export async function getUser(req: Request, res: Response, prisma: PrismaClient): 
    Promise<UserWithoutPasswordAndGoogleId | null> 
{
    const auth = req.headers.authorization;

    try {
        // Verifique se o cabeçalho Authorization está presente e é uma string válida
        if (typeof auth !== 'string') {
            console.error('Cabeçalho Authorization ausente ou inválido.');
            return null;
        }

        // Divida o cabeçalho Authorization no esquema "Bearer token"
        const parts = auth.split(' ');
        if (parts[0] !== 'Bearer' || typeof parts[1] !== 'string') {
            console.error('Formato do cabeçalho Authorization inválido.');
            return null;
        }

        const token = parts[1];

        // Verifica e decodifica o token usando jwt.verify
        const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;  // jwt.verify já retorna o payload

        // Se o payload não for um objeto válido, retorna null
        if (!payload || typeof payload !== 'object' || !payload.email) {
            console.error('Token JWT inválido ou payload sem email.');
            return null;
        }

        // Buscar o usuário no banco de dados usando o email do payload
        return prisma.user.findFirst({
            where: {
                email: payload.email,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                cpf: true,  // Incluindo o CPF
            },
        });
    } catch (err) {
        // Loga o erro para facilitar o debug
        console.error('Erro na verificação do token JWT:', err);
        return null;
    }
}
