<script lang="ts" setup>
import { useHead } from "#app";
import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { useBirthdays } from "@life-utils/birthdays";

// IMPLEMENT
const app = initializeApp({
  apiKey: "AIzaSyBAI61jKj5u3bJwRUIbss8lK2Ap6TlMjiY",
  authDomain: "life-utils.firebaseapp.com",
  projectId: "life-utils",
  storageBucket: "life-utils.appspot.com",
  messagingSenderId: "560182097714",
  appId: "1:560182097714:web:4c3663f1c85c72fea5892b",
  measurementId: "G-QNYEM6G0N6",
});
const database = getFirestore(app);

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
