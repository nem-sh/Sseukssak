<template>
  <v-container fluid>
    <v-btn @click="test">test</v-btn>
  </v-container>
</template>
<script>
const { shell } = require('electron')
const { dialog } = require('electron').remote
const fs = require('fs')
const path = require('path')
const byte = require('bytes')
const Datastore = require('nedb-promises')
const DBFile = Datastore.create('dbFiles.db')

export default {
  data () {
    return {
      dir: '',
      byte,
      headers: [
        // { value: '_id', text: '_id' },
        { value: 'name', text: 'name' },
        // { value: 'path', text: 'path' },
        { value: 'time', text: 'time' },
        { value: 'size', text: 'size' },
        { value: 'tags', text: 'tags' },
        { value: 'rating', text: 'rating' },
        { value: '_id', text: 'actions' }
      ],
      items: [],
      dialog: false,
      selectedItem: null,
      tags: [],
      search: ''
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    async fetch () {
      this.items = await DBFile.find()
      this.addTag()
    },
    test () {
      fs.rename('C:\\foo\\spam.txt', 'C:\\foo\\bar\\spam.txt', (err) => {
        if (err) {
          console.log(err)
        }
      })
    },
    async read () {
      const rs = dialog.showOpenDialogSync({
        properties: ['openDirectory']
      })
      if (!rs) return
      this.dir = rs[0]
      const files = fs.readdirSync(this.dir)
      if (!files.length) return
      for (let v of files) {
        const p = path.join(this.dir, v)
        const stat = fs.statSync(p)
        const item = {
          name: v,
          path: p,
          time: stat.ctime,
          size: stat.size,
          tags: []
        }
        const fr = await DBFile.findOne({ path: p })
        if (fr) continue
        await DBFile.insert(item)
      }
      this.fetch()
    },
    execute (item) {
      shell.openItem(item.path)
    },
    openDialog (item) {
      this.selectedItem = item
      this.dialog = true
    },
    async changeTag () {
      await DBFile.update({ _id: this.selectedItem._id }, { $set: { tags: this.selectedItem.tags } })
      this.addTag()
    },
    addTag () {
      this.items.forEach(item => {
        const tags = item.tags
        tags.forEach(tag => {
          if (!this.tags.includes(tag)) this.tags.push(tag)
        })
      })
    },
    async delTag (item, tag) {
      await DBFile.update({ _id: item._id }, { $pull: { tags: tag } })
      await this.fetch()
    },
    async del (item) {
      await DBFile.remove({ _id: item._id })
      await this.fetch()
    },
    async ratingChange (item) {
      await DBFile.update({ _id: item._id }, { $set: { rating: item.rating } })
    }
  }
}
</script>
