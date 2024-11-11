import { Router } from 'express';
import { Medico } from '../models/Medico';

const router = Router();
const medicoController = new Medico();

router.post('/', async (req, res) => {
  const { nome, especialidade } = req.body;

  try {
    const medico = await medicoController.criar(nome, especialidade);
    res.status(201).json(medico);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
});

router.get('/', async (req, res) => {
  const { especialidade } = req.query;

  try {
    const medicos = await medicoController.listarPorEspecialidade(especialidade as string);
    res.json(medicos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
});

export default router;