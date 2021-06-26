<template>
  <section class="container">
    <h1 class="title">{{Deck.meta.name}}</h1>
    <section class="gridContainer">
      <span class="bin normalButton" @click="state.isShowingPopup = true">
        <p style="margin: 0 7px 0 0">Delete</p>
        <font-awesome-icon style="color: #dad6d6" :icon="['fas', 'trash-alt']" size="1x"></font-awesome-icon>
      </span>
      <router-link :to="{name: 'CreateCard', params: {id: Deck.meta.name}}" tag="button" class="normalButton selectMode">Edit Flashcards</router-link>
      <router-link :to="{name: 'LearnFlashcards', params: {id: Deck.meta.name}}" tag="button" class="normalButton selectMode">Learn</router-link>
      <router-link v-if="Deck.meta.alphabet === 'Non-Latin'" :to="{name: 'Calligraphy', params: {id: Deck.meta.name}}" tag="button" class="normalButton selectMode">Calligraphy</router-link>
      <router-link v-if="!state.isShared" :to="{name: 'Global'}" class="normalButton Global" @click="ShareDeck">Share deck</router-link>
      <button v-else class="normalButton Global Cancel" @click="CancelShare">Cancel Sharing</button>
    </section>
    <table class="overview" >
      <tr>
        <th>Term</th>
        <th>Definition</th>
      </tr>
      <tr v-for="(flashcard, index) in Deck.flashcards" :key="index">
        <td class="term">{{flashcard.term}}</td>
        <td class="definition">{{flashcard.definition}}</td>
      </tr>
    </table>
  </section>
  <Popup v-show="state.isShowingPopup"
     @exit-popup="RemoveDeck">
    <template v-slot:properties>
      <div class="properties">
        <p v-if="!isLoadingAsync">Remove your deck? Are you sure?</p>
        <p v-else>Loading...</p>
      </div>
    </template>
    <template v-slot:ButtonExitPopUp >
      Yes, remove
    </template>
  </Popup>
  <Loading v-show="isLoadingAsync" v-bind:load-description="'Loading'"></Loading>
</template>

<script>
import {useStore} from 'vuex';
import {computed, onBeforeMount, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {getFlashcardsFromStore} from "@/utilities/externalFunctions/getFlashcardsFromStore";
import checkToSeeChosenDeck from "@/utilities/externalFunctions/checkToSeeChosenDeck";
import fire from "@/utilities/fire";
import {CreateUserDecksList} from "@/utilities/externalFunctions/CreateUserDecksList";
import Popup from "@/components/Popup";
import Loading from "@/LoadingComponents/Loading";

export default {
  name: "DeckView",
  components: {
    Loading,
    Popup
  },
  setup(props, _) {

    const store = useStore()
    const router = useRouter()

    const isLoadingAsync = ref(false);

    onBeforeMount(() => {
      checkToSeeChosenDeck(store);
      CheckIfShared()
      // Validate();
    })

    const state = reactive({
      Deck: '',
      Flashcards: '',
      isShowingPopup: false,
      isShared: false,
      deckShared: {} // object with shared decs
    })
    // cancel share
    const CancelShare = async () => {
      isLoadingAsync.value = true
      await fire.database().ref(`GlobalFlashcards/DeckNames/${Deck.value.id}`).remove()
      await fire.database().ref(`GlobalFlashcards/flashcards/${Deck.value.id}`).remove()
      await fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/UserMeta/decksShared/${state.deckShared.key}`).remove()
      state.isShared = false
      isLoadingAsync.value = false
    }

    const FolderInfo = computed(() => {
      return store.state.ChosenFolder
    })

    const Deck = computed(() => {
      // state.Flashcards = store.state.ChosenDeck.flashcards
      return store.state.ChosenDeck
    })

    const ShareDeck = async() => {
      let Ref = fire.database().ref('GlobalFlashcards')
      // let UniqueID = Ref.push().key
      let DeckName = {
        name: Deck.value.meta.name,
        alphabet: Deck.value.meta.alphabet,
        length: Deck.value.meta.length,
        author: store.state.UserData.AuthUser.displayName
      }
      let newMeta = Object.assign(Deck.value.meta, {author: store.state.UserData.AuthUser.displayName})
      let FlashcardsObject = {
        meta: newMeta,
        flashcards: Deck.value.flashcards,
      }
      isLoadingAsync.value = true
      await fire.database().ref(`GlobalFlashcards/DeckNames/${Deck.value.id}`).update(DeckName)
      await fire.database().ref(`GlobalFlashcards/flashcards/${Deck.value.id}`).update(FlashcardsObject)
      await fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/UserMeta/decksShared`).push({id: Deck.value.id, name: Deck.value.meta.name})
      CheckIfShared()
      isLoadingAsync.value = false
    }

    const CheckIfShared =  async () => {
      let shares = []
      await fire.database()
          .ref(`UsersData/${store.state.UserData.AuthUser.uid}/UserMeta/decksShared`)
          .on('value', (snapshot) => {
            const data = snapshot.val()
            Object.keys(data).forEach(key => {
              shares.push({
                key: key,
                id: data[key].id,
                name: data[key].name
              })
            })
            console.log(data)
            shares.forEach(checkForCurrentFolder)
          })
      console.log(state.isShared, 'shared?')
    }

    const checkForCurrentFolder = (data) => {
      if (data.id === Deck.value.id) {
        state.deckShared = data
        return state.isShared = true
      }else {
        return  state.isShared = false
      }
    }

    const RemoveDeck = async (payload) => {
      if (payload === 'accepted') {
        isLoadingAsync.value = true
        // removes when the user accepted
        await fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/${FolderInfo.value.id}/decks/DecsNames/${Deck.value.id}`).remove();
        await fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/${FolderInfo.value.id}/decks/flashcards/${Deck.value.id}`).remove();
        isLoadingAsync.value = false
        router.go(-1);
        store.commit('ChangeChosenDeck', null)
      }
      state.isShowingPopup = false

    }


    return {
      state,
      Deck,
      RemoveDeck,
      isLoadingAsync,
      ShareDeck,
      CancelShare
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 1em;
  margin-top: 3em;
  .gridContainer {
    width: 90%;
    //background-color: #ba0a0a;
    padding: 1em;
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    @media (min-width: 1080px) {
      width: 50%;
    }

    .Global {
      background-color: blue;
      color: #dad6d6;
      text-align: center;
      font-weight: bold;
    }
    //.Cancel {
    //  background-color: #f0690c;
    //}

    .bin {
      background-image: linear-gradient(to right, #e13100, #ec0000);
      color: #dad6d6;
      font-weight: bold;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 7px 7px 7px 7px;
    }

    .selectMode {
      background-image: linear-gradient(to right, #72cd05, #07c636);
      color: #ffffff;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

  }
  .title {
    font-size: 3em;
  }
  .modesOverview {

  }
  .overview {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    font-size: 1.2em;
    width: 90%;
    @media (min-width: 1080px) {
      width: 70%;
      font-size: 1.8em;
    }
    .term {
      text-align: left;
      width: 50%;
      padding: 0.5em;

    }
    .definition {
      text-align: right;
      padding: 0.5em;
      width: 50%;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    th {
      font-size: 1em;
    }
    //td, th {
    //  //border: 1px solid black;
    //  //margin: 0;
    //}
    tr:nth-child(even){
      background-color: #f1f1f1;
    }

  }
}

</style>