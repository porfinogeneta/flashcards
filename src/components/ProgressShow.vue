<template>
  <section class="ProgressScreen" @click="ClosePopUp">
      <section class="Background">
      </section>
      <div class="BoxText">
      <div class="ProgressInfo">
        <p>Left to learn: <br>
          {{leftToLearn}}</p>
        <p>You Learnt: <br>
          {{amountOfLearnt}}</p>
      </div>
    </div>


  </section>
</template>

<script>
export default {
name: "ProgressShow",
  props: {
    leftToLearn: {
      type: Number,
    },
    amountOfLearnt: {
      type: Number
    }
  },
  methods: {
    ClosePopUp() {
      this.$emit('close-pop-up')
    }
  }
}
</script>

<style scoped lang="scss">
  .ProgressScreen {
    position: fixed;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     z-index: 99;
      //opacity: 0.6;
    width: 100%;
    height: 100%;
    .Background {
      position: fixed;
      z-index: 20;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      opacity: 0.7;
    }
    .BoxText {
      position: absolute;
      border-radius: 50px;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 64px;

      .ProgressInfo {
        text-align: center;
        border-radius: 20px;
        width: 50vh;
        height: 60vh;
        background-color: #f5f1f1;
        padding: 20px;
      }
    }
  }

</style>