import { addDoc, onSnapshot } from "firebase/firestore";
import { useStickerAlbumStore } from "./store";
import { IStickerAlbum } from "./types";
import { createCollection } from "./utils";
import { computed } from "vue-demi";

export function useStickerAlbum(options: IStickerAlbum.Options) {
  const { database, user } = options;

  if (!database) {
    throw new Error("Empty database");
  }

  if (!user) {
    throw new Error("Empty user");
  }

  const collection = createCollection<IStickerAlbum.Item>(
    database,
    "StickerAlbum"
  );
  const store = useStickerAlbumStore();

  const list = computed(() => {
    return store.list;
  });

  const onItemAdd = async (item: IStickerAlbum.Item): Promise<void> => {
    await addDoc(collection, item);
  };

  onSnapshot(collection, { includeMetadataChanges: true }, (querySnapshot) => {
    querySnapshot.forEach((document) => {
      store.addItem(document.id, document.data());
    });
  });

  return {
    collection,
    store,

    list,

    onItemAdd,
  };
}
