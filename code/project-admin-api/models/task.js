/*
 * @Author: your name
 * @Date: 2021-04-13 21:57:57
 * @LastEditTime: 2021-05-11 21:20:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wish-admin-api\models\task.js
 */
// 引入Sequelize模块
const Sequelize = require('sequelize');
// 引入数据库实例
const db = require('../db');
// 定义model
const Task = db.define('Task', {
    // 主键
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    // 任务标题
    title: { type: Sequelize.STRING(20), allowNull: false },
    // 任务内容
    info: { type: Sequelize.STRING, allowNull: false },
    // 任务执行人
    executor: { type: Sequelize.STRING, allowNull: false },
    // 所属项目
    project: { type: Sequelize.STRING(20), allowNull: false },
    //uid
    uid: { type: Sequelize.STRING, allowNull: false },
    //任务开始时间
    startTime: { type: Sequelize.STRING(100), allowNull: false },
    //任务截止时间
    endTime: { type: Sequelize.STRING(100), allowNull: false },
    //任务状态
    todo: { type: Sequelize.STRING(100), allowNull: false },
    //任务进度
    finish: { type: Sequelize.STRING(100), allowNull: false }
}, {
    // 是否支持驼峰
    underscored: true,
    // MySQL数据库表名
    tableName: 'task'
});
// 导出model
module.exports = Task;