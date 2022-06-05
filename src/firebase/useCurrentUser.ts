import { getAuth } from "firebase/auth";
import { doc, DocumentReference, getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { UserDoc } from "./useUser";
import { idConverter } from "./utils";

export const useCurrentUser = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, userLoading] = useAuthState(auth);
  const userRef = (
    user ? doc(db, "users", user?.uid).withConverter(idConverter) : null
  ) as DocumentReference<UserDoc> | null;

  const [userDocData, userDocLoading] = useDocumentData<UserDoc>(userRef);

  const profile = userDocData || {};
  const favorite = profile?.favorite || [];

  const loading = userLoading || userDocLoading;

  return {
    auth,
    user,
    favorite,
    profile,
    loading,
  };
};

export type CurrentUser = ReturnType<typeof useCurrentUser>;
