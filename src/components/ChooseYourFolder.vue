<template>
  <div class="nameFolder">
      <form class="nameYourFolder" @submit="addFolder">
        <select class="select" v-model="chosenFolder" @change="chooseFolder">
          <option v-if="Folders !== ''" value="" selected disabled hidden>Choose folder here...</option>
          <option v-else value="" selected disabled hidden>Loading...</option>
          <option
              v-for="(folder, index) in Folders"
              :key="folder"
          >
            {{ Folders[index] }}
          </option>
        </select>
        <button class="button" type="submit" >Add Folder</button>
      </form>

    </div>
</template>

<script>
import {CreateFolderListMixin} from '../utilities/mixins/createListOfUserFolders'

export default {
  name: "ChooseYourFolder",
  mixins: [CreateFolderListMixin],

  data() {
    return {
      // Folders: [],
      chosenFolder: ''
    }
  },
  methods: {
    chooseFolder() {
      this.$store.commit('changeChosenFolder', this.chosenFolder)
    },
    addFolder() {
      console.log('add')
    }
  }
}
</script>

<style scoped lang="scss">
  .nameFolder {
    width: 100%;
    height: 100%;
    //border: 5px solid #00ba21;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;


    .nameYourFolder {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      position: relative;
      width: 100%;
      height: 100%;

      .button {
        background-color: #00ba21;
        color: white;
        border: none;
        margin-left: 10px;
        padding: 10px;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 7px;

        @media (max-width: 767px) {
          font-size: 15px;
          margin-left: 0;
        }
      }

      .select {
        width: 12em;
        padding: 18px;
        font-size: 30px;
        //border-radius: 5px;
      }
      .bottom {
        margin-bottom: 0;
      }
    }

  }
</style>