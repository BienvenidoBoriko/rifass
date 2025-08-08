-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `payment_comment` TEXT NULL,
    ADD COLUMN `payment_proof` VARCHAR(500) NULL;
