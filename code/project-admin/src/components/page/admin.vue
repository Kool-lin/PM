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
        <el-button type="primary" class="el-icon-plus" @click="handleAdd" style="float:right">添加成员</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column prop="uid" label="工号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="role" label="角色" :formatter="calcRole">
        </el-table-column>
        <el-table-column prop="department" label="部门">
        </el-table-column>
        <el-table-column prop="workType" label="工种" :formatter="calcWorktype">
        </el-table-column>
        <el-table-column prop="tel" label="联系电话">
        </el-table-column>
        <el-table-column prop="isbusy" label="员工状态" :formatter="calcIsbusy">
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" sortable>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index,scope.row)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index,scope.row)">删除
            </el-button>
          </template>
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
        <el-form-item label="工号">
          <el-input v-model="addForm.uid"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="addForm.department" placeholder="请选择" style="width: 100%;">
            <el-option label="项目部" value="项目部"></el-option>
            <el-option label="采购部" value="采购部"></el-option>
            <el-option label="销售部" value="销售部"></el-option>
            <el-option label="施工部" value="施工部"></el-option>
            <el-option label="研发部" value="研发部"></el-option>
            <el-option label="财务部" value="财务部"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.role" placeholder="请选择" style="width: 100%;">
            <el-option label="项目经理" :value=1></el-option>
            <el-option label="企业销售" :value=2></el-option>
            <el-option label="企业员工" :value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工种">
          <el-select v-model="addForm.workType" placeholder="请选择" style="width: 100%;">
            <el-option label="开槽施工" :value=1></el-option>
            <el-option label="管道安装" :value=2></el-option>
            <el-option label="锅炉安装" :value=3></el-option>
            <el-option label="其他" :value=4></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态">
          <el-select v-model="addForm.isbusy" placeholder="请选择" style="width: 100%;">
            <el-option label="待分配任务" :value=0></el-option>
            <el-option label="施工作业中" :value=1></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="修改管理员" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="editForm" label-width="100px">
        <el-form-item label="工号">
          <el-input v-model="editForm.uid"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="editForm.department" placeholder="请选择" style="width: 100%;">
            <el-option label="项目部" value="项目部"></el-option>
            <el-option label="采购部" value="采购部"></el-option>
            <el-option label="销售部" value="销售部"></el-option>
            <el-option label="施工部" value="施工部"></el-option>
            <el-option label="研发部" value="研发部"></el-option>
            <el-option label="财务部" value="财务部"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.role" placeholder="请选择" style="width: 100%;">
            <el-option label="项目经理" :value=1></el-option>
            <el-option label="企业销售" :value=2></el-option>
            <el-option label="企业员工" :value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工种">
          <el-select v-model="editForm.workType" placeholder="请选择" style="width: 100%;">
            <el-option label="开槽施工" :value=1></el-option>
            <el-option label="管道安装" :value=2></el-option>
            <el-option label="锅炉安装" :value=3></el-option>
            <el-option label="其他" :value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态">
          <el-select v-model="editForm.isbusy" placeholder="请选择" style="width: 100%;">
            <el-option label="待分配任务" :value=0></el-option>
            <el-option label="施工作业中" :value=1></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
        tableData: [],
        cur_page: 1,
        rows:10,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        addVisible: false,
        editVisible: false,
        delVisible: false,
        editForm: {
          uid: '',
          password: '',
          name: '',
          role: '',
          department : '',
          workType: '',
          tel: '',
          isbusy: ''
        },
        addForm: {
          uid: '',
          password: '',
          name: '',
          role: '',
          department : '',
          workType: '',
          tel: '',
          isbusy: ''
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
      calcRole (row, column) {
        return row[column.property] == 1 ? '项目经理' : row[column.property] == 2 ? '企业销售' : '企业员工'
      },
      calcWorktype (row, column) {
        return row[column.property] == 1 ? '开槽施工' 
        : row[column.property] == 2 ? '管道安装' 
        : row[column.property] == 3 ? '锅炉安装'
        : '其他'
      },
      calcIsbusy (row, column) {
        return row[column.property] == 1 ? '施工作业中' : '待分配任务'
      },
      // 分页导航
      handleCurrentChange (val) {
        this.cur_page = val;
        this.getData ();
      },
      // 获取列表数据
      getData (search) {
        this.fetchData ({
          method: 'get',
          url: '/api/admin',
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
      search () {
        this.getData(true);
      },
      handleAdd () {
        this.addVisible = true;
      },
      handleEdit (index,row) {
        this.idx = index;
        // const item = this.tableData[index];
        // this.editForm = {
        //   name: item.name,
        //   username: item.username,
        //   password: item.password,
        //   role: item.role,
        //   department : item.department
        // };
        this.fetchData ({
          method: 'get',
          url: '/api/admin/' + row.id,
          success: data => {
            this.editForm = {
              name: data.name,
              uid: data.uid,
              password: data.password,
              role: data.role,
              department : data.department,
              workType: data.workType,
              tel: data.tel,
              isbusy: data.isbusy
            };
          }
        });
        this.editVisible = true;
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
          url: '/api/admin',
          data: {
            name: this.addForm.name,
            uid:this.addForm.uid,
            password:this.addForm.password,
            role: this.addForm.role,
            department : this.addForm.department,
            workType: this.addForm.workType,
            tel: this.addForm.tel,
            isbusy: this.addForm.isbusy
          },
          success: data => {
            this.$message.success (`添加成功`);
            this.addVisible = false;
            this.getData ();
          }
        });

      },
      // 修改
      saveEdit () {
        this.fetchData ({
          method: 'put',
          url: '/api/admin',
          data: {
            id: this.tableData[this.idx].id,
            name: this.editForm.name,
            uid:this.editForm.uid,
            password:this.editForm.password,
            role: this.editForm.role,
            department: this.editForm.department,
            workType: this.editForm.workType,
            tel: this.editForm.tel,
            isbusy: this.editForm.isbusy
          },
          success: data => {
            this.$message.success (`修改成功`);
            this.editVisible = false;
            this.getData ();
          }
        });

        // this.$set(this.tableData, this.idx, this.form);
        // this.editVisible = false;

      },
      // 确定删除
      deleteRow () {
        this.fetchData ({
          method: 'delete',
          url: '/api/admin',
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
</style>
