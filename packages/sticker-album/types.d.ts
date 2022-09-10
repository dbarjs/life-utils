import { User } from "@firebase/auth";
import { Firestore } from "@firebase/firestore";

export namespace IStickerAlbum {
  export interface Item {
    ownerId: string;
    date: string;
    displayName: string;
  }

  export type List = (Item & { id: string })[];

  export interface State {
    items: Record<string, Item>;
  }

  export interface Options {
    database: Firestore;
    user: Partial<User>;
  }
}
