import fire from "@/utilities/fire";
import store from "@/store";

export default async function getFlashcardsFromGivenDeck(FolderID, DeckID) {

    const FlashcardRef = fire.database().ref(`UsersData/${store.state.UserData.AuthUser.uid}/Folders/${FolderID}/decks/flashcards/${DeckID}`)


      await FlashcardRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        // console.log(data, 'data')

        store.commit('ChangeChosenDeck', {
          id: DeckID,
          flashcards: data.flashcards,
          meta: data.meta
        })
      })
    }
