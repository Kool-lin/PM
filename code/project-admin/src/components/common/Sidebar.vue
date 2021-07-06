<!--
 * @Author: your name
 * @Date: 2019-04-21 15:20:48
 * @LastEditTime: 2021-05-05 10:34:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \第3章\wish-admin\src\components\common\Sidebar.vue
-->
<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.roles.indexOf(role*1)!=-1">
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页',
                        roles:[1,2,3]
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'project',
                        title: '项目管理',
                        roles:[1]
                    },
                   {
                        icon: 'el-icon-lx-friend',
                        index: 'admin',
                        title: '公司员工管理',
                        roles:[1]
                    },
                    {
                        icon: 'el-icon-s-order',
                        index: 'order',
                        title: '销售签单管理',
                        roles:[1,2]
                    },
                    {
                        icon: 'el-icon-s-tools',
                        index: 'task',
                        title: '施工任务管理',
                        roles:[1]
                    },
                    {
                        icon: 'el-icon-s-claim',
                        index: 'taskView',
                        title: '施工任务查看',
                        roles:[1,2,3]
                    },
                    {
                        icon: 'el-icon-question',
                        index: 'question',
                        title: '施工问题反馈',
                        roles:[1,2,3]
                    }
                ],
                role:localStorage.getItem('role')
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            // bus.$on('collapse', msg => {
            //     this.collapse = msg;
            // })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
