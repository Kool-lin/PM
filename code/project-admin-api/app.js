/*
 * @Author: your name
 * @Date: 2021-04-21 15:42:52
 * @LastEditTime: 2021-05-31 14:07:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-admin-api\app.js
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// 引入项目管理模块路由文件
var projectRouter = require('./routes/project');
// 引入管理员管理模块路由文件
var adminRouter = require('./routes/admin');
// 引入销售签单模块路由文件
var orderlistRouter = require('./routes/orderlist');
// 引入施工任务模块路由文件
var taskRouter = require('./routes/task');
// 引入施工任务模块路由文件
var questionRouter = require('./routes/question');
// 引入团队成员管理模块路由文件
var teamRouter = require('./routes/team');
// 引入Token验证中间件
const verifyMiddleware = require('./routes/middleware/verify');
// 引入图片上传路由
const uploadRouter = require('./routes/upload');

var app = express();


app.set('views', path.join(__dirname, 'views'));

//用art-template引擎替换默认的jade引擎
//app.set(‘view engine’, ‘jade’);
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// 配置许愿管理模块路由path，添加Token验证中间件
app.use('/project', verifyMiddleware.verifyToken, projectRouter);
// 配置管理员管理模块路由path，添加Token验证中间件
app.use('/admin', verifyMiddleware.verifyToken, adminRouter);
// 配置销售签单模块路由path，添加Token验证中间件
app.use('/orderlist', verifyMiddleware.verifyToken, orderlistRouter);
// 配置施工任务模块路由path，添加Token验证中间件
app.use('/task', verifyMiddleware.verifyToken, taskRouter);
// 配置团队成员管理模块路由path，添加Token验证中间件
app.use('/team', verifyMiddleware.verifyToken, teamRouter);
// 配置问题反馈模块路由path，添加Token验证中间件
app.use('/question', verifyMiddleware.verifyToken, questionRouter);
// 配置图片上传模块路由path，添加Token验证中间件
app.use('/upload', uploadRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err.message);
    // render the error page
    res.status(err.status || 500);
    res.json({
        code: err.status || 500
    });
});


module.exports = app;