import * as firebase from 'firebase/app'
import 'firebase/analytics'

const firebaseConfig = {
   apiKey: "AIzaSyBcx71DNrPW4K1z8_7WRsg2WoqNKLG8Uh0",
   authDomain: "slint-2-1.firebaseapp.com",
   databaseURL: "https://slint-2-1.firebaseio.com",
   projectId: "slint-2-1",
   storageBucket: "slint-2-1.appspot.com",
   messagingSenderId: "115995177689",
   appId: "1:115995177689:web:ae98bbcba4d3b3eb8784c8",
   measurementId: "G-TZPQFF1D0F"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics()