import Vue from "vue";
import Vuex from "vuex";

import { google } from 'googleapis';
import { stat } from 'fs';

Vue.use(Vuex);

interface DirState {
  firstOpen: boolean;
  fromDir: string;
  fileList: string[];
  fileSortList: SortList;
  toLibraryList: ToLibrary[];
  toLibraryNameList: string[];
  selectedToName: string;
  logBackCheck: boolean;
  duplicatedList: [][];
  dropToDir: string;
  modifyDirectroy: ToLibraryDirectory;
  renameHistory: any[][];
  renameHistory2: any[][];

  moveHistory: any[][];
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
  allSelect: boolean;
  renameDir: string;

  // Google Auth
  tokenPath: string;
  oAuth2Client: any;
  isLogin: boolean;
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
  icon: string;
}

export default new Vuex.Store({
  state: {
    firstOpen: true,
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
    modifyDirectroy: {
      path: "",
      typeTags: [],
      dateTags: [],
      titleTags: [],
    },
    renameHistory: [],
    renameHistory2: [],
    moveHistory: [],
    renameFileList: [],
    beforeItems: [],
    afterItems: [],
    filterFront: "3",
    filterMiddle: "1",
    filterBack: "3",
    dupCheck: [],
    frontName: '',
    middleName: '',
    backName: '',
    allSelect: false,
    renameDir: '',
    
    // google dive
    tokenPath: "token.json",
    oAuth2Client: new google.auth.OAuth2(
      '957933273560-84cubajfji0djc5k9r9n2okck14sribj.apps.googleusercontent.com',
      'xErwUWs1A-ohs2fgcFFqdulF',
      'urn:ietf:wg:oauth:2.0:oob'
    ),
    isLogin: false
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
    changeFirstOpenValue(state: DirState) {
      state.firstOpen = false;
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
    changeDuplicatedList(state: DirState, newList: [][]) {
      state.duplicatedList = newList;
    },
    changeLogBackCheck(state: DirState, newCheck: boolean) {
      state.logBackCheck = newCheck;
    },
    changeRenameHistory(state: DirState, newHistory: [][]) {
      state.renameHistory.push(newHistory);
    },
    changeMoveHistory(state: DirState, newHistory: [][]) {
      state.moveHistory.push(newHistory);
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
      state.beforeItems.sort(function(a, b) {
        return a.mtime > b.mtime ? 1 : -1;
      });
    },
    sortRenameFileList(state: DirState) {
      state.renameFileList.sort(function(a, b) {
        return a.mtime > b.mtime ? 1 : -1;
      });
      state.renameFileList.forEach((item) => {
        state.dupCheck.push(item.name);
      });
    },
    changeRenameFileList(state: DirState, newlist: FileInfo[]) {
      state.renameFileList = newlist;
    },
    changeBeforeItems(state: DirState, newItems: FileInfo[]) {
      state.beforeItems = newItems;
    },
    initailizeRename(state: DirState) {
      state.renameFileList = state.beforeItems = state.afterItems = [];
      state.dupCheck = [];
      state.filterFront = "3";
      state.filterMiddle = "1";
      state.filterBack = "3";
      state.frontName = state.middleName = state.backName = "";
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
    changeAllSelect(state: DirState) {
      state.allSelect = !state.allSelect
    },
    changeRenameDir(state: DirState, newDir: string) {
      state.renameDir = newDir
    },
    changeLoginState(state: DirState, value: boolean){
      state.isLogin = value
    },
    changeRenameHistory2(state: DirState, newHistory: []) {
      state.renameHistory2.push(newHistory);
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
    authUrl: (state) => {
      return state.oAuth2Client.generateAuthUrl({
        accessType: "offline",
        scope: ["https://www.googleapis.com/auth/drive"],
      });
    },
  },
  modules: {},
});
