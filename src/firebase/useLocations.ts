import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { StatisticType } from "./statistic";
import { idConverter } from "./utils";

export type LocationsStatisticType = {
  primary: StatisticType;
  other: StatisticType;
  online: StatisticType;
  total: StatisticType;
};

export type LocationDoc = {
  id?: string;
  name: string;
  country?: string;
  coordinates?: number[];
  image?: string;
  statistic?: {
    "2022"?: LocationsStatisticType;
  };
};

export type UseLocationsParams = {
  searchString?: string;
};

export const useLocations = ({ searchString = "" }: UseLocationsParams) => {
  const db = getFirestore();
  const locationRef = collection(db, "locations").withConverter(
    idConverter
  ) as CollectionReference<LocationDoc>;

  const [locationsDocData, locationsDocLoading] =
    useCollectionData<LocationDoc>(
      searchString
        ? query(
            locationRef,
            where("name", ">=", searchString),
            where("name", "<=", searchString + "\uf8ff")
          )
        : locationRef
    );

  const addLocation = async (data: LocationDoc) => {
    addDoc(locationRef, data);
  };

  const loading = locationsDocLoading;

  return { locations: locationsDocData || [], addLocation, loading };
};
