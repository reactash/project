import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'



const firebaseConfig = {
  apiKey: "AIzaSyCFuqNxXklmyR1WRme-ucBGW515bxIhEAM",
  authDomain: "ecom-9a2bf.firebaseapp.com",
  projectId: "ecom-9a2bf",
  storageBucket: "ecom-9a2bf.appspot.com",
  messagingSenderId: "303526503270",
  appId: "1:303526503270:web:e87dc59b8fb9b8660cdea7",
  measurementId: "G-0J8S77EZB0"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth,fs,storage}