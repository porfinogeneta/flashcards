<template>
  <div>
    <div v-if="state.isLessonFinished">
      <FlashcardsFinishScreen v-bind:finished-deck-metaData="state.flashcards.length"/>
    </div>
    <div v-else>
      <Modal v-if="state.isShowingProgress" @hide-modal="state.isShowingProgress = false">
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
               v-on:click="changeSides()">
<!--               v-bind:class="[ === true ? 'changeSideAnimation' : '']"-->
<!--          >-->
            <div class="BasicWord" v-if="state.basicSide === 'basicWord'">
              <div class="FrontSide">
                <div v-if="state.flashcardObject.linkToGraphic !== ''" class="image_div">
                  <img class="picture" :src="state.flashcardObject.linkToGraphic"/>
                </div>
                {{state.flashcardObject.basicWord}}
              </div>
              <div v-show="state.isShowingAnswer" class="BackSide" :class="[state.isShowingAnswer === true ? 'changeSideAnimationUp' : '']">
                {{ state.flashcardObject.translatedWord }}
              </div>
            </div>
            <div class="BasicWord" v-if="state.basicSide === 'translatedWord'">
              <div  class="BackSide">
                {{ state.flashcardObject.translatedWord }}
              </div>
              <div class="FrontSide">
                <div class="image_div">
                  <img class="picture" :src="state.flashcardObject.linkToGraphic"/>
                </div>
                {{state.flashcardObject.basicWord}}
              </div>
            </div>


          </div>
          <section class="changeFlashcard">
            <div>
              <button class="ChangeButtonMemorized" @click="ChangeCurrentFlashcard('right');">know</button>
            </div>
            <div>
              <button class="ChangeButtonForgotten" @click="ChangeCurrentFlashcard('left');">again</button>
            </div>
          </section>
        </section>
      </section>
    </div>
  </div>
  <Popup v-if="state.isShowingPopup" @exit-popup="state.isShowingPopup = false;">
    <template v-slot:title>Settings</template>
    <template v-slot:properties>
      <section class="settingsContainer">
        <div class="settingsElement">
          <p class="SetParagraph">shuffle:</p>
          <font-awesome-icon class="Icon" checkIfShuffle :style="changeSettingsColor(state.settings.shuffle)"
                             :icon="['fas', 'random']" size="2x"
                             @click="state.settings.shuffle = !state.settings.shuffle"/></div>
        <div class="settingsElement">
          <p class="SetParagraph">audio:</p>
          <font-awesome-icon class="Icon" :style="changeSettingsColor(state.settings.audio)"
                             :icon="['fas', 'volume-up']" size="2x"
                             @click="state.settings.audio = !state.settings.audio"/></div>
        <div class="settingsElement">
          <p class="SetParagraph">change side:</p>
          <font-awesome-icon class="Icon" :style="changeSettingsColor(state.settings.changeSide)"
                             :icon="['fas', 'exchange-alt']" size="2x"
                             @click="state.settings.changeSide = !state.settings.changeSide"/>
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
      basicSide: 'basicWord',
      currentSide: 'basicWord',
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
        changeSide: false
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
      console.log(property)
      state.settings.shuffle =  !property
    }

    const checkIfShuffle = computed(() => {
      Restart() // resets whole lesson
      ChangeCurrentList(state.NotShuffledToLearn) // go back to not shuffle list
      console.log('shuffle')
    })

    const checkIfChangeSide = computed(() => {
      Restart()
    })

    function Restart() {
      state.CurrentFlashcard = 0
      state.LearntProgress.perLearnt = 0
      state.LearntProgress.perNotLearnt = 0
      state.LearntInTurn = 0

    }
/////////////////////////////////////////////// SETTINGS
    watch(() => state.isShowingProgress, (newList, prevList) => {
      if (state.isShowingProgress === false) {
        state.LearntProgress.perLearnt = 0
        state.LearntProgress.perNotLearnt = 0
        state.LearntInTurn = 0
      }
    })

    const ShowPopup = () => {
      state.isShowingPopup = true
    }



    watchEffect(() => console.log(state.settings.shuffle))


    // when buttons know/again are pressed
    function ChangeCurrentFlashcard(direction) {
      state.isShowingAnswer = false;
      if (direction === 'right') {
        // data used later to show progress
        state.LearntInTurn ++
      }else {
        // added to learn later
        state.next_flashcardsToLearn.push(state.FlashcardsToLearn[state.CurrentFlashcard])
      }


      CountPercentages(); // gives info to progress bar
      // shuffle(state.FlashcardsToLearn)

      state.CurrentFlashcard ++


      // start another learn period
      if (state.CurrentFlashcard > state.FlashcardsToLearn.length - 1) {
        ChangeCurrentList(state.next_flashcardsToLearn) // change what to learn next
        state.isShowingProgress = true;
      }

      // lesson finished
      if (state.FlashcardsToLearn.length === 0 && state.next_flashcardsToLearn.length === 0) {
        state.isLessonFinished = true
      }

      state.flashcardObject = state.FlashcardsToLearn[state.CurrentFlashcard] // learn another flashcard

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
      checkIfShuffle
    }
  }

}
</script>

<style scoped lang="scss">

.settingsContainer {
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
  margin-top: 2rem;
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
      width: 80%;
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
      font-size: 3em;

      @media (min-width: 1080px) {
        width: 60%;
      }

      .BasicWord {
        width: 100%;
        height: 100%;
        position: relative;
        .FrontSide {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background-color: #eaeaea;
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
          //transition: transform 10s ease-in-out;
          //transform: translateY(0);
          position: absolute;
          background-color: #eaeaea;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
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
        background-color: crimson;
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

.changeSideAnimationUp {
  //transform: translateY(-100px);
  //transform: skewY(1.07rad);
  //transition: all 1s;

  //@keyframes change {
  //  0% {
  //    background-color: #5dee08;
  //  }
  //  100% {
  //    background-color: #838383;
  //  }
  //}
}
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