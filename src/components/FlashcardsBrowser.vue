<template>
  <section class="all">
    <section class="displayFolders">
      <section v-for="deck in Folders" :key="deck">
        <div class="Folder" @click="WhatDirectory(deck)">
          {{deck.name}}
        </div>
      </section>
      <section @click="MoveToCreation">
        <div
            class="slotButton Folder" id="adder"
        >
          <p style="font-size: 120px">
            +
          </p>
        </div>
      </section>
    </section>
    <Modal v-if="state.isShowingModal" @hide-modal="state.isShowingModal = false">
      <template v-slot:titleOfPopup>
        {{state.CurrentFolder}}
      </template>
      <template v-slot:PropertiesToShow>
        <router-link to="/CreateCard" tag="button" class="slotButton">Edit Flashcards</router-link>
        <router-link to="/flashcardView" tag="button" class="slotButton">Learn</router-link>
      </template>
    </Modal>

  </section>


</template>

<script>
import {CreateFolderListMixin} from '../utilities/mixins/createListOfUserFolders'
import {useStore} from 'vuex'
import Modal from "@/components/Modal";
import {reactive} from "vue";
import {useRouter} from 'vue-router'

export default {
  name: "FlashcardsBrowser",
  components: {Modal},
  mixins: [CreateFolderListMixin],
  setup() {

    const router = useRouter()

    const state = reactive({
      isShowingModal: false,
      CurrentFolder: '',
      DeckName: ''
    })

    const store = useStore()

    function WhatDirectory(deck) {
      store.commit('changeChosenFolder', deck)
      state.isShowingModal = true
      state.CurrentFolder = store.state.ChosenFolder.name
    }

    function MoveToCreation() {
      store.state.CreationMode = true
      store.state.ChosenFolder = null
      router.push('/CreateCard')
    }

    return {
      WhatDirectory,
      MoveToCreation,
      state
    }
  }
}
</script>

<style scoped lang="scss">
.all {
  margin-left: 25%;
  margin-right: 25%;
  margin-top: 5%;
  @media (max-width: 764px){
    margin-left: 0;
    margin-right: 0;
    margin-top: 10%;
  }

  .slotButton {
    font-size: 24px;
    display: inline;
    border: none;
    background-image: linear-gradient(to right, #72cd05, #07c636);
    border-radius: 8px;
    color: #ffffff;
    box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
    transition: 0.4s ease-out;
    margin: 4px;
    padding: 7px;
    &:hover {
      box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
      cursor: pointer;
    }
    &:focus{
      outline: 0;
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
      background: #c6c1c1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 10em;
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