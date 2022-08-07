import { DistributedBook } from "../firebase/useOperations";

export const calculateOperationStatistic = (
  bookCountsMap: Record<number, number>,
  bookPointsMap: Record<string, number>,
  isOnline?: boolean
) => {
  const statistic = {
    totalPoints: 0,
    totalPrimaryCount: 0,
    totalOtherCount: 0,
    totalOnlineCount: 0,
    totalOnlinePoints: 0,
  };

  Object.entries(bookCountsMap).forEach(([id, count]) => {
    if (count) {
      statistic.totalPoints += bookPointsMap[id] * count;
      if (bookPointsMap[id] === 0) {
        statistic.totalOtherCount += count;
      } else {
        statistic.totalPrimaryCount += count;
      }
      if (isOnline) {
        statistic.totalOnlineCount += count;
        statistic.totalOnlinePoints += bookPointsMap[id] * count;
      }
    }
  });

  return statistic;
};

export const getBookCountsMap = (books?: DistributedBook[]): Record<string, number> => {
    return books?.reduce((acc, book) => {
      acc[book.bookId] = book.count ? Number(book.count) : 0;
      return acc;
    }, {} as Record<string, number>) || {};
  };
