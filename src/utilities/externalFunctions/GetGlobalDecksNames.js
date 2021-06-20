import fire from '../fire'

export default async function GetGlobalDecksNames() {
    let decks = []
    await fire.database().ref('GlobalFlashcards/DeckNames').once('value').then((snapshot) => {
        const data = snapshot.val();
        let DeckNames = []
        if (data) {
            Object.keys(data).forEach(key => {
                DeckNames.push({
                    id: key,
                    name: data[key].name,
                    alphabet: data[key].alphabet,
                    length: data[key].length,
                    author: data[key].author
                })
            })
        }
        decks = DeckNames
    });
    return decks
}