<!--
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:18:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin\src\components\page\question.vue
-->

<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-friend"></i> {{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="selectUsername" placeholder="搜索用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button type="primary" class="el-icon-plus" @click="handleAdd();getprojectData()" style="float:right">问题反馈</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%;font-size:16px;" @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="工号">
                <span>{{ props.row.uid }}</span>
              </el-form-item>
              <el-form-item label="提出人">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属项目">
                <span>{{ props.row.project }}</span>
              </el-form-item>
              <el-form-item label="问题内容">
                <span>{{ props.row.content }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createdAt }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="工号"
          prop="uid">
        </el-table-column>
        <el-table-column
          label="提出人"
          prop="name">
        </el-table-column>
        <el-table-column
          label="问题内容"
          prop="content"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createdAt" sortable>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" :page-size="rows" layout="prev, pager, next"
                       :total="count">
        </el-pagination>
      </div>
    </div>

    <!-- 添加弹出框 -->
    <el-dialog title="添加管理员" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="所属项目">
          <template>
            <el-select v-model="addForm.project" filterable placeholder="可搜索选择">
              <el-option
                v-for="item in projectData"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input type='textarea' v-model="addForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="删除管理员提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        title: this.$route.meta.title,
        projectData: [],
        tableData: [],
        cur_page: 1,
        rows: 10,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        addVisible: false,
        editVisible: false,
        delVisible: false,
        addForm: {
          name: '',
          project: '',
          content: '',
          subTime: ''
        },
        idx: - 1,
        count: 0,
        selectUsername: ''
      }
    },
    created () {
      this.getData ();
    },
    methods: {
      // 分页导航
      handleCurrentChange (val) {
        this.cur_page = val;
        this.getData ();
      },
      // 获取列表数据
      getData (search) {
        this.fetchData ({
          method: 'get',
          url: '/api/question',
          params: {
            page: search ? 1 : this.cur_page,
            rows: this.rows,
            name: this.selectUsername
          },
          success: data => {
            this.tableData = data.list;
            this.count = data.count;
          }
        })
      },
      //获取项目列表
      getprojectData (search) {
        this.fetchData ({
          method: 'get',
          url: '/api/project',
          params: {
            page: 1,
            rows: ''
          },
          success: data => {
            this.projectData = data.list;
            this.count = data.count;
          }
        })
      },
      search () {
        this.getData(true);
      },
      handleAdd () {
        this.addVisible = true;
      },
      handleDelete (index, row) {
        this.idx = index;
        const item = this.tableData[index];
        this.delVisible = true;
      },
      delAll () {
        const length = this.multipleSelection.length;
        let str = '';
        this.del_list = this.del_list.concat (this.multipleSelection);
        for (let i = 0; i < length; i ++) {
          str += this.multipleSelection[i].name + ' ';
        }
        this.$message.error ('删除了' + str);
        this.multipleSelection = [];
      },
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      // 添加
      saveAdd () {
        this.fetchData ({
          method: 'post',
          url: '/api/question',
          data: {
            name: localStorage.getItem('adminUsername'),
            uid:localStorage.getItem('adminUid')*1,
            project:this.addForm.project,
            content:this.addForm.content
          },
          success: data => {
            this.$message.success (`添加成功`);
            this.addVisible = false;
            this.getData ();
          }
        });
      },
      // 确定删除
      deleteRow () {
        this.fetchData ({
          method: 'delete',
          url: '/api/question',
          data: {
            id: this.tableData[this.idx].id
          },
          success: data => {
            this.$message.success ('删除成功');
            this.delVisible = false;
            this.getData ();
          }
        });
      }
    }
  }

</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .del-dialog-cnt {
    font-size: 16px;
    text-align: center
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label{
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
