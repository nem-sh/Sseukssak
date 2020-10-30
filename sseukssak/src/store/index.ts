import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

interface DirState {
  fromDir: string;
  fileList: string[];
  fileSortList: SortList;
  toLibraryList: ToLibrary[];
  toLibraryNameList: string[];
  selectedToName: string;
  logBackCheck: boolean;
  duplicatedList: any[][];
  token: string;
  dropToDir: string;
  modifyDirectroy: ToLibraryDirectory;
  renameHistory: any[][];
}
interface ToLibrary {
  name: string;
  directories: ToLibraryDirectory[];
}
interface ToLibraryDirectory {
  path: string;
  typeTags: string[];
  dateTags: string[];
  titleTags: string[];
}
interface SortList {
  directories: Directory[];
  files: File[];
}
interface File {
  fileType: string;
  name: string;
  birthTime: number;
  updatedTime: number;
}
interface Directory {
  name: string;
  birthTime: number;
  updatedTime: number;
}

export default new Vuex.Store({
  state: {
    dropToDir: '',
    fromDir: '',
    fileList: [],
    fileSortList: {
      directories: [],
      files: []
    },
    toLibraryList: [],
    toLibraryNameList: [],
    selectedToName: '',
    logBackCheck: false,
    duplicatedList: [[]],
    token: '',
    modifyDirectroy: {
      path: '',
      typeTags: [],
      dateTags: [],
      titleTags: []
    },
    renameHistory: []
  },
  mutations: {
    changeModifyDirectroy(
      state: DirState,
      modifyDirectroy: ToLibraryDirectory
    ) {
      state.modifyDirectroy = modifyDirectroy;
    },
    changeDropToDir(state: DirState, dropToDir: string) {
      state.dropToDir = dropToDir;
    },
    changeDir(state: DirState, newDir: string) {
      state.fromDir = newDir;
    },
    changeFileList(state: DirState, newList: string[]) {
      state.fileList = newList;
    },
    changeFileSortList(state: DirState, newList: SortList) {
      state.fileSortList = newList;
    },
    changeToLibraryList(state: DirState, newList: ToLibrary[]) {
      state.toLibraryList = newList;
      state.toLibraryNameList = [];
      newList.forEach((from: ToLibrary) => {
        state.toLibraryNameList.push(from.name);
      });
    },
    changeSelectedToName(state: DirState, newName: string) {
      state.selectedToName = newName;
    },
    changeDuplicatedList(state: DirState, newList: any[][]) {
      state.duplicatedList = newList;
    },
    setToken(state: DirState, newToken: string) {
      state.token = newToken;
    },
    changeLogBackCheck(state: DirState, newCheck: boolean) {
      state.logBackCheck = newCheck;
    },
    changeRenameHistory(state: DirState, newHistory: any[]) {
      state.renameHistory.push(newHistory);
    }
  },
  actions: {},
  modules: {}
});
