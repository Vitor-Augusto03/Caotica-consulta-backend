/*
  Warnings:

  - Added the required column `especialidadeId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agendamento` ADD COLUMN `especialidadeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Agendamento` ADD CONSTRAINT `Agendamento_especialidadeId_fkey` FOREIGN KEY (`especialidadeId`) REFERENCES `Especialidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
