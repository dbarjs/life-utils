import { useFirestoreDocument } from "./../shared/utils/firestore";
import { addDoc, setDoc, onSnapshot, FieldValue } from "firebase/firestore";
import { useStickerAlbumStore } from "./store";
import { IStickerAlbum } from "./types";
import { useFirestoreCollection } from "@life-utils/shared";
import { computed, ref } from "vue-demi";
import { createStorage } from "unstorage";
import localForage from "localforage";

export function useStickerAlbum(options: IStickerAlbum.Options) {
  const { database, user } = options;

  if (!database) {
    throw new Error("Empty database");
  }

  if (!user?.uid) {
    throw new Error("Empty user");
  }

  const stickersDocument = useFirestoreDocument<Partial<IStickerAlbum.State>>(
    database,
    `sticker-album/${user.uid}`
  );
  const storage = localForage.createInstance({
    name: "stickerAlbum",
    storeName: "@life-utils",
  });
  const patchesCollection = useFirestoreCollection<
    Partial<IStickerAlbum.State>
  >(database, `sticker-album/${user.uid}/patches`);
  const store = useStickerAlbumStore();
  const firestoreStickers = ref<IStickerAlbum.State["stickers"]>({});
  const localStickers = ref<IStickerAlbum.State["stickers"]>({});
  const stickers = computed<IStickerAlbum.State["stickers"]>(() => {
    return {
      ...firestoreStickers.value,
      ...localStickers.value,
    };
  });

  const addStickerToCurrentPatch = (stickerCode?: string): void => {
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

  const removeStickerFromCurrentPatch = (stickerCode?: string): void => {
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
    await addDoc(patchesCollection, {
      stickers: stickers.value,
    });
    await setDoc(stickersDocument, {
      stickers: stickers.value,
    });
    setLocalStickersOnStorage(stickers.value);
  };

  restoreStickersStorage();

  onSnapshot(
    stickersDocument,
    { includeMetadataChanges: true },
    (querySnapshot) => {
      firestoreStickers.value = querySnapshot.data()?.stickers || {};
      console.log("fuuu");
      setLocalStickersOnStorage(stickers.value);
    }
  );

  const setLocalStickersOnStorage = (value: IStickerAlbum.Patch) => {
    console.log("value", stickers.value);

    try {
      storage.setItem("stickers", { ...stickers.value });
    } catch {}
  };

  return {
    patchesCollection,
    store,

    stickers,

    addStickerToCurrentPatch,
    processCurrentBatch,
    removeStickerFromCurrentPatch,
  };
}
