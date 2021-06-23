<template>
  <div>
    <div v-if="state.isLessonFinished">
      <FlashcardsFinishScreen v-bind:finished-deck-metaData="state.flashcards.length"/>
    </div>
    <div v-else>
      <Modal v-if="state.isShowingProgress" @hide-modal="state.isShowingProgress = false; Restart()">
        <template v-slot:titleOfPopup>
          Your Progress
        </template>
        <template v-slot:PropertiesToShow>
          <section class="innerProgress">
            <p class="innerProgressText">
            You learnt overall: {{state.flashcards.length - state.FlashcardsToLearn.length}}
            </p>
            <p class="innerProgressText">
              Left to revise: {{state.FlashcardsToLearn.length}}
            </p>
            <p class="innerProgressText">
              You learnt in this round: {{state.LearntInTurn}}
            </p>
          </section>
        </template>
      </Modal>
      <section class="FlashcardWrapper">
        <div class="ProgressMng">
          <ProgressBar v-bind:LearntProgressShow="state.LearntProgress"/>
          <button class="normalButton settingsButton" @click="ShowPopup">
            <font-awesome-icon :icon="['fas', 'cogs']" size="2x"/>
          </button>
        </div>
        <section class="FlashcardsManager">
          <div class="FlashcardInner"
               @click="changeSides()">
            <div class="BasicWord" v-if="state.currentSide === 'term'">
              <div class="FrontSide">
                <div v-if="state.flashcardObject.link" class="image_div">
                  <img class="picture" :src="state.flashcardObject.link"/>
                </div>
                <p class="text">{{state.flashcardObject.term}}</p>
              </div>
              <transition name="flip">
                <div v-show="state.isShowingAnswer"
                  class="BackSide" >
                  <p class="text">{{ state.flashcardObject.definition }}</p>
                </div>
              </transition>
            </div>
<!--            :class="[state.isShowingAnswer === true ? 'changeSideAnimationUp' : '']"-->
            <div class="BasicWord" v-if="state.currentSide === 'definition'">
              <div class="FrontSide">
                {{ state.flashcardObject.definition }}
                <div class="image_div" v-if="state.flashcardObject.link">
                  <img class="picture" :src="state.flashcardObject.link"/>
                </div>
              </div>
              <transition name="flip">
                <div v-show="state.isShowingAnswer" class="BackSide">
                  {{state.flashcardObject.term}}
                </div>
              </transition>
            </div>
          </div>
          <section class="changeFlashcard">
            <div>
              <button class="ChangeButtonMemorized" @click="ChangeCurrentFlashcard('right');">know</button>
            </div>
            <div style="" @click="LastFlashcard">
              <font-awesome-icon style="color: #9a9a9a" :icon="['fas', 'chevron-left']" size="3x"></font-awesome-icon>
            </div>
            <div>
              <button class="ChangeButtonForgotten" @click="ChangeCurrentFlashcard('left');">again</button>
            </div>
          </section>
        </section>
      </section>
    </div>
  </div>
  <Popup v-if="state.isShowingPopup" @exit-popup="SettingsFunctions">
    <template v-slot:title>Settings</template>
    <template v-slot:properties>
      <section class="settingsContainer">
        <div class="settingsElement">
          <p class="SetParagraph">shuffle:</p>
          <font-awesome-icon class="Icon" :style="changeSettingsColor(state.settings.shuffle)"
                             :icon="['fas', 'random']" size="2x"
                             @click="state.settings.shuffle =! state.settings.shuffle"/></div>
        <div class="settingsElement">
          <p class="SetParagraph">audio:</p>
          <font-awesome-icon class="Icon" :style="changeSettingsColor(state.settings.audio)"
                             :icon="['fas', 'volume-up']" size="2x"
                             @click="state.settings.audio =! state.settings.audio"/></div>
        <div class="settingsElement">
          <p class="SetParagraph">change side:</p>
          <font-awesome-icon class="Icon" :style="changeSettingsColor(state.settings.changeSide)"
                             :icon="['fas', 'exchange-alt']" size="2x"
                             @click="state.settings.changeSide =! state.settings.changeSide"/>
        </div>
      </section>
    </template>
  </Popup>

</template>

<script>
import checkToSeeChosenDeck from "@/utilities/externalFunctions/checkToSeeChosenDeck";
import {getFlashcardsFromStore} from "@/utilities/externalFunctions/getFlashcardsFromStore";
import { shuffle } from "@/utilities/externalFunctions/shuffle";
import {reactive, onMounted, onBeforeMount, ref, watch, watchEffect, computed} from 'vue'
import FlashcardsFinishScreen from '@/components/FlashcardsMode/FlashcardsFinishScreen'
import {useStore} from 'vuex';
import Modal from "@/components/Modal";
import ProgressBar from "@/components/ProgressBar";
import Popup from "@/components/Popup";

