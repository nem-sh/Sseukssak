<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>\
    <Exp1/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Exp1 from '@/components/Exp1.vue'


export default {
  name: 'Home',
  components: {
    HelloWorld,
    Exp1,
  }
}
</script>
