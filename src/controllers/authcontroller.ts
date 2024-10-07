import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta';

// Função de cadastro
export const cadastro = async (req: Request, res: Response) => {
  const { nome, email, senha, cpf } = req.body;

  // Validação básica
  if (!nome || !email || !senha || !cpf) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(senha, 10);

  try {
    const usuario = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        cpf,
      },
    });
    res.status(201).json({ message: 'Usuário criado com sucesso!', usuario });
  } catch (error: any) {
  if (error.code === 'P2002') { // Erro Prisma para duplicatas
    return res.status(400).json({ error: 'Email ou CPF já estão em uso.' });
  }
  return res.status(500).json({ error: 'Erro ao criar usuário' });
}
};

// Função de login
export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const usuario = await prisma.user.findUnique({ where: { email } });

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  // Verifica a senha
  const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '1d' });

  res.json({ message: 'Login bem-sucedido', token });
};
