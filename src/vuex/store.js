import VUE from 'vue'
import VUEX from 'vuex'

VUE.use(VUEX)

const state = {
  isPractice: false, //练习模式标志
  flag: false, //菜单栏左右滑动标志
  userInfo: null,
  menu: [{
      index: '1',
      title: '投票管理',
      icon: 'icon-kechengbiao',
      content:[{item1:'功能介绍',path:'/voteDescription'},{item2:'全部投票',path:'/selectVote'},{item3:'发起投票',path:'/addVote'}],
    },
    {
      index: '2',
      title: '用户管理',
      icon: 'icon-tiku',
      content:[{item1:'功能介绍',path:'/mngDescription'},{item2:'分组管理',path:'/mngGroup'}],
    },
    // {
    //   index: '3',
    //   title: '成绩查询',
    //   icon: 'icon-performance',
    //   content:[{item1:'学生成绩查询',path:'/allStudentsGrade'},{path: '/grade'},{item2: '成绩分段查询',path: '/selectExamToPart'},{path: '/scorePart'}],
    // },
    // {
    //   index: '4',
    //   title: '学生管理',
    //   icon: 'icon-role',
    //   content:[{item1:'学生管理',path:'/studentManage'},{item2: '添加学生',path: '/addStudent'}],
    // },
    // {
    //   index: '5',
    //   title: '教师管理',
    //   icon: 'icon-Userselect',
    //   content:[{item1:'教师管理',path:'/teacherManage'},{item2: '添加教师',path: '/addTeacher'}],
    // },
    // {
    //   index: '7',
    //   title: '模块管理',
    //   icon: 'icon-module4mokuai',
    //   content:[{item1:'模块操作',path:'/module'}],
    // }
  ],
}
const mutations = {
  practice(state,status) {
    state.isPractice = status
  },
  toggle(state) {
    state.flag = !state.flag
  },
  changeUserInfo(state,info) {
    state.userInfo = info
  }
}
const getters = {
 
}
const actions = {
  getUserInfo(context,info) {
    context.commit('changeUserInfo',info)
  },
  getPractice(context,status) {
    context.commit('practice',status)
  }
}
export default new VUEX.Store({
  state,
  mutations,
  getters,
  actions,
  // store
})
