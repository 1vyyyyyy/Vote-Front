<!--首页-->
<template>
  <div id="user">
    <el-row class="padding-50">
      <el-col :span="24">
        <ul class="list">
          <li class="logo"><i class="iconfont icon-kaoshi"></i><span>Vote-Online</span></li>
          <li><a href="javascript:;" @click="all()">全部投票</a></li>
          <!-- <li><router-link to="/voteResult">历史结果</router-link></li> -->
          <li class="right" @mouseenter="flag = !flag" @mouseleave="flag = !flag">
            <a href="javascript:;"><i class="iconfont icon-Userselect icon"></i>{{user.userName}}</a>
            <div class="msg" v-if="flag">
              <p @click="manage()">修改密码</p>
              <p class="exit" @click="exit()">退出</p>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <!--路由区域-->
    <div class="main">
      <router-view></router-view>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import myFooter from "@/components/vote/myFooter"
import {mapState} from 'vuex'
export default {
  components: {
    "v-footer": myFooter
  },
  data() {
    return {
      flag: false,
      user: {}
    }
  },
  created() {
    this.userInfo()
  },
  methods: {
    exit() {  //退出登录
      this.$router.push({path:"/"}) //跳转到登录页面
      this.$cookies.remove("cname") //清除cookie
      this.$cookies.remove("cid")
    },
    manage() {  //跳转到修改密码页面
      this.$router.push({path: '/manager'})
    },
    userInfo() {
      let userName = this.$cookies.get("cname")
      let userId = this.$cookies.get("cid")
      console.log(`userId${userId}`)
      console.log(`userName ${userName}`)
      this.user.userName = userName
      this.user.userId = userId
    },
    all() { //跳转考试模式
      this.$router.push({path:'/index'})
    }
  },
  computed:mapState(["isPractice"])
}
</script>

<style scoped>
.right .icon {
  margin-right: 6px;
}
#user .padding-50 {
  margin: 0 auto;
  padding: 0 50px;
  box-shadow: 0 0 10px 4px rgba(1,149,255,0.1);
  background-color: #fff;
}
.list a {
  text-decoration: none;
  color: #334046;
}
li {
  list-style: none;
  height: 60px;
  line-height: 60px;
}
#user .list{
  display: flex;
}
#user .list li {
  padding: 0 20px;
  cursor: pointer;
}
#user .list li:hover {
  background-color: #0195ff;
  transition: all 2s ease;
}
#user .list li:hover a {
  color: #fff;
}
#user .list .right {
  margin-left: auto;
  position: relative;
}
#user .list li.right :hover a {
  color: #000;
}
#user .list .logo {
  display: flex;
  font-weight: bold;
  color: #2f6c9f;
}
#user .list .logo i {
  font-size: 50px;
}
.right .msg {
  text-align: center;
  position: absolute;
  top: 60px;
  left: 0px;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border-bottom: 3px solid #0195ff;
  background-color: #fff;
}
.right .msg p {
  height: 40px;
  line-height: 40px;
  width: 105px;
}
.right .msg p:hover {
  background-color: #0195ff;
}
</style>
