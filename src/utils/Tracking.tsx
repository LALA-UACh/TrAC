import axios from "axios";
import _ from "lodash";
import moment from "moment-timezone";
import { useEffect } from "react";

const trackingTemplate = ({
  program,
  curriculum,
  student,
  showingProgress,
  showingPrediction,
  coursesOpen,
  action,
  effect,
  target,
}: {
  program: string;
  curriculum: string;
  student: string;
  showingProgress: boolean;
  showingPrediction: boolean;
  coursesOpen: string;
  action: string;
  effect: string;
  target: string;
}) => {
  return `program=${program},curriculum=${curriculum},student=${student},showing-progress=${
    showingProgress ? 1 : 0
  },showing-prediction=${
    showingPrediction ? 1 : 0
  },courses-open=${coursesOpen},action=${action},effect=${effect},target=${target}`;
};

const Track = async (
  action: string,
  effect: string,
  target: string,
  callback?: Function
) => {
  const datetime = `${moment(new Date())
    .tz("America/Santiago")
    .format("YYYY-MM-DD HH:mm:ss.SSS")}Z`;

  await axios.post(`/api/dashboard/tracking`, {
    app_id:
      getTrackingData("type", "director") === "student"
        ? "TrAC-student"
        : "TrAC",
    user_id: getTrackingData("user_id", "null"),
    datetime,
    data: trackingTemplate({
      action,
      effect,
      target,
      coursesOpen: getTrackingData("coursesOpen", "null"),
      showingPrediction: getTrackingData("showingPrediction", 0),
      showingProgress: getTrackingData("showingProgress", 0),
      student: getTrackingData("student", "null"),
      curriculum: getTrackingData("curriculum", "null"),
      program: getTrackingData("program", -1),
    }),
  });

  if (callback) callback();
};

declare global {
  interface Window {
    trackingData: {
      [name: string]: any;
    };
  }
}

export const getTrackingData = (name: string, defaultValue?: any) => {
  return _.get(window, ["trackingData", name]) || defaultValue;
};

export const setTrackingData = (
  name: string,
  data: string | boolean | number
) => {
  window.trackingData = _.assign(window.trackingData || {}, {
    [name]: data,
  });
};

export const useTrackingData = (
  name: string,
  data: string | boolean | number
) => {
  useEffect(() => {
    window.trackingData = _.assign(window.trackingData || {}, {
      [name]: data,
    });
  }, [data]);
};

export default Track;
