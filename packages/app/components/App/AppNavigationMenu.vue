<template>
  <nav class="AppNavigationMenu">
    <VBtn
      rounded="pill"
      variant="tonal"
      prepend-icon="mdi-cloud-upload"
      to="/birthdays"
    >
      <span>Birthdays</span>
    </VBtn>

    <VBtn
      rounded="pill"
      variant="text"
      prepend-icon="mdi-exit-to-app"
      @click="onSignOutButtonClick"
    >
      <span>Logout</span>
    </VBtn>
  </nav>
</template>

<script lang="ts">
import { VBtn } from "vuetify/components";
</script>

<script lang="ts" setup>
const { $auth } = useNuxtApp();

function onSignOutButtonClick() {
  $auth.signOut();
}
</script>

<style lang="scss">
.AppNavigationMenu {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1rem;
}
</style>
