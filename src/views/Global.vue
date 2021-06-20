<template>
  <section class="container">
    <h1 class="title">Learn with Wai</h1>
    <div class="DeckList" v-for="deck in state.Decks" :key="deck">
      <div class="Deck" @click="OpenDeckOverview(deck)">
        <p class="name">{{deck.name}}</p>
        <span class="minorInfo">
          <p id="items">items: {{deck.length}}</p>
          <p id="alphabet">alphabet: {{deck.alphabet}}</p>
        </span>
        <p class="author">author: {{deck.author}}</p>
      </div>
    </div>
  </section>
  <Loading v-show="state.isLoading" :load-description="'Preparing Decks'"></Loading>
</template>

<script>
import {onMounted, reactive} from "vue";
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import GetGlobalDecksNames from "@/utilities/externalFunctions/GetGlobalDecksNames";
import {GetGlobalFlashcards} from "@/utilities/externalFunctions/GetGlobalFlashcards";
import Loading from "@/LoadingComponents/Loading";

export default {
  name: "Global",
  components: {Loading},
  setup() {

    // const store = useStore()

    const router = useRouter()

    const state = reactive({
      Decks: [],
      isLoading: true
    })

    onMounted(async() => {
      state.Decks = await GetGlobalDecksNames();
      state.isLoading = false
    })

    function OpenDeckOverview(deck) {
      router.replace({name: 'globalDecs', params: {id: deck.id}})
    }

    return {
      state,
      OpenDeckOverview
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 1em;
  .DeckList {
    margin: auto;
    @media (min-width: 1080px) {
      width: 70%;
    }
    .Deck {
      margin: 7px 7px 7px 7px;
      display: flex;
      align-items: center;
      //justify-content: center;
      text-align: center;
      flex-direction: column;
      border: solid 3px $green-main;
      border-radius: 7px 7px 7px 7px;
      &:hover {
        cursor: pointer;
      }
      .name {
        font-weight: bold;
        font-size: 2em;
      }
      .minorInfo {
        font-weight: bold;
        font-size: 1em;
        display: flex;
        width: 80%;
        justify-content: space-evenly;
        #alphabet {
          color: blue;
        }
        #items {
          color: #169e16;
        }
      }
      .author {
        font-size: 0.8em;
        margin-right: 1em;
        display: flex;
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
}
</style>