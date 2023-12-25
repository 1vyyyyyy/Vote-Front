//查询所有投票
<template>
  <div class="vote">
    <el-table :data="pagination.records" border>
      <el-table-column fixed="left" prop="voteId" label="#id" width="100"></el-table-column>
      <el-table-column prop="voteName" label="投票名称" width="200"></el-table-column>
      <el-table-column prop="voteDate" label="开始日期" width="160"></el-table-column>
      <el-table-column prop="endDate" label="结束日期" width="160"></el-table-column>
      <el-table-column prop="enableWeight" label="是否加权" width="160">
        <template slot-scope="scope">{{ scope.row.enableWeight ? '是' : '否' }}</template></el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button @click="calc(scope.row.voteId)" type="success" size="small">结算</el-button>
          <!-- <el-button :disabled="scope.row.isEnd" @click="calc(scope.row.voteId)" type="success" size="small">结算</el-button> -->
          <el-button @click="edit(scope.row.voteId)" type="primary" size="small">编辑</el-button>
          <el-button @click="deleteRecord(scope.row.voteId)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[4, 8, 10, 20]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total" class="page">
    </el-pagination>
    <!-- 编辑对话框-->
    <el-dialog
      title="编辑投票信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="投票名称">
            <el-input v-model="form.voteName"></el-input>
          </el-form-item>
          <el-form-item label="投票描述">
            <el-input v-model="form.voteDescription"></el-input>
          </el-form-item>
          <el-form-item label="开始日期">
            <el-date-picker placeholder="选择日期" v-model="form.voteDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker placeholder="选择日期" v-model="form.endDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="添加候选项">
            <div v-for="(field, index) in form.candidates" :key="index" class="form-row">
              <div class="input-container">
                <el-input v-model="field.name" placeholder="名称" class="candidate-input"></el-input>
              </div>
              <div class="input-container">
                <el-input v-model="field.description" placeholder="描述" class="candidate-input"></el-input>
              </div>
              <div class="button-container">
                <el-button circle type="danger" icon="el-icon-minus" @click="removeRow(index)" v-if="form.candidates.length > 1" class="candidate-button" size="small"></el-button>
              </div>
              <div class="button-container">
                <el-button circle type="success" icon="el-icon-plus" @click="addRow" class="candidate-button"  size="small"></el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="是否设置权重">
            <el-switch v-model="form.enableWeight"></el-switch>
          </el-form-item>
          <el-form-item v-if="form.enableWeight" label="权重分配">
            <div class="weight-input-group">
              <div class="weight-input-item">
                <span>普通用户 </span>
                <el-input-number v-model="form.weight0" :min="1" :max="10" :step="1" class="small-input"></el-input-number>
              </div>
              <div class="weight-input-item">
                <span>认证用户 </span>
                <el-input-number v-model="form.weight1" :min="1" :max="10" :step="1" class="small-input"></el-input-number>
              </div>
              <div class="weight-input-item">
                <span>媒体用户 </span>
                <el-input-number v-model="form.weight2" :min="1" :max="10" :step="1" class="small-input"></el-input-number>
              </div>
            </div>
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
      form: {}, //保存点击以后当前投票的信息
      pagination: { //分页后的投票信息
        current: 1, //当前页
        total: null, //记录条数
        size: 4 //每页条数
      },
      dialogVisible: false
    }
  },
  created() {
    this.getVoteInfo()
  },
  methods: {
    formatTime(date) { //日期格式化
      let year = date.getFullYear()
      let month= date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // 拼接
      return year+"-"+month+"-"+day
    },
    calc(voteCode) { //结算投票结果并发布
      this.$axios(`/api/voteCalc/${voteCode}`).then(res => { //根据voteId请求后台
        if(res.data.code == 200) {
          this.$message({ //成功结算提示
            message: '结算成功',
            type: 'success'
          })
        }
      })
    },
    edit(voteCode) { //编辑投票
      this.dialogVisible = true
      this.$axios(`/api/vote/${voteCode}`).then(res => { //根据voteId请求后台
        if(res.data.code == 200) {
          this.form = res.data.data
          this.form.candidates = JSON.parse(this.form.candidates)
        }
      })
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
    },
    submit() { //提交修改后的投票信息
      this.dialogVisible = false
      // console.log(this.form.voteDate)
      // console.log(this.form.endDate)
      // let voteDate = this.formatTime(this.form.voteDate)
      // console.log(voteDate)
      // this.form.voteDate = voteDate
      // let endDate = this.formatTime(this.form.endDate)
      // this.form.endDate = endDate
      // console.log(endDate)
      this.$axios({
        url: '/api/vote',
        method: 'put',
        data: {
          ...this.form
        }
      }).then(res => {
        if(res.data.code == 200) {
          this.$message({ //成功修改提示
            message: '更新成功',
            type: 'success'
          })
        }
        this.getVoteInfo()
      })
    },
    deleteRecord(voteId) {
      this.$confirm("确定删除该投票吗？","提示",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(()=> { //确认删除
        this.$axios({
          url: `/api/vote/${voteId}`,
          method: 'delete',
        }).then(res => {
          this.getVoteInfo()
        })
      }).catch(() => {

      })
    },
    getVoteInfo() { //分页查询所有投票信息
      this.$axios(`/api/votes/${this.pagination.current}/${this.pagination.size}`).then(res => {
        this.pagination = res.data.data
        for(var i=0;i < this.pagination.records.length;i++) {
          this.pagination.records[i].totalPeople = JSON.parse(this.pagination.records[i].candidates).length
          this.pagination.records[i].isEnd = (new Date(this.pagination.records[i].endDate) > new Date)
        }
        // this.pagination.records.candidates = JSON.parse(this.pagination.records.candidates)
      }).catch(error => {
      })
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val
      this.getVoteInfo()
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getVoteInfo()
    },
    addRow() {
      this.form.candidates.push({ name: '', description: '' });
    },
    removeRow(index) {
      this.form.candidates.splice(index, 1);
    },
  },
};
</script>
<style lang="less" scoped>
.vote {
  padding: 0px 40px;
  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit{
    margin-left: 20px;
  }
}
</style>
