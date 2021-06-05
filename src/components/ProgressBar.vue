<template>
  <section class="ProgressBar">
    <section class="InnerProgress" :style="StylePercentagesLearnt"></section>
    <section class="InnerProgress" :style="StylePercentagesToLearn"></section>
  </section>
</template>

<script>
import {computed} from "vue";

export default {
  name: "ProgressBar",
  props: {
    LearntProgressShow: {
      default: '',
      required: true
    }
  },
  setup(props) {

    const StylePercentagesLearnt = computed(() => {
      // console.log(props.LearntProgressShow)
      // console.log(props.LearntProgressShow.perLearnt)
      return {background: 'green', width: props.LearntProgressShow.perLearnt + '%'}
    })

    const StylePercentagesToLearn = computed(() => {
      // console.log(props.LearntProgressShow.perNotLearnt)
      return {background: 'red', width: props.LearntProgressShow.perNotLearnt + '%'}
    })

    return {
      StylePercentagesLearnt,
      StylePercentagesToLearn
    }
  }
}
</script>

<style scoped lang="scss">
.ProgressBar {
    display: flex;
    flex-wrap: wrap;
    height: 0.7em;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: #dadfda;

    .InnerProgress {
      justify-content: space-between;
      height: 100%;
    }
  }
</style>