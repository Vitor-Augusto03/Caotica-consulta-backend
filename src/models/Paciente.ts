// src/models/Paciente.ts
import { PrismaClient, Paciente as PacienteModel } from '@prisma/client';

export class Paciente {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async criar(nome: string, cpf: string): Promise<PacienteModel> {
    return this.prisma.paciente.create({
      data: { nome, cpf },
    });
  }

  async buscarPorCpf(cpf: string) {
    return this.prisma.paciente.findUnique({
      where: { cpf },
    });
  }
}
