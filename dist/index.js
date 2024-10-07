"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client"); // Importa o PrismaClient
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient(); // Inicializa o PrismaClient
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Exemplo de rota para listar usuários
app.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany(); // Busca todos os usuários
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});
// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
