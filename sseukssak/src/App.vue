<template>
  <v-app>
    <div class="app">
      <div class="menu">
        <div class="menu--icon">
          <span>SS</span>
        </div>
        <div class="menu--separator"></div>
        <div
          class="menu--icon"
          v-for="item in items"
          :key="item.title"
          :to="item.path == '#' ? '' : item.path"
          @click="goMenu(item.id)"
          :class="{ active: activeTab === item.title }"
        >
          <span>{{ item.title }}</span>
        </div>
      </div>
      <div class="main"><router-view></router-view></div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Home from "@/views/Home.vue";
import "./components/styles/main.scss";

@Component({
  components: {
    Home,
  },
  data() {
    return {
      items: [
        { id: 1, title: "Home", icon: "mdi-home-city", path: "/" },
        { id: 2, title: "Rename", icon: "mdi-account", path: "rename" },
        { id: 3, title: "Users", icon: "mdi-account-group-outline" },
      ],
    };
  },
})
export default class App extends Vue {
  activeTab: string = "Home";
  goMenu(idx) {
    if (idx === 1 && this.$route.name !== "Home") {
      this.activeTab = "Home";
      this.$router.push({ name: "Home" });
    } else if (idx === 2 && this.$route.name !== "Rename") {
      this.activeTab = "Rename";
      this.$router.push({ name: "Rename" });
    }
  }
}
</script>
