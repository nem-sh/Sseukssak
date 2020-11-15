<template>
  <a
    @click="uploadFile(oAuth2Client)"
    style="display: flex; align-items: center"
  >
    <v-img
      class="mr-2"
      max-width="25"
      contain
      height="100%"
      src="@/assets/googleDriveLogo.png"
      alt="googleDrive"
    />
    구글 드라이브 백업
  </a>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
import axios from "axios";
import mime from "mime-types";
import Swal from "sweetalert2";

const BtnUploadGoogleDriveProps = Vue.extend({
  props: {
    fileName: String,
  },
});

@Component({
  computed: mapState(["fromDir", "tokenPath", "oAuth2Client"]),
  methods: mapMutations([
    "changeGoogleHistory"
  ]),
})
export default class BtnUploadGoogleDrive extends BtnUploadGoogleDriveProps {
  oAuth2Client!: object;
  fromDir!: string;
  changeGoogleHistory!: (newHistory: any[]) => void

  async uploadFile(auth) {
    const accessToken = auth.credentials.access_token;
    const UPLOAD_URL =
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=media";
    const PATCH_URL = "https://www.googleapis.com/drive/v3/files/";

    const contentType = mime.lookup(this.fileName);
    const file = fs.readFileSync(this.fromDir + "/" + this.fileName);

    const headers = {
      Authorization: "Bearer " + accessToken,
      "Content-Type": contentType,
    };

    axios
      .post(UPLOAD_URL, file, { headers: headers })
      .then((res) => {
        const data = {
          name: this.fileName,
        };
        const patchHeaders = {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        };
        axios
          .patch(PATCH_URL + `${res.data.id}?uploadType=multipart`, data, {
            headers: patchHeaders,
          })
          .then(() =>{
              Swal.fire({
                icon: "success",
                title: "구글 드라이브 업로드에 성공했습니다.",
              })
              const time = new Date().setTime(Date.now())
              this.changeGoogleHistory([])
              this.changeGoogleHistory([
                this.fileName,
                1,
                this.fromDir+'\\'+this.fileName,
                '%drive%'+this.fileName,
                time,
                4,
              ])
            }
          )
          .catch(() =>
            {
              Swal.fire({
                icon: "error",
                title: "구글 드라이브 업로드에 실패했습니다.",
              })
              const time = new Date().setTime(Date.now())
              this.changeGoogleHistory([])
              this.changeGoogleHistory([
                this.fileName,
                0,
                this.fromDir+'\\'+this.fileName,
                '%drive%'+this.fileName,
                time,
                4,
              ])
            }
          );
      })
      .catch((err) =>
        {
          Swal.fire({
            icon: "error",
            title: "구글 드라이브 업로드에 실패했습니다.",
          })
          const time = new Date().setTime(Date.now())
          this.changeGoogleHistory([])
          this.changeGoogleHistory([
            this.fileName,
            0,
            this.fromDir+'\\'+this.fileName,
            '%drive%'+this.fileName,
            time,
            4,
          ])
        }
      );
  }
}
</script>