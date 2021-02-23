import db from "@/utilities/db";
import {ref} from'vue'

export default function getFlashcardsFromGivenFolder() {

    const FlashcardsArgument = ref([])

    const FlashcardRef = db.database().ref('flashcards/' + 'flashcards')

      FlashcardRef.on('value', snapshot => {
        const data = snapshot.val();

        let flashcards = []


        Object.keys(data).forEach(key => {
          flashcards.push({
            id: key,
            basicWord: data[key].basicWord,
            linkToGraphic: data[key].linkToGraphic,
            translatedWord: data[key].translatedWord
          })
        })
          FlashcardsArgument.value = flashcards
      })
    }
