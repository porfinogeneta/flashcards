import { createStore } from 'vuex';
import fire from '../utilities/fire'

const store = createStore({
  state() {
    return {
      isLoading: false,
      ChosenFolder: null,
      ChosenDeck: null,
      CreationMode: false,
      CanvasImg: '',
      // user Data
      UserData: {
        isLoggedIn: false,
        AuthUser: {},
        settings: {
          clearCanvas: false
        }
      }
    }
  },
  mutations: {
    changeChosenFolder(state, payload) {
      state.ChosenFolder = payload
    },
    // GetUserFolders(state, Folders){
    //   return state.UserFolders = Folders
    // },
    ChangeIsLoggedIn(state, BoolPayload){
      return state.UserData.isLoggedIn = BoolPayload
    },
    ChangeClearCanvasSettings(state, BoolPayload){
      return state.UserData.settings.clearCanvas = BoolPayload
    },
    ChangeAuthUser(state, AuthUserPayload){
      return state.UserData.AuthUser = AuthUserPayload
    },
    ChangeChosenDeck(state, DeckPayload) {
      return state.ChosenDeck = DeckPayload
    },
    ChangeCanvasImg(state, payload) {
      state.CanvasImg = payload
    }
  },
  // actions: {
  //   async GetUserFolders ({commit}){
  //     await fire.database().ref('/user_1/Folders').once('value').then((snapshot) => {
  //       const data = snapshot.val()
  //       // console.log(data)
  //
  //       let Folders = []
  //
  //       Object.keys(data).forEach(key => {
  //         Folders.push({
  //           id: key,
  //           name: data[key].name,
  //           length: data[key].length
  //         })
  //       })
  //       commit('GetUserFolders', Folders)
  //     })
  //   }
  // },

})

export default store;
