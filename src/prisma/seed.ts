
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const medicos = [
    { nome: 'Dra. Ana Clara', especialidade: 'Cardiologista' },
    { nome: 'Dr. Carlos Santos', especialidade: 'Ortopedista' },
    { nome: 'Dra. Fernanda Almeida', especialidade: 'Dermatologista' },
    { nome: 'Dr. João Pedro', especialidade: 'Pediatra' },
    { nome: 'Dra. Luísa Ribeiro', especialidade: 'Neurologista' },
    { nome: 'Dra. Maria Silva', especialidade: 'Ginecologista' },
  ];

  // Limpar tabela de médicos antes de adicionar novos
  await prisma.medico.deleteMany();

  // Criar médicos
  for (const medico of medicos) {
    await prisma.medico.create({ data: medico });
  }

  console.log('Médicos criados com sucesso!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
