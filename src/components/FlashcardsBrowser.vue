<template>
  <section class="all">
    <section class="displayFolders">
      <section v-for="deck in Folders" :key="deck" class="FoldersGrid">
        <router-link to="flashcardView" @click="WhatDirectory(deck)">
          <div class="Folder">
            {{deck}}
          </div>
        </router-link>
      </section>
    </section>
  </section>


</template>

<script>
import {CreateFolderListMixin} from '../utilities/mixins/createListOfUserFolders'
import {useStore} from 'vuex'

export default {
  name: "FlashcardsBrowser",
  mixins: [CreateFolderListMixin],
  setup() {

    const store = useStore()

    function WhatDirectory(deck) {
      store.commit('changeChosenFolder', deck)
    }

    return {
      WhatDirectory
    }
  }
}
</script>

<style scoped lang="scss">
.all {
  margin-left: 25%;
  margin-right: 25%;
  margin-top: 2%;
  @media (max-width: 764px){
    margin: 0;
  }
  .displayFolders {
    //background-color: #00ba21;
    //margin-left: 25%;
    //margin-right: 25%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    @media (max-width: 764px){
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
  }

    .FoldersGrid {
      //width: 100%;
      //height: 100%;
      //background-color: #e82709;
      .Folder {
        border-radius: 18px;
        background: #c6c1c1;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        padding: 20px;
        min-height: 10em;
        min-width: 10em;
        margin: 20px;
        font-size: 24px;
        color: black;
        &:hover {
          transition: all .2s ease-in-out;
          cursor: pointer;
          transform: scale(1.1);
          background-color: #afaeae;
        }
      }
    }
  }

}

</style>