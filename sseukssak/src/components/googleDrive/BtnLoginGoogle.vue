<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="400"
    >
      <template v-slot:activator="{ on, attrs }">
          <i 
          class="fab fa-google-drive"
          v-bind="attrs"
          v-on="on"
          @click="login(oAuth2Client)"
          >
          </i>
      </template>
      <v-card>
        <v-card-title class="headline">
          인증 코드를 입력해주세요.
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Code"
            v-model="code"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            닫기
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="setCode(oAuth2Client,tokenPath)"
          >
            입력
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import { mapGetters, mapState } from 'vuex'

const { shell } = require('electron').remote

@Component({
  computed:{
  ...mapState([
    "tokenPath",
    "oAuth2Client"
  ]),
  ...mapGetters([
      "authUrl"
  ])
  }
})

export default class BtnLoginGoogle extends Vue {
    dialog: boolean = false
    tokenPath!: string
    code: string = ''
    oAuth2Client!: any
    authUrl!: string


    login(oAuth2Client){
        fs.readFile(this.tokenPath,(err,token)=>{
            if (err) {
                shell.openExternal(this.authUrl);
                return
            }
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
        })
    }
    setCode(oAuth2Client,TOKEN_PATH){
        this.dialog = false
        
        oAuth2Client.getToken(this.code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);

            oAuth2Client.setCredentials(token);
            
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
        })
    }
}
</script>

<style>

</style>