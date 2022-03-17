const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
const config = require("config");

// get config from ./default.json
const firebaseConfig = {
  apiKey: "AIzaSyAHD0dltwAbH81Qf7KtzTTioC57ezqBxPE",
  authDomain: "sih22-khel-ind.firebaseapp.com",
  projectId: "sih22-khel-ind",
  storageBucket: "sih22-khel-ind.appspot.com",
  messagingSenderId: "564861176652",
  appId: "1:564861176652:web:219ecda27e378f62439de9"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
auth.languageCode = 'it';
module.exports = { db, auth };
