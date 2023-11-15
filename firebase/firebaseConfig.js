
import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: "AIzaSyCnxnGmNvQicpDaP1wj7jTY1WWBZXqbJjk",
  authDomain: "pubgm-id-buy-and-sell-a777d.firebaseapp.com",
  databaseURL: "https://pubgm-id-buy-and-sell-a777d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pubgm-id-buy-and-sell-a777d",
  storageBucket: "pubgm-id-buy-and-sell-a777d.appspot.com",
  messagingSenderId: "998966989312",
  appId: "1:998966989312:web:ab7121b41e7d60a6d6bee5"
};
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}
export {firebase};