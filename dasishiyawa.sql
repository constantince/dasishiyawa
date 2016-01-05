/*
SQLyog Ultimate v11.24 (32 bit)
MySQL - 5.6.24 : Database - dasishiyawa
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`dasishiyawa` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `dasishiyawa`;

/*Table structure for table `aboutus` */

DROP TABLE IF EXISTS `aboutus`;

CREATE TABLE `aboutus` (
  `id` int(1) NOT NULL COMMENT '公众号介绍',
  `version` varchar(10) DEFAULT NULL COMMENT '版本号',
  `discription` varchar(100) DEFAULT NULL COMMENT '版本介绍',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `aboutus` */

insert  into `aboutus`(`id`,`version`,`discription`,`create_time`) values (1,'V1.25','版本和内容说明...........','2016-01-03 16:32:31');

/*Table structure for table `comment` */

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '评论表id',
  `user` int(4) NOT NULL COMMENT '用户',
  `master` int(4) NOT NULL COMMENT '师傅',
  `star` int(1) DEFAULT NULL COMMENT '评论分数5分最高',
  `content` varchar(40) DEFAULT NULL COMMENT '评论内容',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '评论时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `comment` */

/*Table structure for table `function` */

DROP TABLE IF EXISTS `function`;

CREATE TABLE `function` (
  `id` int(2) NOT NULL AUTO_INCREMENT COMMENT '功能表的id',
  `name` varchar(8) NOT NULL COMMENT '功能名称',
  `status` int(2) DEFAULT NULL COMMENT '开放时间0开发中1已经开通',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '功能开发时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `function` */

/*Table structure for table `infomation` */

DROP TABLE IF EXISTS `infomation`;

CREATE TABLE `infomation` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '表id',
  `phone` varchar(20) DEFAULT NULL COMMENT '用户的电话',
  `nick` varchar(3) NOT NULL COMMENT '用户名',
  `sex` int(1) NOT NULL DEFAULT '0' COMMENT '用户性别 0男，1女',
  `age` int(2) DEFAULT NULL COMMENT '年龄',
  `chat` varchar(20) NOT NULL COMMENT '微信号',
  `birthplace` varchar(20) DEFAULT NULL COMMENT '出生地',
  `liveplace` varchar(20) DEFAULT NULL COMMENT '现居地',
  `profession` varchar(20) DEFAULT NULL COMMENT '职业',
  `speciality` varchar(20) DEFAULT NULL COMMENT '特长',
  `hobby` varchar(20) DEFAULT NULL COMMENT '兴趣爱好',
  `tall` int(3) DEFAULT NULL COMMENT '身高',
  `weight` int(3) DEFAULT NULL COMMENT '体重',
  `socialaccount` varchar(20) DEFAULT NULL COMMENT '其他社交账号',
  `img` varchar(50) DEFAULT NULL COMMENT '图片地址',
  `marriageable` int(2) DEFAULT '0' COMMENT '0:你猜，1单身，2未婚，3已婚，4丧偶，5离异，6同性',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `infomation` */

/*Table structure for table `likes` */

DROP TABLE IF EXISTS `likes`;

CREATE TABLE `likes` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '收到的赞的id',
  `user` int(4) NOT NULL COMMENT '收到赞的用户id',
  `send` int(4) DEFAULT NULL COMMENT '点赞用户的id',
  `sendtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `likes` */

insert  into `likes`(`id`,`user`,`send`,`sendtime`) values (3,1,2,'2015-12-31 16:03:26'),(4,1,2,'2015-12-31 16:03:38'),(5,1,1,'2015-12-31 16:04:07'),(6,1,1,'2015-12-31 16:09:09'),(7,1,1,'2015-12-31 16:11:58'),(8,2,1,'2016-01-04 20:19:17');

/*Table structure for table `master` */

DROP TABLE IF EXISTS `master`;

CREATE TABLE `master` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '师傅id',
  `name` varchar(5) NOT NULL COMMENT '师傅名字',
  `phone` varchar(13) NOT NULL COMMENT '师傅联系电话',
  `experience` int(4) DEFAULT NULL COMMENT '维修经验（年）',
  `age` int(2) DEFAULT NULL COMMENT '年龄',
  `sex` int(1) NOT NULL DEFAULT '0' COMMENT '性别0男1女',
  `skill_id` int(3) DEFAULT NULL COMMENT '所属专业',
  `skill` varchar(20) DEFAULT NULL COMMENT '专业技能',
  `adress` varchar(20) DEFAULT NULL COMMENT '店铺地址',
  `introduction` varchar(50) DEFAULT NULL COMMENT '自我介绍',
  `head_img` varchar(50) DEFAULT NULL COMMENT '头像',
  `area` varchar(20) NOT NULL COMMENT '服务范围',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `master` */

insert  into `master`(`id`,`name`,`phone`,`experience`,`age`,`sex`,`skill_id`,`skill`,`adress`,`introduction`,`head_img`,`area`) values (1,'文明','15222625587',3,45,0,1,'修电视','萍乡湘东五四村','大家好，才是真的好',NULL,'湘东全乎龙');

/*Table structure for table `news` */

DROP TABLE IF EXISTS `news`;

CREATE TABLE `news` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '个人消息id',
  `user` int(4) NOT NULL COMMENT '收到消息的用户',
  `type` int(4) NOT NULL DEFAULT '0' COMMENT '消息类型0系统1用户2师傅3其他',
  `sender` int(4) DEFAULT NULL COMMENT '消息发送人',
  `status` int(4) DEFAULT NULL COMMENT '消息状态0已经读取，1未读取，2已忽略 3已接受',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '发送时间',
  `content` varchar(200) DEFAULT NULL COMMENT '消息内容',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `news` */

insert  into `news`(`id`,`user`,`type`,`sender`,`status`,`create_time`,`content`) values (1,1,1,2,0,'2016-01-03 15:13:44','感谢关注大四时呀哇'),(2,1,1,2,0,'2016-01-03 15:20:28','咯皮球向您打了招呼'),(3,1,1,2,0,'2016-01-03 15:20:52','您的订单已经被师傅处理了'),(4,1,1,1,0,'2016-01-03 15:28:49','您的交友信息已经发布'),(5,1,1,1,0,'2016-01-03 15:29:15','请及时处理未处理消息'),(6,1,1,1,0,'2016-01-03 15:29:36','卖烧烤的向你打了一个招呼和赞'),(7,2,1,1,0,'2016-01-04 20:19:05',NULL);

/*Table structure for table `order` */

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '订单表id',
  `order_number` int(8) NOT NULL COMMENT '订单id',
  `user` int(4) NOT NULL COMMENT '下单人的id',
  `master` int(4) NOT NULL COMMENT '师傅id',
  `start_time` timestamp NULL DEFAULT NULL COMMENT '订单开始处理的时间',
  `end_time` timestamp NULL DEFAULT NULL COMMENT '订单处理结束时间',
  `bookup_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '预约时间',
  `apparatus` varchar(20) DEFAULT NULL COMMENT '设备名称',
  `kind` varchar(10) DEFAULT NULL COMMENT '设备品牌',
  `problem` varchar(50) DEFAULT NULL COMMENT '描述',
  `used_year` int(2) DEFAULT NULL COMMENT '使用年限',
  `type` int(5) NOT NULL DEFAULT '0' COMMENT '订单类型0家电维修',
  `review` varchar(100) DEFAULT NULL COMMENT '评价内容',
  `star` int(1) DEFAULT '1' COMMENT '评论星级',
  `review_time` timestamp NULL DEFAULT NULL COMMENT '评论时间',
  `status` int(1) NOT NULL DEFAULT '0' COMMENT '订单状态0为开始1处理中2已完成3已评价4已取消',
  PRIMARY KEY (`id`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `order` */

insert  into `order`(`id`,`order_number`,`user`,`master`,`start_time`,`end_time`,`bookup_time`,`apparatus`,`kind`,`problem`,`used_year`,`type`,`review`,`star`,`review_time`,`status`) values (1,54447,1,1,NULL,NULL,'2016-01-04 21:44:34','冰箱','康佳','有雪花点',3,0,NULL,1,NULL,0);

/*Table structure for table `relactionshop` */

DROP TABLE IF EXISTS `relactionshop`;

CREATE TABLE `relactionshop` (
  `id` int(8) NOT NULL AUTO_INCREMENT COMMENT '关系表id',
  `sender` int(4) NOT NULL COMMENT '发起人id',
  `user` int(4) NOT NULL COMMENT '收到请求人id',
  `status` int(4) NOT NULL COMMENT '0处理中1接受2拒绝',
  `message` varchar(20) DEFAULT NULL COMMENT '附带消息',
  `create_time` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `relactionshop` */

/*Table structure for table `signin` */

DROP TABLE IF EXISTS `signin`;

CREATE TABLE `signin` (
  `id` int(12) NOT NULL AUTO_INCREMENT COMMENT '签到表id',
  `user` int(4) NOT NULL COMMENT '签到人',
  `num` int(4) NOT NULL DEFAULT '0' COMMENT '签到次数',
  `update_time` timestamp(4) NOT NULL DEFAULT CURRENT_TIMESTAMP(4) ON UPDATE CURRENT_TIMESTAMP(4) COMMENT '最近签到时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '签到时间',
  PRIMARY KEY (`id`,`user`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `signin` */

insert  into `signin`(`id`,`user`,`num`,`update_time`,`create_time`) values (1,1,13,'2016-01-04 21:59:36.3796','2016-01-04 21:59:36');

/*Table structure for table `skill` */

DROP TABLE IF EXISTS `skill`;

CREATE TABLE `skill` (
  `id` int(3) NOT NULL AUTO_INCREMENT COMMENT '专业表id',
  `name` varchar(20) NOT NULL COMMENT '服务行业名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `skill` */

insert  into `skill`(`id`,`name`) values (1,'家电维修');

/*Table structure for table `suggestion` */

DROP TABLE IF EXISTS `suggestion`;

CREATE TABLE `suggestion` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '建议列表',
  `user` int(4) DEFAULT NULL COMMENT '建议人',
  `connection` varchar(40) DEFAULT NULL COMMENT '联系方式',
  `content` varchar(400) DEFAULT NULL COMMENT '建议内容',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '建议生成的时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `suggestion` */

insert  into `suggestion`(`id`,`user`,`connection`,`content`,`create_time`) values (6,1,'undefined','undefined','2016-01-03 16:14:21'),(7,1,'fgdfdfdf','dfdfdfdfdfdf','2016-01-03 16:15:15'),(8,1,'undefined','undefined','2016-01-03 16:15:23'),(9,1,'大幅度反对法','','2016-01-03 16:15:57'),(10,1,'大幅度反对法','','2016-01-03 16:17:19'),(11,1,'怕怕怕怕怕怕','噢噢噢噢','2016-01-03 16:17:34');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '用户所有信息对应的表格id',
  `verify_status` int(2) DEFAULT '0' COMMENT '0待审核，1通过 2失败',
  `varify_err_msg` varchar(20) DEFAULT NULL COMMENT '失败原因',
  `phone` varchar(20) DEFAULT NULL COMMENT '用户的电话',
  `nick` varchar(3) DEFAULT NULL COMMENT '用户名',
  `sex` int(1) DEFAULT '0' COMMENT '用户性别 0男，1女',
  `age` int(2) DEFAULT NULL COMMENT '年龄',
  `identification` int(1) DEFAULT '0' COMMENT '0用户1认证用户2认证师傅',
  `chat` varchar(20) DEFAULT NULL COMMENT '微信号',
  `birthplace` varchar(20) DEFAULT NULL COMMENT '出生地',
  `liveplace` varchar(20) DEFAULT NULL COMMENT '现居地',
  `profession` varchar(20) DEFAULT NULL COMMENT '职业',
  `speciality` varchar(20) DEFAULT NULL COMMENT '特长',
  `hobby` varchar(20) DEFAULT NULL COMMENT '兴趣爱好',
  `tall` int(3) DEFAULT NULL COMMENT '身高',
  `weight` int(3) DEFAULT NULL COMMENT '体重',
  `socialaccount` varchar(20) DEFAULT NULL COMMENT '其他社交账号',
  `marriageable` int(2) DEFAULT '0' COMMENT '0:你猜，1单身，2未婚，3已婚，4丧偶，5离异，6同性',
  `introduction` varchar(50) DEFAULT NULL COMMENT '自我介绍',
  `show_img` varchar(100) DEFAULT NULL COMMENT '交友头像',
  `is_show` int(1) NOT NULL DEFAULT '0' COMMENT '是否开通交友功能',
  `need_hiddenwx` int(1) DEFAULT NULL COMMENT '是否开启打招呼功能0否1是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`verify_status`,`varify_err_msg`,`phone`,`nick`,`sex`,`age`,`identification`,`chat`,`birthplace`,`liveplace`,`profession`,`speciality`,`hobby`,`tall`,`weight`,`socialaccount`,`marriageable`,`introduction`,`show_img`,`is_show`,`need_hiddenwx`) values (1,0,NULL,NULL,'又一村',1,20,0,'1354','江西','深圳','设计师','设计','羽毛球',168,51,'254447898',1,'hello 大家好 我是又一村','./publish/upload/images/0.3608497316017747.png',1,NULL),(2,0,NULL,NULL,'卡皮球',0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,'./publish/upload/images/upload_5a4188265121fcb298efcfd6f58bca69.png',0,NULL);

/*Table structure for table `wechat` */

DROP TABLE IF EXISTS `wechat`;

CREATE TABLE `wechat` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '微信表的id',
  `user` int(4) NOT NULL DEFAULT '1' COMMENT '对应用户表id',
  `subscribe` int(2) DEFAULT NULL COMMENT '是否订阅公众号',
  `openid` varchar(32) DEFAULT NULL COMMENT '用户唯一的openid',
  `nickname` varchar(8) DEFAULT NULL COMMENT '昵称',
  `sex` int(2) DEFAULT NULL COMMENT '性别',
  `city` varchar(4) DEFAULT NULL COMMENT '城市',
  `province` varchar(4) DEFAULT NULL COMMENT '省份',
  `country` varchar(4) DEFAULT NULL COMMENT '国家',
  `headimgurl` varchar(200) DEFAULT NULL COMMENT '头像地址',
  `subscribe_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '订阅公众号时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `wechat` */

insert  into `wechat`(`id`,`user`,`subscribe`,`openid`,`nickname`,`sex`,`city`,`province`,`country`,`headimgurl`,`subscribe_time`) values (1,1,1,'oxHI6t673rqzFvdu2P6OFJPxr8Sw','风也退 云也退',1,'萍乡','江西','中国','http://wx.qlogo.cn/mmopen/ACu4SDpODSA7MlZeggQbcHxulfXBTsc2NibGDn2UQO5EBUD23Uz9fCXktvah4LeN4icXdhNBvGNDIkIf5sKTOzHbVI4TASabzT/0','2015-12-29 20:43:58'),(2,2,1,'oxHI8t673rqzFvdh2P6OFJPxr8St','卖烧烤夫斯基',1,'萍乡','江西','中国','http://wx.qlogo.cn/mmopen/ACu4SDpODSA7MlZeggQbcHxulfXBTsc2NibGDn2UQO5EBUD23Uz9fCXktvah4LeN4icXdhNBvGNDIkIf5sKTOzHbVI4TASabzT/0','2016-01-05 11:09:57');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
