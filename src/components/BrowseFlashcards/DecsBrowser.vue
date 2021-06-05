<template>
  <Loading v-if="state.isLoading" :load-description="'Getting decks...'"></Loading>
  <section v-else class="all">
    <section class="Info">
      <h1 class="title">{{Folder}}</h1>
      <span class="Icon" @click="state.isShowingPopup = true">
        <font-awesome-icon :icon="['fas', 'trash-alt']" size="2x"/>
      </span>
    </section>
    <section class="displayFolders" >
      <section @click="MoveToCreation">
        <div
            class="slotButton Folder" id="adder"
        >
          <p style="font-size: 120px">
            +
          </p>
        </div>
      </section>
      <section v-for="deck in state.Decks" :key="deck">
        <div class="Folder" @click="WhatDirectory(deck)">
          {{deck.name}}
          {{deck.alphabet}}
          Length: {{deck.length}}
        </div>
      </section>

    </section>
    <Modal v-if="state.isShowingModal" @hide-modal="state.isShowingModal = false">
      <template v-slot:titleOfPopup>
        <div class="DeckInfo">
          <p>{{state.CurrentDeck.name}}</p>
          <span class="bin">
            <font-awesome-icon class="binIcon" @click="RemoveDeck" :icon="['fas', 'trash-alt']" size="1x"></font-awesome-icon>
          </span>
        </div>
      </template>
      <template v-slot:PropertiesToShow>
        <section class="gridContainer">
          <router-link :to="{name: 'CreateCard', params: {id: state.CurrentDeck.name}}" tag="button" class="normalButton selectMode">Edit Flashcards</router-link>
          <router-link :to="{name: 'LearnFlashcards', params: {id: state.CurrentDeck.name}}" tag="button" class="normalButton selectMode">Learn</router-link>
          <router-link v-if="state.CurrentDeck.alphabet === 'Non-Latin'" :to="{name: 'Calligraphy', params: {id: state.CurrentDeck.name}}" tag="button" class="normalButton selectMode">Calligraphy</router-link>
        </section>
      </template>
    </Modal>
    <Popup v-show="state.isShowingPopup"
           @exit-popup="removeFolder">
      <template v-slot:properties>
        <div class="properties">
          Remove your folder? Are you sure?
        </div>
      </template>
      <template v-slot:ButtonExitPopUp >
        Yes, remove
      </template>
    </Popup>

  </section>


</template>

<script>
import {CreateUserDecksList} from "@/utilities/externalFunctions/CreateUserDecksList";
import getFlashcardsFromGivenDeck from "@/utilities/externalFunctions/getFlashcardsFromGivenDeck";
import {useStore} from 'vuex'
import Modal from "@/components/Modal";
import Loading from "@/LoadingComponents/Loading";
import {onMounted, reactive, computed} from "vue";
import {useRouter} from 'vue-router'
import fire from "@/utilities/fire";
import Popup from "@/components/Popup";

export default {
  name: "FlashcardsBrowser",
  components: {Popup, Loading, Modal},
  props: {
    folder: {
      required: true,
      type: String
    },
  },
  setup(props, _) {

    const state = reactive({
      Decks: [],
      isLoading: true,
      isShowingModal: false,
      isShowingPopup: false,
      CurrentDeck: '',
      DeckName: '',
      toDelete: false
    })

    // gets prop from router
    const Folder = computed(() => {
      return props.folder
    })

    const FolderInfo = computed(() => {
      return store.state.ChosenFolder
    })

    const store = useStore();
    const router = useRouter();

    onMounted(async () => {
      // gets all decks from given folder
      state.Decks = await CreateUserDecksList(store.state.UserData.AuthUser.uid, fire, FolderInfo.value.id)
      state.isLoading = false
    })



    async function WhatDirectory(deck) {
      await getFlashcardsFromGivenDeck(FolderInfo.value.id, deck.id) // load flashcards, which are chosen
      state.isShowingModal = true
      state.CurrentDeck = deck
      console.log(state.CurrentDeck, 'what directory')
    }

    const RemoveDeck = async () => {
      // removes when the bin is pressed
      await fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/${FolderInfo.value.id}/decks/DecsNames/${state.CurrentDeck.id}`).remove();
      await fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/${FolderInfo.value.id}/decks/flashcards/${state.CurrentDeck.id}`).remove();
      state.Decks = await CreateUserDecksList(store.state.UserData.AuthUser.uid, fire, FolderInfo.value.id)
      state.isShowingModal = false;
    }

    function MoveToCreation() {
      // creates new flashcards
      store.state.CreationMode = true
      store.commit('ChangeChosenDeck', null)
      // store.state.ChosenFolder = null
      router.push({name: 'CreateCard', params: {id: 'creation'}})
    }

    const removeFolder = async (payload) => {
      if (payload === 'accepted') {
        await fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/${FolderInfo.value.id}`).remove();
        router.push('/')
      }
      state.isShowingPopup = false
    }

    const ChangeShowPopUp = () => {
      state.isShowingPopup = !state.isShowingPopup
    }

    return {
      WhatDirectory,
      MoveToCreation,
      RemoveDeck,
      Folder,
      removeFolder,
      state,
      ChangeShowPopUp
    }
  }
}
</script>

<style scoped lang="scss">
.all {
  margin-left: 25%;
  margin-right: 25%;
  //margin-top: 5%;
  @media (max-width: 764px){
    margin-left: 0;
    margin-right: 0;
    margin-top: 10%;
  }

  .properties {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    width: 100%;
    height: 100%;
    color: #ba0a0a;
    font-weight: bold;
  }

  .DeckInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .Info {
    margin-top: 2vh;
    margin-left: 2vw;
    margin-right: 2vw;
    border: solid 2px #9a9a9a;
    border-radius: 7px 7px 7px 7px;
    padding: 1.5em;
    font-size: 2em;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .title {
      border-bottom: solid 2px;
    }
    .Icon {
      color: #9a9a9a;
      &:hover {
        color: crimson;
        cursor: pointer;
      }
    }
  }



  .gridContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;

    .selectMode {
        background-image: linear-gradient(to right, #72cd05, #07c636);
        color: #ffffff;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.4s ease-out;
    }

  }
  .bin {
      padding: 7px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      //background-color: #5dee08;
      .binIcon {
        //width: 30%;
        &:hover {
          color: crimson;
          cursor: pointer;
        }
      }
    }


  .displayFolders {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    @media (max-width: 764px){
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }

    .Folder {
      border-radius: 18px;
      background: #dad6d6;
      border: solid gray;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 5em;
      min-width: 10em;
      margin: 20px;
      font-size: 24px;
      color: black;
      &:hover {
        transition: all .2s ease-in-out;
        background: #48c814;
        cursor: pointer;
        transform: scale(1.1);
        //background-color: #afaeae;
      }
      //@media (max-width: 764px){
      //  grid-template-columns: 1fr;
      //  grid-template-rows: 1fr;
      //}
    }

  }
  #adder {
    background-image: linear-gradient(to right, #838383, #6f7470);
    color: #f5f1f1;
    font-weight: 700;
  }
}

</style>