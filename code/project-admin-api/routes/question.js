/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:13
 * @LastEditTime: 2021-08-24 10:29:05
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\routes\question.js
 */

// 引入Express对象
var express = require('express');
// 引入路由对象
var router = express.Router();
// 引入我们自定义的controller
const QuestionController = require('../controllers/question');
// 定义问题反馈列表路由，GET请求
router.get('/', QuestionController.list);
// 定义单条问题反馈路由，GET请求
router.get('/:id', QuestionController.info);
// 定义添加问题反馈路由，POST请求
router.post('/', QuestionController.add);
// 定义修改问题反馈路由，PUT请求
router.put('/', QuestionController.update);
// 定义删除问题反馈路由，DELETE请求
router.delete('/', QuestionController.remove);
// 导出路由，供app.js文件调用
module.exports = router;