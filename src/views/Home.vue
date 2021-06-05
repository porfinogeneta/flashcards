<template>
  <div>
    <FlashcardsBrowser/>
  </div>
</template>

<script>
import FlashcardsBrowser from "@/components/BrowseFlashcards/FlashcardsBrowser";

export default {
  name: 'Home',
  components: {
    FlashcardsBrowser,
  },
  // data() {
  //   return {
  //     isShowingPopup: true
  //   }
  // }
}
</script>
