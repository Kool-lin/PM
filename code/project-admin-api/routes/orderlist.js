/*
 * @Author: your name
 * @Date: 2021-04-10 19:20:31
 * @LastEditTime: 2021-05-03 11:00:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-admin-api\routes\orderlist.js
 */
// 引入Express对象
var express = require('express');
// 引入路由对象
var router = express.Router();
// 引入我们自定义的controller
const orderlistController = require('../controllers/orderlist');
// 定义管理员列表路由，GET请求
router.get('/', orderlistController.list);
// 定义单条管理员路由，GET请求
router.get('/:id', orderlistController.info);
// 定义添加管理员路由，POST请求
router.post('/', orderlistController.add);
// 定义修改管理员路由，PUT请求
router.put('/', orderlistController.update);
// 定义删除管理员路由，DELETE请求
router.delete('/', orderlistController.remove);
// 导出路由，供app.js文件调用
module.exports = router;