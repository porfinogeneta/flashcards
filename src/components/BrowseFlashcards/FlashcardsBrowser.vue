<template>
  <Loading v-show="state.isLoading" :load-description="'Getting folders...'"></Loading>
  <FolderBrowser @finished="state.isLoading = false"/>
</template>

<script>
import Loading from "@/LoadingComponents/Loading";
import {onMounted, reactive} from "vue";
import FolderBrowser from "@/components/BrowseFlashcards/FolderBrowser";

export default {
  name: "FlashcardsBrowser",
  components: {
    FolderBrowser,
    Loading
  },
  // mixins: [CreateFolderListMixin],
  setup() {

    onMounted(async () => {
      state.isLoading = true
    })

    const state = reactive({
      isLoading: true,
    })


    return {
      state
    }
  }
}
</script>

<style scoped lang="scss">


</style>