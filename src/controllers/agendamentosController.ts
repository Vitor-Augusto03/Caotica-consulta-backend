// src/controllers/agendamentosController.ts
import { Request, Response, Express} from 'express';
import { getUser } from '../auth_utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function agendarConsulta(req: Request, res: Response, prisma: PrismaClient) {
    const { data, horario, medicoId, cpf, status, nome } = req.body;

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!status) {
        return res.status(400).json({ error: 'O status é obrigatório' });
    }

    const user = await getUser(req, res, prisma);
    if (!user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!cpf) {
        return res.status(400).json({ error: 'O CPF do paciente é obrigatório' });
    }

    if (!nome) {
        return res.status(400).json({ error: 'O nome do paciente é obrigatório' });
    }

    // Verificação do formato do horário
    const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:mm
    if (!horarioRegex.test(horario)) {
        return res.status(400).json({ error: 'O horário deve estar no formato HH:mm' });
    }

    try {
        // Log para verificar o horário recebido
        console.log("Horário recebido:", horario);

        let paciente = await prisma.paciente.findUnique({
            where: { cpf },
        });

        if (!paciente) {
            paciente = await prisma.paciente.create({
                data: {
                    nome,
                    cpf,
                },
            });
        }

        // Conversão da data para o formato ISO
        const dataISO = new Date(data).toISOString();
        
        // Verifica se a data é válida
        if (isNaN(new Date(dataISO).getTime())) {
            return res.status(400).json({ error: 'A data fornecida é inválida' });
        }

        // Log para verificar a data convertida
        console.log("Data convertida para ISO:", dataISO);

        // Verifica se já existe um agendamento para o médico na data e horário especificados
        const agendamentoExistente = await prisma.agendamento.findFirst({
            where: {
                medicoId,
                data: dataISO,
                horario,
            },
        });

        if (agendamentoExistente) {
            return res.status(400).json({ error: 'Horário já está agendado para este médico' });
        }

        const agendamento = await prisma.agendamento.create({
            data: {
                data: dataISO,
                horario,
                usuarioId: user.id,
                pacienteId: paciente.id,
                medicoId,
                status,
            },
        });

        return res.status(201).json(agendamento);
    } catch (error) {
        console.error("Erro ao agendar consulta:", error);
        console.error("Dados recebidos:", { data, horario, medicoId, cpf, status, nome });
        const errorMessage = (error as Error).message || 'Erro desconhecido';
        return res.status(500).json({ error: 'Erro ao agendar consulta', details: errorMessage });
    }
}



async function cancelarAgendamento(req: Request, res: Response, prisma: PrismaClient) {
    const { id } = req.params;

    const user = await getUser(req, res, prisma); // Adicionando prisma aqui
    if (!user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const usuarioId = user.id;

    try {
        const agendamento = await prisma.agendamento.findUnique({
            where: { id: Number(id) },
        });

        if (!agendamento || agendamento.usuarioId !== usuarioId) {
            return res.status(403).json({ error: 'Acesso não permitido' });
        }

        await prisma.agendamento.delete({ where: { id: Number(id) } });

        return res.json({ message: 'Agendamento cancelado com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Erro ao cancelar agendamento' });
    }
}

async function listarAgendamentos(req: Request, res: Response, prisma: PrismaClient) {
    const user = await getUser(req, res, prisma); 
    if (!user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const usuarioId = user.id;

    try {
        const agendamentos = await prisma.agendamento.findMany({
            where: {
                usuarioId,
                status: 'Confirmado', // Filtrando apenas agendamentos confirmados
            },
            include: {
                medico: true,
            },
        });

        return res.json(agendamentos);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Erro ao listar agendamentos' });
    }
}


export function rotasAgendamentosController(app: Express, prisma: PrismaClient) {
    app.post('/api/agendamentos', (req: Request, res: Response) => {
        agendarConsulta(req, res, prisma).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        });
    });

    app.delete('/api/agendamentos/:id', (req: Request, res: Response) => {
        cancelarAgendamento(req, res, prisma).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        });
    });

    app.get('/api/agendamentos', (req: Request, res: Response) => {
        listarAgendamentos(req, res, prisma).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        });
    });
}
