<template>
  <v-row :class="partMode"> 
    <v-col cols="12 pb-0">
      <h4 class="text-center" :class="partTitleMode">2. 변경할 형식 설정</h4>
    </v-col>
    <v-col cols="4" class="text-center pb-0">
      <p class="font-weight-bold" :class="partTitleMode">머리말</p>
      <v-radio-group v-model="front" @change="filterChange(1)">
        <v-radio label="생성 날짜" value="1" color="#7288da"></v-radio>
        <v-radio label="사용자 입력" value="2" color="#7288da"></v-radio>
        <v-text-field
          style="padding:3px 0px 0px 0px"
          v-show="front == '2'"
          v-model="fileName1"
          @input="nameChange(1)"
          :rules="nameRules"
          :counter="10"
          label="머리말 추가"
          required
        ></v-text-field>
        <v-radio label="없음" value="3" color="#7288da"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="4" class="text-center pb-0">
      <p class="font-weight-bold" :class="partTitleMode">폴더/파일명</p>
      <v-radio-group v-model="middle" @change="filterChange(2)">
        <v-radio label="기존 이름" value="1" color="#7288da"></v-radio>
        <v-radio label="사용자 입력" value="2" color="#7288da"></v-radio>
        <v-text-field
          style="padding:3px 0px 0px 0px"
          v-show="middle == '2'"
          v-model="fileName2"
          @input="nameChange(2)"
          :rules="nameRules"
          :counter="20"
          label="변경할 파일명"
          required
        ></v-text-field>
      </v-radio-group>
    </v-col>
    <v-col cols="4" class="text-center pb-0">
      <p class="font-weight-bold" :class="partTitleMode">꼬리말</p>
      <v-radio-group v-model="back" @change="filterChange(3)">
        <v-radio label="숫자(수정 날짜 오름차순)" value="1" color="#7288da"></v-radio>
        <v-radio
          label="사용자 입력"
          value="2"
          :disabled="isDisabled"
          color="#7288da"
        ></v-radio>
        <v-text-field
          style="padding:3px 0px 0px 0px"
          v-show="back == '2'"
          v-model="fileName3"
          @input="nameChange(3)"
          :rules="nameRules"
          :counter="10"
          label="꼬리말 추가"
          required
        ></v-text-field>
        <v-radio label="없음" value="3" :disabled="isDisabled" color="#7288da"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { mapMutations, mapState } from 'vuex';

import { BUS } from "../EventBus.js";

@Component({
  computed: mapState(["filterFront", "filterMiddle", "filterBack", "frontName", "middleName", "backName"]),
  methods: mapMutations(["changePreview", "changeFilterFront", "changeFilterMiddle", "changeFilterBack", "changeFrontName", "changeMiddleName", "changeBackName"])
})

export default class Rename extends Vue {
  nameRules: object = [
    (v) => !!v || "It is required",
    (v) => v.length <= 20 || "It must be less than 20 characters",
    (v) => v.search(/[?:|*<>\\/"]/gi) === -1 || '해당 특수 문자(?:|*<>\\/")는 사용할 수 없습니다.',
  ];
  front: string = "3";
  middle: string = "1";
  back: string = "3";
  fileName1: string = "";
  fileName2: string = "";
  fileName3: string = "";
  filterFront!: string;
  filterMiddle!: string;
  filterBack!: string;
  frontName!: string;
  middleName!: string;
  backName!: string;
  changeFilterFront!: (newFilterBack: string) => void;
  changeFilterMiddle!: (newFilterBack: string) => void;
  changeFilterBack!: (newFilterBack: string) => void;
  changeFrontName!: (newName: string) => void;
  changeMiddleName!: (newName: string) => void;
  changeBackName!: (newName: string) => void;
  changePreview!: () => void;

  get isDisabled(): boolean {
    return this.middle == "2" ? true : false;
  }

  get partTitleMode() {
    return this.$vuetify.theme.dark? "part-title-d" : "part-title"
  }
  get partMode() {
    return this.$vuetify.theme.dark? "rename-part-bg-d" : "rename-part-bg"
  }

  filterChange(n) {
    if (n === 1){
      this.changeFilterFront(this.front)
    } else if (n === 2) {
      this.changeFilterMiddle(this.middle)
    } else {
      this.changeFilterBack(this.back)
    }
    this.changePreview()
  }

  nameChange(n) {
    if (n === 1){
      this.changeFrontName(this.fileName1)
    } else if (n === 2) {
      this.changeMiddleName(this.fileName2)
    } else {
      this.changeBackName(this.fileName3)
    }
    this.changePreview()  
  }

  refreshFilter() {
    this.fileName1 = this.fileName2 = this.fileName1 = ""
    this.front = "3"
    this.middle = "1"
    this.back = "3"
  }
  
  mounted() {
    this.front = this.filterFront
    this.middle = this.filterMiddle
    this.back = this.filterBack
    this.fileName1 = this.frontName
    this.fileName2 = this.middleName
    this.fileName3 = this.backName
    BUS.$on("bus:refreshfilter", () => {
      this.refreshFilter();
    })
  }

  @Watch("middle")
  watchMiddle() {
    if (this.middle == "2") {
      this.back = "1"
      this.changeFilterBack("1")
      this.changePreview()
    }
  }
}
</script>