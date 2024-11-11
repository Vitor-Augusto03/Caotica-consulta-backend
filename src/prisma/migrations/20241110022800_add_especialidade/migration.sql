/*
  Warnings:

  - You are about to drop the column `especialidade` on the `medico` table. All the data in the column will be lost.
  - Added the required column `especialidadeId` to the `Medico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `medico` DROP COLUMN `especialidade`,
    ADD COLUMN `especialidadeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Especialidade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Medico` ADD CONSTRAINT `Medico_especialidadeId_fkey` FOREIGN KEY (`especialidadeId`) REFERENCES `Especialidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
