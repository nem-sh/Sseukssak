<template>
<div>
  토큰:{{token}}
  <v-btn @click="openAuthBrowser(oAuth2Client,authUrl)">
    google 인증
  </v-btn>
  <v-text-field type="text" v-model="newToken"/>
  <v-btn @click="saveToken(oAuth2Client, newToken)">입력</v-btn>
</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import { google } from 'googleapis'
import { mapMutations, mapState } from 'vuex'
const { shell } = require('electron').remote
const TOKEN_PATH = 'token.json';

@Component({
  computed: mapState([
    "token"
  ]),
  methods: mapMutations(['setToken'])
})

export default class App extends Vue {

    newToken: string = '';
    TOKEN_PATH: string = 'token.json'
    setToken!: (newToken: string) => void
    oAuth2Client = new google.auth.OAuth2("1096987524792-3jbd92ksgk67a55169h1jbnbvnequ2ca.apps.googleusercontent.com", "1moPvka8ihD8bsUIR_zTVLql","urn:ietf:wg:oauth:2.0:oob")
    authUrl = this.oAuth2Client.generateAuthUrl({
                'access_type': 'offline',
                scope: ['https://www.googleapis.com/auth/drive'] 
            })

    openAuthBrowser(oAuth2Client, authUrl){
            console.log(oAuth2Client)
            const getAccessToken = async function (oAuth2Client) {
            shell.openExternal(authUrl)
        }
        const authorize = function(credentials) {
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getAccessToken(oAuth2Client);
                oAuth2Client.setCredentials(JSON.parse(token.toString()));
            });
        }
        const uploadFile = function(auth){
            const drive = google.drive({ version: 'v3', auth })
            const fileMetadata = {
                'name': 'test.jpg'
            };
            const media = {
                mimeType: 'image/jpeg',
                body: fs.createReadStream('test.jpg')
            };
            const dPrams: object ={
                resource: fileMetadata,
                media: media,
                fields: 'id'
            }
            drive.files.create(dPrams, function (err, file: any) {
                if (err) {
                // Handle error
                console.error(err);
                } else {
                console.log('File Id: ', file.id);
                }
            });
        }
        fs.readFile('credentials.json', (err, content) => {
        if (err){
            console.log(err)
            return
        } console.log('Error loading client secret file:', err)
        authorize(JSON.parse(content.toString()))
        })
    }
    saveToken(oAuth2Client,newToken: string){
        const uploadFile = function(auth){
            const drive = google.drive({ version: 'v3', auth })
            const fileMetadata = {
                'name': 'test.jpg'
            };
            const media = {
                mimeType: 'image/jpeg',
                body: fs.createReadStream('test.jpg')
            };
            const dPrams: object ={
                resource: fileMetadata,
                media: media,
                fields: 'id',
                uploadType: 'media'
            }
            drive.files.create(dPrams, function (err, file: any) {
                if (err) {
                // Handle error
                console.error(err);
                } else {
                console.log(dPrams)
                console.log('File Id: ', file.id);
                }
            });
        }
        this.setToken(newToken)
        console.log('!!!!!!!!!!!!!!!')
        console.log(newToken)
        oAuth2Client.getToken(newToken, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        uploadFile(oAuth2Client);
        });
        
    }
}
</script>