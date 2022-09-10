import { defineStore } from "pinia";
import { IStickerAlbum } from "./types";

export const useStickerAlbumStore = defineStore("StickerAlbum", {
  state: (): IStickerAlbum.State => ({
    items: {},
  }),
  getters: {
    list(): IStickerAlbum.List {
      return Object.entries(this.items).map(([id, item]) => ({
        id,
        ...item,
      }));
    },
  },
  actions: {
    addItem(id: string, item: IStickerAlbum.Item) {
      console.log("addItem", id, item);

      this.items[id] = item;
    },
  },
});
