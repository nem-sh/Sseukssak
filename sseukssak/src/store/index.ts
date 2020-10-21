import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface DirState {
  fromDir: string;
  fileList: string[];
}

export default new Vuex.Store({
  state: {
    fromDir:'None',
    fileList: []
  },
  mutations: {
    changeDir (state: DirState, newDir){
      state.fromDir=newDir
    },
    changeFileList (state: DirState, newList){
      state.fileList=newList
    },
  },
  actions: {
  },
  modules: {
  }
})
