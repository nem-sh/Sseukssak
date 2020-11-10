<template>
  <v-container class="OuterDiv" fluid at-0>
    <v-row class="ImagePart">
      <img :src="require(`@/assets/${picture}`)" class="snapshot">
      </v-row>
      <v-row class="DescriptionPart">
        {{descriptions}}
      </v-row>
  </v-container>
</template>

<script>
export default {
  name: "IntroCard",
  props: {
    picture: String,
    descriptions: String
  },
  data () {
    return {
    }
  },
  methods: {
  },
}
</script>

<style>
.snapshot {
  height: 100%;
  width: 100%;
}
.ImagePart {
    height: 92%;
}
.DescriptionPart {
    padding-top: 5vh;
    height: 8%;
    width: 100%;
    justify-content: center;
    align-content: center;
    font-size: 4vh;
    text-align: center;
    color: black;
}
</style>