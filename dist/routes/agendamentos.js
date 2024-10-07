"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/agendamento.ts
const express_1 = require("express");
const agendamentosController_1 = require("../controllers/agendamentosController");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = (0, express_1.Router)();
router.post('/agendar', verifyToken_1.verifyToken, agendamentosController_1.agendar);
router.delete('/cancelar/:id', verifyToken_1.verifyToken, agendamentosController_1.cancelarAgendamento);
router.get('/meus-agendamentos', verifyToken_1.verifyToken, agendamentosController_1.listarAgendamentos);
exports.default = router;
