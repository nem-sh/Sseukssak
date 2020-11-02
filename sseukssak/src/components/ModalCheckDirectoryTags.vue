<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="#7288da" v-bind="attrs" v-on="on">
          <i class="fas fa-tags"></i>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Privacy Policy
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> I accept </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

const AppProps = Vue.extend({
  props: {
    path: String,
    typeTags: Array,
    dateTags: Array,
    titleTags: Array,
  },
});

@Component({})
export default class ModalCheckDirectoryTags extends Vue {
  dialog: boolean = false;
}
</script>

<style>
header {
  height: 64px;
}
</style>
