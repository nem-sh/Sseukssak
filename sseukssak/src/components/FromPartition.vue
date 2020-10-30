<template>
  <div>
    <v-virtual-scroll
      :bench="benched"
      :items="items"
      height="400"
      item-height="64"
    >
      <template v-slot:default="{ item }" class="mt-4">
        <v-list-item :key="item" class="d-flex justify-space-between mb-6">
          <v-card v-for="n in 3" :key="n" class="pa-2" outlined tile>
            file
          </v-card>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class App extends Vue {
  benched: number = 0;

  get length() {
    return 10;
  }

  get items() {
    return Array.from({ length: this.length }, (k, v) => v + 1);
  }
}
</script>
