<template>
  <v-menu offset-y>
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ma-2"
        outlined
        rounded
        small
        color="var(--color-purple)"
        v-bind="attrs"
        v-on="on"
      >
        <i class="fas fa-angle-down mr-2"></i>{{ selected }}
      </v-btn>
    </template>
    <div :class="dropdownBgMode">
      <v-radio-group v-model="radioGroup" class="mx-4">
        <v-radio
          v-for="item in items"
          :key="item.id"
          :label="item.label"
          :value="item.id"
          color="var(--color-purple)"
          @click="sendSelected(item.id)"
        ></v-radio
      ></v-radio-group>
    </div>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

const AppProps = Vue.extend({
  props: {
    state: String,
  },
});

@Component({
  data() {
    return {
      items: [
        {
          id: 1,
          label: "전체보기",
        },
        {
          id: 2,
          label: "오늘 생성된",
        },
        {
          id: 3,
          label: "오늘 수정된",
        },
      ],
    };
  },
})
export default class ListFromFilter extends AppProps {
  radioGroup: number = 1;
  selected: string = "전체보기";
  filterState: string = this.state;
  get dropdownBgMode() {
    return this.$vuetify.theme.dark ? "drop-down-d" : "drop-down";
  }

  @Watch("radioGroup")
  watchRadioGroup() {
    if (this.radioGroup === 1) {
      this.selected = "전체보기";
    } else if (this.radioGroup === 2) {
      this.selected = "오늘 생성된";
      this.state = "오늘 생성된";
    } else if (this.radioGroup === 3) {
      this.selected = "오늘 수정된";
      this.state = "오늘 수정된";
    }
  }
  @Watch("state")
  watchState() {
    if (this.state === "전체보기") {
      this.selected = "전체보기";
      this.radioGroup = 1;
    }
  }
  sendSelected(id) {
    this.$emit("filter-date", id);
  }
}
</script>

<style>
.drop-down {
  background-color: white;
}
.drop-down-d {
  background-color: #24303a;
  color: white;
}
</style>

