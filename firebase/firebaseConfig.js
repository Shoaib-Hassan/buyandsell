
import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/database'

const firebaseConfig = {
  apiKey: "YOURAPIKEY",
  authDomain: "DATABASEDOMAIN",
  databaseURL: "URL",
  projectId: "PROJECTID",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}
export {firebase};
