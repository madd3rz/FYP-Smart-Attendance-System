-- MySQL dump 10.13  Distrib 5.7.38, for Linux (x86_64)
--
-- Host: localhost    Database: SAS
-- ------------------------------------------------------
-- Server version	5.7.38-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admins` (
  `AdminID` int(11) NOT NULL AUTO_INCREMENT,
  `Adminname` varchar(255) NOT NULL,
  `AdminEmail` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`AdminID`),
  UNIQUE KEY `admins__admin_email` (`AdminEmail`),
  KEY `userId` (`userId`),
  CONSTRAINT `Admins_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
INSERT INTO `Admins` VALUES (1,'admin1','admin@admin.com','2022-03-16 11:22:08','2022-03-16 11:22:08',1);
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Attendances`
--

DROP TABLE IF EXISTS `Attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Attendances` (
  `recordID` int(11) NOT NULL AUTO_INCREMENT,
  `checkInDateTime` datetime NOT NULL,
  `tempReading` float(4,2) NOT NULL,
  `RFIDcode` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL,
  PRIMARY KEY (`recordID`),
  UNIQUE KEY `recordID` (`recordID`),
  KEY `StudentID` (`StudentID`),
  CONSTRAINT `Attendances_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attendances`
--

LOCK TABLES `Attendances` WRITE;
/*!40000 ALTER TABLE `Attendances` DISABLE KEYS */;
INSERT INTO `Attendances` VALUES (1,'2022-05-18 03:14:36',32.30,22220000,1010),(2,'2022-05-18 03:23:51',36.30,22220000,1011),(3,'2022-05-18 12:32:24',36.30,22220000,1011),(4,'2022-05-21 03:14:36',38.30,22220000,1010),(5,'2022-05-22 03:14:36',38.30,22220000,1011),(6,'2022-05-24 03:14:36',38.30,22220000,1011),(7,'2022-05-24 00:14:36',37.50,22220000,1011),(8,'2022-05-23 00:14:36',37.50,22220000,1011),(9,'2022-05-24 17:30:23',38.50,22220000,1011),(10,'2022-05-25 13:14:36',38.30,22220000,1011),(11,'2022-05-26 00:00:00',29.61,1943477128,1010),(12,'2022-05-26 01:21:00',29.35,1943477128,1010),(13,'2022-05-26 01:43:42',29.19,1943477128,1010);
/*!40000 ALTER TABLE `Attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Parents`
--

DROP TABLE IF EXISTS `Parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Parents` (
  `ParentID` int(11) NOT NULL AUTO_INCREMENT,
  `ParentName` varchar(255) NOT NULL,
  `ParentEmail` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`ParentID`),
  UNIQUE KEY `ParentEmail` (`ParentEmail`),
  KEY `userId` (`userId`),
  CONSTRAINT `Parents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parents`
--

LOCK TABLES `Parents` WRITE;
/*!40000 ALTER TABLE `Parents` DISABLE KEYS */;
INSERT INTO `Parents` VALUES (1,'parent123','parent1@sas.com','2022-03-18 16:27:15','2022-05-13 18:50:42',3),(2,'parent2','parent2@sas.com','2022-05-19 13:21:20','2022-05-19 13:21:20',4),(3,'parent3','parent3@sas.com','2022-05-25 12:59:23','2022-05-25 12:59:23',5),(4,'parent4','parent4@sas.com','2022-05-25 13:02:02','2022-05-25 13:02:02',16),(5,'parent123','parent123@sas.com','2022-05-25 13:03:03','2022-05-25 13:03:03',19),(6,'John','john@email.com','2022-05-25 13:07:19','2022-05-25 13:07:19',22),(7,'parent6','parent6@email.com','2022-05-25 13:54:39','2022-05-25 13:54:39',34),(8,'parent10','parent10@email.com','2022-05-25 15:34:42','2022-05-25 15:34:42',38),(9,'12345','12345@email.com','2022-05-25 15:42:33','2022-05-25 15:42:33',39),(10,'1234567','1234567@email.com','2022-05-25 15:48:16','2022-05-25 15:48:16',41);
/*!40000 ALTER TABLE `Parents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Students`
--

DROP TABLE IF EXISTS `Students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Students` (
  `StudentID` int(11) NOT NULL,
  `StudentName` varchar(255) NOT NULL,
  `StudentClass` varchar(255) NOT NULL,
  `StudentEmail` varchar(255) DEFAULT NULL,
  `RFIDcode` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ParentID` int(11) NOT NULL,
  PRIMARY KEY (`StudentID`),
  UNIQUE KEY `StudentID` (`StudentID`),
  UNIQUE KEY `RFIDcode` (`RFIDcode`),
  KEY `ParentID` (`ParentID`),
  CONSTRAINT `Students_ibfk_1` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Students`
--

LOCK TABLES `Students` WRITE;
/*!40000 ALTER TABLE `Students` DISABLE KEYS */;
INSERT INTO `Students` VALUES (1010,'student123','1','johndoe@example.com','22220000','2022-05-11 17:44:33','2022-05-14 16:12:10',1),(1011,'student2','2','johndoe@example.com','22221111','2022-05-17 19:20:15','2022-05-17 19:20:15',2);
/*!40000 ALTER TABLE `Students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Teachers`
--

DROP TABLE IF EXISTS `Teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Teachers` (
  `TeacherID` int(11) NOT NULL AUTO_INCREMENT,
  `Teachername` varchar(255) NOT NULL,
  `TeacherEmail` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`TeacherID`),
  KEY `userId` (`userId`),
  CONSTRAINT `Teachers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Teachers`
--

LOCK TABLES `Teachers` WRITE;
/*!40000 ALTER TABLE `Teachers` DISABLE KEYS */;
INSERT INTO `Teachers` VALUES (1,'Teacher1','teacher1@sas.com','2022-05-21 16:45:19','2022-05-21 16:45:19',2);
/*!40000 ALTER TABLE `Teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`sid`),
  KEY `userId` (`userId`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('D4irBKHTfzr_cZr2X8U9gJyzbSJmRbQO','2022-06-13 03:52:32','{\"cookie\":{\"originalMaxAge\":21600000,\"expires\":\"2022-06-12T19:52:32.437Z\",\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"aWZl8_pi_Mf0npGuOxwi4Px3\",\"flash\":{},\"isLoggedIn\":true,\"user\":{\"id\":1,\"fullName\":\"admin\",\"email\":\"admin@admin.com\",\"password\":\"$2a$12$9wqsF.HpfbYZWtOgcRV1s.ra3gfcri4Bar78cd6snZivinHmO9mhG\",\"resetToken\":null,\"resetTokenExpiry\":null,\"createdAt\":\"2022-03-02T02:58:18.000Z\",\"updatedAt\":\"2022-03-02T02:58:18.000Z\"},\"isAdmin\":true}','2022-06-12 21:52:18','2022-06-12 21:52:32',NULL);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@admin.com','$2a$12$9wqsF.HpfbYZWtOgcRV1s.ra3gfcri4Bar78cd6snZivinHmO9mhG',NULL,NULL,'2022-03-02 10:58:18','2022-03-02 10:58:18'),(2,'Teacher1','teacher1@sas.com','$2a$12$uAD2Ago3IYPHlEMiqghanuKOkX0dZfKKdgPATkb/BZsaNDLvRh5UW',NULL,NULL,'2022-03-16 01:55:40','2022-03-16 01:55:40'),(3,'parent1','parent1@sas.com','$2a$12$HOKBZ/UKg9eVS8lJX2DCFufQjSQN.kmyUYhaEMmB1z8ZMCornPlXK',NULL,NULL,'2022-03-18 08:27:55','2022-03-18 08:27:55'),(4,'johndoe','parent2@sas.com','$2a$12$yQEs7GaPg9/X/iSNYb6jhup.xYddVF18z63MYeCG4wvfCsJaqKPFG',NULL,NULL,'2022-05-19 13:21:20','2022-05-19 13:21:20'),(5,'parent3','parent3@sas.com','$2a$12$z906rz60eXJlAh53FIFzJu2BXFJjEE6onCCqyo1pjJ.CwZVnNFWjK',NULL,NULL,'2022-05-25 12:38:36','2022-05-25 12:38:36'),(16,'parent4','parent4@sas.com','$2a$12$SoZjrYck7OUZIEizPyiNiO.JRERhj.42F5VFIOKAIBggLC7MPzue6',NULL,NULL,'2022-05-25 13:00:36','2022-05-25 13:00:36'),(18,'parent5','parent5@sas.com','$2a$12$DVc.oSa/FhcLTRhyh.pMGuUBmD6dnJcv39USF64tv3oKW.2LAGANW',NULL,NULL,'2022-05-25 13:02:17','2022-05-25 13:02:17'),(19,'parent123','parent123@sas.com','$2a$12$AIggvzCT5An2jtGYIOqkPO7mVnxJOi/98/wVPhjYb23TwHUWcW6M2',NULL,NULL,'2022-05-25 13:02:49','2022-05-25 13:02:49'),(21,'Ali','ali@email.com','$2a$12$8kBf2RFrbXDgfP/qdS9iQ.2rb8Gu1FWhUNLwlntiDNuVV1Rxc8JsS',NULL,NULL,'2022-05-25 13:04:01','2022-05-25 13:04:01'),(22,'John','john@email.com','$2a$12$HcG6R6ypBrML/.zvDisDp.I3OnAihBWri0lc/YU6Doxv2./VPsOvC',NULL,NULL,'2022-05-25 13:06:38','2022-05-25 13:06:38'),(24,'doe','doe@email.com','$2a$12$dRMto8SC335ioukiaGKOiuDoAj1zh4yf1Yd547lF4rPGxZIJf8MYO',NULL,NULL,'2022-05-25 13:07:47','2022-05-25 13:07:47'),(26,'john2','john2@email.com','$2a$12$4md7J3R3eQ.6ZgXkbhG4TevPrRo7OgHN/KygKpp56DMHF6uIt4GTK',NULL,NULL,'2022-05-25 13:10:26','2022-05-25 13:10:26'),(28,'john3','john3@email.com','$2a$12$vA.VZ17Uwph0Te/Nv0Iyo.2ufU.BefGra3x7MS65mQ3TOLtsMffCO',NULL,NULL,'2022-05-25 13:11:46','2022-05-25 13:11:46'),(29,'john5','john5@email.com','$2a$12$HsgEMW7WZi.ToFXC5V2zCuS7nLzOVEwS5cgXDFlnAsP6IKrsEm66i',NULL,NULL,'2022-05-25 13:16:35','2022-05-25 13:16:35'),(30,'john10','john10@email.com','$2a$12$VpXA6w5TCYND7TollKWjUOsQaCH3KinUxZCU1YdrMHbbBU1cpNBVy',NULL,NULL,'2022-05-25 13:40:34','2022-05-25 13:40:34'),(31,'john123','john123@email.com','$2a$12$6T4K8pnFmKEm3v.rrcz/tuMl6EJI//pBQbq60NItlNeHaVc1mgjK.',NULL,NULL,'2022-05-25 13:41:14','2022-05-25 13:41:14'),(32,'parent123321','parent123321@email.com','$2a$12$5vZppSIkPa5tP42ZhZ/QDuyMuHx1AnS9HR9REM/4mXpsgutdawmra',NULL,NULL,'2022-05-25 13:43:40','2022-05-25 13:43:40'),(33,'parent321','parent321@email.com','$2a$12$Qo1TgftaSuQUo6wYzRri/eK3PBLMHFKRO3jo3u7TTqVACZRq6vIWm',NULL,NULL,'2022-05-25 13:52:01','2022-05-25 13:52:01'),(34,'parent6','parent6@email.com','$2a$12$K39mka1CsxPpUIqZ6Dm1ouy4YJYQWepp0ME8bAuqs6o2pVcBTpb12',NULL,NULL,'2022-05-25 13:54:20','2022-05-25 13:54:20'),(36,'parent7','parent7@email.com','$2a$12$.pPokkBkFcQRzc8muRBtRuZ./VTfthD43VwTgHQSWLCjDR93Jx7sa',NULL,NULL,'2022-05-25 13:56:02','2022-05-25 13:56:02'),(38,'parent10','parent10@email.com','$2a$12$WUxU8O4bbgfpu.B0G/vFfu0hIu4iBHsQoZMAE9Fyqi14632GRzLQ6',NULL,NULL,'2022-05-25 15:34:42','2022-05-25 15:34:42'),(39,'12345','12345@email.com','$2a$12$A3uYDcC6AO5Lp7jqaioQU.5Yb980BHO9v31ufkMK0UjCig5AsEJei',NULL,NULL,'2022-05-25 15:42:33','2022-05-25 15:42:33'),(40,'123456','123456@email.com','$2a$12$UsB0Pows/ZDXe5CV9OkMGO7i57vyrbci8o84BVfC6S66cUXVZhqHK',NULL,NULL,'2022-05-25 15:44:23','2022-05-25 15:44:23'),(41,'1234567','1234567@email.com','$2a$12$jd.spKmVjzwVy0oa6xU2A.YD6rcKcPANihFSkVma6bRXhhn5IRgde',NULL,NULL,'2022-05-25 15:48:16','2022-05-25 15:48:16');
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

-- Dump completed on 2022-06-12 21:59:32
