<template>
  <meta charset="utf-8">
  Hello World
  <Navbar/>
  <router-view/>
  <Loading v-show="isLoading" :load-description="'Loading...'"/>
</template>

<script>
import {onBeforeMount, computed, ref} from 'vue'
import { useRouter} from 'vue-router';
import fire from './utilities/fire';
import { useStore } from 'vuex'
import Navbar from "@/components/Navbar";
import Loading from "@/LoadingComponents/Loading";

export default {
  name: "App",
  components: {Loading, Navbar},
  setup() {

    const store = useStore()

    const router = useRouter()

    const isLoading = ref(false)

    // const isLoggedIn = computed(() => store.state.UserData.isLoggedIn)


    onBeforeMount(() => {
      isLoading.value = true
      fire.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('logged')
          router.replace('/')
          store.commit('ChangeIsLoggedIn', true)
          store.commit('ChangeAuthUser', user)
        }else {
          console.log('not logged')
          router.replace('/login')
          store.commit('ChangeIsLoggedIn', false)
          store.commit('ChangeAuthUser', null)
        }
        isLoading.value = false
      })
    })

    return {
      isLoading
    }
  }
}

</script>


<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

</style>
