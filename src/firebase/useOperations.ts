import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { idConverter } from "./utils";

export type DistributedBook = {
  bookId: number;
  count: number;
};

export type OperationDoc = {
  id?: string;
  date: string;
  userId: string;
  userName: string;
  locationId: string;
  totalCount: number;
  totalPoints: number;
  books: DistributedBook[];
  isAuthorized?: boolean;
  isOnline?: boolean;
};

export const useOperations = () => {
  const db = getFirestore();
  const operationsRef = collection(db, "operations").withConverter(
    idConverter
  ) as CollectionReference<OperationDoc>;

  const [operationsDocData, operationsDocLoading] =
    useCollectionData<OperationDoc>(
      query(operationsRef, orderBy("date", "desc"))
    );

  const addOperation = async (params: OperationDoc) => {
    addDoc(operationsRef, params);
  };

  const deleteOperation = async (id?: string | number) => {
    if (id) {
      const operationRef = doc(db, "operations", String(id));
      deleteDoc(operationRef);
    }
  };

  const loading = operationsDocLoading;

  return { addOperation, deleteOperation, operationsDocData, loading };
};
