<script lang="ts" setup>
import { useHead } from "#app";
import { getFirestore } from "@firebase/firestore";
import { useBirthdays } from "@life-utils/birthdays";
import { getFirebaseApp } from "@life-utils/shared";

// IMPLEMENT
getFirebaseApp();
getFirebaseApp();
getFirebaseApp();
const database = getFirestore(getFirebaseApp());

const { list } = useBirthdays({
  database,
  user: {
    uid: "93pqGFyTnMNt4sZAcOym8VL0wFh2",
  },
});

useHead({
  title: "Birthdays",
  titleTemplate: (title) => `${title} | Admin Panel`,
});
</script>

<template>
  <VList>
    <VListItem v-for="item in list" :key="item.id" link>
      <VListItemTitle>
        <span>{{ item.displayName }}</span>
      </VListItemTitle>
    </VListItem>
  </VList>
</template>
