<template>
  <section>
    <h3>Draw by translation: </h3>
    <p class="Info">{{Flashcard.definition}}</p>
    <Draw/>
  </section>
</template>

<script>
import {computed} from "vue";
import Draw from "@/utilities/mixins/Draw";

export default {
  name: "DrawByTranslation",
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

    const DrawingObject = computed(() => {
      return props.drawingObject
    })

    const Flashcard = computed(() => {
      return props.flashcard
    })

    return {
      DrawingObject,
      Flashcard
    }
  }
}
</script>

<style scoped>

</style>