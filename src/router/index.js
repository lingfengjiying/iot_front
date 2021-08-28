import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Index from "../views/index.vue"
import Login from '../views/login.vue'
import device_info from "../views/device/device_info.vue"//设备基本信息
import device_access from "../views/device/device_access.vue"//设备状态
import device_func from "../views/device/device_func.vue"//设备功能
import device_data_list from "../views/device_data/device_data_list.vue"//设备数据
import device_catch_list from "../views/device_data/device_catch_list.vue"//设备异常
import user_list from '../views/user/user_list.vue'//用户信息
import depart_list from '../views/user/depart_list.vue'//组织、公司信息
import policy_list from '../views/policy/policy_list.vue'//策略信息
import devie_policy_list from '../views/policy/devie_policy_list.vue'//策略分配
import data_count from '../views/data_count/data_count.vue'//数据可视化
import device_group from '../views/device/device_group.vue'//设备分组管理
import device_bind from '../views/device/device_bind.vue'//设备绑定
import device_data_detail from '../views/device_data/device_data_detail'//设备数据详情查看
import product from '../views/device/product'//产品管理

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },//设置主页
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/index',
    name: '首页',
    component: Index,
    iconCls: "el-icon-tickets",
    children: [
      {
        path: "/device/device_info",
        name: "device_info",
        component: device_info,
        meta: {
          requireAuth: true
        }

      },
      {
        path: "/device/device_func",
        name: "device_func",
        component: device_func,
        meta: {
          requireAuth: true
        },
      },
      {
        path: "/device/device_access",
        name: "device_access",
        component: device_access,
        meta: {
          requireAuth: true
        },
      },
      {
        path: "/device/product",
        name: "product",
        component: product,
        meta: {
          requireAuth: true
        },
      },
      {

        path: "/device_data/device_data_list",
        name: "device_data_list",
        component: device_data_list,
        meta: {
          requireAuth: true

        }
      },
      {

        path: "/device_data/device_catch_list",
        name: "device_catch_list",
        component: device_catch_list,
        meta: {
          requireAuth: true

        }
      },
      {

        path: "/device_data/device_data_detail",
        name: "device_data_detail",
        component: device_data_detail,
        meta: {
          requireAuth: true

        }
      },
      
      {

        path: "/user/user_list",
        name: "user_list",
        component: user_list,
        meta: {
          requireAuth: true

        }

      },
      {

        path: "/user/depart_list",
        name: "depart_list",
        component: depart_list,
        meta: {
          requireAuth: true

        }
      },
      {

        path: "/policy/policy_list",
        name: "policy_list",
        component: policy_list,
        meta: {
          requireAuth: true

        }
      },
      {

        path: "/policy/devie_policy_list",
        name: "devie_policy_list",
        component: devie_policy_list,
        meta: {
          requireAuth: true

        }
      },
      {
        path: "/data_count/data_count",
        name: "data_count",
        component: data_count,
        meta: {
          requireAuth: true

        }
      },
      {
        path: "/device/device_group",
        name: "device_group",
        component: device_group,
        meta: {
          requireAuth: true

        }
      },
      {
        path: "/device/device_bind",
        name: "device_bind",
        component: device_bind,
        meta: {
          requireAuth: true

        }
      },
      

    ]

  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
