<template>
  <v-container class="IntroBox">
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
.IntroBox {
  height: 85vh;
  margin-bottom: 10vh;
  padding-top: 0;
  width: 65vw;;
}
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