import { getAuth } from "firebase/auth";
import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export type DistributedBook = {
  bookId: number;
  count: number;
};

export type OperationDoc = {
  date: string;
  userId: string;
  userName: string;
  locationId: string;
  totalCount: number;
  totalPoints: number;
  books: DistributedBook[];
  isAuthorized?: boolean;
};

export const useOperations = () => {
  const db = getFirestore();
  const operationRef = collection(
    db,
    "operations"
  ) as CollectionReference<OperationDoc>;

  const [operationsDocData, operationsDocLoading] =
    useCollectionData<OperationDoc>(
      query(operationRef, orderBy("date", "desc"))
    );

  const addOperation = async (params: OperationDoc) => {
    addDoc(operationRef, params);
  };

  const loading = operationsDocLoading;

  return { addOperation, operationsDocData, loading };
};
