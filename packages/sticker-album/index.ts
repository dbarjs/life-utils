import { useFirestoreDocument } from "./../shared/utils/firestore";
import { addDoc, setDoc, onSnapshot, FieldValue } from "firebase/firestore";
import { useStickerAlbumStore } from "./store";
import { IStickerAlbum } from "./types";
import { useFirestoreCollection } from "@life-utils/shared";
import { computed, ref } from "vue-demi";
import { createStorage } from "unstorage";
import localForage from "localforage";

function getTimestampInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export function useStickerAlbum(options: IStickerAlbum.Options) {
  const { database, user } = options;

  if (!database) {
    throw new Error("Empty database");
  }

  if (!user?.uid) {
    throw new Error("Empty user");
  }

  const storage = localForage.createInstance({
    name: "stickerAlbum",
    storeName: "@life-utils",
  });

  const stickersDocument = useFirestoreDocument<Partial<IStickerAlbum.State>>(
    database,
    `sticker-album/${user.uid}`
  );
  const patchesCollection = useFirestoreCollection<
    Partial<IStickerAlbum.State>
  >(database, `sticker-album/${user.uid}/patches`);

  const store = useStickerAlbumStore();

  const isLocalSelecting = ref<boolean>(false);
  const firestoreStickers = ref<IStickerAlbum.State["stickers"]>({});
  const localStickers = ref<IStickerAlbum.State["stickers"]>({});
  const _mergedStickers = computed<IStickerAlbum.State["stickers"]>(() => {
    return Object.keys(localStickers.value).reduce<IStickerAlbum.Patch>(
      (mergedStickers, stickerCode) => {
        const localCount = localStickers.value[stickerCode];
        if (mergedStickers[stickerCode]) {
          mergedStickers[stickerCode] += localCount;
        } else {
          mergedStickers[stickerCode] = localCount;
        }
        return mergedStickers;
      },
      { ...firestoreStickers.value }
    );
  });

  const addStickerToLocalPatch = (stickerCode?: string): void => {
    if (!stickerCode) {
      return;
    }

    if (localStickers.value[stickerCode]) {
      localStickers.value[stickerCode]++;
    } else {
      localStickers.value[stickerCode] = 1;
    }

    setLocalStickersOnStorage(localStickers.value);
  };

  const removeStickerFromLocalPatch = (stickerCode?: string): void => {
    if (!stickerCode) {
      return;
    }

    if (localStickers.value[stickerCode]) {
      localStickers.value[stickerCode]--;
    } else {
      localStickers.value[stickerCode] = -1;
    }

    setLocalStickersOnStorage(localStickers.value);
  };

  const restoreStickersStorage = async () => {
    try {
      localStickers.value =
        (await storage.getItem<IStickerAlbum.State["stickers"]>("stickers")) ||
        {};
    } catch {}
  };

  const processCurrentBatch = async (): Promise<void> => {
    const mergedStickers = Object.keys({
      ...localStickers.value,
    }).reduce<IStickerAlbum.Patch>(
      (mergedStickers, stickerCode) => {
        const localCount = localStickers.value[stickerCode];
        if (mergedStickers[stickerCode]) {
          mergedStickers[stickerCode] += localCount;
        } else {
          mergedStickers[stickerCode] = localCount;
        }
        return mergedStickers;
      },
      { ...firestoreStickers.value }
    );

    await addDoc(patchesCollection, {
      stickers: mergedStickers,
      _unixTimestamp: getTimestampInSeconds(),
    });
    await setDoc(stickersDocument, {
      stickers: mergedStickers,
    });

    clearLocalStickers();
  };

  const clearLocalStickers = () => {
    setLocalStickersOnStorage({});
  };

  restoreStickersStorage();

  onSnapshot(
    stickersDocument,
    { includeMetadataChanges: true },
    (querySnapshot) => {
      firestoreStickers.value = querySnapshot.data()?.stickers || {};
    }
  );

  const setLocalStickersOnStorage = (value: IStickerAlbum.Patch) => {
    try {
      storage.setItem("stickers", { ...value });
    } catch {}
  };

  return {
    patchesCollection,
    store,

    isLocalSelecting,
    localStickers,
    firestoreStickers,
    _mergedStickers,

    clearLocalStickers,
    addStickerToLocalPatch,
    processCurrentBatch,
    removeStickerFromLocalPatch,
  };
}
