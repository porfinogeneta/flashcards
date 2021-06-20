<template>
  <div class="finishScreen" v-if="true">
    <section class="innerInfo">
      <h1>You made it - Congratulations!</h1>
      <div class="innerMessage">
        You learnt {{finishedDeckMetaData}} words!
        <button class="BackToHome" @click="$router.go(-1)">
          Back to home
        </button>
      </div>

    </section>
  </div>
</template>

<script>
import MoveToGivenRoute from "@/utilities/externalFunctions/MoveToGivenRoute";

export default {
name: "FlashcardsFinishScreen",
  props: {
    finishedDeckMetaData: {
      type: Number,
      required: true
    }
  },
  setup() {

    return {
      MoveToGivenRoute
    }
  }
}
</script>

<style scoped lang="scss">
.finishScreen {
  position: fixed;
  top: 3%;
  left: 50%;
  transform: translate(-50%, 0);
  margin: auto;
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .innerInfo {
    font-size: 1.5em;
    text-align: center;
    padding: 24px;
    width: 20%;
    height: 60%;
    border: solid darkslateblue 4px;
    border-radius: 7px;
    box-shadow: 3px 6px #888888;
    @media only screen and (max-width: 768px) {
      width: 80%;
      font-size: 1em;
    }
    .innerMessage {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      .BackToHome {
        font-size: 24px;
        padding: 24px;
        margin: 24px;
        background-color: $green-btn;
        border: none;
        border-radius: 7px 7px 7px 7px;
      }
    }
  }
}

</style>