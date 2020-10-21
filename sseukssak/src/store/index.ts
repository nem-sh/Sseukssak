import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface DirState {
  fromDir: string;
}

export default new Vuex.Store({
  state: {
    fromDir:'None'
  },
  mutations: {
    changeDir (state: DirState, newDir){
      state.fromDir=newDir
    }
  },
  actions: {
  },
  modules: {
  }
})
