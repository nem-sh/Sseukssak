<template>
  <v-btn @click="test">
      test
  </v-btn>
</template>

<script>
import fs from 'fs'
export default {
    methods:{
        test() {
            console.log(fs)
        }
    }
}
</script>

<style>

</style>