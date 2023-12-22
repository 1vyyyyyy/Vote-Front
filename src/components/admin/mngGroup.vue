// 用户管理页面
<template>
  <div class="all">
    <el-table :data="pagination.records" border>
      <el-table-column fixed="left" prop="userId" label="#id" width="180"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="300"></el-table-column>
      <el-table-column prop="userType" label="用户类型" width="300">
        <template slot-scope="scope">{{ getUserType(scope.row.userType) }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="changeGroup(scope.row.userId)" type="primary" size="small">编辑</el-button>
          <!-- <el-button @click="deleteById(scope.row.userId)" type="danger" size="small">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[6, 10]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      class="page">
    </el-pagination>
    <!-- 编辑对话框-->
    <el-dialog
      title="编辑用户类型"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="用户类型">
            <el-select
              ref="optionRef"
              v-model="form.userType"
              placeholder="请选择"
              style="width: 250px"
            >
              <el-option
                v-for="utype in userTypes"
                :key="utype.value"
                :label="utype.label"
                :value="utype.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagination: {
        //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
      },
      dialogVisible: false, //对话框
      form: {}, //保存点击以后当前试卷的信息
      userTypes: [{label: "普通用户",value: 0},{label: "认证用户",value: 1},{label:"媒体用户",value: 2}]
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      //分页查询所有试卷信息
      this.$axios(`/api/users/${this.pagination.current}/${this.pagination.size}`).then(res => {
        this.pagination = res.data.data;
      }).catch(error => {});
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getUserInfo();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getUserInfo();
    },
    changeGroup(userId) { //修改学生信息
      this.dialogVisible = true
      this.$axios(`/api/user/${userId}`).then(res => {
        this.form = res.data.data
      })
    },
    getUserType(userType) {
      return this.userTypes[userType].label;
    },
    submit() { //提交更改
      this.dialogVisible = false
      this.$axios({
        url: '/api/user',
        method: 'put',
        data: {
          ...this.form
        }
      }).then(res => {
        console.log(res)
        if(res.data.code ==200) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        }
        this.getUserInfo()
      })
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
    },
  }
};
</script>
<style lang="less" scoped>
.all {
  padding: 0px 40px;
  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit {
    margin-left: 20px;
  }
  .el-table tr {
    background-color: #dd5862 !important;
  }
}
.el-table .warning-row {
  background: #000 !important;
}

.el-table .success-row {
  background: #dd5862;
}
</style>
