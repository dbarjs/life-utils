import { defineStore } from "pinia";
import { IBirthdays } from "./types";

export const useBirthdaysStore = defineStore("birthdays", {
  state: (): IBirthdays.State => ({
    items: {},
  }),
  getters: {
    list(): IBirthdays.List {
      return Object.entries(this.items).map(([id, item]) => ({
        id,
        ...item,
      }));
    },
  },
  actions: {
    addItem(id: string, item: IBirthdays.Item) {
      console.log("addItem", id, item);

      this.items[id] = item;
    },
  },
});
