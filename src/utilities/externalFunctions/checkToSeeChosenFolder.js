import {useRouter} from 'vue-router';
import { useStore } from 'vuex'

export default function checkToSeeChosenFolder () {

    const store = useStore()
    const router = useRouter()

    if (!store.state.ChosenFolder) {
        if (!store.state.CreationMode) {
            router.push('/')
        }
    }

}