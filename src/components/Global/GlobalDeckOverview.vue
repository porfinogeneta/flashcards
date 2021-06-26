<template>
  <section class="container">
    <h1 class="title">{{Deck.meta.name}}</h1>
    <section class="gridContainer">
      <router-link :to="{name: 'LearnFlashcards', params: {id: Deck.meta.name}}" tag="button" class="normalButton selectMode">Learn</router-link>
      <router-link v-if="Deck.meta.alphabet === 'Non-Latin'" :to="{name: 'Calligraphy', params: {id: Deck.meta.name}}" tag="button" class="normalButton selectMode">Calligraphy</router-link>
    </section>
    <table class="overview" >
      <tr>
        <th>Term</th>
        <th>Definition</th>
      </tr>
      <tr v-for="(flashcard, index) in Flashcards" :key="index">
        <td class="term">{{flashcard.term}}</td>
        <td class="definition">{{flashcard.definition}}</td>
      </tr>
    </table>
  </section>
  <Loading v-show="isLoadingAsync" :load-description="'Loading Flashcards'"></Loading>
</template>

<script>
import {useStore} from 'vuex';
import {computed, onBeforeMount, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {GetGlobalFlashcards} from "@/utilities/externalFunctions/GetGlobalFlashcards";
import Loading from "@/LoadingComponents/Loading";
import checkToSeeChosenDeck from "@/utilities/externalFunctions/checkToSeeChosenDeck";

export default {
  name: "DeckView",
  components: {
    Loading

  },
  props: {
    id: {
      type: String
    }
  },
setup(props, _) {

    const store = useStore();
    // const router = useRouter();

    const isLoadingAsync = ref(true);

    onMounted(async () => {
      isLoadingAsync.value = true
      await GetGlobalFlashcards(props.id)
      checkToSeeChosenDeck(store)
      isLoadingAsync.value = false
      console.log(Deck.value)
    })

    // isLoadingAsync.value = true
    // await GetGlobalFlashcards(props.id)
    // checkToSeeChosenDeck(store)
    // isLoadingAsync.value = false
    // console.log(Deck.value)
    // const getId = computed(() => {
    //   return props.id
    // })

    // const Deck = computed(() => {
    //   return store.state.ChosenDeck
    // })

    const state = reactive({
      Deck: '',
      Flashcards: '',
      isShowingPopup: false,
    })

    const Flashcards = computed(() => {
      return store.state.ChosenDeck.flashcards
    })


    const Deck = computed(() => {
      console.log(store.state, 'state')
      return store.state.ChosenDeck
    })


    return {
      state,
      isLoadingAsync,
      Flashcards,
      Deck
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 1em;
  margin-top: 3em;
  //background-color: #5dee08;
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

</style>