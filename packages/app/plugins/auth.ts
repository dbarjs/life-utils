import { Auth, useAuthStore } from "@life-utils/auth";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  const auth = Auth.getInstance({
    firebaseOptions: {
      apiKey: "AIzaSyBAI61jKj5u3bJwRUIbss8lK2Ap6TlMjiY",
      authDomain: "life-utils.firebaseapp.com",
      projectId: "life-utils",
      storageBucket: "life-utils.appspot.com",
      messagingSenderId: "560182097714",
      appId: "1:560182097714:web:4c3663f1c85c72fea5892b",
      measurementId: "G-QNYEM6G0N6",
    },
    storeNamespace: "@flux-admin",
  });

  const authStore = useAuthStore();

  authStore.idToken;

  auth.onStateUpdate = ({ idToken, isLoading, isVerified, user }) => {
    console.log("onStateUpdate", isLoading);

    authStore.$patch((state) => {
      state.idToken = idToken;
      state.isLoading = isLoading;
      state.isVerified = isVerified;
      state.user = user;
    });
  };
  auth.init();

  return {
    provide: {
      auth,
    },
  };
});
