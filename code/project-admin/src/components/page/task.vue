<!--
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:18:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin\src\components\page\task.vue
-->

<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          ><i class="el-icon-lx-cascades"></i> {{ title }}</el-breadcrumb-item
        >
    </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="searchName"
          placeholder="搜索任务"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button
          type="primary"
          class="el-icon-plus"
          @click="handleAdd();getuserData()"
          style="float: right"
          >新建任务</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="title" label="任务标题">
        </el-table-column>
        <el-table-column prop="info" label="任务内容" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="project" label="所属项目"> </el-table-column>
        <el-table-column prop="executor" label="执行人员"> </el-table-column>
        <el-table-column prop="startTime" label="开始时间"> </el-table-column>
        <el-table-column prop="endTime" label="截止时间"> </el-table-column>
        <el-table-column
          prop="todo"
          label="任务状态"
          align="center"
          :filters="[
            { text: '已认领', value: '已认领' },
            { text: '未认领', value: '未认领' }
          ]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.todo === '已认领' ? 'success':'warning'"
              disable-transitions
              >{{ scope.row.todo }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="finish"
          label="任务进度"
          align="center"
          :filters="[
            { text: '进行中', value: '进行中' },
            { text: '未开始', value: '未开始' },
            { text: '已完成', value: '已完成' }
          ]"
          :filter-method="filterFinish"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.finish === '已完成' ? 'success' : scope.row.finish === '未开始' ? '' : 'warning'"
              disable-transitions
              >{{ scope.row.finish }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" sortable> </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row);getuserData()"
              >修改</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :page-size="rows"
          layout="prev, pager, next"
          :total="count"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 添加弹出框 -->
    <el-dialog title="添加任务" :visible.sync="addVisible" width="40%">
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
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
        <el-form-item label="任务内容">
          <el-input type="textarea" v-model="addForm.info"></el-input>
        </el-form-item>
        <el-form-item label="执行人">
          <template>
            <el-select v-model="addForm.uid" filterable placeholder="可搜索选择" @change="setInfo">
              <el-option
                v-for="item in userData"
                :key="item.uid"
                :label="item.name"
                :value="item.uid"
                :disabled="item.isbusy == 1||item.role!=3">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="开始时间">
          <div class="block">
            <el-date-picker
              v-model="addForm.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="截止时间">
          <div class="block">
            <el-date-picker
              v-model="addForm.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="addForm.todo" placeholder="请选择任务类型">
            <el-option label="已认领" value="已认领"></el-option>
            <el-option label="未认领" value="未认领"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务进度">
          <el-select v-model="addForm.finish" placeholder="请选择任务状态">
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="未开始" value="未开始"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="修改任务" :visible.sync="editVisible" width="40%">
      <el-form ref="form" :model="editForm" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="任务内容">
          <el-input type="textarea" v-model="editForm.info"></el-input>
        </el-form-item>
        <el-form-item label="所属项目">
          <template>
            <el-select v-model="editForm.project" filterable placeholder="可搜索选择">
              <el-option
                v-for="item in projectData"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="执行人">
          <template>
            <el-select v-model="editForm.uid" filterable placeholder="可搜索选择" @change="setInfo">
              <el-option
                v-for="item in userData"
                :key="item.uid"
                :label="item.name"
                :value="item.uid"
                :disabled="item.isbusy == 1||item.role!=3">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="开始时间">
          <div class="block">
            <el-date-picker
              v-model="editForm.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="截止时间">
          <div class="block">
            <el-date-picker
              v-model="editForm.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="editForm.todo" placeholder="请选择任务类型">
            <el-option label="已认领" value="已认领"></el-option>
            <el-option label="未认领" value="未认领"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务进度">
          <el-select v-model="editForm.finish" placeholder="请选择任务状态">
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="未开始" value="未开始"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog
      title="删除任务提示"
      :visible.sync="delVisible"
      width="300px"
      center
    >
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
  data() {
    return {
      title: this.$route.meta.title,
      projectData: [],
      userData:[],
      tableData: [],
      curPage: 1,
      rows: 10,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      addVisible: false,
      editVisible: false,
      delVisible: false,
      editForm: {
        title: "",
        info: "",
        executor: "",
        startTime: "",
        endTime: "",
        todo: "",
        finish:""
      },
      addForm: {
        title: "",
        info: "",
        executor: "",
        startTime: "",
        endTime: "",
        todo: "",
        finish:""
      },
      idx: -1,
      count: 0,
      searchName: "",
    };
  },
  created() {
    this.getData();
    this.getprojectData();
  },
  methods: {
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterStatus(value, row) {
      return row.todo === value;
    },
    filterFinish(value, row) {
      return row.finish === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    setInfo(value){
      for(var i = 0 ;i <this.userData.length;i++){
          if(this.userData[i].uid == value){
            this.addForm.executor = this.userData[i].name;
            this.editForm.executor = this.userData[i].name;
          }
      }
    },
    // 分页导航
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
    },
    //获取项目数据
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
          }
        })
      },
    // 获取列表数据
    getData(search) {
      this.fetchData({
        method: "get",
        url: "/api/task",
        params: {
          page: search ? 1 : this.curPage,
          rows: this.rows,
          executor: this.searchName,
        },
        success: (data) => {
          this.tableData = data.list;
          this.count = data.count;
        },
      });
    },
    //获取用户列表
    getuserData (search) {
        this.fetchData ({
          method: 'get',
          url: '/api/admin',
          params: {
            page: 1,
            rows: ''
          },
          success: data => {
            this.userData = data.list;
            this.count = data.count;
          }
        })
      },
    
    search() {
      this.getData(true);
    },
    handleAdd() {

      this.addVisible = true;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.editForm = {
        title: item.title,
        info: item.info,
        executor: item.executor,
        startTime: item.startTime,
        endTime: item.endTime,
        todo: item.todo,
        project:item.project,
        uid:item.uid,
        finish: item.finish
      };
      this.editVisible = true;
    },
    handleDelete(index, row) {
      this.idx = index;
      this.delVisible = true;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加
    saveAdd() {
      this.fetchData({
        method: "post",
        url: "/api/task/",
        data: {
          title: this.addForm.title,
          info: this.addForm.info,
          project:this.addForm.project,
          startTime: this.addForm.startTime,
          endTime: this.addForm.endTime,
          todo: this.addForm.todo,
          uid:this.addForm.uid,
          finish: this.addForm.finish,
          executor: this.addForm.executor
        },
        success: (data) => {
          this.$message.success(`添加成功`);
          this.addVisible = false;
          this.getData();
        },
      });
    },
    // 修改
    saveEdit() {
      this.fetchData({
        method: "put",
        url: "/api/task",
        data: {
          id: this.tableData[this.idx].id,
          title: this.editForm.title,
          info: this.editForm.info,
          startTime: this.editForm.startTime,
          endTime: this.editForm.endTime,
          todo: this.editForm.todo,
          uid:this.editForm.uid,
          finish: this.editForm.finish,
          executor: this.editForm.executor
        },
        success: (data) => {
          this.$message.success(`修改成功`);
          this.editVisible = false;
          this.getData();
        },
      });

      // this.$set(this.tableData, this.idx, this.form);
      // this.editVisible = false;
    },
    // 确定删除
    deleteRow() {
      this.fetchData({
        method: "delete",
        url: "/api/task",
        data: {
          id: this.tableData[this.idx].id,
        },
        success: (data) => {
          this.$message.success("删除成功");
          this.delVisible = false;
          this.getData();
        },
      });
    },
  },
};
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
  text-align: center;
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
</style>
