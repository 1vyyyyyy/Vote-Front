<!-- 新增投票 -->
<template>
  <section class="add">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="投票名称">
        <el-input v-model="form.voteName" placeholder="请输入名称" maxlength="25" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="投票描述">
        <el-input v-model="form.voteDescription" placeholder="请输入描述" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-col :span="12">
          <el-date-picker placeholder="选择日期" v-model="form.voteDate" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-col :span="12">
          <el-date-picker placeholder="选择日期" v-model="form.endDate" style="width: 100%;"></el-date-picker>
        </el-col>
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
            <el-input-number v-model="form.weights[0].weight" :min="1" :max="10" :step="1" class="small-input"></el-input-number>
          </div>
          <div class="weight-input-item">
            <span>认证用户 </span>
            <el-input-number v-model="form.weights[1].weight" :min="1" :max="10" :step="1" class="small-input"></el-input-number>
          </div>
          <div class="weight-input-item">
            <span>媒体用户 </span>
            <el-input-number v-model="form.weights[2].weight" :min="1" :max="10" :step="1" class="small-input"></el-input-number>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: { //表单数据初始化
        voteName: null,
        voteDescription: null,
        voteDate: null,
        endDate: null,
        candidates: [{ name: '', description: '' }],
        enableWeight: false,
        weights: [{ groupType: 0, weight: 1 },{ groupType: 1, weight: 1 },{ groupType: 2, weight: 1 }]
      }
    };
  },
  methods: {
    formatTime(date) { //日期格式化
      let year = date.getFullYear()
      let month= date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let day=date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours=date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes=date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds=date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    onSubmit() {
      let voteDate = this.formatTime(this.form.voteDate)
      this.form.voteDate = voteDate.substr(0,10)
      // console.log(typeof(this.form.candidates[0].name))
      // console.log(typeof(this.form.weights))
      this.$axios({
        url: '/api/vote',
        method: 'post',
        data: {
          ...this.form
        }
      }).then(res => {
        if(res.data.code == 200) {
          this.$message({
            message: '数据添加成功',
            type: 'success'
          })
          this.$router.push({path: '/selectVote'})
        }
      })
    },
    addRow() {
      this.form.candidates.push({ name: '', description: '' });
    },
    removeRow(index) {
      this.form.candidates.splice(index, 1);
    },
    cancel() { //取消按钮
      this.form = {}
    },
    
  }
};
</script>
<style lang="less" scoped>
.add {
  padding: 0px 30px;
  width: 550px;
}
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* Adjust the margin as needed */
}

.input-container {
  flex: 1;
  margin-right: 10px; /* Adjust the margin as needed */
}

.button-container {
  margin-left: 10px; /* Adjust the margin as needed */
}
.weight-input-group {
  display: flex;
  flex-direction: column;
}

.weight-input-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* 调整行与行之间的间距 */
}

.small-input {
  width: 200px; /* 调整输入框宽度 */
  margin-left: 30px; /* 调整输入框之间的间距 */
}
</style>

