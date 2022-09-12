import { User } from "@firebase/auth";
import { Firestore } from "@firebase/firestore";

export namespace IStickerAlbum {
  interface State {
    _unixTimestamp?: number;
    items: Record<string, Item>;
    stickers: Patch;
    patches?: State;
  }

  interface Sticker {
    code: string;
    displayCode: string;
  }

  interface StickerGroup {}

  export namespace Group {
    export interface Item {
      code: string;
      options: Options;
      stickers: Sticker[];
    }

    interface Options {
      codePrefix: string;
      stickerLength?: number;
      initialNumber?: number;
      customStickers?: Sticker[];
    }
  }

  export type Patch = Record<Stiker["code"], number>;

  export interface Options {
    database: Firestore;
    user: Partial<User>;
  }
}
