<template>
  <div>
    <div>
      <!-- <h3 class="text-center">폴더 설정</h3> -->
      <div>
        <div class="text-right mb-3">
          <v-btn @click="readDir" text color="green"><i class="fas fa-search mr-2"></i>폴더 찾기</v-btn>
          <v-dialog class="file-scroller" v-model="dialog3" persistent max-width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" text v-bind="attrs" v-on="on">
                <i class="fas fa-folder-plus mr-2"></i>From 경로에 새 폴더 추가
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="subtitle">
                From 경로에 새 폴더 추가
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="readFromDirName"
                  label="새 폴더명 입력"
                >
                </v-text-field
              ></v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog3 = false">
                  취소
                </v-btn>
                <v-btn color="green darken-1" text @click="readFromDir">
                  추가
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <v-card-text v-show="directoryDir !== ''" class="font-weight-bold">폴더 경로: {{ directoryDir}}</v-card-text>
      </div>
    </div>
    <v-divider></v-divider>
    <!-- <h3 class="text-center">정리 기준 설정</h3> -->
    <v-row>
      <v-col cols="6" class="pb-0">
        <div id="type">
          <div style="width: 70%; margin-left: auto">
            <v-text-field v-model="typeAddName" label="확장자 직접 입력" class="pt-0" prepend-icon="mdi-information">
            <v-icon slot="append" color="green" @click="typeAdd">
                mdi-plus
            </v-icon>
            </v-text-field>
          </div>
          <v-select
            v-model="selectedTypeTags"
            :items="typeTags"
            deletable-chips
            chips
            color="red"
            item-color="red"
            label="파일 타입"
            multiple
            outlined
          ></v-select>
        </div>
      </v-col>
      <v-col cols="6" class="pb-0">
        <div id="date">
          <div style="width: 80%; margin-left: auto">
            <v-dialog v-model="dialog2" persistent max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                   class="pt-0"
                  v-model="dateRangeText"
                  label="Date range 직접 입력"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @click="dates = []"
                ><v-icon slot="append" color="green" @click="dateAdd">
                  mdi-plus
                </v-icon>
                </v-text-field>
              </template>
              <v-date-picker v-model="dates" range></v-date-picker>
            </v-dialog>
          </div>
        <v-select
          v-model="selectedDateTags"
          :items="dateTags"
          deletable-chips
          chips
          label="날짜"
          multiple
          outlined
        >
        </v-select>
        </div>
      </v-col>
    </v-row>
    <v-row class="">
      <v-col cols="6" class="py-0">
        <div id="name">
          <div style="width: 70%; margin-left: auto">
            <v-text-field v-model="titleAddName" label="파일 이름 직접 입력" class="pt-0" prepend-icon="mdi-pencil">
              <v-icon slot="append" color="green" @click="titleAdd">
                  mdi-plus
              </v-icon>
            </v-text-field>
          </div>
          <v-select
            v-model="selectedTitleTags"
            :items="titleTags"
            deletable-chips
            chips
            label="파일 이름"
            multiple
            outlined
          ></v-select>
        </div>
      </v-col>
      <v-col cols="6" class="py-0"></v-col>
    </v-row>
    <v-divider></v-divider>
    <div>
      <v-select
        v-model="selectedTotalTags"
        :items="totalTags"
        deletable-chips
        chips
        label="선택된 태그들"
        multiple
        outlined
      ></v-select>
    </div>
    <div class="text-center">
      <v-btn color="#7288da" dark @click="addDirectory">
      <v-icon>mdi-plus</v-icon>정리 폴더 추가
      </v-btn>
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import Swal from "sweetalert2"

const { dialog } = require("electron").remote;

@Component({
})

export default class ModalCreateToLibrary extends Vue {
  dates: string[] = [];
  selectedTypeTags: string[] = [];
  selectedDateTags: string[] = [];
  totalTags: string[] = [];
  selectedTotalTags: string[] = [];
  typeAddName: string = "";
  titleAddName: string = "";
  typeTags: string[] = [
    "#Image",
    "#Document",
    "#Video",
    "#Audio",
    "#Compressed",
  ];
  dateTags: string[] = [
    "#Today",
    "#This week",
    "#This month",
    "#Every new file",
  ];
  titleTags: string[] = [];
  selectedTitleTags: string[] = [];
  readFromDirName: string = "";
  directoryDir: string = "";
  dialog2: boolean = false;
  dialog3: boolean = false;

  readDir() {
    this.directoryDir = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    })[0];
  }
  readFromDir() {
    this.directoryDir = "%from%" + "\\" + this.readFromDirName;
    this.dialog3 = false;
  }

  titleAdd() {
    if (this.titleAddName === "") {
      return
    }
    this.selectedTitleTags.push(this.titleAddName);
    this.titleTags.push(this.titleAddName);
    this.titleAddName = "";
  }

  dateAdd() {
    if (this.dates.length != 2) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "날짜를 선택해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    this.selectedDateTags.push(this.dates[0] + "~" + this.dates[1]);
    this.dateTags.push(this.dates[0] + "~" + this.dates[1]);
    this.dates = [];
  }

  typeAdd() {
    if (this.typeAddName === "") {
      return
    }
    let addName = this.typeAddName.toLowerCase();
    if (addName[0] != ".") {
      addName = "." + addName;
    }
    this.selectedTypeTags.push(addName);
    this.typeTags.push(addName);
    this.typeAddName = "";
  }

  addDirectory() {
    if (this.directoryDir.trim() === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "폴더를 지정해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      this.$emit("addDirectory", {
        path: this.directoryDir,
        typeTags: this.selectedTypeTags,
        dateTags: this.selectedDateTags,
        titleTags: this.selectedTitleTags,
      })
      this.directoryDir = ""
      this.selectedTitleTags = this.selectedDateTags = this.selectedTypeTags = []
    }
  }

  get dateRangeText() {
    return this.dates.join(" ~ ");
  }


  @Watch("selectedTypeTags")
  watchSelectedTypeTags() {
    this.selectedTotalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
    this.totalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
  }

  @Watch("selectedTitleTags")
  watchSelectedTitleTags() {
    this.selectedTotalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
    this.totalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
  }

  @Watch("dates")
  watchDates() {
    if (this.dates.length == 2) {
      this.dialog2 = false;
    }
  }

  @Watch("selectedDateTags")
  watchSelectedDateTags() {
    this.selectedTotalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
    this.totalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
  }

  @Watch("selectedTotalTags")
  watchSelectedTotalTags() {
    this.selectedTypeTags.forEach((tag) => {
      if (!this.selectedTotalTags.includes(tag)) {
        if (this.selectedTypeTags.indexOf(tag) > -1)
          this.selectedTypeTags.splice(this.selectedTypeTags.indexOf(tag), 1);
      }
    });
    this.selectedDateTags.forEach((tag) => {
      if (!this.selectedTotalTags.includes(tag)) {
        if (this.selectedDateTags.indexOf(tag) > -1)
          this.selectedDateTags.splice(this.selectedDateTags.indexOf(tag), 1);
      }
    });
    this.selectedTitleTags.forEach((tag) => {
      if (!this.selectedTotalTags.includes(tag)) {
        if (this.selectedTitleTags.indexOf(tag) > -1)
          this.selectedTitleTags.splice(this.selectedTitleTags.indexOf(tag), 1);
      }
    });
  }
}
</script>

<style scoped>
hr {
  margin: 0 0 20px 0;
}
</style>