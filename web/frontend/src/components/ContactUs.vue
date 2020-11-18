<template>
  <v-container class="CUWrapper m-auto">
      <v-row class="CURow">
          <v-col cols="12" sm="6" md="4" class="CUCol">
              <ProfileCard :profileName="names.Soyoung" :BackImage="Bimg.Sisong" :profileImage="profileImg.SoyoungPro" :profileDescription="profileDes.SoyoungDes" />
          </v-col>
          <v-col cols="12" sm="6" md="4" class="CUCol">
              <ProfileCard :profileName="names.Sisong" :BackImage="Bimg.Sisong" :profileImage="profileImg.SisongPro" :profileDescription="profileDes.SisongDes" />
          </v-col>
          <v-col cols="12" sm="6" md="4" class="CUCol">
              <ProfileCard :profileName="names.Myungsoo" :BackImage="Bimg.Myungsoo" :profileImage="profileImg.MyungsooPro" :profileDescription="profileDes.MyungsooDes" />
          </v-col>
      </v-row>
      <v-row class="CURow">
          <v-col cols="12" sm="6" md="4" class="CUCol">
              <ProfileCard :profileName="names.Innam" :BackImage="Bimg.Sisong" :profileImage="profileImg.InnamPro" :profileDescription="profileDes.InnamDes" />
          </v-col>
          <v-col cols="12" sm="6" md="4" class="CUCol">
              <ProfileCard :profileName="names.Joohyun" :BackImage="Bimg.Sisong" :profileImage="profileImg.JoohyunPro" :profileDescription="profileDes.JoohyunDes" />
          </v-col>
          <v-col cols="12" sm="6" md="4" class="CUCol">
              <ProfileCard :profileName="names.Soomi" :BackImage="Bimg.Sisong" :profileImage="profileImg.SoomiPro" :profileDescription="profileDes.SoomiDes" />
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
import ProfileCard from "@/components/ProfileCard.vue"

export default {
    name: "ContactUs",
    components: {
        ProfileCard
    },
    data () {
        return {
            names: {
                Soyoung: "김소영",
                Sisong: "남시성",
                Myungsoo: "박명수",
                Innam: "박인남",
                Joohyun: "박주현",
                Soomi: "조수미",
            },
            profileImg: {
                SoyoungPro: "Soyeong.jpg",
                SisongPro: "Sisong.jpg",
                MyungsooPro: "Myungsoo.jpg",
                InnamPro: "Innam.jpg",
                JoohyunPro: "Joohyun.jpg",
                SoomiPro: "Soomi.jpg",
            },
            Bimg: {
                Sisong: "SisongBack.png",
                Myungsoo: "MyungsooBack.png"
            },
            profileDes: {
                SoyoungDes: "부사장",
                SisongDes: "세일즈맨",
                MyungsooDes: "CFO",
                InnamDes: "대표이사",
                JoohyunDes: "인턴",
                SoomiDes: "부장",
            }
        }
    },
    methods: {

    }
}
</script>

<style>
.CUWrapper {
    justify-content: center;
    align-items: center;
    height: 90vh;
    width: 70vw;
}
.CURow {
    justify-content: center;
    width: 100%;
    height: 50%;
}
.CUCol {
    margin: auto;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>