/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:13
 * @LastEditTime: 2021-08-24 10:29:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\routes\team.js
 */

// 引入Express对象
var express = require('express');
// 引入路由对象
var router = express.Router();
// 引入我们自定义的controller
const TeamController = require('../controllers/team');
// 定义团队成员管理列表路由，GET请求
router.get('/', TeamController.list);
// 定义单条团队成员管理路由，GET请求
router.get('/:id', TeamController.info);
// 定义添加团队成员管理路由，POST请求
router.post('/', TeamController.add);
// 定义修改团队成员管理路由，PUT请求
router.put('/', TeamController.update);
// 定义删除团队成员管理路由，DELETE请求
router.delete('/', TeamController.remove);
// 导出路由，供app.js文件调用
module.exports = router;