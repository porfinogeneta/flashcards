<template>
  <section class="container">
    <p class="Info">{{Flashcard.basicWord}} {{Flashcard.translatedWord}}</p>
    <div id="RedrawSpace">
      <Draw :isRedraw="true"/>
    </div>
    <div id="RedrawSign">
      <p class="drawSymbol">
        {{ DrawingObject }}
      </p>
    </div>
  </section>
</template>

<script>
import {computed, onMounted, reactive, ref} from "vue";
import Draw from "@/utilities/mixins/Draw";

export default {
  name: "Redraw",
  components: {Draw},
  props: {
    drawingObject: {
      required: true
    },
    flashcard: {
      required: true
    }
  },
  setup(props, _) {

    // const draw = ref('')

    const DrawingObject = computed(() => {
      return props.drawingObject
    })

    const Flashcard = computed(() => {

      return props.flashcard
    })

    const state = reactive({

    })

    const Canvas = ref('')



    return {
      state,
      Canvas,
      DrawingObject,
      Flashcard
    }
  }
}
</script>

<style scoped lang="scss">

.container {
  //background: black;
  //position: relative;
  #RedrawSpace {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 99;
    margin-bottom: 1rem;
  }
  #RedrawSign {
    overflow: hidden;
    opacity: 0.2;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 350px;
    height: 350px;
    margin: auto auto 1rem;
    .drawSymbol {
      font-size: 2em;
      margin: 0;
      @media (max-width: 768px) {
        font-size: 9em;
      }
    }
  }
}

</style>