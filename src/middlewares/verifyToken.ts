import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta';

interface UsuarioPayload {
  id: number; // Defina a interface para o payload do token
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UsuarioPayload;
    req.usuario = decoded; // Aqui você garante que req.usuario terá um id
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};