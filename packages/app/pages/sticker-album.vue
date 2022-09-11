<script lang="ts" setup>
import { useHead } from "#app";
import { useFirebaseApp } from "@life-utils/shared";
import { useStickerAlbum } from "@life-utils/sticker-album";
import { IStickerAlbum } from "@life-utils/sticker-album/types";
import { getFirestore } from "firebase/firestore";
import Sticker from "@life-utils/sticker-album/components/Sticker.vue";
import { count } from "console";

const {
  addStickerToCurrentPatch,
  processCurrentBatch,
  removeStickerFromCurrentPatch,
  stickers,
} = useStickerAlbum({
  database: getFirestore(useFirebaseApp()),
  user: {
    uid: "93pqGFyTnMNt4sZAcOym8VL0wFh2",
  },
});

const DEFAULT_STICKERS_LENGTH: number = 24;

const ALPHABETICAL_ORDER: boolean = true;

const stickerGroupsOptions: IStickerAlbum.Group.Options[] = [
  {
    codePrefix: "PANINI",
    customStickers: [
      { code: "PANINI_00", displayCode: "00" },
      { code: "PANINI_0", displayCode: "0" },
    ],
    stickerLength: 0,
  },
  { codePrefix: "FWC", stickerLength: 7, initialNumber: 0 },
  { codePrefix: "FWC", stickerLength: 11, initialNumber: 8 },
  { codePrefix: "QAT", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "ECU", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "SEN", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "NED", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "ENG", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "IRN", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "USA", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "WAL", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "ARG", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "KSA", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "MEX", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "POL", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "FRA", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "AUS", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "DEN", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "TUN", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "ESP", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "CRC", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "GER", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "JPN", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "BEL", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "CAN", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "MAR", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "CRO", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "BRA", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "SRB", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "SUI", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "CMR", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "POR", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "GHA", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "URU", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "KOR", stickerLength: 20, initialNumber: 0 },
  { codePrefix: "FWC", stickerLength: 4, initialNumber: 19 },
  { codePrefix: "FWC", stickerLength: 7, initialNumber: 23 },
];

const stickerGroups = stickerGroupsOptions
  .reduce<IStickerAlbum.Group.Item[]>((stickerGroups, options, groupIndex) => {
    const stickers: IStickerAlbum.Sticker[] = [];

    options.customStickers?.forEach((sticker) => {
      stickers.push(sticker);
    });

    let currentStickerCodeNumber = options.initialNumber || 1;

    Array.from({
      length: options.stickerLength ?? DEFAULT_STICKERS_LENGTH,
    }).forEach((_) => {
      stickers.push({
        code: `${options.codePrefix}_${currentStickerCodeNumber}`,
        displayCode: `${options.codePrefix} ${currentStickerCodeNumber}`,
      });

      currentStickerCodeNumber++;
    });

    stickerGroups.push({
      code: `${options.codePrefix}_${groupIndex}`,
      options,
      stickers,
    });

    return stickerGroups;
  }, [])
  .sort((groupA, groupB) => {
    if (ALPHABETICAL_ORDER) {
      return groupA.code.localeCompare(groupB.code);
    }

    return 0;
  });

const avaiableStickerCountOnGroups = stickerGroups.reduce<number>(
  (count, group) => count + group.stickers.length,
  0
);

const stickersCountMap = computed<Record<string, string>>(() => {
  if (!stickers.value) {
    return {};
  }

  return stickerGroups.reduce<Record<string, string>>((countMap, group) => {
    countMap[group.code] = `${group.stickers.reduce<number>(
      (count, sticker) => count + (stickers.value[sticker.code] || 0),
      0
    )} / ${group.stickers.length}`;

    return countMap;
  }, {});
});

const collectedUniqueStickersCount = computed<number>(() => {
  if (!stickers.value) {
    return 0;
  }

  return Object.values(stickers.value).reduce((uniqueCount, stickerCount) => {
    if (stickerCount > 0) {
      uniqueCount++;
    }

    return uniqueCount;
  }, 0);
});

const collectedUniqueStickersPercentage = computed<number>(() => {
  if (!collectedUniqueStickersCount.value) {
    return 0;
  }

  return (
    (collectedUniqueStickersCount.value / avaiableStickerCountOnGroups) * 100
  );
});

useHead({
  title: "Birthdays",
  titleTemplate: (title) => `${title} | Admin Panel`,
});

function timesSelected(stickerCode?: string) {
  if (!stickerCode) {
    return 0;
  }

  return stickers.value[stickerCode] || 0;
}

function onProcessButtonClick() {
  processCurrentBatch();
}

function onAddButtonClick(stickerCode?: string) {
  addStickerToCurrentPatch(stickerCode);
}

function onRemoveButtonClick(stickerCode?: string) {
  removeStickerFromCurrentPatch(stickerCode);
}
</script>

<template>
  <div class="wrapper">
    <pre>{{ collectedUniqueStickersPercentage }}</pre>

    <VBtn @click="onProcessButtonClick">Process!</VBtn>

    <VProgressLinear
      :model-value="collectedUniqueStickersPercentage"
      striped
      height="25"
      color="deep-orange"
    >
      <strong>{{ Math.ceil(collectedUniqueStickersPercentage) }}%</strong>
    </VProgressLinear>

    <VExpansionPanels variant="popout">
      <VExpansionPanel
        v-for="{ code, options, stickers } in stickerGroups"
        :key="code"
        class="group"
      >
        <VExpansionPanelTitle>
          <span class="group-code-prefix">{{ options.codePrefix }}</span>
          <span class="group-count">({{ stickersCountMap[code] }})</span>
        </VExpansionPanelTitle>

        <VExpansionPanelText>
          <div class="list">
            <Sticker
              v-for="sticker in stickers"
              :key="sticker.code"
              class="sticker"
              :sticker="sticker"
              :times-selected="timesSelected(sticker.code)"
              @add-button:click="onAddButtonClick(sticker.code)"
              @remove-button:click="onRemoveButtonClick(sticker.code)"
            />
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.group {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
}

.group-code-prefix {
  color: #005662;
  font-size: 1.125rem;
  font-weight: 900;
  margin-right: 0.5rem;
}

.group-count {
  color: #424242;
  margin-right: 0.5rem;
}

.list {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}
</style>
