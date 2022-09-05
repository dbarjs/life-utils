import { defineStore } from "pinia";
import { IAuth } from "./types";

export const useAuthStore = defineStore("auth", {
  state: (): IAuth.State => ({
    idToken: null,
    isLoading: false,
    isVerified: false,
    user: null,
  }),
  getters: {
    isSignedIn(state) {
      return !!state.idToken;
    },
  },
});
