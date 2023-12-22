<!-- 用户注册界面 -->
<template>
    <div id="register">
      <div class="bg"></div>
      <el-row class="main-container">
        <el-col :lg="8" :xs="16" :md="10" :span="10">
          <div class="top">
            <i class="iconfont icon-kaoshi"></i><span class="title">在线投票系统</span>
          </div>
          <div class="bottom">
            <div class="container">
              <p class="title">注册</p>
              <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
                <el-form-item label="用户名">
                  <el-input v-model.number="formLabelAlign.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="formLabelAlign.password" placeholder="请输入密码" type='password'></el-input>
                </el-form-item>
                <div class="submit">
                  <el-button type="primary" class="row-register" @click="register()">注册</el-button>
                </div>
              </el-form>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="footer">
        <el-col>
          <p class="msg2">技术赋能：基于#同态加密#</p>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import {mapState} from 'vuex'
  export default {
    name: "register",
    data() {
      return {
        role: 2,
        labelPosition: 'left',
        formLabelAlign: {
          username: '',
          password: ''
        },
        registerForm: {
          username: '',
          password: ''
        },
      }
    },
    methods: {
      //用户登录请求后台处理
      register() {
        console.log("");
        const sha256 = require('js-sha256')
        if(!this.formLabelAlign.username||!this.formLabelAlign.username) {
          this.$message.error('用户名或密码不能为空')
        } else {
          this.registerForm.username = this.formLabelAlign.username
          this.registerForm.password = sha256(this.formLabelAlign.password)

          this.$axios({
            url: `/api/register`,
            method: 'post',
            data: {
              ...this.registerForm
            }
          }).then(res=>{
            let resData = res.data.data
            if(resData != null) {
                this.$cookies.set("cname", resData.userName)
                this.$cookies.set("cid", resData.userId)
                this.$router.push({path: '/'})
            }
            if(resData == null) { //错误提示
              this.$message({
                showClose: true,
                type: 'error',
                message: '用户名或者密码错误'
              })
            }
          })
        }
      },
      clickTag(key) {
        this.role = key
      }
    },
    computed: mapState(["userInfo"]),
    mounted() {
  
    }
  }
  </script>
  
  <style lang="less" scoped>
  .remind {
    border-radius: 4px;
    padding: 10px 20px;
    display: flex;
    position: fixed;
    right: 20px;
    bottom: 50%;
    flex-direction: column;
    color: #606266;
    background-color: #fff;
    border-left: 4px solid #409eff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
  }
  .container {
    margin-bottom: 32px;
  }
  .container .el-radio-group {
    margin: 30px 0px;
  }
  a:link {
    color:#ff962a;
    text-decoration:none;
  }
  #register {
    font-size: 14px;
    color: #000;
    background-color: #fff;
  }
  #register .bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    overflow-y: auto;
    height: 100%;
    background: url('../../assets/img/loginbg.png')center top / cover no-repeat;
    background-color: #b6bccdd1 !important;
  }
  #register .main-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #register .main-container .top {
    margin-top: 100px;
    font-size: 30px;
    color: #ff962a;
    display: flex;
    justify-content: center;
  }
  #register .top .icon-kaoshi {
    font-size: 80px;
  }
  #register .top .title {
    margin-top: 20px;
  }
  #register .bottom {
    display:flex;
    justify-content: center;
    background-color:#fff;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  #register .bottom .title {
    text-align: center;
    font-size: 30px;
  }
  .bottom .container .title {
    margin: 30px 0px;;
  }
  .bottom .submit .row-register {
    width: 100%;
    background-color: #04468b;
    border-color: #04468b;
    margin: 20px 0px 10px 0px;
    padding: 15px 20px;
  }
  .bottom .submit {
    display: flex;
    justify-content: center;
  }
  .footer {
    margin-top: 50px;
    text-align: center;
  }
  .footer .msg1 {
    font-size: 18px;
    color: #fff;
    margin-bottom: 15px;
  }
  .footer .msg2 {
    font-size: 14px;
    color: #e3e3e3;
    margin-top: 70px;
  }
  .bottom .options {
    margin-bottom: 40px;
    color: #ff962a;
    display: flex;
    justify-content: space-between;
  }
  .bottom .options > a {
    color: #ff962a;
  }
  .bottom .options .register span:nth-child(1) {
    color: #8C8C8C;
  }
  </style>
  