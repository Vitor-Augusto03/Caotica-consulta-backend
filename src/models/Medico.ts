// src/models/Medico.ts
import { PrismaClient, Medico as MedicoModel } from '@prisma/client';

export class Medico {
   prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async criar(nome: string, especialidade: string): Promise<MedicoModel> {
    const medicoExistente = await this.prisma.medico.findFirst({
      where: { nome },
    });

    if (medicoExistente) {
      throw new Error('Médico já cadastrado.');
    }

    return this.prisma.medico.create({
      data: { nome, especialidade },
    });
  }

  async listarPorEspecialidade(especialidade: string) {
    return this.prisma.medico.findMany({
      where: { especialidade },
    });
  }
}
