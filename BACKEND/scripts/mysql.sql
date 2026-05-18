-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: ambulancias
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ambulancia`
--

DROP TABLE IF EXISTS `ambulancia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ambulancia` (
  `idambulancia` int NOT NULL AUTO_INCREMENT,
  `placa` varchar(10) NOT NULL,
  `tipo` varchar(5) NOT NULL,
  `estado` int NOT NULL,
  `sede_id` int DEFAULT NULL,
  PRIMARY KEY (`idambulancia`),
  UNIQUE KEY `placa` (`placa`),
  KEY `ambulancia_sede_id_9c795b1e_fk_sede_idsede` (`sede_id`),
  CONSTRAINT `ambulancia_sede_id_9c795b1e_fk_sede_idsede` FOREIGN KEY (`sede_id`) REFERENCES `sede` (`idsede`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ambulancia`
--

LOCK TABLES `ambulancia` WRITE;
/*!40000 ALTER TABLE `ambulancia` DISABLE KEYS */;
INSERT INTO `ambulancia` VALUES (24,'BCH001','MAT',1,83),(25,'B508061','BAT',1,83),(26,'B508062','BAT',1,83),(27,'B508063','BAT',1,83),(28,'B508064','BAT',1,83),(29,'B508065','BAT',1,83),(30,'B508066','BAT',1,83),(31,'B508067','BAT',1,83),(32,'B508068','BAT',1,83),(33,'B508069','BAT',1,83),(34,'B508070','BAT',1,83),(35,'B508071','BAT',1,83),(36,'B508072','BAT',1,83),(37,'B508073','BAT',1,83),(38,'B508074','BAT',1,83),(39,'B508075','BAT',1,83),(40,'B508076','BAT',1,83),(41,'B508077','BAT',1,83),(42,'B508078','BAT',1,83),(43,'B508079','BAT',1,83),(44,'B508080','BAT',1,83);
/*!40000 ALTER TABLE `ambulancia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Token',6,'add_token'),(22,'Can change Token',6,'change_token'),(23,'Can delete Token',6,'delete_token'),(24,'Can view Token',6,'view_token'),(25,'Can add Token',7,'add_tokenproxy'),(26,'Can change Token',7,'change_tokenproxy'),(27,'Can delete Token',7,'delete_tokenproxy'),(28,'Can view Token',7,'view_tokenproxy'),(29,'Can add cargo',8,'add_cargo'),(30,'Can change cargo',8,'change_cargo'),(31,'Can delete cargo',8,'delete_cargo'),(32,'Can view cargo',8,'view_cargo'),(33,'Can add niveles',9,'add_niveles'),(34,'Can change niveles',9,'change_niveles'),(35,'Can delete niveles',9,'delete_niveles'),(36,'Can view niveles',9,'view_niveles'),(37,'Can add regional',10,'add_regional'),(38,'Can change regional',10,'change_regional'),(39,'Can delete regional',10,'delete_regional'),(40,'Can view regional',10,'view_regional'),(41,'Can add colaboradores',11,'add_colaboradores'),(42,'Can change colaboradores',11,'change_colaboradores'),(43,'Can delete colaboradores',11,'delete_colaboradores'),(44,'Can view colaboradores',11,'view_colaboradores'),(45,'Can add usuarios',12,'add_usuarios'),(46,'Can change usuarios',12,'change_usuarios'),(47,'Can delete usuarios',12,'delete_usuarios'),(48,'Can view usuarios',12,'view_usuarios'),(49,'Can add organizacion',13,'add_organizacion'),(50,'Can change organizacion',13,'change_organizacion'),(51,'Can delete organizacion',13,'delete_organizacion'),(52,'Can view organizacion',13,'view_organizacion'),(53,'Can add registro soat',14,'add_registrosoat'),(54,'Can change registro soat',14,'change_registrosoat'),(55,'Can delete registro soat',14,'delete_registrosoat'),(56,'Can view registro soat',14,'view_registrosoat'),(57,'Can add sede',15,'add_sede'),(58,'Can change sede',15,'change_sede'),(59,'Can delete sede',15,'delete_sede'),(60,'Can view sede',15,'view_sede'),(61,'Can add ambulancia',16,'add_ambulancia'),(62,'Can change ambulancia',16,'change_ambulancia'),(63,'Can delete ambulancia',16,'delete_ambulancia'),(64,'Can view ambulancia',16,'view_ambulancia');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_usuarios_id` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargo` (
  `idcargo` int NOT NULL AUTO_INCREMENT,
  `nombrecargo` varchar(30) NOT NULL,
  `estadocargo` int NOT NULL,
  PRIMARY KEY (`idcargo`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargo`
--

LOCK TABLES `cargo` WRITE;
/*!40000 ALTER TABLE `cargo` DISABLE KEYS */;
INSERT INTO `cargo` VALUES (48,'BenchCargo',1),(49,'BenchCargoUpd',1),(50,'BenchCargo508121',1),(51,'BenchCargo508122',1),(52,'BenchCargo508123',1),(53,'BenchCargo508124',1),(54,'BenchCargo508125',1),(55,'BenchCargo508126',1),(56,'BenchCargo508127',1),(57,'BenchCargo508128',1),(58,'BenchCargo508129',1),(59,'BenchCargo508130',1),(60,'BenchCargo508131',1),(61,'BenchCargo508132',1),(62,'BenchCargo508133',1),(63,'BenchCargo508134',1),(64,'BenchCargo508135',1),(65,'BenchCargo508136',1),(66,'BenchCargo508137',1),(67,'BenchCargo508138',1),(68,'BenchCargo508139',1),(69,'BenchCargo508140',1);
/*!40000 ALTER TABLE `cargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colaboradores`
--

DROP TABLE IF EXISTS `colaboradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colaboradores` (
  `idcolaborador` int NOT NULL AUTO_INCREMENT,
  `cccolaborador` varchar(30) NOT NULL,
  `nombrecolaborador` varchar(30) NOT NULL,
  `apellidocolaborador` varchar(30) NOT NULL,
  `correocolaborador` varchar(50) DEFAULT NULL,
  `telefocolaborador` varchar(20) DEFAULT NULL,
  `estadocolaborador` int NOT NULL,
  `cargocolaborador_id` int DEFAULT NULL,
  `nivelcolaborador_id` int DEFAULT NULL,
  `regionalcolab_id` int DEFAULT NULL,
  `sede_id` int DEFAULT NULL,
  PRIMARY KEY (`idcolaborador`),
  UNIQUE KEY `cccolaborador` (`cccolaborador`),
  KEY `colaboradores_cargocolaborador_id_2107b64f_fk_cargo_idcargo` (`cargocolaborador_id`),
  KEY `colaboradores_nivelcolaborador_id_2385eea6_fk_niveles_idnivel` (`nivelcolaborador_id`),
  KEY `colaboradores_regionalcolab_id_e437f3b7_fk_regional_idregional` (`regionalcolab_id`),
  KEY `colaboradores_sede_id_1e6a98c8_fk_sede_idsede` (`sede_id`),
  CONSTRAINT `colaboradores_cargocolaborador_id_2107b64f_fk_cargo_idcargo` FOREIGN KEY (`cargocolaborador_id`) REFERENCES `cargo` (`idcargo`),
  CONSTRAINT `colaboradores_nivelcolaborador_id_2385eea6_fk_niveles_idnivel` FOREIGN KEY (`nivelcolaborador_id`) REFERENCES `niveles` (`idnivel`),
  CONSTRAINT `colaboradores_regionalcolab_id_e437f3b7_fk_regional_idregional` FOREIGN KEY (`regionalcolab_id`) REFERENCES `regional` (`idregional`),
  CONSTRAINT `colaboradores_sede_id_1e6a98c8_fk_sede_idsede` FOREIGN KEY (`sede_id`) REFERENCES `sede` (`idsede`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colaboradores`
--

LOCK TABLES `colaboradores` WRITE;
/*!40000 ALTER TABLE `colaboradores` DISABLE KEYS */;
INSERT INTO `colaboradores` VALUES (3,'00000001','Bench','User','bench@bench.com','3000000000',1,48,48,48,NULL);
/*!40000 ALTER TABLE `colaboradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_usuarios_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_usuarios_id` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(16,'ambulancias','ambulancia'),(13,'ambulancias','organizacion'),(14,'ambulancias','registrosoat'),(15,'ambulancias','sede'),(3,'auth','group'),(2,'auth','permission'),(6,'authtoken','token'),(7,'authtoken','tokenproxy'),(4,'contenttypes','contenttype'),(5,'sessions','session'),(8,'usuarios','cargo'),(11,'usuarios','colaboradores'),(9,'usuarios','niveles'),(10,'usuarios','regional'),(12,'usuarios','usuarios');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'usuarios','0001_initial','2026-04-07 16:47:15.362492'),(2,'contenttypes','0001_initial','2026-04-07 16:47:15.412434'),(3,'admin','0001_initial','2026-04-07 16:47:15.589117'),(4,'admin','0002_logentry_remove_auto_add','2026-04-07 16:47:15.595799'),(5,'admin','0003_logentry_add_action_flag_choices','2026-04-07 16:47:15.600506'),(6,'contenttypes','0002_remove_content_type_name','2026-04-07 16:47:15.709748'),(7,'auth','0001_initial','2026-04-07 16:47:16.015610'),(8,'auth','0002_alter_permission_name_max_length','2026-04-07 16:47:16.080511'),(9,'auth','0003_alter_user_email_max_length','2026-04-07 16:47:16.085478'),(10,'auth','0004_alter_user_username_opts','2026-04-07 16:47:16.090805'),(11,'auth','0005_alter_user_last_login_null','2026-04-07 16:47:16.095683'),(12,'auth','0006_require_contenttypes_0002','2026-04-07 16:47:16.098250'),(13,'auth','0007_alter_validators_add_error_messages','2026-04-07 16:47:16.103205'),(14,'auth','0008_alter_user_username_max_length','2026-04-07 16:47:16.107124'),(15,'auth','0009_alter_user_last_name_max_length','2026-04-07 16:47:16.111581'),(16,'auth','0010_alter_group_name_max_length','2026-04-07 16:47:16.124754'),(17,'auth','0011_update_proxy_permissions','2026-04-07 16:47:16.155193'),(18,'auth','0012_alter_user_first_name_max_length','2026-04-07 16:47:16.160896'),(19,'authtoken','0001_initial','2026-04-07 16:47:16.253780'),(20,'authtoken','0002_auto_20160226_1747','2026-04-07 16:47:16.264443'),(21,'authtoken','0003_tokenproxy','2026-04-07 16:47:16.268179'),(22,'authtoken','0004_alter_tokenproxy_options','2026-04-07 16:47:16.272800'),(23,'sessions','0001_initial','2026-04-07 16:47:16.314348'),(24,'ambulancias','0001_initial','2026-04-07 20:28:28.538433'),(25,'usuarios','0002_colaboradores_sede','2026-04-07 20:28:28.662797');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `niveles`
--

DROP TABLE IF EXISTS `niveles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `niveles` (
  `idnivel` int NOT NULL AUTO_INCREMENT,
  `nombrenivel` varchar(50) NOT NULL,
  `estadonivel` int NOT NULL,
  `prom` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idnivel`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `niveles`
--

LOCK TABLES `niveles` WRITE;
/*!40000 ALTER TABLE `niveles` DISABLE KEYS */;
INSERT INTO `niveles` VALUES (48,'BenchNivel',1,NULL),(49,'BenchNivelUpd',1,NULL),(50,'BenchNivel508161',1,NULL),(51,'BenchNivel508162',1,NULL),(52,'BenchNivel508163',1,NULL),(53,'BenchNivel508164',1,NULL),(54,'BenchNivel508165',1,NULL),(55,'BenchNivel508166',1,NULL),(56,'BenchNivel508167',1,NULL),(57,'BenchNivel508168',1,NULL),(58,'BenchNivel508169',1,NULL),(59,'BenchNivel508170',1,NULL),(60,'BenchNivel508171',1,NULL),(61,'BenchNivel508172',1,NULL),(62,'BenchNivel508173',1,NULL),(63,'BenchNivel508174',1,NULL),(64,'BenchNivel508175',1,NULL),(65,'BenchNivel508176',1,NULL),(66,'BenchNivel508177',1,NULL),(67,'BenchNivel508178',1,NULL),(68,'BenchNivel508179',1,NULL),(69,'BenchNivel508180',1,NULL);
/*!40000 ALTER TABLE `niveles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizacion`
--

DROP TABLE IF EXISTS `organizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizacion` (
  `idorganizacion` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `nit` varchar(20) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `representante` varchar(100) DEFAULT NULL,
  `descripcion` longtext,
  PRIMARY KEY (`idorganizacion`),
  UNIQUE KEY `nit` (`nit`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizacion`
--

LOCK TABLES `organizacion` WRITE;
/*!40000 ALTER TABLE `organizacion` DISABLE KEYS */;
INSERT INTO `organizacion` VALUES (1,'Org Bench','900-1',NULL,NULL,NULL,NULL,NULL),(4,'Org Test Benchmark','999-9',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `organizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regional`
--

DROP TABLE IF EXISTS `regional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regional` (
  `idregional` int NOT NULL AUTO_INCREMENT,
  `nombreregional` varchar(30) NOT NULL,
  `estadoregional` int NOT NULL,
  PRIMARY KEY (`idregional`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regional`
--

LOCK TABLES `regional` WRITE;
/*!40000 ALTER TABLE `regional` DISABLE KEYS */;
INSERT INTO `regional` VALUES (48,'BenchRegional',1),(49,'BenchRegionUpd',1),(50,'BenchRegion508201',1),(51,'BenchRegion508202',1),(52,'BenchRegion508203',1),(53,'BenchRegion508204',1),(54,'BenchRegion508205',1),(55,'BenchRegion508206',1),(56,'BenchRegion508207',1),(57,'BenchRegion508208',1),(58,'BenchRegion508209',1),(59,'BenchRegion508210',1),(60,'BenchRegion508211',1),(61,'BenchRegion508212',1),(62,'BenchRegion508213',1),(63,'BenchRegion508214',1),(64,'BenchRegion508215',1),(65,'BenchRegion508216',1),(66,'BenchRegion508217',1),(67,'BenchRegion508218',1),(68,'BenchRegion508219',1),(69,'BenchRegion508220',1);
/*!40000 ALTER TABLE `regional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_soat`
--

DROP TABLE IF EXISTS `registro_soat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_soat` (
  `idregistro` int NOT NULL AUTO_INCREMENT,
  `placa_ambulancia` varchar(10) NOT NULL,
  `tipo_ambulancia` varchar(50) NOT NULL,
  `tripulante1` varchar(100) NOT NULL,
  `tripulante2` varchar(100) NOT NULL,
  `nombre_paciente` varchar(100) NOT NULL,
  `documento_paciente` varchar(30) NOT NULL,
  `tipo_documento` varchar(3) NOT NULL,
  `edad_paciente` varchar(10) NOT NULL,
  `genero_paciente` varchar(1) NOT NULL,
  `direccion_paciente` varchar(200) NOT NULL,
  `telefono_paciente` varchar(20) NOT NULL,
  `fecha_siniestro` date DEFAULT NULL,
  `hora_siniestro` time(6) DEFAULT NULL,
  `lugar_siniestro` varchar(200) NOT NULL,
  `tipo_vehiculo` varchar(50) NOT NULL,
  `placa_vehiculo` varchar(10) NOT NULL,
  `poliza` varchar(50) NOT NULL,
  `aseguradora` varchar(100) NOT NULL,
  `descripcion_siniestro` longtext NOT NULL,
  `departamento` varchar(50) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `sede_prestadora` varchar(100) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `ambulancia_id` int DEFAULT NULL,
  `registrado_por_id` int DEFAULT NULL,
  `sede_id` int DEFAULT NULL,
  PRIMARY KEY (`idregistro`),
  KEY `registro_soat_ambulancia_id_095e6328_fk_ambulancia_idambulancia` (`ambulancia_id`),
  KEY `registro_soat_registrado_por_id_55dab3fe_fk_usuarios_id` (`registrado_por_id`),
  KEY `registro_soat_sede_id_5383d9ed_fk_sede_idsede` (`sede_id`),
  CONSTRAINT `registro_soat_ambulancia_id_095e6328_fk_ambulancia_idambulancia` FOREIGN KEY (`ambulancia_id`) REFERENCES `ambulancia` (`idambulancia`),
  CONSTRAINT `registro_soat_registrado_por_id_55dab3fe_fk_usuarios_id` FOREIGN KEY (`registrado_por_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `registro_soat_sede_id_5383d9ed_fk_sede_idsede` FOREIGN KEY (`sede_id`) REFERENCES `sede` (`idsede`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_soat`
--

LOCK TABLES `registro_soat` WRITE;
/*!40000 ALTER TABLE `registro_soat` DISABLE KEYS */;
INSERT INTO `registro_soat` VALUES (1,'BCH001','BAT','','','Actualizado','07269347','CC','','','','',NULL,NULL,'','','','','','','','','','2026-04-28 20:14:29.347219',NULL,NULL,NULL),(2,'BCH001','BAT','','','Actualizado','07326707','CC','','','','',NULL,NULL,'','','','','','','','','','2026-04-28 20:15:26.707839',NULL,NULL,NULL),(3,'BCH001','BAT','','','Actualizado','07354524','CC','','','','',NULL,NULL,'','','','','','','','','','2026-04-28 20:15:54.524696',NULL,NULL,NULL),(4,'BCH001','BAT','','','Actualizado','07423129','CC','','','','',NULL,NULL,'','','','','','','','','','2026-04-28 20:17:03.129638',NULL,NULL,NULL),(5,'BCH001','BAT','','','Actualizado','07508667','CC','','','','',NULL,NULL,'','','','','','','','','','2026-04-28 20:18:28.667910',24,4,83);
/*!40000 ALTER TABLE `registro_soat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sede`
--

DROP TABLE IF EXISTS `sede`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sede` (
  `idsede` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL,
  `activa` tinyint(1) NOT NULL,
  PRIMARY KEY (`idsede`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sede`
--

LOCK TABLES `sede` WRITE;
/*!40000 ALTER TABLE `sede` DISABLE KEYS */;
INSERT INTO `sede` VALUES (2,'S Bench POST','X','300','A',1),(3,'S Bench POST','X','300','A',1),(4,'S Bench POST','X','300','A',1),(5,'S Bench POST','X','300','A',1),(6,'S Bench POST','X','300','A',1),(7,'S Bench POST','X','300','A',1),(8,'S Bench POST','X','300','A',1),(9,'S Bench POST','X','300','A',1),(10,'S Bench POST','X','300','A',1),(11,'S Bench POST','X','300','A',1),(12,'S Bench POST','X','300','A',1),(13,'S Bench POST','X','300','A',1),(14,'S Bench POST','X','300','A',1),(15,'S Bench POST','X','300','A',1),(16,'S Bench POST','X','300','A',1),(17,'S Bench POST','X','300','A',1),(18,'S Bench POST','X','300','A',1),(19,'S Bench POST','X','300','A',1),(20,'S Bench POST','X','300','A',1),(21,'S Bench POST','X','300','A',1),(22,'S Bench POST','X','300','A',1),(23,'S Bench POST','X','300','A',1),(24,'S Bench POST','X','300','A',1),(25,'S Bench POST','X','300','A',1),(26,'S Bench POST','X','300','A',1),(27,'S Bench POST','X','300','A',1),(28,'S Bench POST','X','300','A',1),(29,'S Bench POST','X','300','A',1),(30,'S Bench POST','X','300','A',1),(31,'S Bench POST','X','300','A',1),(32,'S Bench POST','X','300','A',1),(33,'S Bench POST','X','300','A',1),(34,'S Bench POST','X','300','A',1),(35,'S Bench POST','X','300','A',1),(36,'S Bench POST','X','300','A',1),(37,'S Bench POST','X','300','A',1),(38,'S Bench POST','X','300','A',1),(39,'S Bench POST','X','300','A',1),(40,'S Bench POST','X','300','A',1),(41,'S Bench POST','X','300','A',1),(42,'S Bench POST','X','300','A',1),(43,'S Bench POST','X','300','A',1),(44,'S Bench POST','X','300','A',1),(45,'S Bench POST','X','300','A',1),(46,'S Bench POST','X','300','A',1),(47,'S Bench POST','X','300','A',1),(48,'S Bench POST','X','300','A',1),(49,'S Bench POST','X','300','A',1),(50,'S Bench POST','X','300','A',1),(51,'S Bench POST','X','300','A',1),(52,'S Bench POST','X','300','A',1),(53,'S Bench POST','X','300','A',1),(54,'S Bench POST','X','300','A',1),(55,'S Bench POST','X','300','A',1),(56,'S Bench POST','X','300','A',1),(57,'S Bench POST','X','300','A',1),(58,'S Bench POST','X','300','A',1),(59,'S Bench POST','X','300','A',1),(60,'S Bench POST','X','300','A',1),(61,'S Bench POST','X','300','A',1),(63,'S Bench POST','X','300','A',1),(64,'S Bench POST','X','300','A',1),(65,'S Bench POST','X','300','A',1),(66,'S Bench POST','X','300','A',1),(67,'S Bench POST','X','300','A',1),(68,'S Bench POST','X','300','A',1),(69,'S Bench POST','X','300','A',1),(70,'S Bench POST','X','300','A',1),(71,'S Bench POST','X','300','A',1),(72,'S Bench POST','X','300','A',1),(73,'S Bench POST','X','300','A',1),(74,'S Bench POST','X','300','A',1),(75,'S Bench POST','X','300','A',1),(76,'S Bench POST','X','300','A',1),(77,'S Bench POST','X','300','A',1),(78,'S Bench POST','X','300','A',1),(79,'S Bench POST','X','300','A',1),(80,'S Bench POST','X','300','A',1),(81,'S Bench POST','X','300','A',1),(82,'S Bench POST','X','300','A',1),(83,'Sede Benchmark','Av. Benchmark 100','3001000000','Nuevo',1),(84,'S Bench POST','X','300','A',1),(85,'S Bench POST','X','300','A',1),(86,'S Bench POST','X','300','A',1),(87,'S Bench POST','X','300','A',1),(88,'S Bench POST','X','300','A',1),(89,'S Bench POST','X','300','A',1),(90,'S Bench POST','X','300','A',1),(91,'S Bench POST','X','300','A',1),(92,'S Bench POST','X','300','A',1),(93,'S Bench POST','X','300','A',1),(94,'S Bench POST','X','300','A',1),(95,'S Bench POST','X','300','A',1),(96,'S Bench POST','X','300','A',1),(97,'S Bench POST','X','300','A',1),(98,'S Bench POST','X','300','A',1),(99,'S Bench POST','X','300','A',1),(100,'S Bench POST','X','300','A',1),(101,'S Bench POST','X','300','A',1),(102,'S Bench POST','X','300','A',1),(103,'S Bench POST','X','300','A',1);
/*!40000 ALTER TABLE `sede` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `last_login` datetime(6) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(30) DEFAULT NULL,
  `password` varchar(500) NOT NULL,
  `estadousuario` int NOT NULL,
  `tipousuario` int NOT NULL,
  `idcolaboradoru_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `usuarios_idcolaboradoru_id_e5c23ccf_fk_colaborad` (`idcolaboradoru_id`),
  CONSTRAINT `usuarios_idcolaboradoru_id_e5c23ccf_fk_colaborad` FOREIGN KEY (`idcolaboradoru_id`) REFERENCES `colaboradores` (`idcolaborador`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (NULL,4,'bench_usr','pbkdf2_sha256$1000000$4fc9GfrVBf7zLaf1DgNYD8$tuQL4peJwYLL/NpZ8MF69rKcCuymmxYdNh0pcapc6rI=',1,4,3);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ambulancias'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-18 17:09:56
