import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface DirState {
  fromDir: string;
  fileList: string[];
  fileSortList: object;
}


export default new Vuex.Store({
  state: {
    fromDir: 'None',
    fileList: [],
    fileSortList: {
      folder: [], file: []
    },
  },
  mutations: {
    changeDir(state: DirState, newDir) {
      state.fromDir = newDir
    },
    changeFileList(state: DirState, newList: string[]) {
      state.fileList = newList
    },
    changeFileSortList(state: DirState, newList: object) {
      state.fileSortList = newList
    },
  },
  actions: {
  },
  modules: {
  }
})
