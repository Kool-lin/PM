<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col>
        <el-card shadow="hover" class="mgb20" style="height: 252px">
          <div class="user-info">
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div v-if="role == 1">项目经理</div>
              <div v-if="role == 2">销售经理</div>
              <div v-if="role == 3">企业员工</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：<span>{{ lastLoginAt }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary" plain @click="chooseType(1)">明装类型项目</el-button>
      <el-button type="primary" plain @click="chooseType(2)">暗装类型项目</el-button>
      <el-button type="primary" plain @click="chooseType(3)">其他类型项目</el-button>
      <el-button type="primary" plain @click="chooseType(4)">所有类型项目</el-button>
    </el-row>
    <el-row justify="space-around">    
  <el-col :span="4" v-for="(o, index) in tableData" :key="index" :offset="index%5 == 0 ? 0 : 1">
    <el-card :body-style="{ padding: '0px' }" shadow="hover" style="margin-top:10px">
      <img src="../../assets/项目图标.png" class="image">
      <div style="padding: 14px;">
        <span>{{o.name}}</span>
        <div class="bottom clearfix">
          <time class="time">{{o.startTime}}</time>
          <el-button type="text" class="button" @click="handleEdit(index);getname(o.mainUid)">查看详情</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
</el-row>
<!-- 弹出框 -->
<el-dialog title="项目详情" :visible.sync="editVisible" width="500px">
      <el-form ref="form" :model="editForm" label-width="220px">
        <el-form-item label="项目名称:">
          <span>{{ editForm.name }}</span>
        </el-form-item>
        <el-form-item label="项目简介:">
          <span>{{ editForm.content }}</span>
        </el-form-item>
        <el-form-item label="项目负责人:">
          <span>{{ username }}</span>
        </el-form-item>
        <el-form-item label="开始时间:">
          <span>{{ editForm.startTime }}</span>
        </el-form-item>
        <el-form-item label="截止时间:">
          <span>{{ editForm.endTime }}</span>
        </el-form-item>
        <el-form-item label="项目施工地址:">
          <span>{{ editForm.address }}</span>
        </el-form-item>
        <el-form-item label="施工类型:">
          <el-tag
            v-if="editForm.type == 1"
            type="danger"
            effect="dark"
            >明装</el-tag>
          <el-tag v-if="editForm.type == 2" effect="dark">暗装</el-tag>
          <el-tag v-if="editForm.type == 3" effect="dark">其他</el-tag>
        </el-form-item>
        <el-form-item label="项目进度:">
          <el-tag v-if="editForm.finish == '已结项'">{{
            editForm.finish
          }}</el-tag>
          <el-tag v-if="editForm.finish == '进行中'" type="success">{{
            editForm.finish
          }}</el-tag>
          <el-tag v-if="editForm.finish == '未开始'" type="warning">{{
            editForm.finish
          }}</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      name: localStorage.getItem("adminUsername"),
      role: localStorage.getItem("role"),
      lastLoginAt: localStorage.getItem("adminLastLoginAt"),
      tableData:[],
      userData:[],
      username:'',
      editVisible:false,
      editForm:{}
    };
  },
  created() {
    this.getData();
  },
  computed: {
    // role() {
    //     return this.name === 'admin' ? '超级管理员' : '普通用户';
    // }
  },

  methods: {
      getData() {
      this.fetchData({
        method: "get",
        url: "/api/project",
        params: {
          page: 1,
          rows: 100,
          name: '',
        },
        success: (data) => {
          this.tableData = data.list;
        },
      });
      this.fetchData({
        method: "get",
        url: "/api/admin",
        params: {
          page: 1,
          rows: 100,
          name: '',
        },
        success: (data) => {
          this.userData = data.list;
        },
      });
    },
    handleEdit(index) {
      this.idx = index;
      const item = this.tableData[index];
      this.editForm = {
        name: item.name,
        mainUid:item.mainUid,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        finish: item.finish,
        type: item.type,
        address:item.address,
        content: item.content,
      };
      this.editVisible = true;
    },
    chooseType(type){
      if(type === 4){
        this.getData();
      }else{
        this.getData();
        setTimeout(() =>{let res = [];
        for(let i = 0; i<this.tableData.length;i++){
          if(this.tableData[i].type === type){
            res.push(this.tableData[i]);
          }
        }
        console.log(res);
        this.tableData = res;
        console.log(this.tableData)},500)
      }
    },
    getname(id){
        for(let i = 0;i<this.tableData.length;i++){
            if(this.tableData[i].mainUid==id){
                this.username  = this.userData[i].name;
                break;
            }
        }
    }
  },
};
</script>


<style scoped>
.container {
    padding: 30px;
    background: #07c4a860;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
