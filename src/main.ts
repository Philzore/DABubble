import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { initializeApp } from "firebase/app";

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


const firebaseConfig = {
  apiKey: "AIzaSyBbnVA_fsi_fcibN_FnP-hZxlL0hrMD3Ug",
  authDomain: "dabubble-60d69.firebaseapp.com",
  projectId: "dabubble-60d69",
  storageBucket: "dabubble-60d69.appspot.com",
  messagingSenderId: "181517138663",
  appId: "1:181517138663:web:ea5464f0392e0f41b8c042"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);