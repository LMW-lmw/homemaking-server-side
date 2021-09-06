/*
 Navicat MySQL Data Transfer

 Source Server         : lmwsql
 Source Server Type    : MySQL
 Source Server Version : 50729
 Source Host           : localhost:3306
 Source Schema         : library

 Target Server Type    : MySQL
 Target Server Version : 50729
 File Encoding         : 65001

 Date: 06/09/2021 19:09:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for booklevel
-- ----------------------------
DROP TABLE IF EXISTS `booklevel`;
CREATE TABLE `booklevel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `floor` varchar(255) NOT NULL COMMENT '楼层',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='书籍所在楼楼层';

-- ----------------------------
-- Table structure for bookrack
-- ----------------------------
DROP TABLE IF EXISTS `bookrack`;
CREATE TABLE `bookrack` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area` varchar(255) NOT NULL COMMENT '所属书架',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='书籍的区域表';

-- ----------------------------
-- Table structure for bookracktier
-- ----------------------------
DROP TABLE IF EXISTS `bookracktier`;
CREATE TABLE `bookracktier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tier` varchar(255) NOT NULL COMMENT '书架的层数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookname` varchar(255) NOT NULL COMMENT '书籍名字',
  `details` varchar(255) NOT NULL COMMENT '书籍介绍',
  `status` int(11) NOT NULL COMMENT '书籍状态',
  `belong` int(11) DEFAULT NULL COMMENT '书籍目前在谁手上',
  `borrowtime` varchar(255) DEFAULT NULL COMMENT '借出时间',
  `backtime` varchar(255) DEFAULT NULL COMMENT '归还时间',
  `picture` varchar(255) DEFAULT NULL COMMENT '书籍图片',
  `qrcode` varchar(255) DEFAULT NULL COMMENT '书籍介绍二维码',
  `floor` int(11) DEFAULT NULL COMMENT '书籍所在楼层',
  `area` int(11) DEFAULT NULL COMMENT '书籍所在书架',
  `tier` int(11) DEFAULT NULL COMMENT '书籍所在书架的层数',
  `booktype` int(11) NOT NULL DEFAULT '0' COMMENT '书籍类型',
  `reserve` int(11) DEFAULT NULL COMMENT '预定人',
  `booknumber` int(11) NOT NULL DEFAULT '1' COMMENT '当前书籍的数量',
  `borrownum` int(11) DEFAULT NULL COMMENT '已被借出的数量',
  `reservenum` int(11) DEFAULT '0' COMMENT '预定数量',
  PRIMARY KEY (`id`),
  KEY `status_key` (`status`),
  KEY `belong_key` (`belong`),
  KEY `floor_key` (`floor`),
  KEY `area_key` (`area`),
  KEY `tier_key` (`tier`),
  KEY `type_key` (`booktype`),
  KEY `reserve_key` (`reserve`),
  CONSTRAINT `area_key` FOREIGN KEY (`area`) REFERENCES `bookrack` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `belong_key` FOREIGN KEY (`belong`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `floor_key` FOREIGN KEY (`floor`) REFERENCES `booklevel` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reserve_key` FOREIGN KEY (`reserve`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `status_key` FOREIGN KEY (`status`) REFERENCES `bookstatus` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tier_key` FOREIGN KEY (`tier`) REFERENCES `bookracktier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `type_key` FOREIGN KEY (`booktype`) REFERENCES `booktype` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for bookstatus
-- ----------------------------
DROP TABLE IF EXISTS `bookstatus`;
CREATE TABLE `bookstatus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL COMMENT '书籍状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for booktype
-- ----------------------------
DROP TABLE IF EXISTS `booktype`;
CREATE TABLE `booktype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL COMMENT '书籍类型',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for history
-- ----------------------------
DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL COMMENT '用户',
  `book` int(11) NOT NULL COMMENT '书籍',
  `borrowtime` varchar(255) DEFAULT NULL COMMENT '借的时间',
  `backtime` varchar(255) DEFAULT NULL COMMENT '归还日期',
  PRIMARY KEY (`id`),
  KEY `borrowuser_key` (`user`),
  KEY `borrowbook_key` (`book`),
  CONSTRAINT `borrowbook_key` FOREIGN KEY (`book`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `borrowuser_key` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for remark
-- ----------------------------
DROP TABLE IF EXISTS `remark`;
CREATE TABLE `remark` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `belong` int(11) NOT NULL COMMENT '点评用户',
  `book` int(255) NOT NULL COMMENT '点评的书籍',
  `content` varchar(255) NOT NULL COMMENT '点评的内容',
  `remarktime` varchar(255) NOT NULL COMMENT '点评时间',
  PRIMARY KEY (`id`),
  KEY `be_key` (`belong`),
  KEY `book_key` (`book`),
  CONSTRAINT `be_key` FOREIGN KEY (`belong`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `book_key` FOREIGN KEY (`book`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for reserve
-- ----------------------------
DROP TABLE IF EXISTS `reserve`;
CREATE TABLE `reserve` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL COMMENT '预定的用户id',
  `bookid` int(11) DEFAULT NULL COMMENT '预定的书籍id',
  `reservetime` varchar(255) DEFAULT NULL COMMENT '预定的时间',
  PRIMARY KEY (`id`),
  KEY `foreignForUser` (`userid`),
  KEY `foreignForBook` (`bookid`),
  CONSTRAINT `foreignForBook` FOREIGN KEY (`bookid`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreignForUser` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for status
-- ----------------------------
DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `dignity` varchar(255) NOT NULL COMMENT '身份',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `identity` int(11) NOT NULL DEFAULT '3' COMMENT '用户身份',
  `email` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL COMMENT '昵称',
  PRIMARY KEY (`id`),
  KEY `status_FOREIGN status_foreign` (`identity`),
  CONSTRAINT `status_FOREIGN status_foreign` FOREIGN KEY (`identity`) REFERENCES `status` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='用户表\n';

SET FOREIGN_KEY_CHECKS = 1;
