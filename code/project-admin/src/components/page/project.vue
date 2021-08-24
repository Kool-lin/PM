<!--
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:18:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin\src\components\page\project.vue
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
          placeholder="搜索项目"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button
          type="primary"
          class="el-icon-plus"
          @click="handleAdd"
          style="float: right"
          >新建项目</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="项目名称">
        </el-table-column>
        <el-table-column prop="mainUid" label="项目负责人工号"> </el-table-column>
        <el-table-column prop="content" label="项目简介" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="startTime" label="开始时间"> </el-table-column>
        <el-table-column prop="endTime" label="截止时间"> </el-table-column>
        <el-table-column prop="type" label="施工类型" :formatter="calcType"></el-table-column>
        <el-table-column prop="address" label="施工地址"> </el-table-column>
        <el-table-column
          prop="status"
          label="项目状态"
          align="center"
          :filters="[
            { text: '加急', value: '加急' },
            { text: '正常', value: '正常' },
            { text: '延期', value: '延期' }
          ]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '加急' ? 'danger' : scope.row.status === '正常' ? 'success':'warning'"
              disable-transitions
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="finish"
          label="项目进度"
          align="center"
          :filters="[
            { text: '进行中', value: '进行中' },
            { text: '已结项', value: '已结项' },
            { text: '未开始', value: '未开始' }
          ]"
          :filter-method="filterFinish"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.finish === '进行中' ? 'success' : scope.row.finish === '已结项' ? '' : 'warning'"
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
              @click="handleEdit(scope.$index, scope.row);addname();"
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
    <el-dialog title="添加项目" :visible.sync="addVisible" width="40%">
      <el-form ref="form" :model="addForm" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input type="textarea" v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="项目施工地址">
          <el-input type="textarea" v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人">
          <template>
            <el-select v-model="addForm.mainUid" filterable placeholder="可搜索选择" @change="setInfo">
              <el-option
                v-for="item in userData"
                :key="item.uid"
                :label="item.name"
                :value="item.uid"
                :disabled="item.role != 1">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="施工类型">
          <el-select v-model="addForm.type" placeholder="请选择施工类型">
            <el-option label="明装" :value=1></el-option>
            <el-option label="暗装" :value=2></el-option>
            <el-option label="其他" :value=3></el-option>
          </el-select>
          <p style="color:red">不同施工类型对应不同施工时间(明装：不超过14天，暗装:不超过7天,其他：根据实际情况而定，一般不超过30天)，请注意合理设置施工起止时间</p>
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
        <el-form-item label="项目类型">
          <el-select v-model="addForm.status" placeholder="请选择项目类型">
            <el-option label="加急" value="加急"></el-option>
            <el-option label="正常" value="正常"></el-option>
            <el-option label="延期" value="延期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="addForm.finish" placeholder="请选择项目状态">
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="已结项" value="已结项"></el-option>
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
    <el-dialog title="修改项目" :visible.sync="editVisible" width="40%">
      <el-form ref="form" :model="editForm" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目简介">
          <el-input type="textarea" v-model="editForm.content"></el-input>
        </el-form-item>
        <el-form-item label="项目施工地址">
          <el-input type="textarea" v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="项目负责人">
          <template>
            <el-select v-model="editForm.mainUid" filterable placeholder="可搜索选择" @change="setInfo">
              <el-option
                v-for="item in userData"
                :key="item.uid"
                :label="item.name"
                :value="item.uid"
                :disabled="item.role != 1">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="施工类型">
          <el-select v-model="editForm.type" placeholder="请选择施工类型">
            <el-option label="明装" :value=1></el-option>
            <el-option label="暗装" :value=2></el-option>
            <el-option label="其他" :value=3></el-option>
          </el-select>
          <p style="color:red">不同施工类型对应不同施工时间(明装：不超过14天，暗装:不超过7天,其他：根据实际情况而定，一般不超过30天)，请注意合理设置施工起止时间</p>
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
        <el-form-item label="项目类型">
          <el-select v-model="editForm.status" placeholder="请选择项目类型">
            <el-option label="加急" value="加急"></el-option>
            <el-option label="正常" value="正常"></el-option>
            <el-option label="延期" value="延期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="editForm.finish" placeholder="请选择项目状态">
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="已结项" value="已结项"></el-option>
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
      title="删除项目提示"
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
      isok:true,
      title: this.$route.meta.title,
      tableData: [],
      userData:[],
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
        name: "",
        content: "",
        startTime: "",
        endTime: "",
        status: "",
        finish:""
      },
      addForm: {
        name: "",
        content: "",
        startTime: "",
        endTime: "",
        status: "",
        finish:""
      },
      idx: -1,
      count: 0,
      searchName: "",
    };
  },
  created() {
    this.getData();
    this.getuserData();
  },
  methods: {
    tixin(){
      alert('请合理创建')
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    filterFinish(value, row) {
      return row.finish === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    calcType (row, column) {
        return row[column.property] == 1 ? '明装' : row[column.property] == 2 ? '暗装' : '其他'
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
        url: "/api/project",
        params: {
          page: search ? 1 : this.curPage,
          rows: this.rows,
          name: this.searchName,
        },
        success: (data) => {
          this.tableData = data.list;
          this.count = data.count;
        },
      });
    },
    getuserData() {
      this.fetchData({
        method: "get",
        url: "/api/admin",
        params: {
          page: 1,
          rows: 100,
          name: ''
        },
        success: (data) => {
          this.userData = data.list;
        },
      });
    },
    addname(){
      for(let i = 0;i<this.tableData.length;i++){
        for(let j = 0;j<this.userData.length;j++){
            if(this.tableData[i].mainUid==this.userData[j].uid){
              this.tableData[i].username=this.userData[j].name;
            }
        }
      }
      console.log(this.tableData);
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
        name: item.name,
        mainUid:item.mainUid,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        finish: item.finish,
        type: item.type,
        address: item.address,
        content: item.content
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
        url: "/api/project/",
        data: {
          name: this.addForm.name,
          mainUid:this.addForm.mainUid,
          address:this.addForm.address,
          content: this.addForm.content,
          startTime: this.addForm.startTime,
          endTime: this.addForm.endTime,
          status: this.addForm.status,
          type: this.addForm.type,
          finish: this.addForm.finish
        },
        success: (data) => {
          this.$message.success(`添加成功`);
          this.addVisible = false;
          this.getData();
        },
      });
    },
    //验证创建
    verify(){
      let time = Date.parse(this.addForm.endTime) - Date.parse(this.addForm.startTime);
      right = this.addForm.type = 1?7:this.addForm.type = 2?14:1;
      if(time > 0 && (time/86400000) >= right){
        return this.isok = true;
      }else{
        return this.isok = false;
      }
    },
    // 修改
    saveEdit() {
      this.fetchData({
        method: "put",
        url: "/api/project",
        data: {
          id: this.tableData[this.idx].id,
          name: this.editForm.name,
          mainUid:this.editForm.mainUid,
          content: this.editForm.content,
          startTime: this.editForm.startTime,
          endTime: this.editForm.endTime,
          status: this.editForm.status,
          type: this.editForm.type,
          finish: this.editForm.finish
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
        url: "/api/project",
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
