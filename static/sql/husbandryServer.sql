/*
 Navicat MySQL Data Transfer

 Source Server         : lmwsql
 Source Server Type    : MySQL
 Source Server Version : 50729
 Source Host           : localhost:3306
 Source Schema         : cms

 Target Server Type    : MySQL
 Target Server Version : 50729
 File Encoding         : 65001

 Date: 26/12/2021 23:57:35
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for areas
-- ----------------------------
DROP TABLE IF EXISTS `areas`;
CREATE TABLE `areas` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `areaid` char(6) NOT NULL COMMENT '区县编码',
  `area` varchar(40) NOT NULL COMMENT '区县名称',
  `cityid` char(6) NOT NULL COMMENT '所属城市编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3145 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '行业名称',
  `createAt` varchar(255) DEFAULT NULL COMMENT '创建时间',
  `updateAt` varchar(255) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cities
-- ----------------------------
DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cityid` char(6) NOT NULL COMMENT '城市编码',
  `city` varchar(40) NOT NULL COMMENT '城市名称',
  `provinceid` char(6) NOT NULL COMMENT '所属省份编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=346 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '部门名称',
  `leader` varchar(255) DEFAULT NULL COMMENT '部门负责人',
  `createAt` varchar(255) DEFAULT NULL COMMENT '创建时间',
  `updateAt` varchar(255) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for maprole
-- ----------------------------
DROP TABLE IF EXISTS `maprole`;
CREATE TABLE `maprole` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) DEFAULT NULL,
  `menuid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_key` (`roleid`),
  KEY `menu_key` (`menuid`)
) ENGINE=InnoDB AUTO_INCREMENT=404 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '菜单名称',
  `type` int(10) DEFAULT NULL COMMENT '几级菜单',
  `url` varchar(255) DEFAULT NULL COMMENT '菜单对应前端的url',
  `parentId` int(10) DEFAULT NULL COMMENT '父级菜单id',
  `children` varchar(255) DEFAULT NULL COMMENT '子菜单',
  `permission` varchar(255) DEFAULT NULL COMMENT '操作',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `createAt` varchar(255) DEFAULT NULL COMMENT '创建时间',
  `updateAt` varchar(255) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY `second_key` (`parentId`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for provinces
-- ----------------------------
DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provinceid` int(11) NOT NULL,
  `province` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '权限名称',
  `intro` varchar(255) DEFAULT NULL COMMENT '权限类型',
  `createAt` varchar(255) DEFAULT NULL COMMENT '创建时间',
  `updateAt` varchar(255) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `enable` int(10) DEFAULT '1' COMMENT '是否启用',
  `cellphone` varchar(255) DEFAULT NULL COMMENT '电话号码',
  `createAt` varchar(255) DEFAULT NULL COMMENT '创建时间',
  `updateAt` varchar(255) DEFAULT NULL COMMENT '修改时间',
  `departmentId` int(10) DEFAULT NULL COMMENT '部门',
  `roleId` int(10) DEFAULT NULL COMMENT '权限',
  `realname` varchar(255) DEFAULT NULL COMMENT '真实姓名',
  PRIMARY KEY (`id`),
  KEY `userrole_key` (`roleId`),
  KEY `department_key` (`departmentId`),
  CONSTRAINT `department_key` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `userrole_key` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for workers
-- ----------------------------
DROP TABLE IF EXISTS `workers`;
CREATE TABLE `workers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `province` int(10) DEFAULT NULL COMMENT '省',
  `city` int(10) DEFAULT NULL COMMENT '市',
  `area` int(10) DEFAULT NULL COMMENT '区',
  `type` int(10) DEFAULT NULL COMMENT '行业类型',
  `telephone` varchar(255) DEFAULT NULL COMMENT '电话',
  `remuneration` varchar(255) DEFAULT NULL COMMENT '薪酬',
  `count` int(11) DEFAULT NULL COMMENT '服务次数',
  `createAt` varchar(255) DEFAULT NULL COMMENT '创建时间',
  `updateAt` varchar(255) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `category_tyoe` (`type`),
  CONSTRAINT `category_tyoe` FOREIGN KEY (`type`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
