/*
Navicat MySQL Data Transfer

Source Server         : 47.95.252.97
Source Server Version : 50527
Source Host           : 47.95.252.97:1992
Source Database       : graduation

Target Server Type    : MYSQL
Target Server Version : 50527
File Encoding         : 65001

Date: 2018-04-22 21:22:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adminuser` varchar(255) NOT NULL COMMENT '管理员名',
  `adminpass` varchar(255) NOT NULL COMMENT '管理员密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for details
-- ----------------------------
DROP TABLE IF EXISTS `details`;
CREATE TABLE `details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `url_flag` varchar(255) DEFAULT NULL,
  `contents` longtext,
  `time` varchar(255) DEFAULT NULL,
  `comments` longtext,
  `authors` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1920 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for mobileinfo
-- ----------------------------
DROP TABLE IF EXISTS `mobileinfo`;
CREATE TABLE `mobileinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `href` varchar(255) DEFAULT NULL,
  `href_flag` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `point` longtext,
  `star` varchar(255) DEFAULT NULL,
  `network` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2921 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for params
-- ----------------------------
DROP TABLE IF EXISTS `params`;
CREATE TABLE `params` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `href_flag` varchar(255) DEFAULT NULL,
  `videoTitle` varchar(255) DEFAULT NULL,
  `videoMo` varchar(255) DEFAULT NULL,
  `videoP` longtext,
  `paramDate` varchar(255) DEFAULT NULL,
  `paramSize` varchar(255) DEFAULT NULL,
  `paramRam` varchar(255) DEFAULT NULL,
  `paramRom` varchar(255) DEFAULT NULL,
  `paramStr` longtext,
  `evaluate` longtext,
  `comments` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1730 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for topics
-- ----------------------------
DROP TABLE IF EXISTS `topics`;
CREATE TABLE `topics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `t` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `href` varchar(255) DEFAULT NULL,
  `href_flag` varchar(255) DEFAULT NULL,
  `imgsrc` varchar(255) DEFAULT NULL,
  `info` text,
  `date` varchar(255) DEFAULT NULL,
  `s` varchar(255) DEFAULT NULL,
  `pinglun` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1864 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '用户密码',
  `ques` varchar(255) DEFAULT NULL COMMENT '问题',
  `ans` varchar(255) DEFAULT NULL COMMENT '答案',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `birth` varchar(255) DEFAULT NULL COMMENT '生日',
  `ps` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=539 DEFAULT CHARSET=utf8;
