import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBmJbeVVIPk6fDSBgrv6hHMpc8SXbhXtNM",
  authDomain: "madrasa-e-nurul-quran.firebaseapp.com",
  projectId: "madrasa-e-nurul-quran",
  storageBucket: "madrasa-e-nurul-quran.firebasestorage.app",
  messagingSenderId: "407617179383",
  appId: "1:407617179383:web:35578dd5851aded6d98df2",
  measurementId: "G-RPEPVW4TLZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log("Firebase Connected Successfully!");
