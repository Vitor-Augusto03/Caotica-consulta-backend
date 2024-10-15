declare module 'jsonwebtoken';
declare module 'cors';

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number }; 
       }
  }
}


import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number }; // Adiciona a propriedade `usuario` ao objeto `Request`
    }
  }
  
}
