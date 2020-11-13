<template>
  <v-dialog
    v-if="isLogin"
    class="file-scroller"
    v-model="dialog"
    max-width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <i class="fab fa-google-drive mr-2"></i>구글 드라이브
      </v-btn>
    </template>

    <v-card :class="{'modal-d': this.$vuetify.theme.dark}">
      <v-card-title>
        <i class="fal fa-info-circle fa-lg mr-2 pb-1"></i>생성할 구글 드라이브 폴더 명을 입력해 주세요
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="folderName" label="새 폴더명 입력">
        </v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> 취소 </v-btn>
        <v-btn dark rounded color="#7288da" @click="makeGoogleFolder">
          추가
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapState } from "vuex";
import { google } from "googleapis";
import Swal from "sweetalert2";

@Component({
  computed: mapState(["oAuth2Client", "isLogin"]),
})
export default class BtnCreateGoogleFolder extends Vue {
  dialog: boolean = false;
  folderName: string = "";
  isLogin!: boolean;
  oAuth2Client!: any;
  // drive: any = google.drive({version: 'v3', auth: this.oAuth2Client})

  makeGoogleFolder() {
    console.log(this.oAuth2Client);
    const drive = google.drive({ version: "v3", auth: this.oAuth2Client });
    const fileMetadata = {
      'name': this.folderName,
      'mimeType': 'application/vnd.google-apps.folder'
    }
    drive.files.create({
      requestBody : fileMetadata,
      fields: 'id'
    }, (err, file) => {
      if (err){
        Swal.fire({
          icon:'error',
          title:'폴더 생성에 실패했습니다.'
        })
      }else{
        Swal.fire({
          icon:'success',
          title:'폴더를 생성했습니다.'
        })
        console.log(file)
        this.$emit('create-google-folder',this.folderName+'\\'+file.data.id)
      }
      this.dialog=false
      }
    )
    
  }


  closeDialog3() {
    this.$emit('close-dialog3')
  }
}
</script>