import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth"

const config = {
    apiKey: "AIzaSyBgCdBy8XDpvpi5AhNM3WkaCT3hfaT0DRw",
    authDomain: "flashcardsaplication.firebaseapp.com",
    databaseURL: "https://flashcardsaplication-default-rtdb.firebaseio.com",
    projectId: "flashcardsaplication",
    storageBucket: "flashcardsaplication.appspot.com",
    messagingSenderId: "332869621594",
    appId: "1:332869621594:web:e71fb9a9a6df7c55014563",
    measurementId: "G-L2N4C27QJP"
}

export const provider = new firebase.auth.GoogleAuthProvider();
const fire = firebase.initializeApp(config);
export default fire;
