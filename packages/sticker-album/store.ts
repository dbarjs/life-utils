import { defineStore } from "pinia";
import { IStickerAlbum } from "./types";

export const useStickerAlbumStore = defineStore("StickerAlbum", {
  state: (): IStickerAlbum.State => ({
    stickers: {},
    items: {},
  }),
  getters: {
    list(): IStickerAlbum.Sticker[] {
      return Object.entries(this.items).map(([id, item]) => ({
        id,
        ...item,
      }));
    },
  },
  actions: {
    addItem(id: string, item: IStickerAlbum.Sticker) {
      console.log("addItem", id, item);

      this.items[id] = item;
    },
  },
});
