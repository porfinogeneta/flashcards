<template>
  <div id="nav">
    <router-link class="home" to="/">Home</router-link>
    <router-link class="about" to="/about">About</router-link>
    <button class="logout" @click="Logout">Logout</button>
  </div>
</template>

<script>
import fire from '../utilities/fire';

export default {
  name: "Navbar",
  setup() {
    function Logout() {
      fire
          .auth()
          .signOut()
          .then(() => alert('logout'))
    }
    return {
      Logout
    }
  }
}
</script>

<style scoped lang="scss">
#nav {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: $green-main;
  height: 7vh;
  font-weight: bold;
  font-size: 2em;
  .home {
    color: #f5f1f1;
  }
  .about {
    color: #f5f1f1;
  }
  .logout {
    background: $green-main;
    border: none;
    color: #f5f1f1;
    font-size: 1em;
    &:hover {
      cursor: pointer;
    }
  }
}

</style>