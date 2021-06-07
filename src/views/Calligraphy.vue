<template>
  <div class="container">
    <section class="headerSection">
      <div class="title headerInfo">
        <font-awesome-icon style="color: #dad6d6; margin-left: 1rem" :icon="['fa', 'pencil-ruler']"/>
        <h2>Calligraphy</h2>
      </div>
      <div class="deckInfo"><h3>{{ state.name}}</h3></div>
    </section>
    <div class="drawingSpace">
      <Redraw v-if="state.Current.mode === 0"
              :drawing-object="state.Symbol"
              :flashcard="state.Current"/>
      <LookAndDraw v-else-if="state.Current.mode === 1"
               :drawing-object="state.Symbol"
               :flashcard="state.Current"/>
      <DrawByTranslation v-else
               :drawing-object="state.Symbol"
               :flashcard="state.Current"/>
    </div>
    <div class="navbtn">
      <button class="normalButton" type="button" @click="getAnotherFlashcard('review')">
        Draw Again
      </button>
      <button class="normalButton" type="button" @click="getAnotherFlashcard('drawn')">
        Done!
      </button>
    </div>
  </div>

</template>

<script>
import {computed, onMounted, reactive} from "vue";
import {useRouter} from 'vue-router'
import {shuffle} from "@/utilities/externalFunctions/shuffle";
import {useStore} from 'vuex'
import checkToSeeChosenDeck from '../utilities/externalFunctions/checkToSeeChosenDeck'
import {
  getFlashcardsFromStore
} from "@/utilities/externalFunctions/getFlashcardsFromStore";
import Redraw from "@/components/Callgraphy/Redraw";
import LookAndDraw from "@/components/Callgraphy/LookAndDraw";
import DrawByTranslation from "@/components/Callgraphy/DrawByTranslation";

export default {
  name: "Calligraphy",
  components: {DrawByTranslation, LookAndDraw, Redraw},
  setup() {

    const store = useStore();
    const router = useRouter()

    const state = reactive({
      flashcards: '',
      name: '',
      Current: {},
      currentFlashcardIndex: 1,
      CurrentFlashcards: [],
      ReviewFlashcards: [],
      NextFlashcards: [],
      Symbol: ''
    })

    onMounted(() => {
      checkToSeeChosenDeck(store)
      ValidateFlashcards()
    })

    function ValidateFlashcards() {
      let flashcards = []
      if (getFlashcardsFromStore()){
        let FolderObject = getFlashcardsFromStore()
        state.name = FolderObject.meta.name
        flashcards = FolderObject.flashcards
        flashcards.forEach(changeFlashcardsToCalligraphy)
        state.flashcards = flashcards
        state.CurrentFlashcards = shuffle(flashcards)
        state.Current = state.CurrentFlashcards[state.currentFlashcardIndex]
        getCharacters(state.Current.basicWord)
      }
    }

    // creates proper Calligraphy flashcards
    function changeFlashcardsToCalligraphy(index) {
      Object.assign(index, {mode: 0})
    }

    async function getCharacters(string) {
      let Symbol = [];
      let Letters = [];
      let CharList = [];
      let newString = replaced(string)

      console.log(newString, 'new string')

      for (let i = 0; i < newString.length; i++){
        CharList.push(newString[i])
      }
      console.log(CharList, 'char list')
      CharList.forEach( character => {
        // console.log(character, 'character')
        let code = character.charCodeAt(character);
        // console.log(code)
        if (48 < code && code < 696) {
          Letters.push(character)
          console.log(Letters, 'letters')
        }else {
          Symbol.push(character)
          console.log(Symbol, 'symbol')
          // Symbol.push(character)
          // console.log(Symbol)
        }
      })
      state.Symbol = Symbol.join('') // makes a string from characters in array, by deleting spaces and commas
    }

    function replaced(string){
      return string
          .replaceAll(' ', '')
          .replaceAll('  ', '')
          .replaceAll(')', '')
          .replaceAll('(', '')
          .replaceAll('[', '')
          .replaceAll(']', '')
          .replaceAll(',', '')
          .replaceAll('-', '')
    }


    // keep tracks of what flashcard to show
    function getAnotherFlashcard(payload) {

      if (state.Current.mode === 3) {
        state.CurrentFlashcards.splice(state.currentFlashcardIndex, 1)
        if (state.CurrentFlashcards.length === 0){
          router.go(-1)
        }
      }

      if (payload === 'drawn') {
        state.Current.mode ++
      }
      state.currentFlashcardIndex ++;
      if (state.currentFlashcardIndex > (state.CurrentFlashcards.length - 1)) {
        shuffle(state.CurrentFlashcards)
        // state.CurrentFlashcards.push(state.ReviewFlashcards, state.NextFlashcards)
        state.currentFlashcardIndex = 0;
      }


      console.log(state.Current)

      state.Current = state.CurrentFlashcards[state.currentFlashcardIndex]
      getCharacters(state.Current.basicWord)
      ClearCanvas();
    }

    const ClearCanvas = () => {
      store.commit('ChangeClearCanvasSettings', true)
    }

    return {
      state,
      getAnotherFlashcard
    }
  }

}
</script>

<style scoped lang="scss">
.container {
  font-size: 2em;
  @media (max-width: 764px) {
    font-size: 1em;
  }
  //background-color: pink;
  .headerSection {
    background: #06d006;
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    text-align: center;
    @media (max-width: 764px) {
      padding: 0.7rem;
    }
  }
  .drawingSpace {
    //background: #ba0a0a;
    min-height: 60vh;
    text-align: center;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .navbtn {
    margin-top: 4em;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}


</style>