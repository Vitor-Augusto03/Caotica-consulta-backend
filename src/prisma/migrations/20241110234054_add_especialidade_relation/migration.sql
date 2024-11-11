/*
  Warnings:

  - You are about to drop the column `especialidadeId` on the `agendamento` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `agendamento` DROP FOREIGN KEY `Agendamento_especialidadeId_fkey`;

-- AlterTable
ALTER TABLE `agendamento` DROP COLUMN `especialidadeId`;
