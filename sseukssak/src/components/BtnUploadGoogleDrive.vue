<template>
  <v-btn @click="test">
    google
  </v-btn>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
// import axios from 'axios'
import readline from 'readline'
import { google } from 'googleapis'
// const { shell } = require('electron').remote
const TOKEN_PATH = 'token.json';

@Component
export default class App extends Vue {
    TOKEN_PATH: string = 'token.json'

    test(){
        const getAccessToken = function (oAuth2Client, callback) {
            const authUrl = oAuth2Client.generateAuthUrl({
                'access_type': 'offline',
                scope: ['https://www.googleapis.com/auth/drive'] 
            })
            console.log('Authorize this app by visiting this url:', authUrl)
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            })
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });[]
                callback(oAuth2Client);
                });
            });
        }
        const authorize = function(credentials, callback) {
            const clientId = credentials.installed.client_id
            const clientSecret = credentials.installed.client_secret
            const redirectUris = credentials.installed.redirect_uris[0]
        
            const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUris)
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getAccessToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token.toString()));
                callback(oAuth2Client);
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
        console.log('ffffff')
        fs.readFile('credentials.json', (err, content) => {
        if (err){
            console.log(err)
            return
        } console.log('Error loading client secret file:', err)
        authorize(JSON.parse(content.toString()), uploadFile)
        })
        console.log('eeeeeeee')
    }
}
</script>