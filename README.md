# MySQL_Tools

## 1. 简介

用来采集 MySQL 数据库增删改查次数和连接次数的工具，主要使用了开源模块 mysql。

## 2. 采集方法

获取上述次数可以通过在 MySQL 中执行 ` show global status like ${condition} `语句来进行获取，其中 condition 的取值可以为 `com_select`，`com_insert`，`com_update`，`com_delete`，`connections`五种，分别对应于查询、插入、更新、删除和连接次数的信息。

## 3. 采集去向
	
通过 UDP 通信，将信息发送给 master，这里的 master 主要指向 [monitor-server](https://github.com/open-catlog/monitor-server)

## 4. 整体流程

Step 1：启动获取硬件信息的进程，并向 master 发送数据。
	 
Step 2：启动服务端主进程，接收来自 slave 的信息，并存储入数据库中。


