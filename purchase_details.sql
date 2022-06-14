/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE IF NOT EXISTS `purchase_details` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `purchase_details`;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 - Active, 0 - Cancelled',
  `created_on` datetime NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

DELETE FROM `orders`;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `user_id`, `status`, `created_on`, `updated_on`) VALUES
	(1, 3, 0, '2022-06-11 18:18:59', '2022-06-11 19:16:12'),
	(2, 3, 0, '2022-06-11 19:49:53', '2022-06-12 11:27:53'),
	(3, 3, 1, '2022-06-11 19:50:00', '0000-00-00 00:00:00'),
	(4, 3, 1, '2022-06-11 19:50:12', '0000-00-00 00:00:00'),
	(5, 2, 1, '2022-06-12 07:39:14', '0000-00-00 00:00:00'),
	(6, 2, 1, '2022-06-12 07:39:22', '0000-00-00 00:00:00'),
	(7, 1, 1, '2022-06-12 07:39:55', '0000-00-00 00:00:00'),
	(8, 1, 1, '2022-06-12 07:39:56', '0000-00-00 00:00:00'),
	(9, 1, 1, '2022-06-12 07:39:56', '0000-00-00 00:00:00'),
	(10, 1, 1, '2022-06-12 07:39:58', '0000-00-00 00:00:00'),
	(11, 1, 1, '2022-06-12 07:39:59', '0000-00-00 00:00:00'),
	(12, 1, 1, '2022-06-12 11:25:26', '0000-00-00 00:00:00'),
	(13, 1, 1, '2022-06-12 11:32:23', '0000-00-00 00:00:00');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `orders_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT '0',
  `product_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL DEFAULT '0',
  `price` float NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '1 - Active, 0 - Cancelled',
  `created_on` datetime NOT NULL,
  `updated_on` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  KEY `orders_id` (`order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=latin1;

DELETE FROM `orders_details`;
/*!40000 ALTER TABLE `orders_details` DISABLE KEYS */;
INSERT INTO `orders_details` (`id`, `order_id`, `product_id`, `user_id`, `price`, `status`, `created_on`, `updated_on`) VALUES
	(6, 1, 2, 3, 15, 0, '2022-06-11 19:01:59', '2022-06-11 19:16:12'),
	(7, 1, 3, 3, 20, 0, '2022-06-11 19:01:59', '2022-06-11 19:16:12'),
	(8, 1, 5, 3, 30, 0, '2022-06-11 19:01:59', '2022-06-11 19:16:12'),
	(14, 3, 1, 3, 10, 1, '2022-06-11 19:50:00', '0000-00-00 00:00:00'),
	(15, 3, 2, 3, 15, 1, '2022-06-11 19:50:00', '0000-00-00 00:00:00'),
	(16, 3, 5, 3, 30, 1, '2022-06-11 19:50:00', '0000-00-00 00:00:00'),
	(17, 4, 1, 3, 10, 1, '2022-06-11 19:50:12', '0000-00-00 00:00:00'),
	(18, 4, 2, 3, 15, 1, '2022-06-11 19:50:12', '0000-00-00 00:00:00'),
	(19, 4, 3, 3, 20, 1, '2022-06-11 19:50:12', '0000-00-00 00:00:00'),
	(20, 4, 4, 3, 25, 1, '2022-06-11 19:50:12', '0000-00-00 00:00:00'),
	(21, 4, 5, 3, 30, 1, '2022-06-11 19:50:12', '0000-00-00 00:00:00'),
	(22, 5, 1, 2, 10, 1, '2022-06-12 07:39:14', '0000-00-00 00:00:00'),
	(23, 5, 2, 2, 15, 1, '2022-06-12 07:39:14', '0000-00-00 00:00:00'),
	(24, 5, 3, 2, 20, 1, '2022-06-12 07:39:14', '0000-00-00 00:00:00'),
	(25, 5, 4, 2, 25, 1, '2022-06-12 07:39:14', '0000-00-00 00:00:00'),
	(26, 5, 5, 2, 30, 1, '2022-06-12 07:39:14', '0000-00-00 00:00:00'),
	(27, 6, 1, 2, 10, 1, '2022-06-12 07:39:22', '0000-00-00 00:00:00'),
	(28, 6, 2, 2, 15, 1, '2022-06-12 07:39:22', '0000-00-00 00:00:00'),
	(29, 6, 3, 2, 20, 1, '2022-06-12 07:39:22', '0000-00-00 00:00:00'),
	(30, 6, 4, 2, 25, 1, '2022-06-12 07:39:22', '0000-00-00 00:00:00'),
	(31, 6, 5, 2, 30, 1, '2022-06-12 07:39:22', '0000-00-00 00:00:00'),
	(32, 7, 1, 1, 10, 1, '2022-06-12 07:39:55', '0000-00-00 00:00:00'),
	(33, 7, 2, 1, 15, 1, '2022-06-12 07:39:55', '0000-00-00 00:00:00'),
	(34, 7, 3, 1, 20, 1, '2022-06-12 07:39:55', '0000-00-00 00:00:00'),
	(35, 7, 4, 1, 25, 1, '2022-06-12 07:39:55', '0000-00-00 00:00:00'),
	(36, 7, 5, 1, 30, 1, '2022-06-12 07:39:55', '0000-00-00 00:00:00'),
	(37, 8, 1, 1, 10, 1, '2022-06-12 07:39:56', '0000-00-00 00:00:00'),
	(38, 8, 2, 1, 15, 1, '2022-06-12 07:39:56', '0000-00-00 00:00:00'),
	(39, 8, 3, 1, 20, 1, '2022-06-12 07:39:56', '0000-00-00 00:00:00'),
	(40, 8, 4, 1, 25, 1, '2022-06-12 07:39:56', '0000-00-00 00:00:00'),
	(41, 8, 5, 1, 30, 1, '2022-06-12 07:39:56', '0000-00-00 00:00:00'),
	(42, 9, 1, 1, 10, 1, '2022-06-12 07:39:57', '0000-00-00 00:00:00'),
	(43, 9, 2, 1, 15, 1, '2022-06-12 07:39:57', '0000-00-00 00:00:00'),
	(44, 9, 3, 1, 20, 1, '2022-06-12 07:39:57', '0000-00-00 00:00:00'),
	(45, 9, 4, 1, 25, 1, '2022-06-12 07:39:57', '0000-00-00 00:00:00'),
	(46, 9, 5, 1, 30, 1, '2022-06-12 07:39:57', '0000-00-00 00:00:00'),
	(47, 10, 1, 1, 10, 1, '2022-06-12 07:39:58', '0000-00-00 00:00:00'),
	(48, 10, 2, 1, 15, 1, '2022-06-12 07:39:58', '0000-00-00 00:00:00'),
	(49, 10, 3, 1, 20, 1, '2022-06-12 07:39:58', '0000-00-00 00:00:00'),
	(50, 10, 4, 1, 25, 1, '2022-06-12 07:39:58', '0000-00-00 00:00:00'),
	(51, 10, 5, 1, 30, 1, '2022-06-12 07:39:58', '0000-00-00 00:00:00'),
	(52, 11, 1, 1, 10, 1, '2022-06-12 07:39:59', '0000-00-00 00:00:00'),
	(53, 11, 2, 1, 15, 1, '2022-06-12 07:39:59', '0000-00-00 00:00:00'),
	(54, 11, 3, 1, 20, 1, '2022-06-12 07:39:59', '0000-00-00 00:00:00'),
	(55, 11, 4, 1, 25, 1, '2022-06-12 07:39:59', '0000-00-00 00:00:00'),
	(56, 11, 5, 1, 30, 1, '2022-06-12 07:39:59', '0000-00-00 00:00:00'),
	(57, 12, 1, 1, 10, 1, '2022-06-12 11:25:26', '0000-00-00 00:00:00'),
	(58, 12, 2, 1, 15, 1, '2022-06-12 11:25:26', '0000-00-00 00:00:00'),
	(59, 12, 3, 1, 20, 1, '2022-06-12 11:25:26', '0000-00-00 00:00:00'),
	(60, 12, 4, 1, 25, 1, '2022-06-12 11:25:26', '0000-00-00 00:00:00'),
	(61, 12, 5, 1, 30, 1, '2022-06-12 11:25:26', '0000-00-00 00:00:00'),
	(62, 2, 2, 3, 15, 0, '2022-06-12 11:26:37', '2022-06-12 11:27:53'),
	(63, 2, 3, 3, 20, 0, '2022-06-12 11:26:37', '2022-06-12 11:27:53'),
	(64, 2, 5, 3, 30, 0, '2022-06-12 11:26:37', '2022-06-12 11:27:53'),
	(65, 13, 1, 1, 10, 1, '2022-06-12 11:32:23', '0000-00-00 00:00:00'),
	(66, 13, 2, 1, 15, 1, '2022-06-12 11:32:23', '0000-00-00 00:00:00'),
	(67, 13, 3, 1, 20, 1, '2022-06-12 11:32:23', '0000-00-00 00:00:00'),
	(68, 13, 4, 1, 25, 1, '2022-06-12 11:32:23', '0000-00-00 00:00:00'),
	(69, 13, 5, 1, 30, 1, '2022-06-12 11:32:23', '0000-00-00 00:00:00');
/*!40000 ALTER TABLE `orders_details` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku` varchar(20) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

DELETE FROM `products`;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `sku`, `name`, `description`, `price`, `created_on`, `updated_on`) VALUES
	(1, 'PD001', 'Pdt 001', 'Pdt Desc 001', 10, '2022-06-11 10:46:20', '2022-06-11 10:48:18'),
	(2, 'PD002', 'Pdt 002', 'Pdt Desc 002', 15, '2022-06-11 13:01:40', '2022-06-11 13:04:41'),
	(3, 'PD003', 'Pdt 003', 'Pdt Desc 003', 20, '2022-06-11 13:01:40', '2022-06-11 13:04:45'),
	(4, 'PD004', 'Pdt 004', 'Pdt Desc 004', 25, '2022-06-11 13:01:40', '2022-06-11 13:04:47'),
	(5, 'PD005', 'Pdt 005', 'Pdt Desc 005', 30, '2022-06-11 13:04:22', '2022-06-11 13:05:24');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_on` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `created_on`) VALUES
	(1, 'Raj', 'Kumar', 'raja.rko79@gmail.com', '065479885b6eff971f0adb9b33d0e194', '2022-06-10 21:43:58'),
	(2, 'User', 'One', 'userone@gmail.com', '065479885b6eff971f0adb9b33d0e194', '2022-06-11 15:39:43'),
	(3, 'User', 'Two', 'usertwo@gmail.com', '065479885b6eff971f0adb9b33d0e194', '2022-06-11 16:07:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
