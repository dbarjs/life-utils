import { addDoc, onSnapshot } from "firebase/firestore";
import { useBirthdaysStore } from "./store";
import { IBirthdays } from "./types";
import { createCollection } from "./utils";
import { computed } from "vue-demi";

export function useBirthdays(options: IBirthdays.Options) {
  const { database, user } = options;

  if (!database) {
    throw new Error("Empty database");
  }

  if (!user) {
    throw new Error("Empty user");
  }

  const collection = createCollection<IBirthdays.Item>(database, "birthdays");
  const store = useBirthdaysStore();

  const list = computed(() => {
    return store.list;
  });

  const onItemAdd = async (item: IBirthdays.Item): Promise<void> => {
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
