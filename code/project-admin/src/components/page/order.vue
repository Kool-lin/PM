<!--
 * @Author: coollin
 * @Date: 2021-04-06 19:31:12
 * @LastEditTime: 2021-08-24 10:17:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \code\project-admin\src\components\page\order.vue
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
          v-model="searchtitle"
          placeholder="搜索订单"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-button
          type="primary"
          icon="search"
          @click="handleAdd"
          style="float: right"
          >添加签单</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="tradNo" label="订单编号"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="info" label="内容" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="limitTime" label="限制施工周期"> </el-table-column>
        <el-table-column prop="type" label="订单类型" :formatter="calcType"> </el-table-column>
        <el-table-column prop="address" label="施工地址"> </el-table-column>
        <el-table-column prop="tel" label="客户联系电话"> </el-table-column>
        <el-table-column prop="signTime" label="签单时间"> </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" sortable>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >查看修改</el-button
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
    <el-dialog title="添加订单" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="addForm" label-width="120px">
        <el-form-item label="标题">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="addForm.info"></el-input>
        </el-form-item>
        <el-form-item label="限制施工周期">
          <el-select v-model="addForm.limitTime" placeholder="请选择" style="width: 100%;">
            <el-option label="7天" value='7天'></el-option>
            <el-option label="14天" value='14天'></el-option>
            <el-option label="30天" value='30天'></el-option>
            <el-option label="待定" value='待定'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="addForm.type" placeholder="请选择" style="width: 100%;">
            <el-option label="暗装" :value=1></el-option>
            <el-option label="明装" :value=2></el-option>
            <el-option label="其他" :value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="施工地址">
          <el-input type="textarea" v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="客户联系电话">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="签单时间">
          <div class="block">
            <el-date-picker
              v-model="addForm.signTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="签单凭证">
          <div class="block">
              <el-upload
              action="/api/upload"
              list-type="picture"
              :file-list="img"
              :limit=1
              :on-success="handelPic"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :modal='false'>
              <img width="100%" :src="editForm.certificate" alt=""/>
            </el-dialog>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="修改订单" :visible.sync="editVisible" width="40%">
      <el-form ref="form" :model="editForm" label-width="120px">
        <el-form-item label="订单编号">
          <span>{{editForm.tradNo}}</span>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="editForm.info"></el-input>
        </el-form-item>
        <el-form-item label="限制施工周期">
          <el-select v-model="editForm.limitTime" placeholder="请选择" style="width: 100%;">
            <el-option label="7天" value='7天'></el-option>
            <el-option label="14天" value='14天'></el-option>
            <el-option label="30天" value='30天'></el-option>
            <el-option label="待定" value='待定'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="editForm.type" placeholder="请选择" style="width: 100%;">
            <el-option label="暗装" :value=1></el-option>
            <el-option label="明装" :value=2></el-option>
            <el-option label="其他" :value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="施工地址">
          <el-input type="textarea" v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="客户联系电话">
          <el-input v-model="editForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="签单时间">
          <div class="block">
            <el-date-picker
              v-model="editForm.signTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="签单凭证">
          <div class="block">
              <el-upload
              action="/api/upload"
              list-type="picture"
              :file-list="img"
              :limit=1
              :on-success="handelPic"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :modal='false'>
              <img width="100%" :src="editForm.certificate" alt=""/>
            </el-dialog>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog
      title="删除订单提示"
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
      dialogImageUrl: '',
      dialogVisible: false,
      editForm: {
        title: "",
        info: "",
        tradNo:'',
        certificate: '',
        type: '',
        tel:'',
        limitTime: '',
        signTime: "",
      },
      addForm: {
        title: "",
        info: "",
        tradNo:'',
        certificate: '',
        type: '',
        tel:'',
        limitTime: '',
        signTime: "",
      },
      img:[{name:'凭证',url:''}],
      idx: -1,
      count: 0,
      searchtitle: "",
    };
  },
  created() {
    this.getData();
  },
  methods: {
    //图片上传处理
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogVisible = true;
      },
      handelPic(response,file,fileList){
        this.editForm.certificate = response.data;
        this.addForm.certificate = response.data;
        this.img = [{name:'凭证',url:response.data}];
      },
    // 分页导航
    handleCurrentChange(val) {
      this.curPage = val;
      this.getData();
    },
    calcType (row, column) {
        return row[column.property] == 1 ? '明装' : row[column.property] == 2 ? '暗装' : '其他'
      },
    // 获取列表数据
    getData(search) {
      this.fetchData({
        method: "get",
        url: "/api/orderlist",
        params: {
          page: search ? 1 : this.curPage,
          rows: this.rows,
          title: this.searchtitle,
        },
        success: (data) => {
          this.tableData = data.list;
          this.count = data.count;
        },
      });
    },
    search() {
      this.getData(true);
    },
    handleAdd() {
      this.img = [];
      this.addVisible = true;
    },
    handleEdit(index, row) {
      this.idx = index;
      const item = this.tableData[index];
      this.editForm = {
        title: item.title,
        info: item.info,
        tradNo:item.tradNo,
        certificate: item.certificate,
        type: item.type,
        tel:item.tel,
        address: item.address,
        limitTime: item.limitTime,
        signTime: item.signTime
      };
      this.img[0].url = item.certificate;
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
        str += this.multipleSelection[i].title + " ";
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
        url: "/api/orderlist/",
        data: {
          title: this.addForm.title,
          info: this.addForm.info,
          tradNo:this.addForm.tradNo,
          certificate: this.addForm.certificate,
          type: this.addForm.type,
          tel: this.addForm.tel,
          address:this.addForm.address,
          limitTime: this.addForm.limitTime,
          signTime: this.addForm.signTime
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
        url: "/api/orderlist",
        data: {
          id: this.tableData[this.idx].id,
          title: this.editForm.title,
          info: this.editForm.info,
          tradNo:this.editForm.tradNo,
          certificate: this.editForm.certificate,
          type: this.editForm.type,
          tel:this.editForm.tel,
          address:this.editForm.address,
          limitTime: this.editForm.limitTime,
          signTime: this.editForm.signTime,
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
        url: "/api/orderlist",
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
