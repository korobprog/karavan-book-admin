import { getAuth } from "firebase/auth";
import {
  doc,
  collection,
  DocumentReference,
  getFirestore,
  setDoc,
  addDoc,
  CollectionReference,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { StatisticType } from "./statistic";
import { idConverter } from "./utils";

export type UserRoles = "admin";

export type UserDoc = {
  id?: string;
  name?: string;
  nameSpiritual?: string;
  phone?: string;
  address?: string;
  city?: string;
  favorite?: string[];
  role?: UserRoles;
  statistic?: {
    "2022": StatisticType;
  };
  email?: string;
  isUnattached?: boolean;
};

export const useUser = () => {
  const auth = getAuth();
  const db = getFirestore();
  const [user, userLoading] = useAuthState(auth);
  const userRef = (
    user ? doc(db, "users", user?.uid).withConverter(idConverter) : null
  ) as DocumentReference<UserDoc> | null;
  const usersRef = (
    user ? collection(db, "users").withConverter(idConverter) : null
  ) as CollectionReference<UserDoc> | null;

  const [userDocData, userDocLoading] = useDocumentData<UserDoc>(userRef);

  const profile = userDocData || {};
  const favorite = profile?.favorite || [];

  const toggleFavorite = async (favoriteId: string) => {
    if (user && userRef) {
      if (favorite.includes(favoriteId)) {
        const filteredFavorite = favorite.filter(
          (value) => value !== favoriteId
        );
        await setDoc(userRef, { ...profile, favorite: filteredFavorite });
      } else {
        const newFavorite = [...favorite, favoriteId];
        await setDoc(userRef, { ...profile, favorite: newFavorite });
      }
    }
  };

  const setProfile = async (newProfile: UserDoc) => {
    if (user && userRef) {
      await setDoc(userRef, { ...profile, ...newProfile });
    }
  };

  const addNewUnattachedProfile = async (newProfile: UserDoc) => {
    if (user && usersRef) {
      await addDoc(usersRef, { ...newProfile, isUnattached: true });
    }
  };

  const rewriteUserStatistic = (newBooks: StatisticType, user?: UserDoc) => ({
    ...user,
    statistic: {
      "2022": {
        count: (user?.statistic?.[2022].count || 0) + newBooks.count,
        points: (user?.statistic?.[2022].points || 0) + newBooks.points,
      },
    },
  });

  const addStatistic = async (
    newBooks: StatisticType,
    selectedUserId?: string
  ) => {
    if (selectedUserId) {
      const selectedUserRef = doc(db, "users", selectedUserId) as DocumentReference<UserDoc>;
      const selectedUser = (await getDoc(selectedUserRef)).data();
      await setDoc(selectedUserRef, rewriteUserStatistic(newBooks, selectedUser));
      return;
    }

    if (user && userRef) {
      await setDoc(userRef, rewriteUserStatistic(newBooks, profile));
      return;
    }
  };

  const loading = userLoading || userDocLoading;

  return {
    auth,
    user,
    userLoading,
    favorite,
    addStatistic,
    toggleFavorite,
    loading,
    setProfile,
    addNewUnattachedProfile,
    profile,
  };
};
