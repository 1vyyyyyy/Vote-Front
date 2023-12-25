<!-- 点击后进入投票界面 -->
<template>
  <div id="msg">
    <div class="title">
      <span>投票详情</span>
      <span>/ {{ voteData.voteName }}</span>
    </div>
    <div class="wrapper">
      <ul class="top">
        <li class="example">{{ voteData.voteName }}</li>
        <li class="right">
          <div>
            <span v-if="!voteData.isEnd" class="count1">已截止</span>
            <span v-if="voteData.isEnd" class="count2">进行中</span>
          </div>
        </li>
      </ul>
      <ul class="bottom">
        <li>发布于 {{voteData.voteDate}}</li>
        <li>来自 admin</li>
      </ul>
      <ul v-if="voteData.isEnd" class="info">
        <li @click="dialogVisible = true"><a href="javascript:;"><i class="iconfont icon-info"></i>投票须知</a></li>
      </ul>
      <div>
        <div v-if="voteData.isEnd">
          <div class="item-detail" v-for="(item, index) in ballot" :key="index">
            <div class="module-item"
              :style="{
                backgroundColor: item.checked ? '#009aff' : '#fff',
                borderColor: item.checked ? 'transparent' : 'black',
                color: item.checked ? '#fff' : 'black',
              }"
              @click="handleMultiple(index)">
              <span>{{ item.name }}</span>
              <span>{{ item.checked ? '√' : '' }}</span>
            </div>
          </div>
          <ul v-if="voteData.isEnd" class="bottom">
            <li class="right"><el-button @click="onSubmit()">提交结果</el-button></li>
          </ul>
        </div>
        <div v-else>
          <div class="title">
            <span>投票结果</span>
          </div>
          <div class="echart" id="mychart" :style="myChartStyle"></div>
        </div>
      </div>
    </div>
    <!-- <div class="content">
      <el-collapse v-model="activeName" >
        <el-collapse-item class="header" name="0">
          <template slot="title" class="stitle" >
            <div class="title">
              <span>{{voteData.source}}</span><i class="header-icon el-icon-info"></i>
              <span class="time">{{voteData.totalScore}}分 / {{voteData.totalTime}}分钟</span>
              <el-button type="primary" size="small">点击查看试题详情</el-button>
            </div>
          </template>
          <el-collapse class="inner">
            <el-collapse-item>
              <template slot="title" name="1">
                <div class="titlei">选择题 (共{{topicCount[0]}}题 共计{{score[0]}}分)</div>
              </template>
              <div class="contenti">
                <ul class="question" v-for="(list, index) in topic[1]" :key="index">
                  <li>{{index+1}}. {{list.question}} {{list.score}}分</li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title" name="2">
                <div class="titlei">填空题 (共{{topicCount[1]}}题  共计{{score[1]}}分)</div>
              </template>
              <div class="contenti">
                <ul class="question" v-for="(list, index) in topic[2]" :key="index">
                  <li>{{topicCount[0]+index+1}}.{{list.question}}  {{list.score}}分</li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title" name="3">
                <div class="titlei">判断题 (共{{topicCount[2]}}题 共计{{score[2]}}分)</div>
              </template>
              <div class="contenti">
                <ul class="question" v-for="(list, index) in topic[3]" :key="index">
                  <li>{{topicCount[0]+topicCount[1]+index+1}}. {{list.question}} {{list.score}}分</li>
                </ul>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
        
      </el-collapse>
    </div> -->
    <!--投票须知对话框-->
    <el-dialog
      title="投票须知"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{voteData.tips}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      dialogVisible: false, //对话框属性
      activeName: '0',  //默认打开序号
      voteData: { //投票信息
        // source: null,
        // totalScore: null,
      },
      showAllSelected: false,
      currentIndex: -1,
      ballotData: {},
      ballot: {},
      xData: [], //横坐标
      yData: [], //数据
      myChartStyle: { width: "100%", height: "400px" } //图表样式
    }
  },
  mounted() {
    this.init()
    // this.initEcharts()
  },
  methods: {
    //初始化页面数据
    init() {
      let voteId = this.$route.query.voteId //获取路由传递过来的投票编号
      this.$axios(`/api/vote/${voteId}`).then(res => {  //通过voteId请求投票详细信息
        res.data.data.voteDate = res.data.data.voteDate.substr(0,10)
        this.voteData = { ...res.data.data}
        this.voteData.isEnd = (new Date(this.voteData.endDate) > new Date)
        // this.voteData.totalPeople = JSON.parse(this.voteData.candidates).length
        this.ballot = JSON.parse(this.voteData.candidates)
        this.ballot.forEach((item) => { item.checked = false })
          this.xData = this.ballot.map(function(ballot) {
          return ballot.name;
        });
        this.yData = JSON.parse(this.voteData.result)
        console.log("load echarts1")
        console.log(this.xData)
        console.log(typeof(this.yData))
        // 基本柱状图
        const option = {
          xAxis: {
            data: this.xData
          },
          yAxis: {},
          series: [
            {
              type: "bar", //形状为柱状图
              data: this.yData,
              label: {
                show: true, // 显示标签
                position: 'top', // 标签位置
                formatter: '{c}', // 标签内容，{c} 表示数据值
              }
            }
          ]
        };
        const myChart = echarts.init(document.getElementById("mychart"));
        myChart.setOption(option);
        console.log("load echarts2")
        //随着屏幕大小调节图表
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      })
    },
    initEcharts() {
      console.log("load echarts1")
      // 基本柱状图
      const option = {
        xAxis: {
          data: this.xData
        },
        yAxis: {},
        series: [
          {
            type: "bar", //形状为柱状图
            data: this.yData
          }
        ]
      };
      const myChart = echarts.init(document.getElementById("mychart"));
      myChart.setOption(option);
      console.log("load echarts2")
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    handleMultiple(index) {
      // 使用 this.$set 确保 Vue 能够正确追踪属性的更改
      this.$set(this.ballot, index, {
        ...this.ballot[index],
        checked: !this.ballot[index].checked,
      });
      // console.log(this.ballot[index].checked);
    },
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
      let ballotDate = this.formatTime(new Date())
      ballotDate = ballotDate.substr(0,10)
      this.ballotData.ballot = this.ballot
      this.ballotData.ballotDate = ballotDate
      this.ballotData.voteId = this.voteData.voteId
      this.ballotData.userId = this.$cookies.get("cid")
      // console.log(this.ballotData)
      this.$axios({
        url: '/api/ballot',
        method: 'post',
        data: {
          ...this.ballotData
        }
      }).then(res => {
        if(res.data.code == 200) {
          this.$message({
            message: '投票成功',
            type: 'success'
          })
          this.$router.push({path: '/index'})
        } else if(res.data.code == 403) {
          this.$message({
            message: '请勿重复投票',
            type: 'error'
          })
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.bottom {
  .right{
    .el-button{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.right {
  margin-left: auto;
}
.inner .contenti .question {
  margin-left: 40px;
  color: #9a9a9a;
  font-size: 14px;
}
.content .inner .titlei {
  margin-left: 20px;
  font-size: 16px;
  color: #88949b;
  font-weight: bold;
}
.content .title .time {
  font-size: 16px;
  margin-left: 420px;
  color: #999;
}
.content .stitle {
  background-color: #0195ff;
}
.content .title span {
  margin-right: 10px;
}
#msg .content .title {
  font-size: 20px;
  margin: 0px;
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  background-color: #fff;
}
.content .header {
  padding: 10px 30px;
}
.wrapper .info {
  margin: 20px 0px 0px 20px;
  border-top: 1px solid #eee;
  padding: 20px 0px 10px 0px;
}
.wrapper .info a {
  color: #88949b;
  font-size: 14px;
}
.wrapper .info a:hover {
  color: #0195ff;
}
.wrapper .bottom .btn {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #88949b;
  border-radius: 4px;
} 
.wrapper .bottom {
  display: flex;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  align-items: center;
}
.wrapper .bottom li {
  margin-right: 14px;
}
#msg {
  background-color: #eee;
  width: 980px;
  margin: 0 auto;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
}
.wrapper .top {
  display: flex;
  margin: 20px;
  align-items: center;
}
.wrapper .top .right {
  margin-left: auto;
}
.wrapper .top .example {
  color: #333;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top li i {
  margin-left: 20px;
  color: #88949b;
}
.wrapper .right .count1 {
  margin-left: 0px;
  color: #fff;
  padding: 10px 15px;
  background-color: #88949b;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #88949b;
}
.wrapper .right .count2 {
  margin-left: 0px;
  color: #fff;
  padding: 10px 15px;
  background-color: #67c23a;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #67c23a;
}
.wrapper .right .people {
  position: absolute;
  left: 53px;
  top: -5px;
  padding: 1px 12px;
  font-size: 20px;
  color: #88949b;
  border: 1px dashed #88949b;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-weight: bold;
}
.wrapper .right div {
  position: relative;
}
.module-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 10px;
  border: 1px solid #409eff;
  border-radius: 8px;
  // margin-bottom: 10px;
  // padding: 10px;
  // border: 1px solid black;
  // cursor: pointer;
}
.circle {
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-radius: 50%;
  color: #fff;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  line-height: 35px;
  text-align: center;
}
// .first-line {
//   font-weight: bold;
//   font-size: 16px;
// }

// .second-line {
//   margin-top: 5px; /* 间距 */
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }

// .checked {
//   background-color: #009aff;
//   border-color: transparent;
//   color: #fff;
// }

// .checked-icon {
//   font-size: 20px;
// }
</style>
