import { PrismaClient, Medico as MedicoModel } from '@prisma/client';

export class Medico {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.cadastrarMedicos(); // Chama o método de cadastro automático no momento da inicialização
  }

  // Método para criar médicos automaticamente
  async cadastrarMedicos() {
    const medicos = [
      { nome: "Dra. Ana Clara", especialidade: "Cardiologista" },
      { nome: "Dr. Carlos Santos", especialidade: "Ortopedista" },
      { nome: "Dra. Fernanda Almeida", especialidade: "Dermatologista" },
      { nome: "Dr. João Pedro", especialidade: "Pediatra" },
      { nome: "Dra. Luísa Ribeiro", especialidade: "Neurologista" },
      { nome: "Dra. Maria Silva", especialidade: "Ginecologista" },
    ];

    for (const medico of medicos) {
      const medicoExistente = await this.prisma.medico.findFirst({
        where: { nome: medico.nome },
      });

      if (!medicoExistente) {
        // Busca a especialidade pelo nome
        const especialidade = await this.prisma.especialidade.findFirst({
          where: { nome: medico.especialidade },
        });

        if (!especialidade) {
          console.log(`Especialidade ${medico.especialidade} não encontrada.`);
          continue;
        }

        await this.prisma.medico.create({
          data: {
            nome: medico.nome,
            especialidade: { connect: { id: especialidade.id } }, // Conecta com o ID da especialidade
          },
        });
        console.log(`Médico ${medico.nome} cadastrado com sucesso.`);
      } else {
        console.log(`Médico ${medico.nome} já existe no banco de dados.`);
      }
    }
  }

  // Método para criar um novo médico
  async criar(nome: string, especialidadeNome: string): Promise<MedicoModel> {
    const medicoExistente = await this.prisma.medico.findFirst({
      where: { nome },
    });

    if (medicoExistente) {
      throw new Error('Médico já cadastrado.');
    }

    // Busca a especialidade pelo nome
    const especialidade = await this.prisma.especialidade.findFirst({
      where: { nome: especialidadeNome },
    });

    if (!especialidade) {
      throw new Error(`Especialidade ${especialidadeNome} não encontrada.`);
    }

    return this.prisma.medico.create({
      data: {
        nome,
        especialidade: { connect: { id: especialidade.id } }, // Conecta com o ID da especialidade
      },
    });
  }

  // Método para listar médicos por especialidade, incluindo a especialidade na resposta
  async listarPorEspecialidade(especialidadeNome: string) {
    return this.prisma.medico.findMany({
      where: {
        especialidade: { nome: especialidadeNome },
      },
      include: {
        especialidade: true, // Inclui a especialidade do médico no retorno
      },
    });
  }
}
