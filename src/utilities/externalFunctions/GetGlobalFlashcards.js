import fire from '@/utilities/fire';
import store from '@/store/index'

export async function GetGlobalFlashcards(DeckID) {
    await fire.database().ref(`GlobalFlashcards/flashcards/${DeckID}`)
        .once('value')
        .then((snapshot) => {
        const data = snapshot.val();
        console.log(data)
        store.commit('ChangeChosenDeck', {
            id: DeckID,
            meta: data.meta,
            flashcards: data.flashcards,
        })
            console.log(store.state.ChosenDeck, 'deck')
    })
}