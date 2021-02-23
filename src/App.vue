<template>
  <div id="nav">
    <router-link class="home" to="/">Home</router-link>
    <router-link class="flashcards" to="/flashcardSurfer">Flashcards</router-link>
    <router-link class="about" to="/about">About</router-link>
  </div>
  <router-view/>
</template>

<script>

</script>


<style scoped lang="scss">

#nav {
  margin: 0;
  padding: 0;
  background: #00ba21;
  width: 100%;
  height: 7vh;
  font-weight: bold;
  font-size: 30px;
  align-items: center;
  .home {
    position: absolute;
    top: 2vh;
    color: #f5f1f1;
    left: 5%;
  }
  .about {
    position: absolute;
    top: 2vh;
    color: #f5f1f1;
    right: 5%;
  }
  .flashcards {
    position: absolute;
    top: 2vh;
    color: #f5f1f1;
    left: 45%;
    right: 45%;
  }
}
</style>
