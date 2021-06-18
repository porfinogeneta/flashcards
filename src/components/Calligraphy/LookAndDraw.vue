<template>
  <section>
    <p class="Info">{{Flashcard.term}}  {{Flashcard.definition}}</p>
    <h3>Look and draw the sign:</h3>
    <p class="Sign">{{DrawingObject}}</p>
    <Draw/>
  </section>
</template>

<script>
import {computed} from "vue";
import Draw from "@/utilities/mixins/Draw";

export default {
  name: "LookAndDraw",
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

<style scoped lang="scss">
.Sign {
  font-size: 5em;
}
</style>