<template>
  <v-container class="mini-mode"> </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: {},
})
export default class MiniMode extends Vue {}
</script>
<style scoped>
.mini-mode {
  padding-top: 28px;
  background-color: var(--color-purple);
  width: 100%;
  height: 100%;
}
</style>

