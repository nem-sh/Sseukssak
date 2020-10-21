<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row no-gutters>From</v-row>
        <v-row no-gutters>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit iusto dolor quae sunt nobis nulla, nemo laboriosam impedit expedita at eius debitis velit tenetur delectus in. Possimus alias cupiditate reiciendis.</v-row>
      </v-col>

      <v-col>
        <v-row no-gutters>To</v-row>
        <v-row no-gutters>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum veniam libero itaque explicabo iusto, error eveniet culpa quia voluptatem quisquam voluptates at odit delectus voluptas molestiae perferendis veritatis vitae incidunt.</v-row>
        <v-footer absolute>to</v-footer>
      </v-col>
    </v-row>
    <v-footer absolute>
      <v-col>
        <BtnRename/>
      </v-col>
      <v-col>
        <Exp1/>
      </v-col>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import Exp1 from '@/components/Exp1.vue'
import BtnRename from '@/components/BtnRename.vue'

@Component({
  components: {
    Exp1,
    BtnRename
  }
})

export default class Home extends Vue {

}
</script>
