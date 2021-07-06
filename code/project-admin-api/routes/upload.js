/*
 * @Author: your name
 * @Date: 2021-05-03 10:56:59
 * @LastEditTime: 2021-05-28 07:38:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-admin-api\routes\upload.js
 */
const express = require('express')
    // 引入路由对象
var router = express.Router();
//是nodejs中处理multipart/form-data数据格式(主要用在上传功能中)的中间件
//文档：https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
//引入multer模块
const multer = require('multer')
    //配置diskStorage来控制文件存储的位置以及文件名字等
var storage = multer.diskStorage({
    //确定图片存储的位置
    destination: function(req, file, cb) {
        cb(null, '../project-admin-api/public/img')
    },
    //确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});
//生成的专门处理上传的一个工具，可以传入storage、limits等配置
var upload = multer({ storage: storage });

//接收上传图片请求的接口
router.post('/', upload.single('file'), function(req, res, next) {
    //图片已经被放入到服务器里,且req也已经被upload中间件给处理好了（加上了file等信息）
    //线上的也就是服务器中的图片的绝对地址
    var url = 'http://localhost:3002/img/' + req.file.filename
    res.json({
        code: 200,
        data: url
    })
});
module.exports = router;