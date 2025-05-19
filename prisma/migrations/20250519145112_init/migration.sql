-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `whatsapp` VARCHAR(20) NOT NULL,
    `license_plate` VARCHAR(15) NULL,
    `role` ENUM('user', 'staff', 'admin') NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_whatsapp_key`(`whatsapp`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parkings` (
    `parking_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `total_slots` INTEGER NOT NULL,
    `available_slots` INTEGER NOT NULL,
    `hourly_rate` DOUBLE NOT NULL DEFAULT 5000,
    `min_rate` DOUBLE NOT NULL DEFAULT 2000,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`parking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slots` (
    `slot_id` VARCHAR(36) NOT NULL,
    `parking_id` VARCHAR(36) NOT NULL,
    `slot_code` VARCHAR(10) NOT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,
    `vehicle_type` VARCHAR(10) NOT NULL DEFAULT 'car',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `slots_slot_code_key`(`slot_code`),
    INDEX `slots_is_available_idx`(`is_available`),
    PRIMARY KEY (`slot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staffs` (
    `staff_id` VARCHAR(36) NOT NULL,
    `parking_id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `staffs_user_id_key`(`user_id`),
    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `booking_id` VARCHAR(36) NOT NULL,
    `booking_code` VARCHAR(10) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `slot_id` VARCHAR(36) NOT NULL,
    `vehicle_type` VARCHAR(15) NOT NULL DEFAULT 'car',
    `license_plate` VARCHAR(15) NOT NULL,
    `reserve_time` DATETIME(3) NOT NULL,
    `check_in_time` DATETIME(3) NULL,
    `check_out_time` DATETIME(3) NULL,
    `status` ENUM('reserved', 'active', 'completed', 'cancelled', 'expired') NOT NULL DEFAULT 'reserved',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bookings_booking_code_key`(`booking_code`),
    INDEX `bookings_booking_code_idx`(`booking_code`),
    INDEX `bookings_status_idx`(`status`),
    INDEX `bookings_user_id_status_idx`(`user_id`, `status`),
    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `payment_id` VARCHAR(36) NOT NULL,
    `booking_id` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `duration_minutes` INTEGER NOT NULL,
    `payment_method` VARCHAR(10) NOT NULL DEFAULT 'cash',
    `staff_id` VARCHAR(36) NOT NULL,
    `paid_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payments_booking_id_key`(`booking_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `slots` ADD CONSTRAINT `slots_parking_id_fkey` FOREIGN KEY (`parking_id`) REFERENCES `parkings`(`parking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staffs` ADD CONSTRAINT `staffs_parking_id_fkey` FOREIGN KEY (`parking_id`) REFERENCES `parkings`(`parking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staffs` ADD CONSTRAINT `staffs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_slot_id_fkey` FOREIGN KEY (`slot_id`) REFERENCES `slots`(`slot_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staffs`(`staff_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
