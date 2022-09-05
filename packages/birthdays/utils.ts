import { CollectionReference, Firestore } from "@firebase/firestore";
import { collection, DocumentData } from "firebase/firestore";

export const createCollection = <T = DocumentData>(
  database: Firestore,
  collectionName: string
) => {
  return collection(database, collectionName) as CollectionReference<T>;
};
