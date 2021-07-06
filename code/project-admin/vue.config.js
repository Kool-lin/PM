/*
 * @Author: your name
 * @Date: 2019-04-21 15:19:33
 * @LastEditTime: 2021-03-02 20:45:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \第3章\wish-admin\vue.config.js
 */
module.exports = {
    publicPath: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3002',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            },
            '/ms': {
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    }
}