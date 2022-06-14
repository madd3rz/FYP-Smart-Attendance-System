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
INSERT INTO `Admins` VALUES (1,'Admin','admin@gmail.com','2022-06-12 22:15:12','2022-06-12 22:15:12',1);
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
  `RFIDcode` bigint(20) DEFAULT NULL,
  `StudentID` int(11) NOT NULL,
  PRIMARY KEY (`recordID`),
  UNIQUE KEY `recordID` (`recordID`),
  KEY `StudentID` (`StudentID`),
  CONSTRAINT `Attendances_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attendances`
--

LOCK TABLES `Attendances` WRITE;
/*!40000 ALTER TABLE `Attendances` DISABLE KEYS */;
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
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`ParentID`),
  UNIQUE KEY `ParentEmail` (`ParentEmail`),
  KEY `userId` (`userId`),
  CONSTRAINT `Parents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Parents`
--

LOCK TABLES `Parents` WRITE;
/*!40000 ALTER TABLE `Parents` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Teachers`
--

LOCK TABLES `Teachers` WRITE;
/*!40000 ALTER TABLE `Teachers` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@gmail.com','$2a$12$QmzvS7SbYyAv/hHr.Vh5V.4j6zfyDCS8OJqAXcaNtO8ULs9/TWxCa',NULL,NULL,'2022-06-12 22:12:58','2022-06-12 22:12:58'),(2,'Teacher Chan','teacher1@gmail.com','$2a$12$NFoLq61dd63lGBiArGOmU.tThHuLJK0cZEn46ajvwMEV8U9rDf70.',NULL,NULL,'2022-06-14 18:06:13','2022-06-14 18:06:13');
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

-- Dump completed on 2022-06-14 18:08:54
