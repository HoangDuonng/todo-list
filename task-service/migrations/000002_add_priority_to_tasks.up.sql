ALTER TABLE `tasks` ADD COLUMN `priority` ENUM('low', 'medium', 'urgent') DEFAULT 'medium' AFTER `status`;
