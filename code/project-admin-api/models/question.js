/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:13
 * @LastEditTime: 2021-08-24 10:26:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\models\question.js
 */

// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Question = db.define('Question', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    // 所属项目
    project: { type: Sequelize.STRING(20), allowNull: false },
    // 问题内容
    content: { type: Sequelize.STRING, allowNull: false },
    // 问题提出人id
    uid: { type: Sequelize.INTEGER, allowNull: false },
    // 问题提出人
    name: { type: Sequelize.STRING, allowNull: false }
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'question'
});
// 导出model
module.exports = Question;