/*
  Warnings:

  - You are about to drop the column `price_per_ticket` on the `raffles` table. All the data in the column will be lost.
  - Added the required column `price_per_ticket_usd` to the `raffles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_per_ticket_ves` to the `raffles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `raffles` DROP COLUMN `price_per_ticket`,
    ADD COLUMN `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
    ADD COLUMN `exchange_rate` DECIMAL(15, 6) NOT NULL DEFAULT 1.000000,
    ADD COLUMN `has_predefined_winners` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `predefined_winners` JSON NULL,
    ADD COLUMN `price_per_ticket_usd` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `price_per_ticket_ves` DECIMAL(15, 2) NOT NULL;
