import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { rotasUsers } from './controllers/users'; 
import { rotasAuth} from './controllers/auth'; 
import { rotasAgendamentosController } from './controllers/agendamentosController';
import medicosRoutes from "./routes/medicos";
import pacienteRoutes from "./routes/paciente"
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api/medicos', medicosRoutes)
app.use('/api/pacientes', pacienteRoutes)
// Importar rotas
rotasAgendamentosController(app, prisma)
rotasUsers(app, prisma);

rotasAuth(app, prisma)

app.listen(+(process.env['PORT'] || 3001));
