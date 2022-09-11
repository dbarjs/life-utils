<template>
  <VApp class="App system-sans-serif">
    <Wrapper>
      <Header>
        <NavigationMenu />
      </Header>

      <VMain>
        <VContainer>
          <slot />
        </VContainer>
      </VMain>
    </Wrapper>
  </VApp>
</template>

<script lang="ts">
import Wrapper from "@/components/AppWrapper.vue";
import Header from "@/components/AppHeader.vue";
import NavigationMenu from "@/components/AppNavigationMenu.vue";
import { VApp, VContainer, VMain } from "vuetify/components";
</script>

<script lang="ts" setup>
useHead({
  title: "Admin Panel",
});
</script>
