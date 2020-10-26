import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface DirState {
  fromDir: string;
  fileList: string[];
  fileSortList: object;
  toLibraryList: ToLibrary[];
  toLibraryNameList: string[];
  selectedToName: string;
}
interface ToLibrary {
  name: string;
  directories: object[];
}


export default new Vuex.Store({
  state: {
    fromDir: 'None',
    fileList: [],
    fileSortList: {
      directories: [], files: []
    },
    toLibraryList: [],
    toLibraryNameList: [],
    selectedToName: ""
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
    changeToLibraryList(state: DirState, newList: ToLibrary[]) {
      state.toLibraryList = newList
      state.toLibraryNameList = []
      newList.forEach((from: ToLibrary) => {
        state.toLibraryNameList.push(from.name);
      });
    },
    changeSelectedToName(state: DirState, newName: string) {
      state.selectedToName = newName
    },
  },
  actions: {
  },
  modules: {
  }
})
