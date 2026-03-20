import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyDDDOeYz56M_BmBpLS105dSeXe6x2KbdyA",
    authDomain: "scorecard-99b96.firebaseapp.com",
    projectId: "scorecard-99b96",
    storageBucket: "scorecard-99b96.firebasestorage.app",
    messagingSenderId: "887902979194",
    appId: "1:887902979194:web:76b32356e537d13efa27c3",
    measurementId: "G-9ZXTW4Z8P0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };