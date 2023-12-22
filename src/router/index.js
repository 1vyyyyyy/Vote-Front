import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login', //登录界面
      component: () => import('@/components/common/login')
    },
    {
      path: '/register',
      name: 'register', //注册界面
      component: () => import('@/components/common/register')
    },
    {
      path:'/admin', //后台登录
      component: () => import('@/components/admin/login')
    },
    {
      path: '/home', //后台主页
      component: () => import('@/components/admin/home'),
      children: [
        {
          path: '/voteDescription', //投票管理功能描述
          component: () => import('@/components/admin/voteDescription')
        },
        {
          path: '/selectVote', //查询所有投票
          component: () => import('@/components/admin/selectVote')
        },
        {
          path: '/addVote', //添加投票
          component: () => import('@/components/admin/addVote')
        },
        {
          path:'/grade', //学生成绩
          component: () => import('@/components/charts/grade')
        },
        {
          path: '/selectExamToPart', //学生分数段
          component: () => import('@/components/admin/selectExamToPart')
        },
        {
          path: '/scorePart',
          component: () => import('@/components/charts/scorePart')
        },
        {
          path: '/allStudentsGrade', //所有学生成绩统计
          component: () => import('@/components/admin/allStudentsGrade')
        },
        {
          path: '/mngDescription', //用户管理功能介绍
          component: ()=> import('@/components/admin/mngDescription')
        },
        {
          path: '/mngGroup', //管理用户分组
          component: () => import('@/components/admin/mngGroup')
        },
        // {
        //   path: '/addCandi', //添加候选人
        //   component: () => import('@/components/admin/addCandi')
        // },

        // {
        //   path: '/addAnswerChildren', //点击试卷跳转到添加题库页面
        //   component: () => import('@/components/admin/addAnswerChildren')
        // },
        // {
        //   path: '/studentManage', //学生管理界面
        //   component: () => import('@/components/admin/studentManage')
        // },
        // {
        //   path: '/addStudent', //添加学生
        //   component: () => import('@/components/admin/addStudent')
        // },
        // {
        //   path: '/teacherManage',
        //   component: () => import('@/components/admin/tacherManage')
        // },
        // {
        //   path: '/addTeacher',
        //   component: () => import ('@/components/admin/addTeacher')
        // }
      ]
    },
    {
      path: '/index',
      component: () => import('@/components/vote/index'),
      children: [
        {path:"/",component: ()=> import('@/components/vote/allVote')},
        {path: '/voteResult', component: () => import("@/components/vote/voteResult")},
        {path: '/voteForm', component: () => import('@/components/vote/voteForm')},   
        // {path:'/newVote', component: () => import('@/components/vote/newVote')},
        // {path: '/manager', component: () => import('@/components/vote/manager')},
        // {path: '/examMsg', component: () => import('@/components/vote/examMsg')},
        // {path: '/message', component: () => import('@/components/vote/message')},
        // {path: '/studentScore', component: () => import("@/components/vote/answerScore")}
      ]
    },
    {path: '/answer',component: () => import('@/components/vote/answer')}
  ]
})
