/*
 * @Author: your name
 * @Date: 2019-04-21 15:46:32
 * @LastEditTime: 2021-05-11 21:02:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \第3章\wish-admin-api\models\wish.js
 */
// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Project = db.define('Project', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    // 项目负责人
    mainUid: { type: Sequelize.STRING(20), allowNull: false },
    // 项目标题
    name: { type: Sequelize.STRING(20), allowNull: false },
    // 项目内容
    content: { type: Sequelize.STRING, allowNull: false },
    // 施工类型
    type: { type: Sequelize.STRING, allowNull: false },
    // 施工地址
    address: { type: Sequelize.STRING(100), allowNull: false },
    //项目开始时间
    startTime: { type: Sequelize.STRING(100), allowNull: false },
    //项目截止时间
    endTime: { type: Sequelize.STRING(100), allowNull: false },
    //项目状态
    status: { type: Sequelize.STRING(100), allowNull: false },
    //项目进度
    finish: { type: Sequelize.STRING(100), allowNull: false }
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'project'
});
// 导出model
module.exports = Project;