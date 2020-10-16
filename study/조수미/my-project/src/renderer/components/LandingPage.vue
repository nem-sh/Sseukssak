<template>
  <div id="wrapper">
    <form>
      <div>
        <input multiple @change="showFile" type="file" id="directory_upload" webkitdirectory>
      </div>
    </form>
    <input type="text" v-model="tmpName">
    <button @click="changeName">이름 변경</button>
    <div v-for="file in fileList" :key="file.id">
      <input type="checkbox" v-model="selected" :label="file.name" :value="{id: file.id, name: file.name, path: file.path, mtime: file.mtime}" :name="file.name">{{file.name}}</input>
    </div>
    <v-btn>dd</v-btn>
  </div>
</template>

<script>
var fs = require('fs')
export default {
  name: 'landing-page',
  data () {
    return {
      fileList: [],
      selected: [],
      tmpName: ''
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    showFile (event) {
      const fileRoot = event.target.files[0].path + '\\'
      var tmpFileList = []
      fs.readdir(fileRoot, function (err, filelist) {
        if (err) throw err
        for (var i = 0; i < filelist.length; i++) {
          var tmpFile = {
            id: i,
            name: filelist[i],
            path: fileRoot + filelist[i],
            mtime: ''
          }
          fs.stat(fileRoot + filelist[i], function (err, stats) {
            if (err) throw err
            tmpFile.mtime = stats.mtime
            console.log('stat')
          })
          console.log('push')
          tmpFileList.push(tmpFile)
        }
      })
      this.fileList = tmpFileList
    },
    changeName () {
      if (this.tmpName) {
        var tmpName = this.tmpName
        // 마지막 수정 날짜에 따른 정렬
        this.selected.sort(function (a, b) {
          var dateA = new Date(a.mtime).getTime()
          var dateB = new Date(b.mtime).getTime()
          return dateA < dateB ? 1 : -1
        })
        this.selected.forEach((file, index) => {
          // 확장자
          var _lastDot = file.path.lastIndexOf('.')
          var _fileType = file.path.substring(_lastDot, file.path.length)
          // 파일명 앞까지 자르기
          var _slicePath = file.path.slice(0, file.path.length - file.name.length)
          // 변경
          fs.rename(file.path, _slicePath + tmpName + 'v' + (index + 1) + _fileType, (err) => {
            if (err) throw err
          })
          this.fileList[file.id].name = tmpName + 'v' + (index + 1) + _fileType
          this.fileList[file.id].path = _slicePath + tmpName + 'v' + (index + 1) + _fileType
        })
        this.selected = []
      } else {
        alert('바꿀 이름 입력')
      }
    }
  }
}
</script>

<style>

</style>
