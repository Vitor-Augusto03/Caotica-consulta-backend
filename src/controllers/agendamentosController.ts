import { Especialidade } from './../../node_modules/.prisma/client/index.d';
import { Request, Response, Express } from "express";
import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function agendarConsulta(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { data, horario, medicoId, cpf, status, nome, especialidadeId } = req.body;

  // Validações de campos obrigatórios
  if (!status) {
    return res.status(400).json({ error: "O status é obrigatório" });
  }

  if (!cpf) {
    return res.status(400).json({ error: "O CPF do paciente é obrigatório" });
  }

  if (!nome) {
    return res.status(400).json({ error: "O nome do paciente é obrigatório" });
  }

  // Valida o formato do horário
  const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!horarioRegex.test(horario)) {
    return res
      .status(400)
      .json({ error: "O horário deve estar no formato HH:mm" });
  }

  try {
    // Verifica se o paciente existe, caso contrário, cria um novo
    let paciente = await prisma.paciente.findUnique({ where: { cpf } });
    if (!paciente) {
      paciente = await prisma.paciente.create({ data: { nome, cpf } });
    }

    // Valida a data
    const dataISO = new Date(data).toISOString();
    if (isNaN(new Date(dataISO).getTime())) {
      return res.status(400).json({ error: "A data fornecida é inválida" });
    }

    // Verifica se já existe um agendamento para o médico no horário
    const agendamentoExistente = await prisma.agendamento.findFirst({
      where: {
        medicoId: Number(medicoId), // Converte para número
        data: dataISO,
        horario,
      },
    });

    if (agendamentoExistente) {
      return res
        .status(400)
        .json({ error: "Horário já está agendado para este médico" });
    }

    // Verifica a especialidade do médico
    const medico = await prisma.medico.findUnique({
      where: { id: Number(medicoId) },
      select: { especialidadeId: true },
    });

    if (!medico) {
      return res.status(400).json({ error: "Médico não encontrado" });
    }

    // Verifica se a especialidade do médico corresponde à especialidade informada no agendamento
    if (especialidadeId && especialidadeId !== medico.especialidadeId) {
      return res.status(400).json({
        error: "A especialidade do médico não corresponde à especialidade informada para o agendamento",
      });
    }

    // Cria o novo agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        data: dataISO,
        horario,
        pacienteId: paciente.id,
        medicoId: Number(medicoId), // Converte para número
        status,
        especialidadeId: medico.especialidadeId, // Confere a especialidade do médico
      },
      include: {
        paciente: { select: { nome: true } },
        medico: { select: { nome: true, especialidade: true } },
      },
    });

    return res.status(201).json(agendamento);
  } catch (error) {
    console.error("Erro ao agendar consulta:", error);
    console.error("Dados recebidos:", {
      data,
      horario,
      medicoId,
      cpf,
      status,
      nome,
      especialidadeId,
    });
    return res
      .status(500)
      .json({
        error: "Erro ao agendar consulta",
        details: (error as Error).message,
      });
  }
}


async function cancelarAgendamento(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { id } = req.params;

  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: Number(id) },
      include: {
        medico: { select: { nome: true, especialidadeId: true } },
        paciente: { select: { nome: true } },
      },
    });
    if (!agendamento) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    // Atualiza o status do agendamento para "Cancelado"
    await prisma.agendamento.update({
      where: { id: Number(id) },
      data: { status: "Cancelado" },
    });

    return res.json({
      message: "Agendamento cancelado com sucesso!",
      agendamento: {
        medico: agendamento.medico.nome,
        especialidadeId: agendamento.medico.especialidadeId,
        paciente: agendamento.paciente.nome,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Erro ao cancelar agendamento" });
  }
}

async function listarAgendamentos(
  req: Request,
  res: Response,
  prisma: PrismaClient
) {
  const { status } = req.query;

  try {
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        ...(status && { status: status as Status }), // Cast para o tipo correto
      },
      include: {
        medico: {
          select: {
            nome: true,
            especialidade: { select: { nome: true } }, // Inclui a especialidade do médico
          },
        },
        paciente: { select: { nome: true, cpf: true } },
      },
    });

    return res.json(agendamentos);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Erro ao listar agendamentos" });
  }
}



export function rotasAgendamentosController(
  app: Express,
  prisma: PrismaClient
) {
  app.post("/api/agendamentos", (req: Request, res: Response) => {
    agendarConsulta(req, res, prisma).catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
  });

  app.patch("/api/agendamentos/:id", (req: Request, res: Response) => {
    cancelarAgendamento(req, res, prisma).catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
  });

  app.get("/api/agendamentos", (req: Request, res: Response) => {
    listarAgendamentos(req, res, prisma).catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Erro interno do servidor" });
    });
  });
}
