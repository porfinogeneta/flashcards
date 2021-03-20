<template>
  <div>
    <div v-if="state.isLessonFinished">
      <FlashcardsFinishScreen v-bind:finished-deck-metaData="state.flashcards.length"/>
    </div>
    <div v-else>
      <div v-if="state.isShowingProgress" >
        <Modal @hide-modal="state.isShowingProgress = false">
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
      </div>
      <section v-if="!state.isLoadingFlashcards" class="FlashcardWrapper">
        <div class="ViewFlashcards" >
          <div class="FlashcardInner"
               @click="state.showAnswer = !state.showAnswer"
               v-bind:class="[state.showAnswer === true ? state.rotation : '']"
          >
            <div v-if="!state.showAnswer" class="Side FrontSide">
              {{state.flashcardObject.basicWord}}
              <div class="image_div">
                <img class="picture" :src="state.flashcardObject.linkToGraphic"/>
              </div>
            </div>

            <div v-else class="Side BackSide">
              {{ state.flashcardObject.translatedWord }}
              <div class="image_div">
                <img class="picture" :src="state.flashcardObject.linkToGraphic"/>
              </div>
            </div>
          </div>
        </div>
        <div class="changeFlashcard">
          <button class="ChangeButtonMemorized" @click="ChangeCurrentFlashcard('right')">know</button>
        </div>
        <div class="changeFlashcard">
          <button class="ChangeButtonForgotten" @click="ChangeCurrentFlashcard('left')">don't know</button>
        </div>
      </section>
      <div v-else>
        Loading...
      </div>
    </div>
  </div>

</template>

<script>
import db from '@/utilities/db.js';
import checkToSeeChosenFolder from "@/utilities/externalFunctions/checkToSeeChosenFolder";
import {reactive, onMounted, onBeforeMount, ref, watch, watchEffect} from 'vue'
import FlashcardsFinishScreen from '@/components/FlashcardsFinishScreen'
import {useStore} from 'vuex';
import Modal from "@/components/Modal";

export default {
  name: "FlashcardView",
  components: {Modal, FlashcardsFinishScreen},

  setup() {

    onBeforeMount(() => {
      Directories.value = store.state.ChosenFolder
    })


    onMounted(() => {
      checkToSeeChosenFolder()
      getFlashcardsFromGivenFolder()
    })

    const store = useStore();

    const Directories = ref('')

    const state = reactive({
      isLoadingFlashcards: true,
      isLessonFinished: false,
      showAnswer: false,
      isShowingProgress: false,
      flashcardObject: {},
      linkToPicture: '',
      CurrentFlashcard: 0,
      FlashcardsToLearn: [],
      flashcards: [],
      next_flashcardsToLearn: [],
      LearntInTurn: 0,
      rotation: 'rotation'
    })



    watch(() => state.isShowingProgress, (newList, prevList) => {
      if (state.isShowingProgress === false) {
        state.LearntInTurn = 0
      }
    })

    watchEffect(() => console.log(state.showAnswer))

    function changeisLoading(list) {
      state.isLoadingFlashcards = false
      for (let index = 0; index <= list.length - 1 ; index++) {
        state.FlashcardsToLearn.push(index)
      }
      state.flashcardObject = list[state.CurrentFlashcard]
    }

    const getFlashcardsFromGivenFolder = () => {

      // const FlashcardRef = db.database().ref('user_1/flashcards/' + '-MV83u1MpwOeSZHZxh9f/flashcards')
      // console.log(FlashcardRef.child('-MV83u1MpwOeSZHZxh9f'))
      // console.log(store.state.ChosenFolder)

        // FlashcardRef.once('value').then((snapshot) => {
        //   const data = snapshot.val();
        //
        //   let flashcards = []
        //
        //   Object.keys(data).forEach(key => {
        //     flashcards.push({
        //       id: key,
        //       basicWord: data[key].basicWord,
        //       linkToGraphic: data[key].linkToGraphic,
        //       translatedWord: data[key].translatedWord
        //     })
        //   })
        //   state.flashcards = flashcards
        // })
      if (store.state.ChosenFolder) {
        let FolderObject = store.state.ChosenFolder

        state.flashcards = FolderObject.flashcards
        changeisLoading(state.flashcards)
      }

    }


    function ChangeCurrentFlashcard(direction) {
      state.showAnswer = false;
      if (direction === 'right') {
        state.LearntInTurn ++
        DeleteFromFlashcardsToLearn();

      }else {
        state.next_flashcardsToLearn.push(state.CurrentFlashcard)
        DeleteFromFlashcardsToLearn();
        // state.FlashcardsToLearn.push(state.CurrentFlashcard)
      }
      // GetRandomNumber();
      if (state.FlashcardsToLearn.length === 0) {
        state.isShowingProgress = true;
        ChangeCurrentList(state.next_flashcardsToLearn);
      }
      RandomFlashcard();

      state.flashcardObject = state.flashcards[state.CurrentFlashcard]
      console.log(state.FlashcardsToLearn, state.next_flashcardsToLearn)
      if (state.FlashcardsToLearn.length === 0 && state.next_flashcardsToLearn.length === 0) {
        state.isLessonFinished = true
      }
    }

    function ChangeCurrentList(list) {
      state.FlashcardsToLearn = list
      state.next_flashcardsToLearn = []
    }

    const DeleteFromFlashcardsToLearn = () => {
      let index = state.FlashcardsToLearn.indexOf(state.CurrentFlashcard);
        state.FlashcardsToLearn.splice(index, 1);
    }

    const RandomFlashcard = () => {
      let RandomNum = null;
      RandomNum = state.FlashcardsToLearn[Math.floor(Math.random() * (state.FlashcardsToLearn.length))];
      state.CurrentFlashcard = RandomNum
    }


    const showAnswerFlag = () => {
      state.showAnswer = !state.showAnswer
    }

    // watch(this.flashcardsMixin, (newValue, oldValue) => {
    //   if (newValue !== oldValue) {
    //     changeisLoading();
    //   }
    // })

    return {
      state,
      ChangeCurrentFlashcard,
      showAnswerFlag,
      changeisLoading
    }
  }

}
</script>

