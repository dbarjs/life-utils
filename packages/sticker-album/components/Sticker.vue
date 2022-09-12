<script lang="ts" setup>
import { defineProps, defineEmits, PropType, computed, ref } from "vue-demi";
import { IStickerAlbum } from "../types";
import { VCard, VBtn, VIcon, VChip } from "vuetify/components";

const props = defineProps({
  isLocalSelecting: { type: Boolean, required: true },
  sticker: { type: Object as PropType<IStickerAlbum.Sticker>, required: true },
  timesSelected: { type: Number, required: true },
  timesSelectedOnFirestore: { type: Number, required: false },
});
const emit = defineEmits(["add-button:click", "remove-button:click"]);

const selectCount = computed<number>(() => {
  if (props.isLocalSelecting) {
    return props.timesSelected;
  }

  return props.timesSelectedOnFirestore || 0;
});
const existsOnFirestore = computed<boolean>(
  () => !!props.timesSelectedOnFirestore
);
const isSelected = computed<boolean>(() => {
  if (props.isLocalSelecting) {
    return !!props.timesSelected;
  }

  return !!props.timesSelectedOnFirestore;
});
const isDuplicated = computed<boolean>(() => props.timesSelected > 1);
const classObject = computed(() => ({
  "Sticker--existsOnFirestore": !!existsOnFirestore.value,
  "Sticker--isSelected": !!isSelected.value,
  "Sticker--isDuplicated": !!isDuplicated.value,
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

      <div class="Sticker__infoWrapper">
        <VChip
          class="Sticker__infoChip Sticker__infoChip--isDuplicated"
          v-if="isLocalSelecting && isSelected && existsOnFirestore"
        >
          <span>Repeated! :(</span>
        </VChip>

        <VChip class="Sticker__infoChip" v-else-if="existsOnFirestore">
          <span>Already have! :-)</span>
        </VChip>

        <VChip
          class="Sticker__infoChip Sticker__infoChip--isDuplicated"
          v-else-if="isDuplicated"
        >
          <span>Ops! o/</span>
        </VChip>

        <VChip class="Sticker__infoChip" v-else-if="isSelected">
          <span>One more! o/</span>
        </VChip>
      </div>
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

      <small class="Sticker__timesSelected">{{ selectCount }}</small>

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
// https://material.io/resources/color/#!/?view.left=0&view.right=0&secondary.color=3F51B5&primary.color=00838F&primary.text.color=ffffff&secondary.text.color=ffffff
.Sticker {
  aspect-ratio: 10/13;
  align-items: center;
  background-color: #26c6da;
  border-radius: 10px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
  text-align: center;
  transition: background 10s ease;
  min-width: 7rem;
  max-width: 10rem;
  margin: 2pt;
  width: 50%;

  &__main {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    position: relative;
    width: 100%;
  }

  &__infoWrapper {
    left: 0;
    position: absolute;
    margin-top: 0.5rem;
    top: 0;
    width: 100%;
  }

  &__infoChip {
    background-color: yellow;
    border-radius: 20px !important;
    font-size: 0.625rem !important;
    font-weight: 700;

    &--isDuplicated {
      background-color: red;
    }
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

  &--isDuplicated {
    background-color: #002984;
  }
}
</style>
