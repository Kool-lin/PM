/*
 * @Author: your name
 * @Date: 2021-04-10 15:02:41
 * @LastEditTime: 2021-05-03 16:14:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wish-admin-api\models\orderlist.js
 */
// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Orderlist = db.define('Orderlist', {
    // 订单id主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    // 订单标题
    title: { type: Sequelize.STRING(20), allowNull: false },
    // 订单信息
    info: { type: Sequelize.STRING(100), allowNull: false },
    // 订单编号
    tradNo: { type: Sequelize.STRING(100), allowNull: false },
    // 施工地址
    address: { type: Sequelize.STRING(100), allowNull: false },
    // 联系电话
    tel: { type: Sequelize.STRING(100), allowNull: false },
    // 订单凭证
    certificate: { type: Sequelize.STRING(100), allowNull: false },
    // 订单类型
    type: { type: Sequelize.STRING(100), allowNull: false },
    // 限制施工周期
    limitTime: { type: Sequelize.STRING(100), allowNull: false },
    // 签单时间
    signTime: { type: Sequelize.STRING(100), allowNull: false }
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'orderlist'
});
// 导出model
module.exports = Orderlist;