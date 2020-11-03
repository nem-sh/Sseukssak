<template>
<div>
  대상 파일:{{filePath}}
  <v-text-field type="text" v-model="filePath"/>
  <v-btn @click="uploadFile(oAuth2Client)">업로드</v-btn>
</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import { google } from 'googleapis'
import { mapMutations, mapState } from 'vuex'

@Component({
  computed:
  mapState([
    "tokenPath",
    "oAuth2Client"
  ])
})

export default class App extends Vue {
    oAuth2Client!: object

    uploadFile(auth) {
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

}
</script>