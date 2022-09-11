import { FirebaseApp, initializeApp } from "firebase/app";

export const useFirebaseApp = (): FirebaseApp => {
  const app = initializeApp({
    apiKey: "AIzaSyBAI61jKj5u3bJwRUIbss8lK2Ap6TlMjiY",
    authDomain: "life-utils.firebaseapp.com",
    projectId: "life-utils",
    storageBucket: "life-utils.appspot.com",
    messagingSenderId: "560182097714",
    appId: "1:560182097714:web:4c3663f1c85c72fea5892b",
    measurementId: "G-QNYEM6G0N6",
  });

  return app;
};
