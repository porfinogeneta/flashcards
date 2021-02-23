<template>
  <div>
    <div v-if="!state.lessonFinished">
      <div v-if="state.isShowingProgress" >
        <ProgressShow
            :amount-of-learnt="state.flashcards.length - state.FlashcardsToLearn.length"
            :left-to-learn="state.FlashcardsToLearn.length"
            @close-pop-up="state.isShowingProgress = false"
        />
      </div>
      <div>

      </div>
      <div v-if="!state.isLoadingFlashcards">
        <div class="ViewFlashcards">
          <div class="BasicWord">{{state.flashcardObject.basicWord}}</div>
          <div class="image_div">
            <img class="picture" :src="state.flashcardObject.linkToGraphic"/>
          </div>
          <div v-if="!state.showAnswer" class="ShowAnswer" v-on:keyup.space="showAnswerFlag" @click="showAnswerFlag">Show Answer</div>
          <div  v-else class="Translation">{{ state.flashcardObject.translatedWord }}</div>
        </div>
        <div class="changeFlashcard">
          <button class="ChangeButtonMemorized" @keyup.right="ChangeCurrentFlashcard('right')" @click="ChangeCurrentFlashcard('right')">know</button>
        </div>
        <div class="changeFlashcard">
          <button class="ChangeButtonForgotten" @keyup.left="ChangeCurrentFlashcard('left')" @click="ChangeCurrentFlashcard('left')">don't know</button>
        </div>
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
    <div v-else>
        <h1>finished</h1>
    </div>
  </div>

</template>

<script>
import db from '@/utilities/db.js';
import getFlashcardsFromGivenFolder from "@/utilities/mixins/getFlashcardsFromFolder";
import {reactive, onMounted, onBeforeMount, ref, watch} from 'vue'
import ProgressShow from "@/components/ProgressShow";
import {useStore} from 'vuex';

export default {
  name: "FlashcardView",
  components: {ProgressShow},

  setup() {

    const store = useStore();

    const Directories = ref('')

    const state = reactive({
      isLoadingFlashcards: true,
      lessonFinished: false,
      showAnswer: false,
      isShowingProgress: false,
      flashcardObject: {},
      linkToPicture: '',
      CurrentFlashcard: 0,
      FlashcardsToLearn: [],
      flashcards: [],
      next_flashcardsToLearn: [],
    })

    onBeforeMount(() => {
      Directories.value = store.state.ChosenFolder
    })


    onMounted(() => {
      getFlashcardsFromGivenFolder()
    })

    watch(() => state.flashcards, (newList, prevList) => {
      console.log('watching you')
      changeisLoading(newList)
    })

    function changeisLoading(list) {
      state.isLoadingFlashcards = false
      for (let index = 0; index <= list.length - 1 ; index++) {
        state.FlashcardsToLearn.push(index)
      }
      state.flashcardObject = list[state.CurrentFlashcard]
    }

    const getFlashcardsFromGivenFolder = () => {

        const FlashcardRef = db.database().ref('flashcards/' + 'flashcards')

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
            state.flashcards = flashcards
          })
        }


    function ChangeCurrentFlashcard(direction) {
      if (direction === 'right') {
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
      state.showAnswer = false;
      state.flashcardObject = state.flashcards[state.CurrentFlashcard]
      if (state.FlashcardsToLearn.length === 0 && state.next_flashcardsToLearn.length === 0) {
          state.lessonFinished = true
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
.ViewFlashcards {
  position: absolute;
  z-index: 30;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: solid 3px #00ba21;
  width: 30%;
  height: 80%;
  margin-top: 3%;

  .BasicWord {
    margin: 10px;
    border: solid 3px black;
    font-size: 40px;
    text-align: center;
    font-weight: bold;
  }
  .image_div {
    position: absolute;
    top: 15%;
    //border: solid 3px black;
    font-size: 40px;
    text-align: center;
    font-weight: bold;
    width: 85%;
    margin-left: 7.5%;
    margin-right: 7.5%;
    height: 50%;
    .picture {
      max-width:100%;
      max-height:100%;
    }
  }
  .ShowAnswer {
    position: absolute;
    font-size: 40px;
    color: #f5f1f1;
    font-weight: bold;
    background-color: #00ba21;
    bottom: 0;
    width: 100%;
    height: 30%;
    text-align: center;
    line-height: 500%;
    &:hover {
      cursor: pointer;
    }
  }
  .Translation {
    position: absolute;
    font-size: 40px;
    border: solid 3px black;
    text-align: center;
    font-weight: bold;
    bottom: 10%;
    width: 100%;
  }
}
.changeFlashcard {

  .ChangeButtonMemorized {
    position: absolute;
    right: 10%;
    top: 35%;
    text-align: center;
    width: 20%;
    height: 30%;
    background-color: #00ba21;
    border: none;
    border-radius: 7px 7px 7px 7px;
    color: #f5f1f1;
    font-size: 300%;

    &:hover {
      cursor: pointer;
      color: black;
    }
  }
  .ChangeButtonForgotten {
      position: absolute;
      left: 10%;
      top: 35%;
      text-align: center;
      width: 20%;
      height: 30%;
      background-color: #e82709;
      border: none;
      border-radius: 7px 7px 7px 7px;
      color: #f5f1f1;
      font-size: 300%;

      &:hover {
      cursor: pointer;
      color: black;
    }

    }


}
</style>