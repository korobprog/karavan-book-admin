import { Tag } from "antd";
import React from "react";
import { StatisticType } from "../../firebase/statistic";
import { LocationDoc } from "../../firebase/useLocations";

type StatisticViewType = "count" | "points" | "all";

const getStatText = (view: StatisticViewType, statistic?: StatisticType) => {
  let result = "";
  if (view === "count" || view === "all") {
    result = `${statistic?.count || 0} шт.`;
  }
  if (view === "all") {
    result += ", ";
  }
  if (view === "points" || view === "all") {
    result += `баллы: ${statistic?.points || 0}`;
  }

  return result;
};

type LocationStatisticProps = {
  statistic: LocationDoc["statistic"];
  view?: StatisticViewType;
};

export const LocationStatistic: React.FC<LocationStatisticProps> = (props) => {
  const { statistic, view = "all" } = props;
  const { online, primary, other, total } = statistic?.[2022] || {};

  return (
    <>
      {Boolean(total) && (
        <Tag color="magenta">{"Всего " + getStatText(view, total)}</Tag>
      )}
      {Boolean(primary) && (
        <Tag color="gold">{"ШП " + getStatText(view, primary)}</Tag>
      )}
      {Boolean(other) && (
        <Tag color="lime">{"Других " + getStatText(view, other)}</Tag>
      )}
      {Boolean(online) && (
        <Tag color="geekblue">{"Онлайн " + getStatText(view, online)}</Tag>
      )}
    </>
  );
};