export default {
  name: "FlashcardView",
  components: {ProgressBar,
    Modal,
    FlashcardsFinishScreen,
    Popup
  },

  setup() {

    onMounted(() => {
      checkToSeeChosenDeck(store) // redirects here if not chosen folder
      // getFlashcardsFromGivenFolder()
      Validate() // state.flashcards get data from vuex ChosenDeck and
      // state.flashcards = state.flashcards
    })

    function Validate() {

      if (getFlashcardsFromStore()) {
        let DeckObject = getFlashcardsFromStore() // returns DeckObject with flashcards from store
        state.flashcards = DeckObject.flashcards

        ChangeCurrentList(state.flashcards) // what will be learnt first
        // changeisLoading(state.flashcards)
      }else {
        console.log('no currrent folder')
      }

    }

    const state = reactive({
      deckName: '',
      currentSide: 'term',
      isShowingPopup: false,
      isLessonFinished: false,
      isShowingAnswer: false,
      isShowingProgress: false,
      flashcardObject: {},
      CurrentFlashcard: 0,
      FlashcardsToLearn: [],
      flashcards: [],
      next_flashcardsToLearn: [],
      LearntInTurn: 0,
      rotation: 'rotation',
      NotShuffledToLearn: [],
      LearntProgress: {
        perLearnt: 0,
        perNotLearnt: 0
      },
      settings: {
        shuffle: true,
        audio: false,
        changeSide: false,
      },
    })

    const store = useStore();
///////////////////////////////////////////// SETTINGS
    // change color in settings
    const changeSettingsColor = (property) => {
      if (property) {
        return {color: 'green'}
      }else {
        return {color: 'black'}
      }
    }
    // change properties in settings
    const ChangeSettings = (property) => {
      return property = !property
    }

    const SettingsFunctions = (payload) => {
      state.isShowingPopup = false;
      console.log(payload)
      if (payload === 'accepted') {
        Restart() // resets whole lesson
        if (!state.settings.shuffle) {
          ChangeCurrentList(state.NotShuffledToLearn) // goes back to not shuffle list
        }else if (state.settings.shuffle){
          ChangeCurrentList(state.FlashcardsToLearn) // goes back to shuffle list
        }if (state.settings.changeSide) {
          state.currentSide = 'definition'; // change side to word in your language
        }else {
          state.currentSide = 'term' // changes side to word in foreign language
        }
      }
    }

    function Restart() {
      state.CurrentFlashcard = 0
      state.LearntProgress.perLearnt = 0
      state.LearntProgress.perNotLearnt = 0
      state.LearntInTurn = 0
    }
/////////////////////////////////////////////// SETTINGS


    const ShowPopup = () => {
      state.isShowingPopup = true
    }

    watchEffect(() => console.log(state.LearntInTurn))


    // when buttons know/again are pressed
    function ChangeCurrentFlashcard(direction) {
      state.isShowingAnswer = false;
      if (direction === 'right') {
        // data used later to show progress
        state.LearntInTurn += 1
      }else {
        // added to learn later
        state.next_flashcardsToLearn.push(state.FlashcardsToLearn[state.CurrentFlashcard])
      }


      CountPercentages(); // gives info to progress bar
      // shuffle(state.FlashcardsToLearn)

      state.CurrentFlashcard ++


      // start another learn period
      if (state.CurrentFlashcard > state.FlashcardsToLearn.length - 1) {
        state.isShowingProgress = true;
        ChangeCurrentList(state.next_flashcardsToLearn) // change what to learn next
      }

      // lesson finished
      if (state.FlashcardsToLearn.length === 0 && state.next_flashcardsToLearn.length === 0) {
        state.isLessonFinished = true
      }

      state.flashcardObject = state.FlashcardsToLearn[state.CurrentFlashcard] // learn another flashcard

    }

    function LastFlashcard() {
      state.isShowingAnswer = false;
      if (state.CurrentFlashcard !== 0) { // czy można wywołać funcję czy istnieje poprzednia fiszka
        state.CurrentFlashcard --; // dobranie się do poprzedniej fiszki
        state.flashcardObject = state.FlashcardsToLearn[state.CurrentFlashcard] // zmiana pokazywanego obiektu
        if (state.next_flashcardsToLearn.includes(state.flashcardObject)) { // czy obiekt jest do naucznia, czy znany
          state.next_flashcardsToLearn.pop();
        }else {
          state.LearntInTurn --;
        }
      }
      CountPercentages();
    }

    function ChangeCurrentList(list) {
      state.FlashcardsToLearn = list
      state.NotShuffledToLearn = list
      if (state.settings.shuffle) {
        shuffle(state.FlashcardsToLearn)// shuffles
      }

      state.CurrentFlashcard = 0
      state.flashcardObject = state.FlashcardsToLearn[state.CurrentFlashcard]
      // console.log(state.flashcardObject)
      state.next_flashcardsToLearn = []

    }

    const CountPercentages = () => {
      // counts percentages of learn and not learnt
      state.LearntProgress.perLearnt = Math.round(state.LearntInTurn / state.FlashcardsToLearn.length * 100)
      state.LearntProgress.perNotLearnt = Math.round(state.next_flashcardsToLearn.length / state.FlashcardsToLearn.length * 100)
      // console.log(state.LearntProgress.perNotLearnt, state.LearntProgress.perLearnt)
    }


    const changeSides = () => {
      state.isShowingAnswer = !state.isShowingAnswer
      // switch (lastSide) {
      //   case 'basicWord': state.currentSide = 'translatedWord';
      //   break;
      //   case 'translatedWord': state.currentSide = 'basicWord';
      //   break;
      // }
    }


    return {
      state,
      ChangeCurrentFlashcard,
      changeSides,
      ChangeSettings,
      changeSettingsColor,
      ShowPopup,
      LastFlashcard,
      SettingsFunctions,
      Restart
    }
  }

}
</script>

