<script lang="ts" setup>
import { useAuthStore } from "@life-utils/auth";
import { computed, ref } from "vue";

const authStore = useAuthStore();
const { $auth } = useNuxtApp();

const isGoogleLoading = ref(false);

const isWrapperAllowed = computed(() => {
  return !authStore.isLoading && !!authStore.isSignedIn;
});

const isProgressVisible = computed(() => {
  return !!authStore.isLoading;
});

const isDialogVisible = computed(() => {
  return !authStore.isLoading && !authStore.isSignedIn;
});

function onGoogleButtonClick() {
  isGoogleLoading.value = true;

  $auth.signInWithGoogle();
}
</script>

<template>
  <slot v-if="isWrapperAllowed" />

  <div v-else class="AppAuthWrapper__background"></div>

  <v-dialog :model-value="isDialogVisible" persistent>
    <v-card class="AppAuthWrapper__card" variant="outlined">
      <img
        class="AppAuthWrapper__logo"
        src="/logo.png"
        alt="Flux Admin"
        draggable="false"
      />

      <p class="text-2">
        You can log into the panel with your Talentify e-mail
      </p>

      <v-btn
        rounded="pill"
        variant="outlined"
        size="x-large"
        prepend-icon
        class="AppAuthWrapper__google"
        :loading="isGoogleLoading"
        @click="onGoogleButtonClick"
      >
        <span>Sign up with Google</span>
      </v-btn>
    </v-card>
  </v-dialog>

  <v-dialog persistent hide-overlay :model-value="isProgressVisible">
    <v-progress-circular
      indeterminate
      :size="70"
      :width="5"
      color="purple"
    ></v-progress-circular>
  </v-dialog>
</template>

<style lang="scss">
.AppAuthWrapper {
  &__background {
    background-image: url("/auth/wrapper-background.png");
    background-position: center;
    background-size: cover;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  &__card {
    align-items: center;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    user-select: none;
  }

  &__logo {
    margin: 2rem 0;
    max-width: 100%;
    user-select: none;
    width: 12rem;
  }

  &__google {
    margin: 2rem 0;
  }
}
</style>
