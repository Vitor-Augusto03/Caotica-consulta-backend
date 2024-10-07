"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.cadastro = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta';
// Função de cadastro
const cadastro = async (req, res) => {
    const { nome, email, senha, cpf } = req.body;
    // Hash da senha
    const hashedPassword = await bcryptjs_1.default.hash(senha, 10);
    try {
        const usuario = await prisma.user.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                cpf,
            },
        });
        res.json(usuario);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao criar usuário' });
    }
};
exports.cadastro = cadastro;
// Função de login
const login = async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    // Verifica a senha
    const isPasswordValid = await bcryptjs_1.default.compare(senha, usuario.senha);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta' });
    }
    const token = jsonwebtoken_1.default.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
};
exports.login = login;
