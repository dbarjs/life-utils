<template>
  <VApp class="App system-sans-serif">
    <AuthWrapper>
      <Header>
        <NavigationMenu />
      </Header>

      <VMain>
        <VContainer>
          <slot />
        </VContainer>
      </VMain>
    </AuthWrapper>
  </VApp>
</template>

<script lang="ts">
import AuthWrapper from "@/components/AppAuthWrapper.vue";
import Header from "@/components/AppHeader.vue";
import NavigationMenu from "@/components/AppNavigationMenu.vue";
import { VApp, VContainer, VMain } from "vuetify/components";
</script>

<script lang="ts" setup>
useHead({
  title: "Admin Panel",
});
</script>
