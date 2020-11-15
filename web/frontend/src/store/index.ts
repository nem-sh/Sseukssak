import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showAppBar: true,
  },
  mutations: {
    changeAppBar (state, myBoolean) {
      state.showAppBar = myBoolean
    }
  },
  actions: {
  },
  modules: {
  }
})
