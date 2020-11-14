<template>
  <a
    @click="uploadFolder(oAuth2Client, folderName, fromDir, false)"
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
import { mapState } from "vuex";
import fs from "fs";
import { google } from "googleapis";
import axios from "axios";
import mime from "mime-types";
import Swal from "sweetalert2";

const BtnUploadGoogleDriveProps = Vue.extend({
  props: {
    folderName: String,
  },
});

@Component({
  computed: mapState(["fromDir", "tokenPath", "oAuth2Client"]),
})
export default class BtnUploadGoogleDrive extends BtnUploadGoogleDriveProps {
  oAuth2Client!: object;
  fromDir!: string;
  fileLog: string[] = [];

  async uploadFile(auth, fileName, isLast, folderId, fromDir) {
    const accessToken = auth.credentials.access_token;
    const UPLOAD_URL =
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=media";
    const PATCH_URL = "https://www.googleapis.com/drive/v3/files/";

    const contentType = mime.lookup(fileName);
    const file = fs.readFileSync(fromDir + "/" + fileName);

    const headers = {
      Authorization: "Bearer " + accessToken,
      "Content-Type": contentType,
    };

    axios
      .post(UPLOAD_URL, file, { headers: headers })
      .then((res) => {
        const data = {
          name: fileName,
        };
        const patchHeaders = {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        };
        axios
          .patch(
            PATCH_URL +
              `${res.data.id}?uploadType=multipart&addParents=${folderId}`,
            data,
            { headers: patchHeaders }
          )
          .then(() => {
            if (isLast) {
              Swal.fire({
                icon: "success",
                title: "구글 드라이브 업로드에 성공했습니다.",
              });
            }
          })
          .catch((err) =>
            Swal.fire({
              icon: "error",
              title: "구글 드라이브 업로드에 실패했습니다.",
            })
          );
      })
      .catch((err) =>
        Swal.fire({
          icon: "error",
          title: "구글 드라이브 업로드에 실패했습니다.",
        })
      );
  }

  uploadFolder(auth, folderName, fromDir, parentsId) {
    const drive = google.drive({ version: "v3", auth: auth });
    let fileMetadata;
    if (parentsId) {
      fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentsId],
      };
    } else {
      fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };
    }

    drive.files.create(
      {
        requestBody: fileMetadata,
        fields: "id",
      },
      (err, file) => {
        if (err) {
          Swal.fire({
            icon: "error",
            title: "구글 드라이브 업로드에 실패했습니다.",
          });
        } else {
          // console.log(file.data.id);
          const folderId = file.data.id;
          fs.readdir(fromDir + "/" + folderName, (err, files) => {
            if (err) {
              console.log("readdir error");
              console.log(err);
            } else {
              //console.log("readdir pass");
              //console.log(files);
              files.forEach((file, idx, array) => {
                if (
                  fs.lstatSync(fromDir + "/" + folderName + "/" + file).isFile()
                ) {
                  if (idx === array.length - 1) {
                    this.uploadFile(
                      auth,
                      file,
                      true,
                      folderId,
                      fromDir + "/" + folderName
                    );
                  } else {
                    this.uploadFile(
                      auth,
                      file,
                      false,
                      folderId,
                      fromDir + "/" + folderName
                    );
                  }
                } else if (
                  fs
                    .lstatSync(fromDir + "/" + folderName + "/" + file)
                    .isDirectory()
                ) {
                  this.uploadFolder(
                    auth,
                    file,
                    fromDir + "/" + folderName,
                    folderId
                  );
                }
              });
            }
          });
        }
      }
    );
  }
}
</script>