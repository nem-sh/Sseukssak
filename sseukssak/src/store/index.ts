import Vue from "vue";
import Vuex from "vuex";

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
  dropToDir: string;
  modifyDirectroy: ToLibraryDirectory;
  renameHistory: any[][];
  renameFileList: FileInfo[];
  beforeItems: FileInfo[];
  afterItems: FileInfo[];
  filterFront: string;
  filterMiddle: string;
  filterBack: string;
  dupCheck: string[];
  frontName: string;
  middleName: string;
  backName: string;

  // Google Auth
  token: string;
  tokenPath: string;
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
  icon: string;
}
interface Directory {
  name: string;
  birthTime: number;
  updatedTime: number;
}

interface FileInfo {
  name: string;
  path: string;
  ctime: Date;
  mtime: Date;
  type: string;
  dir: string;
}

export default new Vuex.Store({
  state: {
    dropToDir: "",
    fromDir: "",
    fileList: [],
    fileSortList: {
      directories: [],
      files: [],
    },
    toLibraryList: [],
    toLibraryNameList: [],
    selectedToName: "",
    logBackCheck: false,
    duplicatedList: [[]],
    token: "",
    tokenPath: "token.json",
    modifyDirectroy: {
      path: "",
      typeTags: [],
      dateTags: [],
      titleTags: [],
    },
    renameHistory: [],
    renameFileList: [],
    beforeItems: [],
    afterItems: [],
    filterFront: "3",
    filterMiddle: "1",
    filterBack: "3",
    dupCheck: [],
    frontName: "",
    middleName: "",
    backName: "",
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
    },
    changePreview(state: DirState) {
      state.afterItems = [];
      state.beforeItems.forEach((item, i) => {
        const tmp = Object.assign({}, item, {
          name:
            this.getters["front"](item) +
            this.getters["middle"](item) +
            this.getters["back"](item, i + 1),
        });
        state.afterItems.push(tmp);
      });
    },
    sortBeforeItems(state: DirState) {
      state.beforeItems.sort(function (a, b) {
        return a.mtime > b.mtime ? 1 : -1;
      });
    },
    changeRenameFileList(state: DirState, item: FileInfo) {
      state.renameFileList.push(item);
      state.dupCheck.push(item.name);
    },
    changeBeforeItems(state: DirState, newItems: FileInfo[]) {
      state.beforeItems = newItems;
    },
    initailizeRename(state: DirState) {
      state.renameFileList = state.beforeItems = state.afterItems = [];
      state.dupCheck = [];
    },
    changeFilterFront(state: DirState, newFront: string) {
      state.filterFront = newFront;
    },
    changeFilterMiddle(state: DirState, newMiddle: string) {
      state.filterMiddle = newMiddle;
    },
    changeFilterBack(state: DirState, newBack: string) {
      state.filterBack = newBack;
    },
    changeFrontName(state: DirState, newName: string) {
      state.frontName = newName;
    },
    changeMiddleName(state: DirState, newName: string) {
      state.middleName = newName;
    },
    changeBackName(state: DirState, newName: string) {
      state.backName = newName;
    },
  },
  actions: {},
  getters: {
    front: (state) => (item: FileInfo) => {
      if (state.filterFront == "1") {
        const sYear = item.ctime.getFullYear();
        let sMonth: string | number = item.ctime.getMonth() + 1;
        let sDate: string | number = item.ctime.getDate();
        sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
        sDate = sDate > 9 ? sDate : "0" + sDate;
        const _date = String(sYear).substring(2, 4) + sMonth + sDate;
        return _date + "_";
      } else if (state.filterFront == "2") {
        return state.frontName;
      } else {
        return "";
      }
    },
    middle: (state) => (item: FileInfo) => {
      if (state.filterMiddle == "1") {
        if (item.type !== "") {
          return item.name.substring(
            0,
            item.name.length - (item.type.length + 1)
          );
        } else {
          return item.name;
        }
      } else {
        return state.middleName;
      }
    },
    back: (state) => (item: FileInfo, i: number) => {
      let _fileType = "";
      if (item.type !== "") {
        _fileType = "." + item.type;
      }
      if (state.filterBack == "1") {
        return "_" + i + _fileType;
      } else if (state.filterBack == "2") {
        return state.backName + _fileType;
      } else {
        return "" + _fileType;
      }
    },
  },
  modules: {},
});
