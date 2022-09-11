<script lang="ts" setup>
import { defineProps, defineEmits, PropType, computed, ref } from "vue-demi";
import { IStickerAlbum } from "../types";
import { VCard, VBtn, VIcon } from "vuetify/components";

const props = defineProps({
  sticker: { type: Object as PropType<IStickerAlbum.Sticker>, required: true },
  timesSelected: { type: Number, required: true },
});
const emit = defineEmits(["add-button:click", "remove-button:click"]);

const isSelected = computed<boolean>(() => !!props.timesSelected);
const classObject = computed(() => ({
  "Sticker--isSelected": !!props.timesSelected,
}));
const elevation = computed<number>(() => (!!props.timesSelected ? 3 : 1));

const isTimesSelectedUpdating = ref(false);

function onAddButtonClick() {
  emit("add-button:click");

  isTimesSelectedUpdating.value = true;

  setTimeout(() => {
    isTimesSelectedUpdating.value = true;
  }, 300);
}

function onRemoveButtonClick() {
  emit("remove-button:click");

  isTimesSelectedUpdating.value = true;

  setTimeout(() => {
    isTimesSelectedUpdating.value = true;
  }, 300);
}
</script>

<template>
  <VCard
    :key="sticker.code"
    :elevation="elevation"
    class="Sticker"
    :class="classObject"
  >
    <div class="Sticker__main">
      <span class="Sticker__displayCode">{{ sticker.displayCode }}</span>
    </div>

    <div class="Sticker__actions">
      <VBtn
        icon
        variant="text"
        class="Sticker__actionButton"
        @click="onRemoveButtonClick"
      >
        <VIcon>mdi-minus-circle-outline</VIcon>
      </VBtn>

      <small class="Sticker__timesSelected">{{ timesSelected }}</small>

      <VBtn
        icon
        variant="text"
        class="Sticker__actionButton"
        @click="onAddButtonClick"
      >
        <VIcon>mdi-plus-circle-outline</VIcon>
      </VBtn>
    </div>
  </VCard>
</template>

<style lang="scss">
.Sticker {
  aspect-ratio: 10/13;
  align-items: center;
  background-color: #26c6da;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  text-align: center;
  min-width: 7rem;
  max-width: 10rem;
  width: 50%;

  &__main {
    align-items: center;
    display: flex;
    justify-content: center;
    flex: 1;
  }

  &__displayCode {
    color: #ffffff;
    font-size: 2rem;
    font-weight: 900;
  }

  &__actions {
    align-items: center;
    display: flex;
    width: 100%;
  }

  &__actionButton {
    .v-icon {
      color: #ffffff !important;
    }
  }

  &__timesSelected {
    color: #ffffff;
    flex: 1;
    font-size: 1.125rem;
    font-weight: 900;
  }

  &--isSelected {
    background-color: #3f51b5;
  }
}
</style>
