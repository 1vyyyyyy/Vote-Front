<!--全部投票-->
<template>
  <div id="myVote">
    <div class="title">参与投票</div>
    <div class="wrapper">
      <ul class="top">
        <!-- <li class="order">投票列表</li> -->
        <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="bottom" type="card" :stretch=true>
          <el-tab-pane label="全部投票" name="first"></el-tab-pane>
          <el-tab-pane label="进行中" name="second"></el-tab-pane>
          <el-tab-pane label="已截止" name="third"></el-tab-pane>
        </el-tabs>
        <li class="search-li"><div class="icon"><input type="text" placeholder="投票名称" class="search" v-model="key"><i class="el-icon-search"></i></div></li>
        <li><el-button type="primary" @click="search()">搜索投票</el-button></li>
      </ul>
      <ul class="paper">
        <li class="item" v-for="(item,index) in pagination.records" :key="index">
          <h4 @click="go2Vote(item.voteId)">{{item.voteName}}</h4>
          <p class="description">{{item.voteDescription}}</p>
          <div class="info">
            <i v-if="item.isEnd" class="iconfont icon-icon-time"><span>{{ ' 进行中' }}</span></i>
            <i v-if="!item.isEnd" class="el-icon-warning"><span>{{ ' 已截止' }}</span></i>
            <span v-if="item.isEnd">{{item.endDate.substr(0,10)}} 截止</span>
            <i class="el-icon-user-solid"></i><span>候选共{{ item.totalPeople }}项</span>
          </div>
        </li>
      </ul>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[6, 10, 20, 40]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'allVote'
  data() {
    return {
      loading: false,
      key: null, //搜索关键字
      allVote: null, //所有投票信息
      pagination: { //分页后的投票信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6 //每页条数
      },
      activeName: 'first'
    }
  },
  created() {
    this.loading = true
    this.getVoteInfo()
  },
  // watch: {
    
  // },
  methods: {
    //获取当前所有投票信息
    getVoteInfo() {
      this.$axios(`/api/votes/${this.pagination.current}/${this.pagination.size}`).then(res => {
        this.pagination = res.data.data
        this.loading = false
        for(var i=0;i < this.pagination.records.length;i++) {
          this.pagination.records[i].totalPeople = JSON.parse(this.pagination.records[i].candidates).length
          this.pagination.records[i].isEnd = (new Date(this.pagination.records[i].endDate) > new Date)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleClick(tab, event) {
        console.log(this.activeName);
        this.$axios('/api/votes').then(res => {
        if(res.data.code == 200) {
          let allVote = res.data.data
          if(this.activeName == 'second') {
            let newPage = allVote.filter(item => {
              item.totalPeople = JSON.parse(item.candidates).length
              return new Date(item.endDate) > new Date();
            })
            this.pagination.records = newPage
          } else if(this.activeName == 'third') {
            let newPage = allVote.filter(item => {
              item.totalPeople = JSON.parse(item.candidates).length
              return new Date(item.endDate) <= new Date();
            })
            this.pagination.records = newPage
          } else {
            this.getVoteInfo()
          }

        }
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
    //搜索投票
    search() {
      this.$axios('/api/votes').then(res => {
        if(res.data.code == 200) {
          let allVote = res.data.data
          let newPage = allVote.filter(item => {
            return item.voteName.includes(this.key)
          })
          this.pagination.records = newPage
        }
      })
    },
    //跳转到投票详情页
    go2Vote(voteId) {
      this.$router.push({path: '/voteForm', query: {voteId: voteId}})
      console.log(voteCode)
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  padding: 20px 0px 30px 0px;
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
.paper {
  h4 {
    cursor: pointer;
  }
}
.paper .item a {
  color: #000;
}
.wrapper .top .order {
  cursor: pointer;
}
.wrapper .top .order:hover {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.wrapper .top .order:visited {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.item .info i {
  margin-right: 5px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
.paper .item {
  width: 380px;
  border-radius: 4px;
  padding: 20px 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
}
.paper .item:hover {
  box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
  transform: scale(1.03);
}
.paper .item .info {
  font-size: 14px;
  color: #88949b;
}
.paper .item .description {
  font-size: 14px;
  color: #88949b;
}
.paper * {
  margin: 20px 0;
}
.wrapper .paper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.top .el-icon-search {
  position: absolute;
  right: 10px;
  top: 10px;
}
.top .icon {
  position: relative;
}
.wrapper .top {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
#myVote .search-li {
  margin-left: auto;
}
.top .search-li {
  margin-left: auto;
}
.top li {
  display: flex;
  align-items: center;
}
.top .search {
  margin-left: auto;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
.top .search:hover {
  color: #0195ff;
  border-color: #0195ff;
}
.wrapper .top {
  display: flex;
}
.wrapper .top li {
  margin: 20px;
}
#myVote {
  width: 980px;
  margin: 0 auto;
}
#myVote .title {
  margin: 20px;
}
#myVote .wrapper {
  background-color: #fff;
}
</style>
