import {useRouter} from 'vue-router';
// import { useStore } from 'vuex'

export default function checkToSeeChosenDeck (store) {

    // const store = useStore()
    const router = useRouter()
    console.log('checking')
    if (!store.state.ChosenDeck) {
        if (!store.state.CreationMode) {
            router.replace('/')
        }
    }

}