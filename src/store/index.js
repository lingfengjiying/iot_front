import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:""
  },
  mutations: {
    login(state, token) {
      localStorage.setItem("token", token);
      },
      
        // 退出
      logout(...state) {
        localStorage.setItem("token", "");
      }
  },
  actions: {
  },
  modules: {
  }
})
