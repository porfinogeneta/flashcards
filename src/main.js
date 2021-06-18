import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';


import { library } from '@fortawesome/fontawesome-svg-core'
import { faCogs, faRandom, faVolumeUp, faExchangeAlt,
    faPencilRuler, faPencilAlt, faEraser, faChalkboard,
    faSpinner, faTrashAlt, faPlus, faTimes, faChevronLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCogs, faRandom, faVolumeUp,
    faExchangeAlt, faPencilRuler, faPencilAlt,
    faEraser, faChalkboard, faSpinner, faTrashAlt,
    faPlus, faTimes, faChevronLeft)



createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(store)
    .use(router)
    .mount('#app');
