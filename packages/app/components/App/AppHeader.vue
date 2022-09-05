<template>
  <VAppBar class="AppHeader">
    <VAppBarNavIcon @click="toggleNavigationDrawerState" />

    <VAppBarTitle>
      <span>LIFE UTILS</span>
    </VAppBarTitle>
  </VAppBar>

  <VNavigationDrawer v-model="isNavigationDrawerVisible">
    <slot />
  </VNavigationDrawer>
</template>

<script lang="ts">
import {
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VNavigationDrawer,
} from "vuetify/components";
</script>

<script lang="ts" setup>
const isNavigationDrawerVisible = ref(false);

function toggleNavigationDrawerState() {
  isNavigationDrawerVisible.value = !isNavigationDrawerVisible.value;
}
</script>

<style lang="scss">
.AppHeader {
  &__logo {
    width: 12rem;
    max-width: 100%;
    user-select: none;
  }
}
</style>
