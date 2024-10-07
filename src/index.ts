
import express from 'express';
import { PrismaClient } from '@prisma/client'; 
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth'


dotenv.config();

const app = express();
const prisma = new PrismaClient(); 

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);


app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
