import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import *as echarts from 'echarts'
import axios from 'axios'
//引入element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from './utils/api.js'
import qs from 'qs'
//加载vue的axois和echarts组件库


Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
axios.defaults.withCredentials = true;
//axios.defaults.headers = { "Content-Type": "application/json;charset=utf-8" };
Vue.prototype.api = api
Vue.config.productionTip = false
//添加一个公用的通信Bus
Vue.prototype.Bus = new Vue();
Vue.use(ElementUI);


// 过滤器
import * as custom from './utils/util'

Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

//vue3.0版本的配置如下：
// const app = createApp(App)
// app.config.globalProperties.$echarts = echarts;
// app.config.globalProperties.$axios = axios
// app.use(store).use(router).use(ElementPlus).mount('#app')