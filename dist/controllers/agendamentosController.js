"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelarAgendamento = exports.listarAgendamentos = exports.agendar = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const agendar = async (req, res) => {
    const { data, horario, medicoId } = req.body;
    // Verifica se req.usuario está definido
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
            },
        });
        res.json(agendamento);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao agendar consulta' });
    }
};
exports.agendar = agendar;
const listarAgendamentos = async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const usuarioId = req.usuario.id;
    try {
        const agendamentos = await prisma.agendamento.findMany({
            where: { usuarioId },
            include: { medico: true },
        });
        res.json(agendamentos);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao listar agendamentos' });
    }
};
exports.listarAgendamentos = listarAgendamentos;
const cancelarAgendamento = async (req, res) => {
    const { id } = req.params;
    if (!req.usuario) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const usuarioId = req.usuario.id;
    try {
        const agendamento = await prisma.agendamento.findUnique({
            where: { id: Number(id) },
        });
        if (agendamento?.usuarioId !== usuarioId) {
            return res.status(403).json({ error: 'Acesso não permitido' });
        }
        await prisma.agendamento.delete({ where: { id: Number(id) } });
        res.json({ message: 'Agendamento cancelado com sucesso!' });
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao cancelar agendamento' });
    }
};
exports.cancelarAgendamento = cancelarAgendamento;
