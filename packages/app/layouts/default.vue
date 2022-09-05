<template>
  <VApp class="App system-sans-serif">
    <AppAuthWrapper>
      <AppHeader>
        <AppNavigationMenu />
      </AppHeader>

      <VMain>
        <VContainer>
          <slot />
        </VContainer>
      </VMain>
    </AppAuthWrapper>
  </VApp>
</template>

<script lang="ts">
import AppAuthWrapper from "@/components/App/AppAuthWrapper.vue";
import AppHeader from "@/components/App/AppHeader.vue";
import AppNavigationMenu from "@/components/App/AppNavigationMenu.vue";
import { VApp, VContainer, VMain } from "vuetify/components";
</script>

<script lang="ts" setup>
useHead({
  title: "Admin Panel",
});
</script>
