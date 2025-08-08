-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE `raffles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(500) NULL,
    `gallery_images` JSON NULL,
    `price_per_ticket` DECIMAL(10, 2) NOT NULL,
    `total_tickets` INTEGER NOT NULL,
    `sold_tickets` INTEGER NOT NULL DEFAULT 0,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `draw_date` DATETIME(3) NOT NULL,
    `status` ENUM('active', 'closed', 'drawn') NOT NULL DEFAULT 'active',
    `winner_ticket_number` INTEGER NULL,
    `winner_name` VARCHAR(255) NULL,
    `winner_phone` VARCHAR(50) NULL,
    `winner_email` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raffle_id` INTEGER NOT NULL,
    `ticket_number` INTEGER NOT NULL,
    `buyer_name` VARCHAR(255) NOT NULL,
    `buyer_phone` VARCHAR(50) NOT NULL,
    `buyer_email` VARCHAR(255) NOT NULL,
    `buyer_country` VARCHAR(100) NULL,
    `buyer_city` VARCHAR(100) NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` ENUM('pending', 'confirmed', 'failed') NOT NULL DEFAULT 'pending',
    `payment_reference` VARCHAR(255) NULL,
    `amount_paid` DECIMAL(10, 2) NOT NULL,
    `purchased_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `confirmed_at` DATETIME(3) NULL,

    INDEX `tickets_buyer_email_idx`(`buyer_email`),
    UNIQUE INDEX `tickets_raffle_id_ticket_number_key`(`raffle_id`, `ticket_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `winners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raffle_id` INTEGER NOT NULL,
    `ticket_id` INTEGER NOT NULL,
    `winner_name` VARCHAR(255) NOT NULL,
    `winner_phone` VARCHAR(50) NOT NULL,
    `winner_email` VARCHAR(255) NOT NULL,
    `prize_title` VARCHAR(255) NOT NULL,
    `draw_date` DATETIME(3) NOT NULL,
    `video_url` VARCHAR(500) NULL,
    `claimed` BOOLEAN NOT NULL DEFAULT false,
    `claimed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `winners` ADD CONSTRAINT `winners_raffle_id_fkey` FOREIGN KEY (`raffle_id`) REFERENCES `raffles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `winners` ADD CONSTRAINT `winners_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