<style scoped lang="scss">

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
  //background-color: #e82709;
  position: fixed;
  width: 100%;
  inset: 0;
  margin-top: 7vh;
  .ViewFlashcards {
  font-size: 48px;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 90vh;
  border: 1px solid #000000;
  perspective: 1000px;

  @media (max-width: 764px){
    width: 100%;
    height: 90vh;
  }


  .FlashcardInner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #e1e5e2;
    width: 30%;
    height: 100%;
    text-align: center;
    transition: transform .8s ease-in-out;
    transform-style: preserve-3d;
    @media (max-width: 764px){
      width: 100%;
      height: 90%;
    }

    .Side {
      //position: absolute;
      //z-index: 40;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      display: flex;
      justify-content: center;
      align-items: center;

      .image_div {
        position: absolute;
        //z-index: 90;
        display: flex;
        justify-content: start;
        align-items: start;
        top: 2%;
        border: solid 2px black;
        width: 90%;
        margin-left: 7.5%;
        margin-right: 7.5%;
        height: 40%;
        .picture {
          max-width:100%;
          max-height:100%;
        }
      }
    }

    .FrontSide {
      position: absolute;
      //z-index: 40;
      background-color: #e1e5e2;

    }
    .BackSide {
      position: absolute;
      transform: rotateY(180deg);
      background-color: #e1e5e2;
      }
    }
  }
  .changeFlashcard {
    display: flex;
    //z-index: 99;
    //width: 100vh;
    //height: 100vh;
    text-align: center;
    border-radius: 7px 7px 7px 7px;
    color: #ba0a0a;
    &:focus {
      outline: 0;
    }
    &:hover {
      cursor: pointer;
      color: black;
    }


  .ChangeButtonMemorized {
    border-radius: 7px 7px 7px 7px;
    border: none;
    width: 20%;
    height: 30%;
    position: absolute;
    right: 10%;
    top: 35%;
    background-color: #00ba21;


    //&:hover {
    //  cursor: pointer;
    //  color: black;
    //}
  }
  .ChangeButtonForgotten {
    border: none;
    width: 20%;
    height: 30%;
    position: absolute;
    left: 10%;
    top: 35%;
    background-color: #e82709;

    }
    @media (max-width: 764px){
      width: 100vh;
      height: 100vh;
    }
  }
}


.rotation{
  transform: rotateY(180deg);
  //background-color: #e82709;
}
</style>