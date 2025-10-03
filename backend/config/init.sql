-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: lag_vintage_shop
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_logs`
--

DROP TABLE IF EXISTS `admin_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT 'Admin thực hiện',
  `action_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại hành động: update_order_status, delete_product, etc',
  `table_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bảng bị tác động',
  `record_id` int DEFAULT NULL COMMENT 'ID bản ghi bị tác động',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action_type`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Log hành động của admin';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_logs`
--

LOCK TABLES `admin_logs` WRITE;
/*!40000 ALTER TABLE `admin_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL COMMENT 'ID user nếu đã đăng nhập',
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Session ID nếu chưa đăng nhập',
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng (max 10)',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `uk_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_session` (`session_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Giỏ hàng của khách';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (44,NULL,'session_1759369865589_a4zp6mrms',60,1,'2025-10-02 01:51:05'),(45,NULL,'session_1759369865589_a4zp6mrms',76,1,'2025-10-02 01:51:07'),(46,NULL,'session_1759371233866_p338vfaog',76,1,'2025-10-02 02:13:58');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã danh mục: jacket, shirt, pants, dress',
  `category_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên hiển thị: Áo Khoác, Áo Sơ Mi, Quần, Váy',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả danh mục',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh đại diện danh mục',
  `display_order` int DEFAULT '0' COMMENT 'Thứ tự hiển thị',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_code` (`category_code`),
  KEY `idx_code` (`category_code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='4 danh mục chính của shop';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'jacket','Áo Khoác','Các loại áo khoác vintage độc đáo với phong cách retro','https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',1),(2,'shirt','Áo Sơ Mi','Áo sơ mi vintage phong cách cổ điển, chất liệu cao cấp','https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',2),(3,'pants','Quần','Quần vintage đa dạng kiểu dáng từ jean đến kaki','https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',3),(4,'dress','Váy','Váy vintage nữ tính và thanh lịch cho mọi dịp','https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',4),(5,'phone','Điện Thoại','Điện thoại smartphone cao cấp - chính hãng, fullbox','https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',5),(6,'laptop','Laptop','Laptop văn phòng, gaming - hiệu năng cao','https://images.pexels.com/photos/18105/pexels-photo.jpg',6),(7,'headphone','Tai Nghe','Tai nghe, headphone chống ồn chất lượng cao','https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',7),(8,'accessory','Phụ Kiện','Phụ kiện điện thoại, laptop chính hãng','https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg',8);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbot_logs`
--

DROP TABLE IF EXISTS `chatbot_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatbot_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  `user_message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `bot_response` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `intent` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sentiment` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `response_time` int DEFAULT NULL,
  `is_helpful` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_session` (`session_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `chatbot_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbot_logs`
--

LOCK TABLES `chatbot_logs` WRITE;
/*!40000 ALTER TABLE `chatbot_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatbot_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `contact_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ',
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email liên hệ',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Số điện thoại',
  `subject` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Chủ đề: general, order, product, shipping, return, complaint, other',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nội dung tin nhắn',
  `subscribe_newsletter` tinyint(1) DEFAULT '0' COMMENT 'Đăng ký nhận tin',
  `is_read` tinyint(1) DEFAULT '0' COMMENT 'Admin đã đọc chưa',
  `is_replied` tinyint(1) DEFAULT '0' COMMENT 'Admin đã trả lời chưa',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày gửi',
  PRIMARY KEY (`contact_id`),
  KEY `idx_email` (`email`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tin nhắn liên hệ từ khách hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'Phạm','Thị D','phamthid@gmail.com','0938123456','order','Cho em hỏi đơn hàng LAG20250930001 đã giao chưa ạ?',1,1,0,'2025-09-26 04:20:00'),(2,'Lê','Văn E','levane@gmail.com','0945678901','product','Shop có thêm áo bomber màu đen không ạ?',0,1,0,'2025-09-29 09:45:00'),(3,'Hoàng','Thị F','hoangthif@gmail.com',NULL,'general','Shop có ship tới Cần Thơ không ạ?',1,1,0,'2025-09-30 01:30:00'),(4,'Lê','Hoa','hoa123@gmail.com','0388843044','product','t5fg',1,1,0,'2025-10-01 06:43:40'),(5,'Lê','Hoa','admin@lagvintage.com','0388843044','product','hh35t',1,0,0,'2025-10-03 02:22:55'),(6,'Lê','Hoa','admin@lagvintage.com','0388843044','general','eqcdq',0,0,0,'2025-10-03 02:48:47');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên sản phẩm',
  `product_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh sản phẩm',
  `price` decimal(10,2) NOT NULL COMMENT 'Giá tại thời điểm mua',
  `quantity` int NOT NULL COMMENT 'Số lượng mua',
  `item_total` decimal(10,2) NOT NULL COMMENT 'Thành tiền = price * quantity',
  PRIMARY KEY (`order_item_id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết sản phẩm trong đơn hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'Áo Sơ Mi Vintage Nam','https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',350000.00,1,350000.00),(2,1,3,'Áo Len Vintage Ấm Áp','https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',380000.00,1,380000.00),(3,2,4,'Áo Khoác Denim Cổ Điển','https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',450000.00,1,450000.00),(4,3,2,'Áo Polo Vintage Thể Thao','https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',280000.00,1,280000.00),(5,4,6,'Blazer Vintage Lịch Lãm','https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg',580000.00,1,580000.00),(6,5,3,'Áo Len Vintage Ấm Áp','https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',380000.00,1,380000.00),(7,6,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,1,350000.00),(8,6,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(9,7,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(10,8,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(11,9,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(12,9,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,1,350000.00),(13,11,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,3,1050000.00),(14,11,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(15,11,71,'AirPods Pro 2nd Generation','tainghe.jpg',5990000.00,1,5990000.00),(16,11,73,'Ốp lưng iPhone 14 Pro Max Silicone','oplungip14.jpg',990000.00,1,990000.00),(17,12,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(18,13,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,2,560000.00),(19,14,55,'Áo Len Vintage Ấm Áp','vintageAMap.jpeg',380000.00,1,380000.00),(20,15,55,'Áo Len Vintage Ấm Áp','vintageAMap.jpeg',380000.00,1,380000.00),(21,16,55,'Áo Len Vintage Ấm Áp','vintageAMap.jpeg',380000.00,1,380000.00),(22,17,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,1,350000.00),(23,17,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(24,18,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,1,350000.00),(25,18,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(26,19,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(27,20,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,1,350000.00),(28,21,55,'Áo Len Vintage Ấm Áp','vintageAMap.jpeg',380000.00,1,380000.00),(29,22,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,1,350000.00),(30,23,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,1,350000.00),(31,24,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(32,25,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(33,26,54,'Áo Polo Vintage Thể Thao','vintage-cam.jpg',280000.00,1,280000.00),(34,26,69,'MacBook Air M2 2023 13 inch','macbook.jpg',28900000.00,1,28900000.00),(35,27,54,'Áo Polo Vintage Thể Thao','/images/vintage-cam.jpg',280000.00,2,560000.00),(36,27,74,'Sạc Nhanh Anker 65W GaN','/images/sacnhanh.webp',1290000.00,1,1290000.00),(37,28,54,'Áo Polo Vintage Thể Thao','/images/vintage-cam.jpg',280000.00,1,280000.00),(38,29,54,'Áo Polo Vintage Thể Thao','/images/vintage-cam.jpg',280000.00,1,280000.00),(39,31,67,'iPhone 13 128GB','/images/ip13.jpg',15900000.00,1,15900000.00),(40,31,75,'Cáp sạc USB-C to Lightning MFi','/images/typec.jpg',490000.00,1,490000.00),(41,33,54,'Áo Polo Vintage Thể Thao','/images/vintage-cam.jpg',280000.00,1,280000.00),(42,34,74,'Sạc Nhanh Anker 65W GaN','/images/sacnhanh.webp',1290000.00,1,1290000.00),(43,35,53,'Áo Sơ Mi Vintage Nam','vitageHam1.jpg',350000.00,1,350000.00),(44,35,54,'Áo Polo Vintage Thể Thao','/images/vintage-cam.jpg',280000.00,1,280000.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã đơn: LAG + timestamp (LAG12345678)',
  `user_id` int DEFAULT NULL COMMENT 'ID user nếu đã đăng nhập (có thể null)',
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ tên khách hàng',
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email khách hàng',
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại',
  `shipping_address` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ chi tiết',
  `shipping_district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Quận/Huyện',
  `shipping_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tỉnh/Thành phố',
  `payment_method` enum('cod','bank','momo') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'COD, Chuyển khoản, MoMo',
  `order_status` enum('pending','processing','shipping','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Chờ xử lý, Đang xử lý, Đang giao, Đã giao, Đã hủy',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'Tổng tiền sản phẩm',
  `shipping_fee` decimal(10,2) DEFAULT '30000.00' COMMENT 'Phí ship (30k, free nếu >500k)',
  `total_amount` decimal(10,2) NOT NULL COMMENT 'Tổng thanh toán = subtotal + shipping',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú từ khách hàng',
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày đặt hàng',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `idx_order_code` (`order_code`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`order_status`),
  KEY `idx_email` (`customer_email`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đơn hàng của khách';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'LAG20250930001',2,'Nguyễn Văn A','user@lagvintage.com','0987654321','123 Đường ABC','Quận 1','TP. Hồ Chí Minh','cod','delivered',730000.00,0.00,730000.00,'Giao hàng giờ hành chính','2025-09-25 03:30:00','2025-09-30 00:59:08'),(2,'LAG20250930002',3,'Nguyễn Thị B','nguyenthib@gmail.com','0912345678','456 Đường XYZ','Hoàn Kiếm','Hà Nội','bank','shipping',450000.00,0.00,450000.00,NULL,'2025-09-28 07:20:00','2025-09-30 00:59:08'),(3,'LAG20250930003',NULL,'Trần Văn C','tranvanc@gmail.com','0909123456','789 Đường DEF','Thanh Khê','Đà Nẵng','momo','cancelled',280000.00,30000.00,310000.00,'Ship ngoài giờ được không?','2025-09-30 02:15:00','2025-09-30 04:30:27'),(4,'LAG06784678',6,'Hoa','hoa123@gmail.com','0388853044','Phường 1 TP Trà Vinh','Bình Thủy','cantho','bank','pending',580000.00,0.00,580000.00,'t5tytyyyy','2025-09-30 04:33:04','2025-09-30 04:33:04'),(5,'LAG07393924',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','hoa123@gmail.com','0388853044','Phường 1 TP Trà Vinh','Quận 1','hcm','bank','pending',380000.00,30000.00,410000.00,'gh5thg','2025-09-30 04:43:13','2025-09-30 04:43:13'),(6,'LAG08657250',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Ba Đình','hanoi','bank','pending',630000.00,0.00,630000.00,NULL,'2025-09-30 05:04:17','2025-09-30 05:04:17'),(7,'ORD1759279188083',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Quận 2','hcm','bank','pending',280000.00,30000.00,310000.00,NULL,'2025-10-01 00:39:48','2025-10-01 00:39:48'),(8,'ORD1759279261719',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Quận 1','hcm','bank','delivered',280000.00,30000.00,310000.00,NULL,'2025-10-01 00:41:01','2025-10-01 00:57:16'),(9,'ORD1759279372738',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Quận 2','hcm','bank','shipping',630000.00,0.00,630000.00,NULL,'2025-10-01 00:42:52','2025-10-01 00:56:21'),(11,'ORD175929292185216',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Quận 2','hcm','bank','cancelled',8310000.00,30000.00,8310000.00,NULL,'2025-10-01 04:28:41','2025-10-01 04:34:53'),(12,'ORD175929305768447',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Quận 2','hcm','bank','cancelled',280000.00,30000.00,280000.00,NULL,'2025-10-01 04:30:57','2025-10-01 04:34:50'),(13,'ORD175929436178490',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Quận 3','hcm','bank','pending',560000.00,30000.00,590000.00,NULL,'2025-10-01 04:52:41','2025-10-01 04:52:41'),(14,'ORD1759294389483566',6,'Kỹ Thuật Nguyễn Huỳnh','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Ba Đình','hanoi','bank','pending',380000.00,30000.00,410000.00,NULL,'2025-10-01 04:53:09','2025-10-01 04:53:09'),(15,'ORD1759294407168498',6,'Kỹ Thuật Nguyễn Huỳnh','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Ba Đình','hanoi','bank','pending',380000.00,30000.00,410000.00,NULL,'2025-10-01 04:53:27','2025-10-01 04:53:27'),(16,'ORD1759294407438905',6,'Kỹ Thuật Nguyễn Huỳnh','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Ba Đình','hanoi','bank','pending',380000.00,30000.00,410000.00,NULL,'2025-10-01 04:53:27','2025-10-01 04:53:27'),(17,'ORD1759294496328341',6,'Hoa','hoa123@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Ninh Kiều','cantho','bank','pending',630000.00,30000.00,660000.00,NULL,'2025-10-01 04:54:56','2025-10-01 04:54:56'),(18,'ORD1759297012753477',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Hoàn Kiếm','hanoi','cod','pending',630000.00,30000.00,660000.00,NULL,'2025-10-01 05:36:52','2025-10-01 05:36:52'),(19,'ORD1759297392554111',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Hoàn Kiếm','hanoi','cod','pending',280000.00,30000.00,310000.00,NULL,'2025-10-01 05:43:12','2025-10-01 05:43:12'),(20,'ORD1759297595697928',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Ba Đình','hanoi','bank','pending',350000.00,30000.00,380000.00,NULL,'2025-10-01 05:46:35','2025-10-01 05:46:35'),(21,'ORD1759297615794521',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Ba Đình','hanoi','cod','pending',380000.00,30000.00,410000.00,NULL,'2025-10-01 05:46:55','2025-10-01 05:46:55'),(22,'ORD1759297954617166',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Hoàn Kiếm','hanoi','cod','pending',350000.00,30000.00,380000.00,NULL,'2025-10-01 05:52:34','2025-10-01 05:52:34'),(23,'ORD1759297997422454',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Hai Bà Trưng','hanoi','cod','pending',350000.00,30000.00,380000.00,NULL,'2025-10-01 05:53:17','2025-10-01 05:53:17'),(24,'ORD1759298322694385',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Hoàn Kiếm','hanoi','cod','pending',280000.00,30000.00,310000.00,NULL,'2025-10-01 05:58:42','2025-10-01 05:58:42'),(25,'ORD1759301224752446',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Ba Đình','hanoi','cod','pending',280000.00,30000.00,310000.00,NULL,'2025-10-01 06:47:04','2025-10-01 06:47:04'),(26,'ORD1759311466267553',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','nguyenhuynhkithuat84tv@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Ba Đình','Hà Nội','bank','pending',29180000.00,30000.00,29210000.00,NULL,'2025-10-01 09:37:46','2025-10-01 09:37:46'),(27,'ORDER-1759373841218',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Đống đa','TP.HCM','bank','pending',1850000.00,50000.00,1900000.00,NULL,'2025-10-02 02:57:21','2025-10-02 02:57:21'),(28,'ORDER-1759374046225',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Trà Cú','TP.HCM','bank','pending',280000.00,50000.00,330000.00,NULL,'2025-10-02 03:00:46','2025-10-02 03:00:46'),(29,'ORDER-1759374393089',6,'Lê Thị Hoa','admin@lagvintage.com','0388843044','Hà Nội','Quận/Huyện','TP.HCM','bank','pending',280000.00,50000.00,330000.00,NULL,'2025-10-02 03:06:33','2025-10-02 03:06:33'),(31,'ORDER-1759374457535',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Quận/Huyện','TP.HCM','bank','pending',16390000.00,50000.00,16440000.00,NULL,'2025-10-02 03:07:37','2025-10-02 03:07:37'),(33,'ORDER-1759374609937',6,'Nguyễn Huỳnh Kỹ Thuật Thuật','nguyenhuynhkithuat84tv@gmail.com','0388853044','39 Định An Trà Cú Trà Vinh','Quận/Huyện','TP.HCM','bank','pending',280000.00,50000.00,330000.00,NULL,'2025-10-02 03:10:09','2025-10-02 03:10:09'),(34,'ORDER-1759375569880',6,'Lê Thị Hoa','hoa123@gmail.com','0388843044','Hà Nội','Quận/Huyện','TP.HCM','bank','cancelled',1290000.00,50000.00,1340000.00,NULL,'2025-10-02 03:26:09','2025-10-02 03:26:39'),(35,'ORDER-1759459698850',6,'Lê Thị Hoa','admin@lagvintage.com','0388843044','Hà Nội','Đống đa','Hà Nội','bank','pending',630000.00,50000.00,680000.00,'Nam','2025-10-03 02:48:18','2025-10-03 02:49:16');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_payment_status` (`payment_status`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'cod',730000.00,NULL,'pending','2025-09-25 03:30:00','2025-10-01 05:41:09','2025-10-01 05:41:09'),(2,18,'cod',660000.00,NULL,'pending','2025-10-01 05:36:52','2025-10-01 05:41:09','2025-10-01 05:41:09'),(3,19,'cod',310000.00,NULL,'pending','2025-10-01 05:43:12','2025-10-01 05:43:12','2025-10-01 05:43:12'),(4,21,'cod',410000.00,NULL,'pending','2025-10-01 05:46:55','2025-10-01 05:46:55','2025-10-01 05:46:55'),(5,22,'cod',380000.00,NULL,'pending','2025-10-01 05:52:34','2025-10-01 05:52:34','2025-10-01 05:52:34'),(6,23,'cod',380000.00,NULL,'pending','2025-10-01 05:53:17','2025-10-01 05:53:17','2025-10-01 05:53:17'),(7,24,'cod',310000.00,NULL,'pending','2025-10-01 05:58:42','2025-10-01 05:58:42','2025-10-01 05:58:42'),(8,25,'cod',310000.00,NULL,'pending','2025-10-01 06:47:04','2025-10-01 06:47:04','2025-10-01 06:47:04'),(9,27,'bank',1900000.00,NULL,'pending','2025-10-02 02:57:21','2025-10-02 02:57:21','2025-10-02 02:57:21'),(10,28,'bank',330000.00,NULL,'pending','2025-10-02 03:00:46','2025-10-02 03:00:46','2025-10-02 03:00:46'),(11,29,'bank',330000.00,NULL,'pending','2025-10-02 03:06:33','2025-10-02 03:06:33','2025-10-02 03:06:33'),(12,31,'bank',16440000.00,NULL,'pending','2025-10-02 03:07:37','2025-10-02 03:07:37','2025-10-02 03:07:37'),(13,33,'bank',330000.00,NULL,'pending','2025-10-02 03:10:09','2025-10-02 03:10:09','2025-10-02 03:10:09'),(14,34,'bank',1340000.00,NULL,'pending','2025-10-02 03:26:09','2025-10-02 03:26:09','2025-10-02 03:26:09'),(15,35,'bank',680000.00,NULL,'pending','2025-10-03 02:48:18','2025-10-03 02:48:18','2025-10-03 02:48:18');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên sản phẩm',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết sản phẩm',
  `price` decimal(10,2) NOT NULL COMMENT 'Giá bán hiện tại',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Link ảnh sản phẩm chính',
  `condition_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Tốt' COMMENT 'Tình trạng: Như mới, Rất tốt, Tốt',
  `size_available` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Các size có sẵn: M, L, XL hoặc 28, 30, 32',
  `stock_quantity` int DEFAULT '1' COMMENT 'Số lượng tồn kho (vintage = ít)',
  `view_count` int DEFAULT '0' COMMENT 'Số lượt xem',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_price` (`price`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sản phẩm quần áo vintage';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,2,'Áo Sơ Mi Vintage Nam','Áo sơ mi vintage phong cách retro, chất liệu cotton cao cấp, thiết kế cổ điển với họa tiết độc đáo.',350000.00,'/images/vintage-cam.jpg','Tốt','M, L, XL',10,0,'2025-09-30 00:58:58','2025-10-02 00:29:29'),(2,2,'Áo Polo Vintage Thể Thao','Áo polo vintage với thiết kế thể thao cổ điển, chất liệu cotton pique thoáng mát.',280000.00,'/images/jean.png','Tốt','M, L, XL',20,0,'2025-09-30 00:58:58','2025-10-02 00:29:29'),(3,2,'Áo Len Vintage Ấm Áp','Áo len vintage với họa tiết đan cổ điển, chất liệu wool cao cấp, giữ ấm tốt.',380000.00,'/images/vintageAMap.jpeg','Tốt','M, L, XL',13,0,'2025-09-30 00:58:58','2025-10-02 00:29:29'),(4,1,'Áo Khoác Denim Cổ Điển','Áo khoác denim phong cách vintage, màu xanh cổ điển với chi tiết rách nhẹ tự nhiên.',450000.00,'/images/aokhoat1.jpg','Rất tốt','S, M, L',8,0,'2025-09-30 00:58:58','2025-10-02 00:29:29'),(5,1,'Áo Bomber Jacket Cổ Điển','Áo bomber jacket vintage với thiết kế cổ điển, chất liệu nylon cao cấp, lót lông ấm áp.',520000.00,'/images/aobomber.jpg','Rất tốt','M, L',6,0,'2025-09-30 00:58:58','2025-10-02 00:29:29'),(6,1,'Blazer Vintage Lịch Lãm','Blazer vintage lịch lãm với thiết kế classic, chất liệu wool blend cao cấp, phù hợp cho công việc.',580000.00,'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg','Như mới','M, L, XL',6,1,'2025-09-30 00:58:58','2025-09-30 04:41:19'),(7,3,'Quần Jean Ống Rộng Vintage','Quần jean ống rộng phong cách vintage, chất liệu denim cao cấp với wash tự nhiên.',380000.00,'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg','Tốt','28, 30, 32',15,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(8,3,'Quần Short Kaki Vintage','Quần short kaki vintage với thiết kế đơn giản, chất liệu cotton twill bền đẹp.',250000.00,'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg','Tốt','30, 32, 34',18,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(9,3,'Quần Túi Hộp Vintage','Quần túi hộp vintage với thiết kế rộng rãi, chất liệu cotton thoáng mát, phù hợp cho mọi hoạt động.',350000.00,'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg','Rất tốt','S, M, L',11,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(10,4,'Váy Hoa Vintage Nhẹ Nhàng','Váy hoa vintage với họa tiết floral cổ điển, chất liệu voan nhẹ, phù hợp cho mùa hè.',320000.00,'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg','Như mới','S, M',12,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(11,4,'Đầm Maxi Vintage Bohemian','Đầm maxi vintage phong cách bohemian với họa tiết ethnic độc đáo, chất liệu viscose mềm mại.',420000.00,'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg','Như mới','S, M, L',9,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(12,4,'Đầm Cocktail Vintage','Đầm cocktail vintage với thiết kế thanh lịch, chất liệu silk cao cấp, phù hợp cho tiệc tối.',480000.00,'https://images.pexels.com/photos/1536622/pexels-photo-1536622.jpeg','Rất tốt','S, M',5,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(13,5,'iPhone 14 Pro Max 256GB','iPhone 14 Pro Max màu Deep Purple, bộ nhớ 256GB, chip A16 Bionic, màn hình Dynamic Island 6.7 inch, camera 48MP, fullbox nguyên seal 99%',26900000.00,'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg','Như mới','256GB',3,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(14,5,'Samsung Galaxy S23 Ultra 512GB','Samsung S23 Ultra 12GB RAM/512GB, màu Phantom Black, chip Snapdragon 8 Gen 2, camera 200MP, bút S Pen, fullbox chính hãng',24500000.00,'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg','Như mới','512GB',2,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(15,5,'iPhone 13 128GB','iPhone 13 màu Midnight, bộ nhớ 128GB, chip A15 Bionic, camera kép 12MP, pin tốt 95%, zin áp suất',15900000.00,'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg','Rất tốt','128GB',5,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(16,5,'Xiaomi 13T Pro 5G 256GB','Xiaomi 13T Pro 12GB/256GB, màu Meadow Green, chip Dimensity 9200+, camera 50MP Leica, sạc nhanh 120W, mới nguyên seal 100%',12990000.00,'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg','Mới','256GB',4,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(17,6,'MacBook Air M2 2023 13 inch','MacBook Air M2 chip 8 nhân, 8GB RAM, 256GB SSD, màn hình Liquid Retina 13.6 inch, màu Space Gray, fullbox seal nguyên hãng',28900000.00,'https://images.pexels.com/photos/18105/pexels-photo.jpg','Mới','256GB SSD',2,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(18,6,'Dell XPS 13 Plus 9320','Dell XPS 13 Plus i7-1360P, 16GB RAM, 512GB SSD, màn hình OLED 3.5K cảm ứng, thiết kế siêu mỏng nhẹ, bảo hành 12 tháng',35900000.00,'https://images.pexels.com/photos/7974/pexels-photo.jpg','Như mới','512GB SSD',1,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(19,6,'Asus ROG Strix G16 2023','Asus ROG Strix G16 i7-13650HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, màn hình 165Hz, RGB Aura Sync, laptop gaming cấu hình khủng',32900000.00,'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg','Rất tốt','512GB SSD',2,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(20,6,'Lenovo ThinkPad X1 Carbon Gen 11','ThinkPad X1 Carbon i7-1355U, 16GB RAM, 512GB SSD, màn hình 2.8K OLED, bàn phím TrackPoint, laptop doanh nhân cao cấp',38900000.00,'https://images.pexels.com/photos/238118/pexels-photo-238118.jpeg','Như mới','512GB SSD',1,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(21,7,'AirPods Pro 2nd Generation','Apple AirPods Pro thế hệ 2, chip H2, chống ồn chủ động ANC 2x mạnh hơn, Adaptive Transparency, âm thanh không gian, fullbox chính hãng VN/A',5990000.00,'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg','Mới','N/A',10,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(22,7,'Sony WH-1000XM5 Wireless','Sony WH-1000XM5 chống ồn cao cấp nhất, 8 micro chống ồn, pin 30 giờ, âm thanh LDAC Hi-Res, màu Midnight Blue, fullbox',8490000.00,'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg','Như mới','N/A',5,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(23,7,'Samsung Galaxy Buds2 Pro','Galaxy Buds2 Pro màu Graphite, chống ồn ANC thông minh, chống nước IPX7, âm thanh 360 độ, sạc không dây, fullbox chính hãng',3990000.00,'https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg','Rất tốt','N/A',8,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(24,8,'Ốp lưng iPhone 14 Pro Max Silicone','Ốp lưng silicone chính hãng Apple cho iPhone 14 Pro Max, bảo vệ toàn diện, chống sốc, chống bám bẩn, nhiều màu sắc',990000.00,'https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg','Mới','iPhone 14 Pro Max',20,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(25,8,'Sạc Nhanh Anker 65W GaN','Sạc Anker 65W công nghệ GaN siêu nhỏ gọn, sạc nhanh laptop/điện thoại/tablet, 2 cổng USB-C + 1 USB-A, bảo hành 18 tháng',1290000.00,'https://images.pexels.com/photos/4792285/pexels-photo-4792285.jpeg','Mới','65W',15,0,'2025-09-30 00:58:58','2025-09-30 00:58:58'),(26,8,'Cáp sạc USB-C to Lightning MFi','Cáp sạc USB-C to Lightning chuẩn MFi chính hãng Apple, dài 2m, sạc nhanh PD 20W cho iPhone, bọc dù chống đứt',490000.00,'https://images.pexels.com/photos/163125/board-printed-circuit-board-computer-electronics-163125.jpeg','Mới','2m',30,1,'2025-09-30 00:58:58','2025-09-30 02:22:20'),(27,2,'Áo Sơ Mi Vintage Nam','Áo sơ mi vintage phong cách retro, chất liệu cotton cao cấp, thiết kế cổ điển với họa tiết độc đáo.',350000.00,'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg','Tốt','M, L, XL',10,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(28,2,'Áo Polo Vintage Thể Thao','Áo polo vintage với thiết kế thể thao cổ điển, chất liệu cotton pique thoáng mát.',280000.00,'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg','Tốt','M, L, XL',20,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(29,2,'Áo Len Vintage Ấm Áp','Áo len vintage với họa tiết đan cổ điển, chất liệu wool cao cấp, giữ ấm tốt.',380000.00,'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg','Tốt','M, L, XL',14,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(30,1,'Áo Khoác Denim Cổ Điển','Áo khoác denim phong cách vintage, màu xanh cổ điển với chi tiết rách nhẹ tự nhiên.',450000.00,'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg','Rất tốt','S, M, L',8,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(31,1,'Áo Bomber Jacket Cổ Điển','Áo bomber jacket vintage với thiết kế cổ điển, chất liệu nylon cao cấp, lót lông ấm áp.',520000.00,'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg','Rất tốt','M, L',6,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(32,1,'Blazer Vintage Lịch Lãm','Blazer vintage lịch lãm với thiết kế classic, chất liệu wool blend cao cấp, phù hợp cho công việc.',580000.00,'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg','Như mới','M, L, XL',7,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(33,3,'Quần Jean Ống Rộng Vintage','Quần jean ống rộng phong cách vintage, chất liệu denim cao cấp với wash tự nhiên.',380000.00,'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg','Tốt','28, 30, 32',15,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(34,3,'Quần Short Kaki Vintage','Quần short kaki vintage với thiết kế đơn giản, chất liệu cotton twill bền đẹp.',250000.00,'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg','Tốt','30, 32, 34',18,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(35,3,'Quần Túi Hộp Vintage','Quần túi hộp vintage với thiết kế rộng rãi, chất liệu cotton thoáng mát, phù hợp cho mọi hoạt động.',350000.00,'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg','Rất tốt','S, M, L',11,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(37,4,'Đầm Maxi Vintage Bohemian','Đầm maxi vintage phong cách bohemian với họa tiết ethnic độc đáo, chất liệu viscose mềm mại.',420000.00,'https://images.pexels.com/photos/1545590/pexels-photo-1545590.jpeg','Như mới','S, M, L',9,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(38,4,'Đầm Cocktail Vintage','Đầm cocktail vintage với thiết kế thanh lịch, chất liệu silk cao cấp, phù hợp cho tiệc tối.',480000.00,'https://images.pexels.com/photos/1536622/pexels-photo-1536622.jpeg','Rất tốt','S, M',5,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(39,5,'iPhone 14 Pro Max 256GB','iPhone 14 Pro Max màu Deep Purple, bộ nhớ 256GB, chip A16 Bionic, màn hình Dynamic Island 6.7 inch, camera 48MP, fullbox nguyên seal 99%',26900000.00,'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg','Như mới','256GB',3,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(40,5,'Samsung Galaxy S23 Ultra 512GB','Samsung S23 Ultra 12GB RAM/512GB, màu Phantom Black, chip Snapdragon 8 Gen 2, camera 200MP, bút S Pen, fullbox chính hãng',24500000.00,'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg','Như mới','512GB',2,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(41,5,'iPhone 13 128GB','iPhone 13 màu Midnight, bộ nhớ 128GB, chip A15 Bionic, camera kép 12MP, pin tốt 95%, zin áp suất',15900000.00,'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg','Rất tốt','128GB',5,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(42,5,'Xiaomi 13T Pro 5G 256GB','Xiaomi 13T Pro 12GB/256GB, màu Meadow Green, chip Dimensity 9200+, camera 50MP Leica, sạc nhanh 120W, mới nguyên seal 100%',12990000.00,'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg','Mới','256GB',4,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(43,6,'MacBook Air M2 2023 13 inch','MacBook Air M2 chip 8 nhân, 8GB RAM, 256GB SSD, màn hình Liquid Retina 13.6 inch, màu Space Gray, fullbox seal nguyên hãng',28900000.00,'https://images.pexels.com/photos/18105/pexels-photo.jpg','Mới','256GB SSD',2,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(44,6,'Dell XPS 13 Plus 9320','Dell XPS 13 Plus i7-1360P, 16GB RAM, 512GB SSD, màn hình OLED 3.5K cảm ứng, thiết kế siêu mỏng nhẹ, bảo hành 12 tháng',35900000.00,'https://images.pexels.com/photos/7974/pexels-photo.jpg','Như mới','512GB SSD',1,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(45,6,'Asus ROG Strix G16 2023','Asus ROG Strix G16 i7-13650HX, RTX 4060 8GB, 16GB RAM, 512GB SSD, màn hình 165Hz, RGB Aura Sync, laptop gaming cấu hình khủng',32900000.00,'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg','Rất tốt','512GB SSD',2,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(46,6,'Lenovo ThinkPad X1 Carbon Gen 11','ThinkPad X1 Carbon i7-1355U, 16GB RAM, 512GB SSD, màn hình 2.8K OLED, bàn phím TrackPoint, laptop doanh nhân cao cấp',38900000.00,'https://images.pexels.com/photos/238118/pexels-photo-238118.jpeg','Như mới','512GB SSD',1,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(47,7,'AirPods Pro 2nd Generation','Apple AirPods Pro thế hệ 2, chip H2, chống ồn chủ động ANC 2x mạnh hơn, Adaptive Transparency, âm thanh không gian, fullbox chính hãng VN/A',5990000.00,'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg','Mới','N/A',10,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(50,8,'Ốp lưng iPhone 14 Pro Max Silicone','Ốp lưng silicone chính hãng Apple cho iPhone 14 Pro Max, bảo vệ toàn diện, chống sốc, chống bám bẩn, nhiều màu sắc',990000.00,'https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg','Mới','iPhone 14 Pro Max',20,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(52,8,'Cáp sạc USB-C to Lightning MFi','Cáp sạc USB-C to Lightning chuẩn MFi chính hãng Apple, dài 2m, sạc nhanh PD 20W cho iPhone, bọc dù chống đứt',490000.00,'https://images.pexels.com/photos/163125/board-printed-circuit-board-computer-electronics-163125.jpeg','Mới','2m',30,0,'2025-09-30 01:04:45','2025-09-30 01:04:45'),(53,2,'Áo Sơ Mi Vintage Nam','Áo sơ mi vintage phong cách retro, chất liệu cotton cao cấp, thiết kế cổ điển với họa tiết độc đáo.',350000.00,'vitageHam1.jpg','Tốt','M, L, XL',8,4,'2025-09-30 01:36:34','2025-10-03 02:48:18'),(54,2,'Áo Polo Vintage Thể Thao','Áo polo vintage với thiết kế thể thao cổ điển, chất liệu cotton pique thoáng mát.',280000.00,'/images/vintage-cam.jpg','Tốt','M, L, XL',0,2,'2025-09-30 01:36:34','2025-10-03 02:48:18'),(55,2,'Áo Len Vintage Ấm Áp','Áo len vintage với họa tiết đan cổ điển, chất liệu wool cao cấp, giữ ấm tốt.',380000.00,'/images/vintageAMap.jpeg','Tốt','M, L, XL',10,1,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(56,1,'Áo Khoác Denim Cổ Điển','Áo khoác denim phong cách vintage, màu xanh cổ điển với chi tiết rách nhẹ tự nhiên.',450000.00,'/images/aokhoat1.jpg','Rất tốt','S, M, L',8,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(57,1,'Áo Bomber Jacket Cổ Điển','Áo bomber jacket vintage với thiết kế cổ điển, chất liệu nylon cao cấp, lót lông ấm áp.',520000.00,'/images/aobomber.jpg','Rất tốt','M, L',6,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(58,1,'Blazer Vintage Lịch Lãm','Blazer vintage lịch lãm với thiết kế classic, chất liệu wool blend cao cấp, phù hợp cho công việc.',580000.00,'/images/blazer.avif','Như mới','M, L, XL',7,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(59,3,'Quần Jean Ống Rộng Vintage','Quần jean ống rộng phong cách vintage, chất liệu denim cao cấp với wash tự nhiên.',380000.00,'/images/jean.png','Tốt','28, 30, 32',15,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(60,3,'Quần Short Kaki Vintage','Quần short kaki vintage với thiết kế đơn giản, chất liệu cotton twill bền đẹp.',250000.00,'/images/short.jpg','Tốt','30, 32, 34',18,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(61,3,'Quần Túi Hộp Vintage','Quần túi hộp vintage với thiết kế rộng rãi, chất liệu cotton thoáng mát, phù hợp cho mọi hoạt động.',350000.00,'/images/quantui.jpg','Rất tốt','S, M, L',11,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(62,4,'Váy Hoa Vintage Nhẹ Nhàng','Váy hoa vintage với họa tiết floral cổ điển, chất liệu voan nhẹ, phù hợp cho mùa hè.',320000.00,'/images/vayhoa.jpg','Như mới','S, M',12,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(63,4,'Đầm Maxi Vintage Bohemian','Đầm maxi vintage phong cách bohemian với họa tiết ethnic độc đáo, chất liệu viscose mềm mại.',420000.00,'/images/dammaxi.jpg','Như mới','S, M, L',9,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(64,4,'Đầm Cocktail Vintage','Đầm cocktail vintage với thiết kế thanh lịch, chất liệu silk cao cấp, phù hợp cho tiệc tối.',480000.00,'/images/damcokteo.webp','Rất tốt','S, M',5,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(65,5,'iPhone 14 Pro Max 256GB','iPhone 14 Pro Max màu Deep Purple, bộ nhớ 256GB, chip A16 Bionic, màn hình Dynamic Island 6.7 inch, camera 48MP, fullbox nguyên seal 99%',26900000.00,'/images/ip14.jpg','Như mới','256GB',3,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(66,5,'Samsung Galaxy S23 Ultra 512GB','Samsung S23 Ultra 12GB RAM/512GB, màu Phantom Black, chip Snapdragon 8 Gen 2, camera 200MP, bút S Pen, fullbox chính hãng',24500000.00,'/images/samsung.png','Như mới','512GB',2,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(67,5,'iPhone 13 128GB','iPhone 13 màu Midnight, bộ nhớ 128GB, chip A15 Bionic, camera kép 12MP, pin tốt 95%, zin áp suất',15900000.00,'/images/ip13.jpg','Rất tốt','128GB',4,0,'2025-09-30 01:36:34','2025-10-02 03:07:37'),(68,5,'Xiaomi 13T Pro 5G 256GB','Xiaomi 13T Pro 12GB/256GB, màu Meadow Green, chip Dimensity 9200+, camera 50MP Leica, sạc nhanh 120W, mới nguyên seal 100%',12990000.00,'/images/xiaomi.jpg','Mới','256GB',4,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(69,6,'MacBook Air M2 2023 13 inch','MacBook Air M2 chip 8 nhân, 8GB RAM, 256GB SSD, màn hình Liquid Retina 13.6 inch, màu Space Gray, fullbox seal nguyên hãng',28900000.00,'/images/macbook.jpg','Mới','256GB SSD',1,1,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(70,6,'Lenovo ThinkPad X1 Carbon Gen 11','ThinkPad X1 Carbon i7-1355U, 16GB RAM, 512GB SSD, màn hình 2.8K OLED, bàn phím TrackPoint, laptop doanh nhân cao cấp',38900000.00,'/images/lenovo.jpg','Như mới','512GB SSD',1,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(71,7,'AirPods Pro 2nd Generation','Apple AirPods Pro thế hệ 2, chip H2, chống ồn chủ động ANC 2x mạnh hơn, Adaptive Transparency, âm thanh không gian, fullbox chính hãng VN/A',5990000.00,'/images/tainghe.jpg','Mới','N/A',9,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(72,7,'Sony WH-1000XM5 Wireless','Sony WH-1000XM5 chống ồn cao cấp nhất, 8 micro chống ồn, pin 30 giờ, âm thanh LDAC Hi-Res, màu Midnight Blue, fullbox',8490000.00,'/images/sony.jpg','Như mới','N/A',5,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(73,8,'Ốp lưng iPhone 14 Pro Max Silicone','Ốp lưng silicone chính hãng Apple cho iPhone 14 Pro Max, bảo vệ toàn diện, chống sốc, chống bám bẩn, nhiều màu sắc',990000.00,'/images/oplungip14.jpg','Mới','iPhone 14 Pro Max',19,0,'2025-09-30 01:36:34','2025-10-02 00:57:30'),(74,8,'Sạc Nhanh Anker 65W GaN','Sạc Anker 65W công nghệ GaN siêu nhỏ gọn, sạc nhanh laptop/điện thoại/tablet, 2 cổng USB-C + 1 USB-A, bảo hành 18 tháng',1290000.00,'/images/sacnhanh.webp','Mới','65W',14,2,'2025-09-30 01:36:34','2025-10-02 03:26:39'),(75,8,'Cáp sạc USB-C to Lightning MFi','Cáp sạc USB-C to Lightning chuẩn MFi chính hãng Apple, dài 2m, sạc nhanh PD 20W cho iPhone, bọc dù chống đứt',490000.00,'/images/typec.jpg','Mới','2m',29,0,'2025-09-30 01:36:34','2025-10-02 03:07:37'),(76,2,'Áo cưới',NULL,3000.00,'vintage-cam.jpg','Tốt',NULL,100,0,'2025-10-01 06:25:57','2025-10-03 02:49:29');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email đăng nhập (unique)',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mật khẩu (cần mã hóa bcrypt)',
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ và tên đầy đủ',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Số điện thoại',
  `role` enum('admin','customer') COLLATE utf8mb4_unicode_ci DEFAULT 'customer' COMMENT 'Vai trò: admin hoặc khách hàng',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active' COMMENT 'Trạng thái tài khoản',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL COMMENT 'Lần đăng nhập gần nhất',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tài khoản đăng nhập';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@lagvintage.com','$2b$10$McUIbSoUfgXcRBVABw/HwuilSfgWc9LKtJGNjyTtVe.C/5/TDjwNG','Administrator','0123456789','admin','active','2025-09-30 00:58:11','2025-10-03 02:49:01'),(2,'user@lagvintage.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Nguyễn Văn A','0987654321','customer','active','2025-09-30 00:58:11',NULL),(3,'nguyenthib@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Nguyễn Thị B','0912345678','customer','active','2025-09-30 00:58:11',NULL),(4,'nguyenhuynhkithaut84tv@gmail.com','$2b$10$wnSvAl7l8Z74HMJyY.76wOYhxgPLeLhPtSLIzPXmJoAoXDd6ZbmFC','Nguyễn Huỳnh Kỹ Thuật','0388853044','customer','active','2025-09-30 02:23:36',NULL),(5,'test_ks73kb@example.com','$2b$10$dA1xGq6JoOniGW7Ss1CnsOa8R6Hyhj.9GWpF0vjjsBNZvDJticwOy','Test User','0123456789','customer','active','2025-09-30 02:24:13','2025-09-30 02:24:17'),(6,'hoa123@gmail.com','$2b$10$8M1l0h69SrWcdVZ9exRYQOAJZ1SKQ4.TqR7xS3p7whQ4/RubzNYYe','Thạch Thị Hoa','0388853044','customer','active','2025-09-30 02:27:01','2025-10-03 02:47:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-03  9:55:59
