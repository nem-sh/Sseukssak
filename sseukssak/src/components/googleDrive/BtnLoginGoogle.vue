<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400">
      <template v-slot:activator="{ on, attrs }">
        <i v-if="isLogin" class="fab fa-google-drive fa-lg" @click="logout"></i>
        <i
          v-else
          style="color: #999999"
          class="fab fa-google-drive fa-lg"
          v-bind="attrs"
          v-on="on"
          @click="login(oAuth2Client)"
        >
        </i>
      </template>

      <v-card :class="{ 'modal-d': this.$vuetify.theme.dark }">
        <v-card-title class="headline">
          인증 코드를 입력해주세요.
        </v-card-title>
        <v-card-text>
          <v-text-field label="Code" v-model="code"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#7288da"
            rounded
            dark
            @click="setCode(oAuth2Client, tokenPath)"
          >
            입력
          </v-btn>
          <v-btn text @click="dialog = false"> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapGetters, mapMutations, mapState } from "vuex";
import Swal from "sweetalert2";

const { shell } = require("electron").remote;

@Component({
  computed: {
    ...mapState(["tokenPath", "oAuth2Client", "isLogin"]),
    ...mapGetters(["authUrl"]),
  },
  methods: mapMutations(["changeLoginState"]),
})
export default class BtnLoginGoogle extends Vue {
  tokenPath!: string;
  oAuth2Client!: any;
  authUrl!: string;
  isLogin!: boolean;

  changeLoginState!: (value: boolean) => void;

  dialog: boolean = false;
  code: string = "";

  mounted() {
    fs.stat(this.tokenPath, (err) => {
      if (!err) {
        fs.readFile(this.tokenPath, (err, data) => {
          if (!err) {
            const savedToken = JSON.parse(data.toString());
            this.oAuth2Client.setCredentials(savedToken);
            this.oAuth2Client.on("tokens", (tokens) => {
              if (tokens["refresh_token"]) {
                savedToken["refresh_token"] = tokens["refresh_token"];
              }
              savedToken["access_token"] = tokens["access_token"];
              fs.writeFileSync(this.tokenPath, savedToken);
              this.oAuth2Client.setCredentials(savedToken);
            });
          }
        });
        this.changeLoginState(true);
      }
    });
  }

  login(oAuth2Client) {
    fs.readFile(this.tokenPath, (err, token) => {
      if (err) {
        shell.openExternal(this.authUrl);
        return;
      }
      oAuth2Client.setCredentials(JSON.parse(token.toString()));
    });
  }

  logout() {
    console.log("logout");
    fs.unlink(this.tokenPath, (err) => {
      console.log("logout logout");
      if (err)
        return Swal.fire({
          icon: "error",
          title: "구글 드라이브 연동 해제에 실패했습니다.",
        });
      this.changeLoginState(false);
      Swal.fire({
        icon: "success",
        title: "구글 드라이브 연동을 해제했습니다.",
      });
    });
  }

  setCode(oAuth2Client, TOKEN_PATH) {
    this.dialog = false;
    this.changeLoginState(true);
    oAuth2Client.getToken(this.code, (err, token) => {
      if (err)
        return Swal.fire({
          icon: "error",
          title: "잘못된 코드입니다. 코드를 다시 확인해주세요.",
        });

      oAuth2Client.setCredentials(token);

      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err)
          return Swal.fire({
            icon: "error",
            title: "로그인 정보 저장에 실패했습니다.",
          });
      });

      Swal.fire({
        icon: "success",
        title: "구글 드라이브 연동에 성공했습니다.",
      });
    });
  }
}
</script>

<style>
</style>