-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 28, 2025 at 11:52 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bellah_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','manager','staff') DEFAULT 'staff',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `email`, `role`, `last_login`, `created_at`) VALUES
(1, 'bellah', '1115', 'admin@belahshop.com', 'admin', NULL, '2025-05-27 07:39:47');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_categories_active` (`is_active`),
  KEY `idx_categories_sort` (`sort_order`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `image`, `is_active`, `sort_order`, `created_at`) VALUES
(1, 'Lipstick', 'Lip colors and treatments', NULL, 1, 1, '2025-05-27 07:39:47'),
(2, 'Foundation', 'Base makeup for flawless skin', NULL, 1, 2, '2025-05-27 07:39:47'),
(3, 'Eyeshadow', 'Eye makeup and palettes', NULL, 1, 3, '2025-05-27 07:39:47'),
(4, 'Mascara', 'Lash enhancement products', NULL, 1, 4, '2025-05-27 07:39:47'),
(5, 'Skincare', 'Skin care and treatments', NULL, 1, 5, '2025-05-27 07:39:47'),
(6, 'Blush', 'Cheek colors and bronzers', NULL, 1, 6, '2025-05-27 07:39:47'),
(7, 'Eyeliner', 'Eye definition products', NULL, 1, 7, '2025-05-27 07:39:47'),
(8, 'Lotion', 'Highly scentend lotions', NULL, 1, 8, '2025-05-27 07:39:47');

-- --------------------------------------------------------

--
-- Table structure for table `chat_logs`
--

DROP TABLE IF EXISTS `chat_logs`;
CREATE TABLE IF NOT EXISTS `chat_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(50) NOT NULL,
  `message_type` enum('user','bot') NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chat_session` (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount_codes`
--

DROP TABLE IF EXISTS `discount_codes`;
CREATE TABLE IF NOT EXISTS `discount_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `minimum_order` decimal(10,2) DEFAULT '0.00',
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT '0',
  `valid_from` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `valid_until` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_discount_code` (`code`),
  KEY `idx_discount_active` (`is_active`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `discount_codes`
--

INSERT INTO `discount_codes` (`id`, `code`, `discount_type`, `discount_value`, `minimum_order`, `usage_limit`, `used_count`, `valid_from`, `valid_until`, `is_active`, `created_at`) VALUES
(1, 'WELCOME10', 'percentage', 10.00, 25.00, 100, 0, '2025-05-27 07:39:48', '2025-06-26 07:39:48', 1, '2025-05-27 07:39:48'),
(2, 'SAVE5', 'fixed', 5.00, 50.00, 50, 0, '2025-05-27 07:39:48', '2025-07-26 07:39:48', 1, '2025-05-27 07:39:48'),
(3, 'NEWCUSTOMER', 'percentage', 15.00, 30.00, 200, 0, '2025-05-27 07:39:48', '2025-08-25 07:39:48', 1, '2025-05-27 07:39:48');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_logs`
--

DROP TABLE IF EXISTS `inventory_logs`;
CREATE TABLE IF NOT EXISTS `inventory_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `change_type` enum('restock','sale','adjustment','return') NOT NULL,
  `quantity_change` int NOT NULL,
  `previous_stock` int NOT NULL,
  `new_stock` int NOT NULL,
  `notes` text,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inventory_product_id` (`product_id`),
  KEY `idx_inventory_created_at` (`created_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `shipping_address` text NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `image` varchar(500) DEFAULT '/placeholder.svg?height=250&width=250',
  `stock` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `image`, `stock`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Luxury Matte Lipstick - Ruby Red', 'Long-lasting matte finish with rich color payoff. Perfect for all-day wear.', 10.00, 'lipstick', 'lipstick.jpg', 15, 1, '2025-05-27 08:24:12', '2025-05-28 10:25:27'),
(2, 'Flawless Foundation - Medium', 'Full coverage foundation for all skin types. Buildable and natural finish.', 12.00, 'foundation', 'foundation.jfif', 20, 1, '2025-05-27 08:24:12', '2025-05-28 10:51:31'),
(3, 'Shimmer Eyeshadow Palette - Sunset', '12 stunning shades for day and night looks. Highly pigmented and blendable.', 8.00, 'eyeshadow', 'inuka palette.jpg', 12, 1, '2025-05-27 08:24:12', '2025-05-28 10:52:02'),
(4, 'Volume Boost Mascara - Black', 'Dramatic volume and length for stunning lashes. Waterproof formula.', 7.00, 'mascara', 'mascara.webp', 25, 1, '2025-05-27 08:24:12', '2025-05-28 10:52:22'),
(5, 'Body mist', 'Long lasting fragnances for all day', 8.00, 'blush', '1000292606.jpg', 18, 1, '2025-05-27 08:24:12', '2025-05-28 10:52:41'),
(6, 'Bath salts', 'bath salts for relaxing ', 8.00, 'blush', '1000292606.jpg', 14, 1, '2025-05-27 08:24:12', '2025-05-28 10:53:06'),
(7, 'Lip Gloss ', 'Glossy finish with subtle nude tones. Non-sticky formula.', 4.00, 'lipstick', 'lipgloss.jfif', 22, 1, '2025-05-27 08:24:12', '2025-05-28 10:53:46'),
(8, 'Classic Perfumes', 'classic perfumes of different scents and long lasting', 15.00, 'blush', '1000033470.jpg', 10, 1, '2025-05-27 08:24:12', '2025-05-28 10:54:14'),
(9, 'Waterproof Eyeliner - Deep Black', 'Precise application with long-lasting wear. Smudge-proof formula.', 7.00, 'eyeliner', 'eyeliner.jfif', 30, 1, '2025-05-27 08:24:12', '2025-05-28 10:54:34'),
(10, 'Lotion and Perfume', 'For long lasting scent apply lotion and perfume of same scent', 25.00, 'bronzer', '1000102580.jpg', 16, 1, '2025-05-27 08:24:12', '2025-05-28 10:55:13');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  `review_text` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_product_id` (`product_id`),
  KEY `idx_reviews_rating` (`rating`)
) ;

--
-- Dumping data for table `product_reviews`
--

INSERT INTO `product_reviews` (`id`, `product_id`, `customer_name`, `rating`, `review_text`, `created_at`) VALUES
(1, 1, 'Sarah M.', 5, 'Amazing lipstick! The color is exactly as shown and lasts all day.', '2025-05-27 07:39:47'),
(2, 1, 'Emma K.', 4, 'Great quality, but wish there were more color options.', '2025-05-27 07:39:47'),
(3, 2, 'Lisa R.', 5, 'Perfect coverage without feeling heavy. Love this foundation!', '2025-05-27 07:39:47'),
(4, 3, 'Maria G.', 5, 'Beautiful eyeshadow palette with great pigmentation.', '2025-05-27 07:39:47'),
(5, 4, 'Anna T.', 4, 'Good mascara, gives nice volume but could be more waterproof.', '2025-05-27 07:39:47'),
(6, 5, 'Jessica L.', 5, 'This lotion has transformed my skin! Highly recommend.', '2025-05-27 07:39:47');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_email` varchar(100) NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wishlist` (`customer_email`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_wishlist_email` (`customer_email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
