import type {
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

export const mockDocumentReference = (id: string) => {
  return {
    id,
  } as DocumentReference;
};

export const mockDocumentSnapshot = <T extends { id: string }>({
  id,
  ...others
}: T) => {
  return {
    id,
    data: () => others,
  } as unknown as DocumentSnapshot<DocumentData>;
};

export const mockQuerySnapshot = <T extends { id: string }>(data: T[]) => {
  return {
    docs: data.map(({ id, ...others }) => ({
      id,
      data: () => others,
    })),
  } as unknown as QuerySnapshot<DocumentData>;
};
