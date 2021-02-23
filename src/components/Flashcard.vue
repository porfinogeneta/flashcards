<template>
  <div>
    <div class="wholeComponent" v-if="!state.isLoading">
      <div class="CreateCard">
        <div class="listOfFlashcards">
          <div  class="flashcard"
               v-for="(card, index) in state.flashcardsList" :key="index"
          >
            <button class="deleteButton" @click="removeflashcard(index)">x</button>
            <section class="flashcardData">
              <textarea class="EditText" v-model="card.basicWord"></textarea>
              <p class="smallHint">Word</p>
            </section>
            <section class="flashcardData">
              <textarea class="EditText" v-model="card.linkToGraphic"></textarea>
              <p class="smallHint">Link to graphic</p>
            </section>
            <section class="flashcardData">
              <textarea class="EditText" v-model="card.translatedWord"></textarea>
              <p class="smallHint">Translation</p>
            </section>
        </div>
        <button class="AddFlashcardButton" @click="AddNewFlashcard">
          <p class="buttonText">AddFlashcard</p>
        </button>
      </div>
    </div>
    <div class="adder">
      <button v-if="FolderChosen.value !== ''" class="button" @click="CreateDeck">Create Deck</button>
      <p v-else>Name your folder</p>
    </div>
  </div>
  <div v-else>
    loading/..
  </div>
  </div>


</template>

<script>
import getFlashcardsFromGivenFolder from '../utilities/mixins/getFlashcardsFromFolder'
import db from '../utilities/db'
import {reactive, ref, computed, onMounted, watch} from 'vue';
import { useStore } from 'vuex'


export default {
  name: "Flashcard",

  setup() {

    const FlashcardRef = reactive(
        db.database().ref('flashcards/' + 'flashcards')
    )

    const FolderChosen = ref('')

    const store = useStore();

    const state = reactive({
      addNew: false,
      isLoading: true,
      word: '',
      translation: '',
      linkGraphic: '',
      chosenFolder: '',
      flashcardsList: []
    })

    const getFolderName = computed(() => {

      FolderChosen.value = store.state.ChosenFolder
      console.log(state.flashcardsList)
    });

    // watch([inputWord, inputTranslate], (newList, prevList) => {
    //   AddNewFlashcard()
    // })

    function removeflashcard(index) {
      state.flashcardsList.splice(index, 1)
    }

    const AddNewFlashcard = () => {

      const flashcard = {
        basicWord: state.word,
        linkToGraphic: state.linkGraphic,
        translatedWord: state.translation,
      }

      state.flashcardsList.push(flashcard)
      console.log(state.flashcardsList)
    }

    onMounted(() => {
      getFlashcardsFromGivenFolder()
    })



    const getFlashcardsFromGivenFolder = () => {


          FlashcardRef.once('value').then((snapshot) => {
            const data = snapshot.val();

            let flashcards = []

            Object.keys(data).forEach(key => {
              flashcards.push({
                id: key,
                basicWord: data[key].basicWord,
                linkToGraphic: data[key].linkToGraphic,
                translatedWord: data[key].translatedWord
              })
            })
            state.flashcardsList = flashcards
            state.flashcardsList.push({
              basicWord: '',
              linkToGraphic: '',
              translatedWord: '',
            })
            state.isLoading = false
          })
        }


    const CreateDeck = () => {

      state.flashcardsList = state.flashcardsList.filter(createValidFlashcards);
      FlashcardRef.set(state.flashcardsList)

    }

    function createValidFlashcards(flashcard) {
      return flashcard.basicWord !== '' && flashcard.translatedWord !== '';
    }



    return {
      FlashcardRef,
      FolderChosen,
      state,
      CreateDeck,
      getFolderName,
      AddNewFlashcard,
      removeflashcard
    }
  }

}
</script>

<style scoped lang="scss">
.wholeComponent {
  width: 100%;
  height: 100%;
  .adder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    //background-color: #e82709;
    p{
      font-size: 2em;
    }
    .button {
      margin: 10px;
      border-radius: 5%;
      padding: 10px;
      background-color: #00ba21;
      color: aliceblue;
      border: none;
      font-size: 3em;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      &:hover {
        cursor: pointer;
      }
    }


}
.CreateCard {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .AddFlashcardButton {
    width: 60%;
    height: 50px;
    background-color: #d7d7d5;
    display: flex;
    margin: auto;
    text-align: center;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 4px 4px 4px 4px;
    &:hover {
      cursor: pointer;
    }
    .buttonText {
      align-items: center;
      font-size: 20px;
    }
  }

  .listOfFlashcards {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;;
    .flashcard {
      margin: auto;
      margin-bottom: 30px;
      width: 60%;
      border: 3px solid #00ba21;
      box-shadow: 0 0 5px gray;
      border-radius: 6px;
      .deleteButton {
        border-radius: 50%;
        border: none;
        color: white;
        background-color: #e82709;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
      .flashcardData {
        padding: 30px;
        font-size: 30px;
        .EditText {
          width: 100%;
          height: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          resize: none;
        }
        .smallHint {
            font-size: 15px;
            color: gray;
          }
        .bottom {
          margin-bottom: 0;
        }
      }
    }
  }
  }

}

</style>