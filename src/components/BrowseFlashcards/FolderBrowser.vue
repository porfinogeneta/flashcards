<template>
  <div class="container">
    <section class="displayFolders">
      <section>
        <div
            @click="AddFolder"
            class="Folder" id="adder"
        >
          <font-awesome-icon :icon="['fas', 'plus']" size="5x"></font-awesome-icon>
        </div>
      </section>
      <section v-for="folder in state.Folders" :key="folder">
        <div class="Folder" @click="MoveToDeckCreation(folder)">
          {{folder.name}}
        </div>
      </section>
    </section>
  </div>
  <Popup @exit-popup="AddFolder" v-if="state.isShowingPopUp">
    <template
        v-slot:title>Name New Folder
    </template>
    <template v-slot:properties>
      <div class="PopupInputs">
        <input class="Inputs" type="text" v-model="state.folderName" placeholder="Folder name..."/>
      </div>
    </template>
    <template v-slot:ButtonExitPopUp>
      New Folder
    </template>
  </Popup>
  <Loading v-show="state.isLoading" :load-description="'Loading'"/>
</template>

<script>
import {onMounted, reactive, computed} from "vue";
import fire from "@/utilities/fire";
import {useStore} from 'vuex';
import getUserFolders from "@/utilities/externalFunctions/getUserFolders";
import Popup from "@/components/Popup";
import {useRouter} from 'vue-router';
import Loading from "@/LoadingComponents/Loading";

export default {
  name: "FolderBrowser",
  components: { Popup, Loading },
  emits: ['finished'],
  setup(_, context) {

    const store = useStore();

    const router = useRouter();

    // const isLoading = computed(() => {
    //   return store.state.isLoading
    // })

    const firebaseFolderRef = fire.database().ref('UsersData/' + store.state.UserData.AuthUser.uid + '/Folders');

    const state = reactive({
      Folders: [],
      isShowingPopUp: false,
      folderName: '',
      isLoading: true,
    })

    onMounted( async () => {
      state.Folders = await getUserFolders(store.state.UserData.AuthUser.uid, fire) // gets user folders at user location
      console.log(state.Folders, 'folders')
      state.isLoading = false
      // state.isLoading = false
      context.emit('finished');
    })

    // adds users to the firebase
    const AddFolder = async () => {
      state.isShowingPopUp = !state.isShowingPopUp
      if (state.isShowingPopUp === false && state.folderName){
        state.isLoading = true
        let key = firebaseFolderRef.push().key // creates random key/id
        await firebaseFolderRef.child(key).set({ // sets given folder at this id
          name: state.folderName,
          // decs: []
        }).then(r => state.folderName = '')
        state.Folders = await getUserFolders(store.state.UserData.AuthUser.uid, fire) // rests state.Folders, after folder added
        state.isLoading = false
      }
    }

    function MoveToDeckCreation(folder) {
      store.commit('changeChosenFolder', folder)
      router.push({name: 'Folder', params: {folder: folder.name}}) // moves to the folder route
    }

    return {
      state,
      AddFolder,
      MoveToDeckCreation,
      // isLoading
    }
  }
}
</script>

<style scoped lang="scss">

.PopupInputs {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .Inputs {
    width: 70%;
    padding: 7px;
    font-size: 1em;
  }
}

.container {
  display: flex;
  justify-content: center;

  .displayFolders {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    @media (max-width: 764px){
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }

    .Folder {
      border-radius: 18px;
      background: #dad6d6;
      border: solid #d7d7d7;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 5em;
      min-width: 10em;
      margin: 20px;
      font-size: 24px;
      color: black;
      &:hover {
        transition: all .2s ease-in-out;
        background: #48c814;
        cursor: pointer;
        transform: scale(1.1);
      }
    }

  }
  #adder {
    background-image: linear-gradient(to right, #cacaca, #aaacaa);
    color: #f5f1f1;
    font-weight: 700;
  }
}


</style>