/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:13
 * @LastEditTime: 2021-08-24 10:27:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\models\team.js
 */

// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Team = db.define('Team', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    // 任务标题
    lid: { type: Sequelize.INTEGER, allowNull: false },
    // 任务内容
    pid: { type: Sequelize.INTEGER, allowNull: false },
    // 任务执行人
    projectName: { type: Sequelize.STRING, allowNull: false },
    // 所属项目
    member: { type: Sequelize.STRING, allowNull: false },
    //uid
    leader: { type: Sequelize.STRING, allowNull: false },
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'team'
});
// 导出model
module.exports = Team;