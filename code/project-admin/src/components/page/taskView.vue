<!--
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:19:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin\src\components\page\taskView.vue
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
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="title" label="任务标题"> </el-table-column>
        <el-table-column
          prop="info"
          label="任务内容"
          :show-overflow-tooltip="true"
        ></el-table-column>
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
            { text: '未认领', value: '未认领' },
          ]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.todo === '已认领' ? 'success' : 'warning'"
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
            { text: '已完成', value: '已完成' },
          ]"
          :filter-method="filterFinish"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.finish === '已完成'
                  ? 'success'
                  : scope.row.finish === '未开始'
                  ? ''
                  : 'warning'
              "
              disable-transitions
              >{{ scope.row.finish }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" sortable>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" prop="todo">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              :disabled = "scope.row.todo == '已认领'"
              @click="handleEdit(scope.$index, scope.row);"
              >认领任务</el-button
            >
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

    <!-- 认领任务弹出框 -->
    <el-dialog title="修改任务" :visible.sync="editVisible" width="500px">
      <el-form ref="form" :model="editForm" label-width="220px">
        <el-form-item label="任务名称:">
          <span>{{ editForm.title }}</span>
        </el-form-item>
        <el-form-item label="任务内容:">
          <span>{{ editForm.info }}</span>
        </el-form-item>
        <el-form-item label="所属项目:">
          <span>{{ editForm.project }}</span>
        </el-form-item>
        <el-form-item label="执行者:">
          <span>{{ editForm.executor }}</span>
        </el-form-item>
        <el-form-item label="开始时间:">
          <span>{{ editForm.startTime }}</span>
        </el-form-item>
        <el-form-item label="截止时间:">
          <span>{{ editForm.endTime }}</span>
        </el-form-item>
        <el-form-item label="任务状态:">
          <el-tag
            v-if="editForm.todo == '未认领'"
            type="danger"
            effect="dark"
            >{{ editForm.todo }}</el-tag
          >
          <el-tag v-if="editForm.todo == '已认领'" effect="dark">{{
            editForm.todo
          }}</el-tag>
        </el-form-item>
        <el-form-item label="任务进度:">
          <el-tag v-if="editForm.finish == '已完成'">{{
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
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">认 领</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: this.$route.meta.title,
      tableData: [],
      userData: [],
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
        finish: "",
      },
      idx: -1,
      count: 0,
      searchName: "",
    };
  },
  created() {
    this.getData();
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 30) {
        return value.slice(0, 30) + "...";
      }
      return value;
    },
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
    // 分页导航
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
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
          this.getuserData();
        },
      });
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
        uid:item.uid,
        project: item.project,
        finish: item.finish,
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
    // 认领任务
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
          todo: "已认领",
          finish: this.editForm.finish,
          executor: this.editForm.executor,
        },
        success: (data) => {
          this.fetchData({
            method: "put",
            url: "/api/task/getTask",
            data: {
              uid: this.editForm.uid
            },
            success: (data) => {
              this.$message.success(`认领成功`);
              this.editVisible = false;
              this.getData();
            },
          });
        }
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
    //获取用户列表
    getuserData(search) {
      this.fetchData({
        method: "get",
        url: "/api/admin",
        params: {
          page: 1,
          rows: "",
        },
        success: (data) => {
          this.userData = data.list;
          this.count = data.count;
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
