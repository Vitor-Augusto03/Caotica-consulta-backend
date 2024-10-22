/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `agendamento` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `agendamento` DROP FOREIGN KEY `Agendamento_usuarioId_fkey`;

-- AlterTable
ALTER TABLE `agendamento` DROP COLUMN `usuarioId`;

-- DropTable
DROP TABLE `user`;
