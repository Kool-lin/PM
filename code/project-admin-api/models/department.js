/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:25:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\models\department.js
 */

// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Admin = db.define('Department', {
    // 部门id主键
    dpid: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    // 部门名称
    dpName: { type: Sequelize.STRING(20), allowNull: false },
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'department',
});
// 导出model
module.exports = Admin;