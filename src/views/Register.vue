<template>
  <section class="LoginPage">
    <h1 class="Header">Register</h1>
    <p>with</p>
    <section class="GoogleLogin" @click="LoginWithGoogle">
      <img class="GoogleButton" src="../assets/btn_google_signin.png">
    </section>
    <h3 class="Header">Create Account</h3>
    <form class="LoginForm" @submit="Register">
      <input class="inputBox enterData" type="email" placeholder="Enter your email..." v-model="Email">
      <input class="inputBox enterData" type="password" placeholder="Password..." v-model="Password">
      <input type="submit" class="inputBox buttonLogin" value="Register">
    </form>
    <section class="LoginLink">
      <router-link to="/login" class="link">Login Here</router-link>
    </section>
  </section>

</template>

<script>
import {reactive, ref} from 'vue'
import fire from '../utilities/fire'
import provider from '../utilities/fire'
import {useRouter} from 'vue-router'
import firebase from "firebase/app"


export default {
  name: "Login",
  setup() {

    // const state = reactive({
    //
    // })

    const Email = ref('')
    const Password = ref('')
    const router = useRouter()

    const Register = () => {
      fire
          .auth()
          .createUserWithEmailAndPassword(Email.value, Password.value)
          .then(UserObject => {
              const AuthUserRef = fire.database().ref('UsersData/' + UserObject.user.uid)
              const UserProfile = {
                email: UserObject.user.email,
                decsCreated: 0
              }
              fire.database().ref('UsersData/UserMeta').set(UserProfile)

            },
          fire
              .auth()
              .signInWithEmailAndPassword(Email.value, Password.value)
              .then(router.push('/'))
              .catch(err => console.log(err.message))
          )
          .catch(err => console.log(err.message))
    }

    const LoginWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider()
      fire
          .auth()
          .signInWithPopup(provider)
          .then(UserObject => {
              const AuthUserRef = fire.database().ref('UsersData/' + UserObject.user.uid)
              const UserProfile = {
                email: UserObject.user.email,
                decsCreated: 0
              }
              fire.database().ref('UsersData/UserMeta').update(UserProfile)
              router.push('/')
            },
          )
          .catch(err => console.log(err.message))
    }

    return {
      Email,
      Password,
      Register,
      LoginWithGoogle
    }
  }
}
</script>

<style scoped lang="scss">
.LoginPage {
  font-size: 2ch;
  //background: #838383;
  flex-direction: column;
  //height: 90vh;
  display: flex;
  padding: 15vh;
  //
  align-items: center;
  @media (max-width: 764px) {
    justify-content: center;
    padding: 4ch;
    margin: 20px;
  }
  .GoogleLogin {
    //max-width: 80vw;
    //min-width: auto;
    .GoogleButton {
      max-width: 80vw;
      min-width: auto;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .Header {
    margin: 12px;
    width: 80vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  .LoginForm {
    display: flex;
    flex-direction: column;
    .inputBox {
      font-size: 2.5ch;
      max-width: 75vw;
      margin: 1.5vh;
      border-radius: 7px;
      padding: 7px;

    }
    .buttonLogin {
      color: white;
      margin: auto;
      width: 100%;
      border: none;
      background-color: #06d006;
      -webkit-transition: background-color 1s ease-out;
      -moz-transition: background-color 1s ease-out;
      -o-transition: background-color 1s ease-out;
      transition: background-color 1s ease-out;
      &:hover {
        cursor: pointer;
        background-color: #5dee08;
        font-weight: bold;
      }
    }
    .enterData {
      &:focus {
        outline: none;
        border: solid #0adb0a;
      }
    }
  }
  .LoginLink {
    font-size: 2.5ch;
    border-bottom: solid black;
    margin-top: 4vw;
    color: black;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>

