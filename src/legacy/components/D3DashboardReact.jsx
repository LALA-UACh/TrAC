import {
  Component,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import d3Comp from "./js/d3Dashboard";
import ScrollContainer from "react-indiana-drag-scroll";
import "./css/Dashboard.css";
import { StudentDataContext } from "@Context/StudentData";

const D3DashboardReactComponent = () => {
  const { programStructure, studentAcademic, prediction_data } = useContext(
    StudentDataContext
  );
  const [nodeRef, setRef] = useState();

  useEffect(() => {
    if (nodeRef)
      d3Comp.createGraphic(
        nodeRef,
        programStructure,
        studentAcademic,
        prediction_data
      );
  }, [nodeRef]);

  return useMemo(
    () => (
      <ScrollContainer hideScrollbars={false}>
        <div ref={setRef} />
      </ScrollContainer>
    ),
    []
  );
};

export default D3DashboardReactComponent;
