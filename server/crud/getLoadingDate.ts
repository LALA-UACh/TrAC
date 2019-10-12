import { Parameter } from "@Models/api";

export default async () => {
  const loadingDate = await Parameter.findAll({
    order: [["loading_date", "DESC"]],
  });

  return loadingDate.length === 0 ? null : loadingDate[0].loading_date;
};
