import {useRouter} from 'vue-router';
// import { useStore } from 'vuex'

export default function checkToSeeChosenDeck (store) {

    // const store = useStore()
    const router = useRouter()

    if (!store.state.ChosenDeck) {
        if (!store.state.CreationMode) {
            router.push('/')
        }
    }

}