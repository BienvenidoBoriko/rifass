/*
  Warnings:

  - A unique constraint covering the columns `[raffle_id,buyer_email,ticket_number]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tickets_raffle_id_buyer_email_ticket_number_key` ON `tickets`(`raffle_id`, `buyer_email`, `ticket_number`);
