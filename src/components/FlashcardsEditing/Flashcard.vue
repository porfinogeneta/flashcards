<template>
  <div>
    <div class="wholeComponent" v-if="!state.isLoading">
      <section class="changeDeckName">
<!--        <h1 style="margin-top: 5%">-->
<!--          Deck name:-->
<!--        </h1>-->
        <input
            class="DeckName"
            placeholder="Name your deck"
            v-model="state.folderName"
        >
      </section>
      <section class="flashcardsMeta">
<!--        <h1 class="metaTitle">Your flashcards meta:</h1>-->
        <div>
          <select class="selectField" name="alphabet" v-model="state.alphabetType">
<!--            <option value="" selected disabled hidden>Alphabet</option>-->
            <option class="option" selected>
              Latin
            </option>
            <option class="option">
              Non-Latin
            </option>
          </select>
        </div>

      </section>
      <div class="CreateCard">
        <div class="listOfFlashcards">
          <div  class="flashcard"
               v-for="(card, index) in state.flashcardsList" :key="index"
          >
            <button class="deleteButton" @click="removeflashcard(index)">x</button>
            <section class="flashcardData">
              <input type="text" class="EditText" v-model="card.basicWord">
              <p class="smallHint">Word</p>
            </section>
            <section class="flashcardData">
              <input type="text" class="EditText" v-model="card.translatedWord">
              <p class="smallHint">Translation</p>
            </section>
            <section class="flashcardData">
              <input type="text" class="EditText" v-model="card.linkToGraphic">
              <p class="smallHint">Link to graphic</p>
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
import checkToSeeChosenDeck from "@/utilities/externalFunctions/checkToSeeChosenDeck";
import fire from '../../utilities/fire'
import {reactive, ref, computed, onMounted, watch} from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {getFlashcardsFromStore} from "@/utilities/externalFunctions/getFlashcardsFromStore";


export default {
  name: "Flashcard",

  setup: function () {

    const store = useStore();

    const router = useRouter()

    const FlashcardContentRef = reactive(
        fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/` + store.state.ChosenFolder.id + '/decks/flashcards')
    )

    const FlashcardDeckRef = reactive(
        fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/` + store.state.ChosenFolder.id+ '/decks/DecsNames')
    )
    const GeneralRef = reactive(
        fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/${store.state.ChosenFolder.id}`)
    )

    const FolderChosen = ref('')


    const state = reactive({
      addNew: false,
      isLoading: false,
      word: '',
      translation: '',
      linkGraphic: '',
      alphabetType: 'Latin',
      folderName: '',
      flashcardsList: [],
    })




    function removeflashcard(index) {
      state.flashcardsList.splice(index, 1)
    }

    const AddNewFlashcard = () => {

      const flashcard = {
        basicWord: '',
        linkToGraphic: '',
        translatedWord: '',
      }

      state.flashcardsList.push(flashcard)
    }

    onMounted(() => {
      checkToSeeChosenDeck(store);
      Validate();
    })


    const Validate = () => {
      // if not in creation mode
      if (getFlashcardsFromStore()) {
        let FolderObject = getFlashcardsFromStore();
        state.flashcardsList = FolderObject.flashcards
        console.log(FolderObject)
        state.folderName = FolderObject.meta.name
        state.alphabetType = FolderObject.meta.alphabet
      }


      // always add additional flashcard
      state.flashcardsList.push({
        basicWord: '',
        linkToGraphic: '',
        translatedWord: '',
      })
      state.isLoading = false
    }


    async function CreateDeck() {
      // create proper flashcards, delete empty
      let flashcardsListValidate = state.flashcardsList.filter(createValidFlashcards);
      // console.log(flashcardsListValidate)
      if (flashcardsListValidate.length !== 0 && state.folderName !== '') {
        // if creation mode, create new flashcards
        if (store.state.CreationMode) {
          const FlashcardsObject = {
            meta: {
              name: state.folderName,
              length: flashcardsListValidate.length,
              alphabet: state.alphabetType
            },
            flashcards: flashcardsListValidate
          }
          const FolderObject = {
            name: state.folderName,
            length: flashcardsListValidate.length,
            alphabet: state.alphabetType
          }
          // create unique ID for both folder and flashcards lists
          var UniqueID = GeneralRef.push().key;
          // console.log(UniqueID, 'unique id')
          await FlashcardContentRef.child(UniqueID).set(
              FlashcardsObject,
          )
          await FlashcardDeckRef.child(UniqueID).set(
              FolderObject
          )
          store.state.CreationMode = false
        }else {
          // console.log(store.state.ChosenFolder.id)
          // do this when editing flashcards
          await FlashcardDeckRef.child(store.state.ChosenDeck.id).update(
              {
                name: state.folderName,
                length: flashcardsListValidate.length,
                alphabet: state.alphabetType
              })
          await FlashcardContentRef.child(store.state.ChosenDeck.id).update(
              {
            meta: {
              name: state.folderName,
              length: flashcardsListValidate.length,
              alphabet: state.alphabetType
            },
            flashcards: flashcardsListValidate
          })
        }
      }else return
      // exit this mode
      router.go(-1)
    }

    // creates validated flashcards
    function createValidFlashcards(flashcard) {
      return flashcard.basicWord !== '' && flashcard.translatedWord !== '';
    }


    return {
      FlashcardRef: FlashcardContentRef,
      FolderChosen,
      state,
      CreateDeck,
      AddNewFlashcard,
      removeflashcard
    }
  }

}
</script>

<style scoped lang="scss">
.wholeComponent {
  font-size: clamp(1em, 2em, 3em);
  .flashcardsMeta {
    min-height: 5vh;
    margin: 1em auto 1em auto;
    width: 80%;
    //background: #06d006;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .metaTitle {
      display: flex;
      margin: 0.5em;
      text-align: center;
    }
  }
  .changeDeckName {
    width: 100%;
    display: flex;
    justify-content: center;

    .DeckName {
      //display: inline-block;
      font-size: 1em;
      margin: 1em auto 1em auto;
      text-align: start;
      width: 80%;
      border: none;
      border-bottom: solid black;
      //resize: none;
      &:focus {
        outline: none;
      }
    }
  }
  .adder {
    width: 80%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;

    p{
      font-size: 2em;
    }
    .button {
      margin: 10px;
      border-radius: 7px 7px 7px 7px;
      padding: 10px;
      background-color: #00ba21;
      color: aliceblue;
      border: none;
      font-size: 2em;
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
    //background: #ba0a0a;
    width: 100%;
    //height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .AddFlashcardButton {
      width: 60%;
      height: 3em;
      background-color: #e6e6e6;
      display: flex;
      margin: auto;
      text-align: center;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 7px 7px 7px 7px;
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
      .flashcard {
        //padding: 30px;
        margin: auto auto 2em;
        width: clamp(70%, 80%, 100%);
        border: 3px solid #00ba21;
        box-shadow: 0 0 5px gray;
        border-radius: 7px;
        .deleteButton {
          margin-bottom: 1em;
          border-radius: 50%;
          border: none;
          color: white;
          background-color: #e82709;
          width: 2.4em;
          height: 2.4em;
          cursor: pointer;
        }
        .flashcardData {
          padding: 0.5em;
          //margin: auto;
          //background: #06d006;
          //margin-right: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .EditText {
            width: 80%;
            //height: 100%;
            font-size: 2rem;
            padding: 0.5rem;
          }
          .smallHint {
            font-size: 0.8em;
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