/*
  Warnings:

  - Added the required column `staff_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `staff_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