<style scoped lang="scss">

.flip-enter-active,
.flip-leave-active {
  transition: all 0.8s ease-in-out;
}

.flip-enter-from,
.flip-leave-to {
  transform: translateX(-1000px);
}

.settingsContainer {
  //background-color: #5dee08;
  width: 100%;
  height: 100%;
  display: grid;
  //margin-right: auto;
  //place-items: center;
  grid-template-rows: 1fr 1fr 1fr;
  @media (min-width: 1080px) {
    grid-template-rows: auto;
    grid-template-columns: auto auto auto;
  }
  .settingsElement {
    //background-color: #ba0a0a;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .SetParagraph {
      margin: 1rem;
    }
    .Icon {
      &:hover {
        cursor: pointer;
      }
    }
  }
}


.innerProgress {
  display: flex;
  flex-direction: column;
  text-align: center;
  .innerProgressText {
    font-size: 32px;
    margin: 48px;
    border-bottom: solid #72cd05 6px;
    @media (max-width: 764px){
      margin: 32px;
    }
  }
}

.FlashcardWrapper {
  margin-top: 1rem;
  height: auto;
  .ProgressMng {
    //background-color: #5dee08;
    padding: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .settingsButton {
      float: right;
    }
  }

  .FlashcardsManager {
    width: 100%;
    height: 70vh;
    //background-color: #ba0a0a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    .FlashcardInner {
      overflow: hidden;
      //position: relative;
      width: 85%;
      height: 90%;
      //display: grid;
      //grid-template-rows: 4fr 6fr;
      //grid-template-columns: auto;
      //justify-items: center;
      //align-items: center;
      text-align: center;
      //display: flex;
      //align-items: center;
      //justify-content: center;
      //flex-direction: column;
      font-size: 2em;

      @media (min-width: 1080px) {
        width: 60%;
        font-size: 4em;
      }

      .BasicWord {
        width: 100%;
        height: 100%;
        position: relative;
        .text {
          //word-wrap: anywhere;
        }
        .FrontSide {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background-color: #f4f4f4;
          .image_div {
            //margin: auto;
            padding: 7px;
            //margin: auto;
            //background-color: #e90707;;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 90%;
            height: 30%;
            .picture {
              max-width: 100%;
              max-height: 100%;
            }
          }
        }
        .BackSide {
          position: absolute;
          background-color: #f3f3f3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          //text-align: center;
          width: 100%;
          height: 100%;
          transition: transform 250ms;
          //&:hover {
          //  transform: translateY(100%);
          //}
        }
      }



    }
    .changeFlashcard {
      padding: 7px;
      width: 80%;
      min-height: 10%;
      //background-color: #00ba21;
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      .ChangeButtonMemorized{
        background-color: $green-btn;
        border-radius: 7px 7px 7px 7px;
        padding: 7px;
        font-size: 2em;
        border: none;
        color: white;
        &:hover {
          cursor: pointer;
        }
      }
      .ChangeButtonForgotten {
        background-color: #c80a2e;
        border-radius: 7px 7px 7px 7px;
        padding: 7px;
        font-size: 2em;
        border: none;
        color: white;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  }

//.changeSideAnimationUp {
//  transition: transform 250ms, opacity 400ms;
//}
.changeSideAnimationDown {
  background-color:lightblue;
  //transform: translate(0,100%);
  animation: change 1s linear;
  @keyframes change {
    0% {
      transform: translate(0,0);
    }
    100% {
      transform: translate(0, -100);
    }
  }
}
</style>