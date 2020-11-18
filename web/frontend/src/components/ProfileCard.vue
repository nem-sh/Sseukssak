<template>
    <div class="flip-card">
        <div class="flip-card-inner">
        <div class="flip-card-front">
            <div class="person">
                <div class="person-picture">
                    <img :src="require(`@/assets/${profileImage}`)" alt="No Image" class="img-fluid">
                </div>
                <div class="person-content">
                    <h3 class="person-name">{{profileName}}</h3>
                    <h4 class="person-description">{{profileDescription}}</h4>
                </div>
            </div>
        </div>
        <div class="flip-card-back">
            <img :src="require(`@/assets/${BackImage}`)" alt="No Image" class="img-fluid">
        </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProfileCard",
    props: {
        profileName: String,
        profileImage: String,
        profileDescription: String,
        BackImage: String,
    },
    data () {
        return {

        }
    }


}
</script>

<style>
.flip-card {
  background-color: transparent;
  width: 15vw;
  height: 37vh;
  /* border: 1px solid #f1f1f1; */
  border: none;
  border-radius: 5%;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
  justify-content: center;
  /* box-shadow: 0px 0px 20px #000; */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
    border-radius: 5%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  justify-content: center;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  /* background-color: black; */
    border-radius: 5%;
  color: black;
}

/* Style the back side */
.flip-card-back {
    border-radius: 5%;
  color: white;
  transform: rotateY(180deg);
}
.flip-card-back img {
    height: 100%;
    width: 100%;
    border-radius: 5%;
}
.person {
  /* padding: 30px 0 40px;
  margin-bottom: 30px; */
  width: 100%;
  height: 100%;
  background-color: #f7f5ec;
  text-align: center;
  overflow: hidden;
  position: relative;
  border-radius: 5%;
}

.person .person-picture {
    padding-top: 10%;
  display: inline-block;
  height: 50%;
  width: 130px;
  margin-bottom: 50px;
  z-index: 1;
  position: relative;
}

.person .person-content {
    margin-top: 5%;
    width: 100%;
    height: 55%;
}

.person .person-picture img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: scale(1);
  transition: all 0.9s ease 0s;
}

.person .person-description {
  display: block;
  font-size: 15px;
  color: #4e5052;
  text-transform: capitalize;
}
</style>