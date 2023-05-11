// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: "AIzaSyDtsBrZkgYe8ktBVRfs3qYrhXRLRU_l7IA",
//   authDomain: "login-2c133.firebaseapp.com",
//   projectId: "login-2c133",
//   storageBucket: "login-2c133.appspot.com",
//   messagingSenderId: "618239516622",
//   appId: "1:618239516622:web:8e013ad7ed94fc643ad59f",
//   measurementId: "G-0NWLEJS91N"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBy-yUeR0C7X2OGGNpLt8ttmU0yOXuSQYI",
  authDomain: "login-93ac0.firebaseapp.com",
  projectId: "login-93ac0",
  storageBucket: "login-93ac0.appspot.com",
  messagingSenderId: "77699484321",
  appId: "1:77699484321:web:04a902c39864be792f7ee0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



export default app;
export {db};


