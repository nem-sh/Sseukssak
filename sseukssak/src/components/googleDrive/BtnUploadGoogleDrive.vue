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
import { mapState } from 'vuex'
import axios from 'axios'

@Component({
  computed:
  mapState([
    "tokenPath",
    "oAuth2Client"
  ])
})

export default class App extends Vue {
    oAuth2Client!: object
    filePath: string =""
    // file!: Buffer
    async uploadFile(auth) {
      const accessToken = auth.credentials.access_token
      const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files?uploadType=media"
      const PATCH_URL = "https://www.googleapis.com/drive/v3/files/"

      const contentType = "image/jpeg"
      const file = fs.readFileSync('test.jpg')
      // // fs.readFile('test.jpg',(err, res)=>{
      // //   if (err) throw err
      // //   let base64Image = new Buffer(res, 'binary').toString('base64');
        
      // // });
      // console.log(file.)
//       const data = `--0471cc99-47c1-4db9-8626-7694e0ac018b
// content-type: application/json

// {"name":"word.docx","mimeType":"application/msword"}
// --0471cc99-47c1-4db9-8626-7694e0ac018b
// content-type: application/msword

// ${file}
// --0471cc99-47c1-4db9-8626-7694e0ac018b--`
      const headers = {
        Authorization: 'Bearer '+accessToken,
        //'Content-Length':contentLength,
        'Content-Type':contentType
      }
      axios.post(UPLOAD_URL,file,{headers:headers})
        .then(res=>{
          console.log('hack!')
          console.log(res.data)
          const data={
            name:"test.jpg"
          }
          const patchHeaders = {
            Authorization: 'Bearer '+accessToken,
            //'Content-Length':contentLength,
            'Content-Type':'application/json'
          }
          axios.patch(PATCH_URL+`${res.data.id}?uploadType=multipart`,data,{headers:patchHeaders})
            .then(res=>console.log(res))
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))

//       console.log(header)
//       axios.post(URL,data,{headers:header})
//         .then(res=>console.log(res))
//         .catch(err=>console.log(err))

      // const file = fs.readFileSync('test.jpg')
      // const drive = google.drive({ version: 'v3', auth })
      // const params = {
      //   requestBody:{
      //     name:'test.jpg',
      //     mimeType:'image/jpeg'
      //   },
      //   media:{
      //     mimeType:'image/jpeg',
      //     body: fs.createReadStream('test.jpg') }
      // }
      // console.log(params.media.body)
      // const res = await drive.files.create(params)

      // console.log(res)

      // const fileMetadata = {
      //   'name': 'test.jpg'
      // };
      // const media = {
      //     mimeType: 'image/jpeg',
      //     body: fs.createReadStream('test.jpg')
      // };
      // const params = {
      //   resource: fileMetadata,
      //   media: media,
      //   fields: 'id'
      // }
      // const response = drive.files.create(params,function (err, file) {
      //     if (err) {
      //     // Handle error
      //     console.error(err);
      //     } else {
      //     console.log('File Id: ', file.id);
      //     }
      // });

      // drive.files.create(params, function (err, file) {
      //     if (err) {
      //     // Handle error
      //     console.error(err);
      //     } else {
      //     console.log('File Id: ', file.id);
      //     }
      // });
    }

}
</script>