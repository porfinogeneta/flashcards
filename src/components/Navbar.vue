<template>
  <div id="nav">
    <router-link class="home" to="/">Home</router-link>
<!--    <router-link class="about" to="/about">About</router-link>-->
    <button v-if="store.state.UserData.isLoggedIn !== false"
            class="logout" @click="isShowingPopUp = true">Logout</button>
  </div>
  <Popup v-show="isShowingPopUp" @exit-popup="Logout">
    <template v-slot:properties>
      Logout
    </template>
    <template v-slot:ButtonExitPopUp>
      Logout
    </template>
  </Popup>
</template>

<script>
import fire from '../utilities/fire';
import {useStore} from 'vuex';
import {ref} from 'vue';
import Popup from "@/components/Popup";

export default {
  name: "Navbar",
  components: {Popup},
  setup() {

    const store = useStore();

    const isShowingPopUp = ref(false)

    function Logout(payload) {
      isShowingPopUp.value = false
      if (payload === 'accepted') {
         fire
          .auth()
          .signOut()
          .then(() => alert('logout'))
      }

    }
    return {
      Logout,
      isShowingPopUp,
      store
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