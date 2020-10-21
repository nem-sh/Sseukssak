<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        From
        <Exp1/>
        <Rename/>
      </v-col>
      <v-col cols="6">
        To
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import Exp1 from '@/components/Exp1.vue'
import Rename from '@/components/Rename.vue'

@Component({
  components: {
    Exp1,
    Rename
  }
})

export default class Home extends Vue {

}
</script>
