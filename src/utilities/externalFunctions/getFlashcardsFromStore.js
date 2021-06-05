import store from "@/store/index";


export function getFlashcardsFromStore() {

      if (store.state.ChosenDeck) {
        let DeckObject = store.state.ChosenDeck
        return DeckObject
      }else {
        console.log('no currrent folder')
      }

    }