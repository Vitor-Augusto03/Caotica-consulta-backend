// src/types/express.d.ts
import * as express from 'express';

// Extende a interface Request para incluir a propriedade user
declare global {
    namespace Express {
        interface Request {
            user?: any; // ou um tipo mais específico se você tiver um tipo definido para o usuário
        }
    }
}
