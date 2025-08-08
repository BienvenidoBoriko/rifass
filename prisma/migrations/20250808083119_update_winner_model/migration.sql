/*
Warnings:

- You are about to drop the column `claimed_at` on the `winners` table. All the data in the column will be lost.
- You are about to drop the column `prize_title` on the `winners` table. All the data in the column will be lost.
- You are about to drop the column `ticket_id` on the `winners` table. All the data in the column will be lost.
- Added the required column `ticket_number` to the `winners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `winners` DROP FOREIGN KEY `winners_ticket_id_fkey`;

-- DropIndex
DROP INDEX `winners_ticket_id_fkey` ON `winners`;

-- First, add the new column as nullable
ALTER TABLE `winners` ADD COLUMN `ticket_number` INTEGER NULL;

-- Update existing records with a default value (you may want to set this to a specific value)
UPDATE `winners`
SET
    `ticket_number` = 0
WHERE
    `ticket_number` IS NULL;

-- Now make the column NOT NULL
ALTER TABLE `winners` MODIFY `ticket_number` INTEGER NOT NULL;

-- Drop the old columns
ALTER TABLE `winners`
DROP COLUMN `claimed_at`,
DROP COLUMN `prize_title`,
DROP COLUMN `ticket_id`,
MODIFY `winner_phone` VARCHAR(50) NULL;