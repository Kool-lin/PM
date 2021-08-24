/*
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:20:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin\src\main.js
 */

import Vue from './Vue'
import App from './App.vue'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import axios from "axios";

Vue.config.productionTip = false

// Vue.prototype.fetchData = axios.fetchData;


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')