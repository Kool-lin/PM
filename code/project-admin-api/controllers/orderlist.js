/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:23:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin-api\controllers\orderlist.js
 */

// 引入公共方法
const Common = require('./common');
// 引入orderlistlist表的model
const orderlistModel = require('../models/orderlist');
// 引入常量
const Constant = require('../constant/constant');
// 引入dateformat包
const dateFormat = require('dateformat');
// 引入Op运算符
const { Op } = require("sequelize");
// 配置对象
let exportObj = {
    list,
    info,
    add,
    update,
    remove
};
// 导出对象，供其它模块调用
module.exports = exportObj;

// 获取许销售签单方法
function list(req, res) {
    // 定义一个返回对象
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams(req.query, ['page', 'rows'], cb);
        },
        // 查询方法，依赖校验参数方法
        query: ['checkParams', (results, cb) => {
            // 根据前端提交参数计算SQL语句中需要的offset，即从多少条开始查询
            let offset = req.query.rows * (req.query.page - 1) || 0;
            // 根据前端提交参数计算SQL语句中需要的limit，即查询多少条
            let limit = parseInt(req.query.rows) || 20;
            // 设定一个查询条件对象
            let whereCondition = {};
            // 如果查询姓名存在，查询对象增加姓名
            if (req.query.title) {
                whereCondition.title = {
                    [Op.substring]: req.query.title
                };
            }
            // 通过offset和limit使用wish的model去数据库中查询，并按照创建时间排序
            orderlistModel
                .findAndCountAll({
                    where: whereCondition,
                    offset: offset,
                    limit: limit,
                    order: [
                        ['created_at', 'DESC']
                    ],
                })
                .then(function(result) {
                    // 查询结果处理
                    // 定义一个空数组list，用来存放最终结果
                    let list = [];
                    // 遍历SQL查询出来的结果，处理后装入list
                    result.rows.forEach((v, i) => {
                        let obj = {
                            id: v.id,
                            title: v.title,
                            info: v.info,
                            tradNo: v.tradNo,
                            certificate: v.certificate,
                            type: v.type,
                            tel: v.tel,
                            address: v.address,
                            limitTime: v.limitTime,
                            signTime: dateFormat(v.signTime, 'yyyy-mm-dd'),
                            createdAt: dateFormat(v.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        };
                        list.push(obj);
                    });
                    // 给返回结果赋值，包括列表和总条数
                    resObj.data = {
                        list,
                        count: result.count
                    };
                    // 继续后续操作
                    cb(null);
                })
                .catch(function(err) {
                    // 错误处理
                    // 打印错误日志
                    console.log(err);
                    // 传递错误信息到async最终方法
                    cb(Constant.DEFAULT_ERROR);
                });

        }]
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)

}

// 获取单条销售签单方法
function info(req, res) {
    // 定义一个返回对象
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams(req.params, ['id'], cb);
        },
        // 查询方法，依赖校验参数方法
        query: ['checkParams', (results, cb) => {
            // 使用wish的model中的方法查询
            orderlistModel
                .findByPk(req.params.id)
                .then(function(result) {
                    // 查询结果处理
                    // 如果查询到结果
                    if (result) {
                        // 将查询到的结果给返回对象赋值
                        resObj.data = {
                            id: result.id,
                            title: result.title,
                            info: result.info,
                            tradNo: result.tradNo,
                            certificate: result.certificate,
                            type: result.type,
                            tel: result.tel,
                            address: result.address,
                            limitTime: result.limitTime,
                            signTime: dateFormat(result.signTime, 'yyyy-mm-dd'),
                            createdAt: dateFormat(result.createdAt, 'yyyy-mm-dd HH:MM:ss')
                        };
                        // 继续后续操作
                        cb(null);
                    } else {
                        // 查询失败，传递错误信息到async最终方法
                        cb(Constant.WISH_NOT_EXSIT);
                    }
                })
                .catch(function(err) {
                    // 错误处理
                    // 打印错误日志
                    console.log(err);
                    // 传递错误信息到async最终方法
                    cb(Constant.DEFAULT_ERROR);
                });

        }]
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)

}

// 添加签单方法
function add(req, res) {
    // 定义一个返回对象
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams(req.body, ['title', 'info', 'signTime', 'certificate', 'type', 'tel', 'address', 'limitTime', 'signTime'], cb);
        },
        // 添加方法，依赖校验参数方法
        add: ['checkParams', (results, cb) => {
            // 使用wish的model中的方法插入到数据库
            orderlistModel
                .create({
                    title: req.body.title,
                    info: req.body.info,
                    tradNo: Common.randomNumber(),
                    certificate: req.body.certificate,
                    type: req.body.type,
                    tel: req.body.tel,
                    address: req.body.address,
                    limitTime: req.body.limitTime,
                    signTime: req.body.signTime
                })
                .then(function(result) {
                    // 插入结果处理
                    // 继续后续操作
                    cb(null);
                })
                .catch(function(err) {
                    // 错误处理
                    // 打印错误日志
                    console.log(err);
                    // 传递错误信息到async最终方法
                    cb(Constant.DEFAULT_ERROR);
                });
        }]
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}

// 修改签单方法
function update(req, res) {
    // 定义一个返回对象
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams(req.body, ['id', 'title', 'info', 'signTime'], cb);
        },
        // 更新方法，依赖校验参数方法
        update: cb => {
            // 使用wish的model中的方法更新
            orderlistModel
                .update({
                    title: req.body.title,
                    info: req.body.info,
                    tradNo: req.body.tradNo,
                    certificate: req.body.certificate,
                    type: req.body.type,
                    tel: req.body.tel,
                    address: req.body.address,
                    limitTime: req.body.limitTime,
                    signTime: req.body.signTime
                }, {
                    where: {
                        id: req.body.id
                    }
                })
                .then(function(result) {
                    // 更新结果处理
                    if (result[0]) {
                        // 如果更新成功
                        // 继续后续操作
                        cb(null);
                    } else {
                        // 更新失败，传递错误信息到async最终方法
                        cb(Constant.WISH_NOT_EXSIT);
                    }
                })
                .catch(function(err) {
                    // 错误处理
                    // 打印错误日志
                    console.log(err);
                    // 传递错误信息到async最终方法
                    cb(Constant.DEFAULT_ERROR);
                });
        }
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}

// 删除销售签单方法
function remove(req, res) {
    // 定义一个返回对象
    const resObj = Common.clone(Constant.DEFAULT_SUCCESS);
    // 定义一个async任务
    let tasks = {
        // 校验参数方法
        checkParams: (cb) => {
            // 调用公共方法中的校验参数方法，成功继续后面操作，失败则传递错误信息到async最终方法
            Common.checkParams(req.body, ['id'], cb);
        },
        // 删除方法，依赖校验参数方法
        remove: cb => {
            // 使用wish的model中的方法更新
            orderlistModel
                .destroy({
                    where: {
                        id: req.body.id
                    }
                })
                .then(function(result) {
                    // 删除结果处理
                    if (result) {
                        // 如果删除成功
                        // 继续后续操作
                        cb(null);
                    } else {
                        // 删除失败，传递错误信息到async最终方法
                        cb(Constant.WISH_NOT_EXSIT);
                    }
                })
                .catch(function(err) {
                    // 错误处理
                    // 打印错误日志
                    console.log(err);
                    // 传递错误信息到async最终方法
                    cb(Constant.DEFAULT_ERROR);
                });
        }
    };
    // 执行公共方法中的autoFn方法，返回数据
    Common.autoFn(tasks, res, resObj)
}