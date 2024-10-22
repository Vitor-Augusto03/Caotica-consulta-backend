import express from 'express'; 
import bodyParser from 'body-parser';
import cors from 'cors';

import { rotasAgendamentosController } from './controllers/agendamentosController';
import medicosRoutes from "./routes/medicos";
import pacienteRoutes from "./routes/paciente";
import { PrismaClient } from '@prisma/client';


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Registrar rotas que não precisam de autenticação
app.use('/api/medicos', medicosRoutes);
app.use('/api/pacientes', pacienteRoutes);

// Registrar rotas de agendamentos com middleware de autenticação
rotasAgendamentosController(app, prisma); // Aqui estamos chamando a função que registra as rotas

// Iniciar o servidor
const port = +(process.env['PORT'] ?? 3001);
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
