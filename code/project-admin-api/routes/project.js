/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:13
 * @LastEditTime: 2021-08-24 10:28:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\routes\project.js
 */

// 引入Express对象
var express = require('express');
// 引入路由对象
var router = express.Router();
// 引入我们自定义的controller
const ProjectController = require('../controllers/project');
// 定义项目列表路由，GET请求
router.get('/', ProjectController.list);
// 定义单条项目路由，GET请求
router.get('/:id', ProjectController.info);
// 定义添加项目路由，POST请求
router.post('/', ProjectController.add);
// 定义修改项目路由，PUT请求
router.put('/', ProjectController.update);
// 定义删除项目路由，DELETE请求
router.delete('/', ProjectController.remove);
// 导出路由，供app.js文件调用
module.exports = router;