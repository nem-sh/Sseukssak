<template>
  <v-app id="app" class="app-container">
    <div class="window-operations-container">
      <div><img class="logo" src="@/assets/sseukssak.png" alt="" /></div>
      <div class="operations">
        <BtnLoginGoogle v-if="!mini" class="mr-1" />
        <i class="far fa-window-minimize minimize" @click="minimizeWindow"></i>
        <i v-if="mini" class="fas fa-expand-alt" @click="resizeBigWindow"></i>
        <i
          v-if="!mini"
          class="fas fa-compress-alt"
          @click="resizeSmallWindow"
        ></i>
        <i class="fas fa-times close" @click="closeWindow"></i>
      </div>
    </div>
    <div class="app-main">
      <div>
        <div class="menu">
          <div v-if="!mini" class="menu-first">
            <div class="top-space"></div>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div class="menu--logo" v-bind="attrs" v-on="on">
                  <img class="app-logo" src="@/assets/sweeping.png" alt="" />
                </div>
              </template>
              <span>쓱싹</span>
            </v-tooltip>

            <div class="menu--separator"></div>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="menu--icon"
                  @click="goMenu(1)"
                  v-bind="attrs"
                  v-on="on"
                  :class="{ active: activeTab === 'Home' }"
                >
                  <span><i class="fas fa-folders fa-lg"></i></span>
                </div>
              </template>
              <span>파일 정리</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="menu--icon"
                  @click="goMenu(2)"
                  v-bind="attrs"
                  v-on="on"
                  :class="{ active: activeTab === 'Rename' }"
                >
                  <span><i class="fas fa-pencil fa-lg"></i></span>
                </div>
              </template>
              <span>파일/폴더명 변경</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="menu--icon"
                  @click="goMenu(3)"
                  v-bind="attrs"
                  v-on="on"
                  :class="{ active: activeTab === 'Restore' }"
                >
                  <span><i class="far fa-history fa-lg"></i></span>
                </div>
              </template>
              <span>히스토리</span>
            </v-tooltip>

            <!-- 다크모드 -->
            <!-- <div>
          <div
            v-show="this.$vuetify.theme.dark"
            class="menu--icon"
            @click="changeMode"
          >
            <span><i class="fas fa-sun fa-lg"></i></span>
          </div>
          <div
            v-show="!this.$vuetify.theme.dark"
            class="menu--icon"
            @click="changeMode"
          >
            <span><i class="fas fa-moon fa-lg"></i></span>
          </div>
        </div> -->
          </div>
          <div v-if="!mini" class="menu-second">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="menu--settings"
                  v-bind="attrs"
                  v-on="on"
                  @click="goSettingsPage"
                >
                  <span><i class="far fa-cog fa-lg"></i></span>
                </div>
              </template>
              <span>환경설정</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div
                  class="menu--settings"
                  v-bind="attrs"
                  v-on="on"
                  @click="goInfoPage"
                >
                  <span><i class="far fa-question fa-lg"></i></span>
                </div>
              </template>
              <span>도움말</span>
            </v-tooltip>
          </div>
        </div>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Swal from "sweetalert2";
import Component from "vue-class-component";
import Home from "@/views/Home.vue";
import "./components/styles/main.scss";
import BtnLoginGoogle from "@/components/googleDrive/BtnLoginGoogle.vue";

const { ipcRenderer, shell } = window.require("electron");

// restore쪽 코드
import { mapMutations, mapState } from "vuex";
import constants from "constants.json";
//

@Component({
  components: {
    Home,
    BtnLoginGoogle
  },
  // restore쪽 코드
  computed: mapState([
    "fileSortList",
    "fromDir",
    "duplicatedList",
    "fileList",
    "renameHistory2",
    "moveHistory",
    "HistoryList"
  ]),
  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeDuplicatedList",
    "changeRenameHistory2",
    "changeMoveHistory",
    "changeHistoryList"
  ]),
  //

  data() {
    return {
      items: [
        { id: 1, title: "Home", icon: "fas fa-folders fa-lg", path: "/" },
        {
          id: 2,
          title: "Rename",
          icon: "fas fa-pencil fa-lg",
          path: "rename"
        },
        {
          id: 3,
          title: "Restore",
          icon: "fa fa-history fa-lg",
          path: "restore"
        }
      ]
    };
  },
  created() {
    this.$router.push({ name: "Home" });
  }
})
export default class App extends Vue {
  activeTab: string = "Home";
  mini: boolean = false;
  //
  changeDuplicatedList!: (newList: [][]) => void;
  changeRenameHistory2!: (newList: [][]) => void;
  changeMoveHistory!: (newList: [][]) => void;
  localHistory: any[] = [];
  duplicatedList!: any[][];
  renameHistory2!: any[][];
  moveHistory!: any[][];
  isLoading!: boolean;
  historyList: (string | number)[][] = [[]];

  //

  goMenu(idx) {
    if (idx === 1 && this.$route.name !== "Home") {
      this.activeTab = "Home";
      this.$router.push({ name: "Home" });
    } else if (idx === 2 && this.$route.name !== "Rename") {
      this.activeTab = "Rename";
      this.$router.push({ name: "Rename" });
    } else if (idx === 3 && this.$route.name !== "Restore") {
      // Swal.fire({
      //   position: "center",
      //   icon: "warning",
      //   title: "준비중 입니다 :)",
      //   showConfirmButton: false,
      //   timer: 1000,
      // });
      this.activeTab = "Restore";
      this.$router.push({ name: "Restore" });
    }
  }

  closeWindow() {
    const remote = window.require ? window.require("electron").remote : null;
    const WIN = remote.getCurrentWindow();
    WIN.close();
  }

  minimizeWindow() {
    const remote = window.require ? window.require("electron").remote : null;
    const WIN = remote.getCurrentWindow();
    WIN.minimize();
  }

  resizeSmallWindow() {
    this.mini = true;
    ipcRenderer.send("resize-me-smaller-please");
    if (this.$route.name !== "MiniMode") {
      this.activeTab = "MiniMode";
      this.$router.push({ name: "MiniMode" });
    }
  }

  resizeBigWindow() {
    this.mini = false;
    ipcRenderer.send("resize-me-bigger-please");
    if (this.$route.name !== "Home") {
      this.activeTab = "Home";
      this.$router.push({ name: "Home" });
    }
  }

  goInfoPage() {
    shell.openExternal("http://k3b304.p.ssafy.io/");
  }

  changeMode() {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
  }

  goSettingsPage() {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "준비중 입니다 :)",
      showConfirmButton: false,
      timer: 1000
    });
  }
}
// font-family: "Nanum Myeongjo", serif;
</script>

<style>
#app {
  font-family: "Nanum Gothic", sans-serif !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  color: #2c3e50;
}
.swal2-popup {
  color: rebeccapurple;
}
</style>
