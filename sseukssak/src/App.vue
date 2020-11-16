<template>
  <v-app id="app" class="app-container">
    <!-- <Quick /> -->
    <div class="window-operations-container">
      <div>
        <img class="logo" src="@/assets/sseukssak.png" alt="" />
      </div>
      <div class="operations">
        <i v-if="!mini" class="far fa-question" @click="dialog = true"></i>
        <!-- <BtnLoginGoogle v-if="!mini" class="mr-1" /> -->

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
                <div
                  @click="goInfoPage()"
                  class="menu--logo"
                  v-bind="attrs"
                  v-on="on"
                >
                  <img class="app-logo" src="@/assets/sweeping.png" alt="" />
                </div>
              </template>
              <span>웹사이트 이동</span>
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
          </div>
          <div v-if="!mini" class="menu-second">
            <div
              v-show="this.$vuetify.theme.dark"
              class="menu--settings"
              @click="changeMode"
            >
              <span><i class="fas fa-sun fa-lg"></i></span>
            </div>
            <div
              v-show="!this.$vuetify.theme.dark"
              class="menu--settings"
              @click="changeMode"
            >
              <span><i class="fas fa-moon fa-lg"></i></span>
            </div>

            <!-- <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <div class="menu--settings" v-bind="attrs" v-on="on">
                  <BtnLoginGoogle />
                </div>
              </template>
              <span>구글드라이브 연동</span>
            </v-tooltip> -->

            <div class="menu--settings">
              <BtnLoginGoogle />
            </div>
            <v-dialog v-model="dialog" width="900px">
                <v-carousel>
                  <v-carousel-item>
                    <v-sheet
                      height="100%"
                      tile
                    >
                      <v-row
                        class="fill-height"
                        align="center"
                        justify="center"
                      >
                        <div class="text-center">
                          <h1 class="info-title">메인 화면</h1>
                          <img width="100%" height="452px" src="@/assets/info/info1.png" alt="info1">
                        </div>
                      </v-row>
                    </v-sheet>
                  </v-carousel-item>
                  <v-carousel-item>
                    <v-sheet
                      tile
                    >
                      <v-row
                        align="center"
                        justify="center"
                      >
                        <div class="text-center">
                          <h1 class="info-title">파일 정리</h1>
                          <img width="100%" height="452px" src="@/assets/info/info2.png" alt="info2">
                        </div>
                      </v-row>
                    </v-sheet>
                  </v-carousel-item>
                  <v-carousel-item>
                    <v-sheet
                      tile
                    >
                      <v-row
                        align="center"
                        justify="center"
                      >
                        <div class="text-center">
                          <h1 class="info-title">파일/폴더명 통합 변경</h1>
                          <img width="100%" height="452px" src="@/assets/info/info3.png" alt="info3">
                        </div>
                      </v-row>
                    </v-sheet>
                  </v-carousel-item>
                  <v-carousel-item>
                    <v-sheet
                      tile
                    >
                      <v-row
                        align="center"
                        justify="center"
                      >
                        <div class="text-center">
                          <h1 class="info-title">히스토리</h1>
                          <img width="100%" height="452px" src="@/assets/info/info4.png" alt="info4">
                        </div>
                      </v-row>
                    </v-sheet>
                  </v-carousel-item>
                </v-carousel>
            </v-dialog>
            
            
            <Quick v-if="osPlatform ==='Win32'" />
          </div>
        </div>
      </div>
      <FeatHistory />
      <div class="main" :class="bgMode">
        <router-view></router-view>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import Component from "vue-class-component";
import Home from "@/views/Home.vue";

import Quick from "@/components/Quick.vue";
import "./components/styles/main.scss";
import BtnLoginGoogle from "@/components/googleDrive/BtnLoginGoogle.vue";
import FeatHistory from "@/components/history/FeatHistory.vue";

const { ipcRenderer, shell } = window.require("electron");

@Component({
  components: {
    Home,
    BtnLoginGoogle,
    FeatHistory,
    Quick,
  },
  data: () => {
    return {
      helpItems: [
        {
          id: 1,
          icon: "far fa-folders",
          title: "파일 정리",
          des:
            "FROM에서 정리를 원하는 폴더를 선택하여 TO에 지정된 정리 그룹의 기준에 맞게 이동됩니다.",
        },
        {
          id: 2,
          icon: "far fa-pencil",
          title: "파일/폴더명 변경",
          des:
            "이름 변경을 원하는 폴더 및 파일을 선택하여 통합적으로 변경이 가능합니다.",
        },
        {
          id: 3,
          icon: "far fa-history",
          title: "히스토리",
          des:
            "쓱싹을 통해 실행했던 파일 이동, 이름 변경, 중복 제거의 기록들을 확인할 수 있습니다.",
        },
      ],
    };
  },
  computed: mapState(["mini", "osPlatform"]),
  methods: mapMutations(["changeMiniState", "setOsPlatform"]),
})
export default class App extends Vue {
  dialog: boolean = false;
  activeTab: string = "Home";
  mini!: boolean;
  changeMiniState!: (value: boolean) => void;
  osPlatform!: string;
  setOsPlatform!: (value: string) => void;

  created() {
    console.log(process.argv[0]);
    const requestOsPlatform = window.navigator.platform;
    this.setOsPlatform(requestOsPlatform);
    if (this.$route.name !== "Home") {
      this.$router.push({ name: "Home" });
    }
  }

  goMenu(idx) {
    if (idx === 1 && this.$route.name !== "Home") {
      this.activeTab = "Home";
      this.$router.push({ name: "Home" });
    } else if (idx === 2 && this.$route.name !== "Rename") {
      this.activeTab = "Rename";
      this.$router.push({ name: "Rename" });
    } else if (idx === 3 && this.$route.name !== "Restore") {
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
    this.changeMiniState(true);
    ipcRenderer.send("resize-me-smaller-please");
    if (this.$route.name !== "MiniMode") {
      this.activeTab = "MiniMode";
      this.$router.push({ name: "MiniMode" });
    }
  }

  resizeBigWindow() {
    this.changeMiniState(false);
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

  get bgMode() {
    return this.$vuetify.theme.dark ? "rename-bg-d" : "rename-bg";
  }
}
</script>

<style>
#app {
  font-family: "Nanum Gothic", sans-serif !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  color: #2c3e50;
}
.go-site:hover {
  cursor: pointer;
  color: var(--color-purple);
}
.rename-bg-d {
  background-color: #24303a !important;
  color: white !important;
}
.info-title {
  background-color: var(--color-purple) !important;
}
</style>
