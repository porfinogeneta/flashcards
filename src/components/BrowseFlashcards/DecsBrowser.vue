<template>
  <Loading v-if="state.isLoading" :load-description="state.loadInfo"></Loading>
  <section v-else class="all">
    <section class="Info">
      <h1 class="title">{{Folder}}</h1>
      <section class="UnderTitle">
        <div
            @click="MoveToCreation"
            class="" id="adder"
        >
          <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
        </div>
        <div class="Icon" @click="state.isShowingPopup = true">
          <font-awesome-icon :icon="['fas', 'trash-alt']" size="2x"/>
        </div>
      </section>

    </section>
    <section class="displayFolders" >
      <section v-for="deck in state.Decks" :key="deck">
        <div class="Folder" @click="WhatDirectory(deck)">
          {{deck.name}}
          {{deck.alphabet}}
          Length: {{deck.length}}
        </div>
      </section>

    </section>
  </section>
  <Popup v-show="state.isShowingPopup"
         @exit-popup="RemoveFolder">
    <template v-slot:properties>
      <div class="properties">
        Remove your folder? Are you sure?
      </div>
    </template>
    <template v-slot:ButtonExitPopUp >
      Yes, remove
    </template>
  </Popup>

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
  components: {Popup, Loading},
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
      toDelete: false,
      loadInfo: 'Getting decks...'
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
      state.isLoading = true
      state.loadInfo = 'Deck...'
      await getFlashcardsFromGivenDeck(FolderInfo.value.id, deck.id) // load flashcards, which are chosen
      state.isLoading = false
      let deckName = deck.name
      router.push({name: 'Deck', params: {deck: deckName}})
      // state.isShowingModal = true
      state.CurrentDeck = deck
      // console.log(state.CurrentDeck, 'what directory')
    }

    function MoveToCreation() {
      // creates new flashcards
      store.state.CreationMode = true
      store.commit('ChangeChosenDeck', null)
      // store.state.ChosenFolder = null
      router.push({name: 'CreateCard', params: {id: 'creation'}})
    }

    const RemoveFolder = async (payload) => {
      if (payload === 'accepted') {
        state.loadInfo = 'Removing'
        state.isLoading = true
        await fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/${FolderInfo.value.id}`)
            .remove()
            .then(r => router.push('/'));
            state.isLoading = false
      }
      state.isShowingPopup = false
    }

    const ChangeShowPopUp = () => {
      state.isShowingPopup = !state.isShowingPopup
    }

    return {
      WhatDirectory,
      MoveToCreation,
      Folder,
      RemoveFolder,
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
    display: grid;
    //justify-content: space-evenly;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
        'title title'
        'UnderTitle UnderTitle';
    .title {
        margin-bottom: 7px;
        border-bottom: solid 2px;
      }
    .UnderTitle {
      grid-area: UnderTitle;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .Icon {
        color: #9a9a9a;
        &:hover {
          color: crimson;
          cursor: pointer;
        }
      }
      #adder {
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(to right, #838383, #6f7470);
        color: #f5f1f1;
        font-weight: 700;
        width: 50px;
        height: 50px;
        border-radius: 7px 7px 7px 7px;
        transition: 0.5s ease-in;
        &:hover {
          transform: scale(0.8);
        }
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
      display: flex;
      flex-direction: column;
      //flex-wrap: wrap;
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
}
.properties {
    color: #ff2d2d;
    font-weight: bold;
  }

</style>