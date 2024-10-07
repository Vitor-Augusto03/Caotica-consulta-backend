
import { Router } from 'express';
import { agendar, cancelarAgendamento, listarAgendamentos } from '../controllers/agendamentosController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.post('/agendar', verifyToken, agendar);
router.delete('/cancelar/:id', verifyToken, cancelarAgendamento);
router.get('/meus-agendamentos', verifyToken, listarAgendamentos);

export default router;
