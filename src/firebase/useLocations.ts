import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  calculateOperationStatistic,
  getBookCountsMap,
} from "../services/statistic";
import { OperationDoc } from "./useOperations";
import { idConverter } from "./utils";

export type LocationsStatisticType = {
  totalPoints: number;
  totalPrimaryCount: number;
  totalOtherCount: number;
  totalOnlineCount: number;
  totalOnlinePoints: number;
};

// TODO: get from operation date
const CHANGED_YEAR = 2022;

export type LocationDoc = {
  id?: string;
  name: string;
  country?: string;
  coordinates?: number[];
  image?: string;
  statistic?: {
    "2022"?: LocationsStatisticType;
    "2023"?: LocationsStatisticType;
  };
};

export type UseLocationsParams = {
  searchString?: string;
};

const db = getFirestore();

const locationsRef = collection(db, "locations").withConverter(
  idConverter
) as CollectionReference<LocationDoc>;

const getLocationRefById = (id: string) =>
  doc(db, "locations", id) as DocumentReference<LocationDoc>;

export const addLocation = async (data: LocationDoc) => {
  addDoc(locationsRef, data);
};

export const editLocation = async (id: string, data: LocationDoc) => {
  setDoc(getLocationRefById(id), data);
};

export const setCoordinates = (x: number, y: number, location: LocationDoc) => {
  const { id, ...newLocation }: LocationDoc = {
    ...location,
    coordinates: [x, y],
  };
  if (id) {
    editLocation(id, newLocation);
  }
};

export const calculateStatisticToLocations = async (
  bookPointsMap: Record<string, number>,
  locationsDocData: LocationDoc[]
) => {
  try {
    const operationsSnapshot = await getDocs(
      collection(db, "operations") as CollectionReference<OperationDoc>
    );

    const countsByCity = {} as Record<string, LocationsStatisticType>;
    operationsSnapshot.forEach((doc) => {
      const operation = doc.data();

      if (operation.locationId) {
        const statistic = calculateOperationStatistic(
          getBookCountsMap(operation.books),
          bookPointsMap,
          operation.isOnline
        );

        countsByCity[operation.locationId] = statistic;
      }
    });

    const promises = Object.keys(countsByCity).map(async (locationId) => {
      const currentLocationWithId = locationsDocData.find(
        (location) => location.id === locationId
      );

      if (currentLocationWithId) {
        const { id: _omitKey, ...newLocation } = currentLocationWithId;

        const statistic = {
          ...(newLocation.statistic || {}),
          [CHANGED_YEAR]: countsByCity[locationId],
        };

        return editLocation(locationId, { ...newLocation, statistic });
      }

      return Promise.resolve();
    });

    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
};

export const useLocations = ({ searchString = "" }: UseLocationsParams) => {
  const [locationsDocData, locationsDocLoading] =
    useCollectionData<LocationDoc>(
      searchString
        ? query(
            locationsRef,
            where("name", ">=", searchString),
            where("name", "<=", searchString + "\uf8ff")
          )
        : locationsRef
    );

  return {
    locations: locationsDocData || [],
    loading: locationsDocLoading,
  };
};
