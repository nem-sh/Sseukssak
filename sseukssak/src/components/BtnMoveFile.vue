<template>
  <v-btn @click="test">
    정리
  </v-btn>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'

@Component({
    methods:{
        test() {
            console.log(fs)
        }
    }
})

export default class App extends Vue {

}
</script>

<style>

</style>