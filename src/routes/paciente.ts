// src/routes/pacientes.ts
import { Router } from 'express';
import { Paciente } from '../models/Paciente';

const router = Router();
const pacienteController = new Paciente();

router.post('/', async (req, res) => {
  const { nome, cpf } = req.body;

  try {
    const paciente = await pacienteController.criar(nome, cpf);
    res.status(201).json(paciente);
  } catch (error: any) { // Aqui
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  const { cpf } = req.query;

  try {
    const paciente = await pacienteController.buscarPorCpf(cpf as string);
    res.json(paciente);
  } catch (error: any) { // Aqui
    res.status(500).json({ message: error.message });
  }
});

export default router;
