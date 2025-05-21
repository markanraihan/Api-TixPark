/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The values [expired] on the enum `bookings_status` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `parkings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `available_slots` on the `parkings` table. All the data in the column will be lost.
  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `staff_id` on the `payments` table. All the data in the column will be lost.
  - The primary key for the `slots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `slot_code` on the `slots` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the `staffs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[parking_id,slot_number]` on the table `slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slot_number` to the `slots` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_slot_id_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_booking_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_staff_id_fkey`;

-- DropForeignKey
ALTER TABLE `slots` DROP FOREIGN KEY `slots_parking_id_fkey`;

-- DropForeignKey
ALTER TABLE `staffs` DROP FOREIGN KEY `staffs_parking_id_fkey`;

-- DropForeignKey
ALTER TABLE `staffs` DROP FOREIGN KEY `staffs_user_id_fkey`;

-- DropIndex
DROP INDEX `bookings_slot_id_fkey` ON `bookings`;

-- DropIndex
DROP INDEX `bookings_user_id_status_idx` ON `bookings`;

-- DropIndex
DROP INDEX `payments_staff_id_fkey` ON `payments`;

-- DropIndex
DROP INDEX `slots_parking_id_fkey` ON `slots`;

-- DropIndex
DROP INDEX `slots_slot_code_key` ON `slots`;

-- AlterTable
ALTER TABLE `bookings` DROP PRIMARY KEY,
    MODIFY `booking_id` VARCHAR(191) NOT NULL,
    MODIFY `booking_code` VARCHAR(191) NOT NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    MODIFY `slot_id` VARCHAR(191) NOT NULL,
    MODIFY `vehicle_type` VARCHAR(191) NOT NULL DEFAULT 'car',
    MODIFY `license_plate` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('reserved', 'active', 'completed', 'cancelled') NOT NULL DEFAULT 'reserved',
    ADD PRIMARY KEY (`booking_id`);

-- AlterTable
ALTER TABLE `parkings` DROP PRIMARY KEY,
    DROP COLUMN `available_slots`,
    MODIFY `parking_id` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`parking_id`);

-- AlterTable
ALTER TABLE `payments` DROP PRIMARY KEY,
    DROP COLUMN `staff_id`,
    MODIFY `payment_id` VARCHAR(191) NOT NULL,
    MODIFY `booking_id` VARCHAR(191) NOT NULL,
    MODIFY `payment_method` VARCHAR(191) NOT NULL DEFAULT 'cash',
    ADD PRIMARY KEY (`payment_id`);

-- AlterTable
ALTER TABLE `slots` DROP PRIMARY KEY,
    DROP COLUMN `slot_code`,
    ADD COLUMN `slot_number` INTEGER NOT NULL,
    MODIFY `slot_id` VARCHAR(191) NOT NULL,
    MODIFY `parking_id` VARCHAR(191) NOT NULL,
    MODIFY `vehicle_type` VARCHAR(191) NOT NULL DEFAULT 'car',
    ADD PRIMARY KEY (`slot_id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `whatsapp` VARCHAR(191) NOT NULL,
    MODIFY `license_plate` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`user_id`);

-- DropTable
DROP TABLE `staffs`;

-- CreateIndex
CREATE UNIQUE INDEX `slots_parking_id_slot_number_key` ON `slots`(`parking_id`, `slot_number`);

-- AddForeignKey
ALTER TABLE `slots` ADD CONSTRAINT `slots_parking_id_fkey` FOREIGN KEY (`parking_id`) REFERENCES `parkings`(`parking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_slot_id_fkey` FOREIGN KEY (`slot_id`) REFERENCES `slots`(`slot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
