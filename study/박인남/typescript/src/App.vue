<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>    
      <input v-model="msg">
      <p>prop: {{ propMessage }}</p>
      <p>msg: {{ msg }}</p>
      <p>helloMsg: {{ helloMsg }}</p>
      <p>computed msg: {{ computedMsg }}</p>
      <Hello ref="helloComponent" />
      <World />

      <p>
        <v-btn @click="greet">Greet</v-btn>
      </p>

      <p>
        Clicked: {{ count }} times
        <v-btn @click="increment">+</v-btn>
      </p>  
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import Hello from '@/components/Hello.vue'
import World from '@/components/World'
import { mapState, mapMutations } from 'vuex'

const AppProps = Vue.extend({
  props: {
    propMessage: String
  }
})
@Component({
  components: {
    Hello,
    World
  },
  // Vuex's component binding helper can use here
  computed: mapState([
    'count'
  ]),
  methods: mapMutations([
    'increment'
  ])
})
export default class App extends AppProps {
  // inital data
  msg: number = 123
  // use prop values for initial data
  helloMsg: string = 'Hello, ' + this.propMessage
  // annotate refs type
  $refs!: {
    helloComponent: Hello;
  }
  // additional declaration is needed
  // when you declare some properties in `Component` decorator
  count!: number
  increment!: () => void
  // lifecycle hook
  mounted () {
    this.greet()
  }
  // computed
  get computedMsg () {
    return 'computed ' + this.msg
  }
  // method
  greet () {
    alert('greeting: ' + this.msg)
    this.$refs.helloComponent.sayHello()
  }
  // direct dispatch example
  incrementIfOdd () {
    this.$store.dispatch('incrementIfOdd')
  }
}
</script>
