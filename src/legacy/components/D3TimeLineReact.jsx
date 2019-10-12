import { Component, useContext, useState, useEffect, useMemo } from "react";
import d3Comp from "./js/d3TimeLine";
import "./css/TimeLine.css";
import Dropout from "@Components/Dashboard/Dropout";
import { Flex, Box } from "@rebass/grid";
import { StudentDataContext } from "@Context/StudentData";
import ScrollContainer from "react-indiana-drag-scroll";

const D3TimeLineReactComponent = () => {
  const { PGA, PSP, ProgramPGA, prediction_data } = useContext(
    StudentDataContext
  );
  const [nodeRef, setRef] = useState();
  useEffect(() => {
    if (nodeRef)
      d3Comp.createGraphic(nodeRef, PGA, PSP, ProgramPGA, prediction_data);
  }, [nodeRef]);

  return useMemo(
    () => (
      <ScrollContainer hideScrollbars={false} style={{ marginBottom: "1em" }}>
        <Flex>
          <div className="D3container" ref={setRef} />
          <Dropout />
        </Flex>
      </ScrollContainer>
    ),
    []
  );
};

export default D3TimeLineReactComponent;
