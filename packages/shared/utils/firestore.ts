import { CollectionReference, Firestore } from "@firebase/firestore";
import { collection, DocumentData } from "firebase/firestore";

export const useFirestoreCollection = <T = DocumentData>(
  database: Firestore,
  collectionName: string
) => {
  return collection(database, collectionName) as CollectionReference<T>;
};
