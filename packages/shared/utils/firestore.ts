import {
  collection,
  doc,
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
} from "firebase/firestore";

export const useFirestoreCollection = <T = DocumentData>(
  database: Firestore,
  collectionName: string
) => {
  return collection(database, collectionName) as CollectionReference<T>;
};

export const useFirestoreDocument = <T = DocumentData>(
  database: Firestore,
  collectionName: string
) => {
  return doc(database, collectionName) as DocumentReference<T>;
};
