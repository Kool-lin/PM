/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:13
 * @LastEditTime: 2021-08-24 10:29:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\routes\task.js
 */

// 引入Express对象
var express = require('express');
// 引入路由对象
var router = express.Router();
// 引入我们自定义的controller
const TaskController = require('../controllers/task');
// 定义任务管理列表路由，GET请求
router.get('/', TaskController.list);
// 定义单条任务管理路由，GET请求
router.get('/:id', TaskController.info);
// 定义添加任务管理路由，POST请求
router.post('/', TaskController.add);
// 定义修改任务管理路由，PUT请求
router.put('/', TaskController.update);
// 定义修改任务管理路由，PUT请求
router.put('/getTask', TaskController.updateIsbusy);
// 定义删除任务管理路由，DELETE请求
router.delete('/', TaskController.remove);
// 导出路由，供app.js文件调用
module.exports = router;