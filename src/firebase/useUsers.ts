import { collection, getFirestore } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UserDoc } from "./useUser";
import { idConverter } from "./utils";

export const useUsers = () => {
  const db = getFirestore();
  const usersRef = collection(db, "users").withConverter(idConverter);
  const [usersDocData, usersDocLoading] = useCollectionData<UserDoc>(usersRef);

  return {
    usersDocData,
    usersDocLoading,
  };
};
