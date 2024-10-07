// src/controllers/agendamentosController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para agendar uma consulta
export const agendar = async (req: Request, res: Response) => {
  const { data, horario, medicoId, status } = req.body;

  // Verifica se o status foi fornecido
  if (!status) {
    return res.status(400).json({ error: 'O status é obrigatório' });
  }

  // Verifica se o usuário está autenticado
  if (!req.usuario) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const usuarioId = req.usuario.id;

  try {
    const agendamento = await prisma.agendamento.create({
      data: {
        data,
        horario,
        usuarioId,
        medicoId,
        status,
      },
    });
    return res.status(201).json(agendamento); // Retorna 201 Created
  } catch (error) {
    console.error(error); // Log do erro para depuração
    return res.status(400).json({ error: 'Erro ao agendar consulta' });
  }
};

// Função para listar os agendamentos de um usuário
export const listarAgendamentos = async (req: Request, res: Response) => {
  // Verifica se o usuário está autenticado
  if (!req.usuario) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const usuarioId = req.usuario.id;

  try {
    const agendamentos = await prisma.agendamento.findMany({
      where: { usuarioId },
      include: { medico: true }, // Inclui informações sobre o médico
    });
    return res.json(agendamentos);
  } catch (error) {
    console.error(error); // Log do erro para depuração
    return res.status(400).json({ error: 'Erro ao listar agendamentos' });
  }
};

// Função para cancelar um agendamento
export const cancelarAgendamento = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verifica se o usuário está autenticado
  if (!req.usuario) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  const usuarioId = req.usuario.id;

  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: Number(id) },
    });

    // Verifica se o agendamento existe e se o usuário tem permissão para cancelá-lo
    if (!agendamento || agendamento.usuarioId !== usuarioId) {
      return res.status(403).json({ error: 'Acesso não permitido' });
    }

    await prisma.agendamento.delete({ where: { id: Number(id) } });

    return res.json({ message: 'Agendamento cancelado com sucesso!' });
  } catch (error) {
    console.error(error); // Log do erro para depuração
    return res.status(400).json({ error: 'Erro ao cancelar agendamento' });
  }
};
