import _ from "lodash";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { Layer, Stage, Text } from "react-konva";
import { animated, Spring } from "react-spring/renderprops-konva.cjs";
import styled from "styled-components";

import { AuthContext } from "@Context/Auth";
import { StudentDataContext } from "@Context/StudentData";
import Track, { setTrackingData, useTrackingData } from "@Context/Tracking";

const Solapa: FunctionComponent<{
  x?: number;
  y?: number;
  fill?: string;
  width?: number;
  height?: number;
  solapaWidth?: number;
  cornerRadius?: number;
  draggable?: boolean;
  shadowBlur?: number;
  opacity?: number;
  onMouseEnter?: Function;
  onMouseLeave?: Function;
}> = ({
  x = 0,
  y = 0,
  fill = "black",
  width = 100,
  height = 200,
  solapaWidth = 30,
  cornerRadius = 20,
  draggable = false,
  shadowBlur,
  opacity = 1,
  onMouseEnter,
  onMouseLeave,
}) => {
  useEffect(() => {});
  return (
    <animated.Group draggable={draggable} opacity={opacity}>
      <animated.Rect
        x={x + width - solapaWidth - cornerRadius}
        y={y}
        width={solapaWidth}
        height={height}
        cornerRadius={cornerRadius}
        fill={fill}
        shadowBlur={shadowBlur}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      ></animated.Rect>

      <animated.Rect
        x={x}
        y={y}
        width={width - solapaWidth}
        height={height}
        fill={fill}
        shadowBlur={shadowBlur}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      ></animated.Rect>
    </animated.Group>
  );
};

const DropoutContainer = styled.div`
  position: relative;
  width: 500px;
  top: 0em;
`;

const height = 245;
const openWidth = 565;
const shadowBlur = 5;

const Dropout: FunctionComponent = () => {
  const {
    prediction_data: {
      prob_dropout,
      model_accuracy,
      weight_per_semester,
      active,
    },
  } = useContext(StudentDataContext);
  const { show_dropout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useTrackingData(
    "showingPrediction",
    !!(
      show_dropout &&
      active &&
      prob_dropout &&
      model_accuracy &&
      weight_per_semester
    )
  );

  if (
    !(
      show_dropout &&
      active &&
      _.isNumber(prob_dropout) &&
      _.isNumber(model_accuracy) &&
      weight_per_semester
    )
  ) {
    return null;
  }

  return (
    <DropoutContainer>
      <Stage width={600} height={280} x={1} y={5}>
        <Spring
          native
          from={{
            width: open ? openWidth : 0,
            antiWidth: open ? openWidth + shadowBlur : 0,
            opacity: open ? 1 : 0,
            color: open ? "rgb(252, 249, 165)" : "rgb(255, 255, 255)",
            shadowBlur: open ? 4 : -2,
          }}
          to={{
            width: open ? openWidth : 0,
            opacity: open ? 1 : 0,
            antiWidth: open ? openWidth + shadowBlur : 0,
            color: open ? "rgb(252, 249, 165)" : "rgb(255, 255, 255)",
            shadowBlur: open ? 4 : -2,
          }}
        >
          {({ width, antiWidth, opacity, color, shadowBlur }) => (
            <Layer x={55}>
              <animated.Rect
                // opacity={opacity}
                x={-55}
                fill={color}
                // fill="#FCF9A5"
                height={height}
                cornerRadius={20}
                fontFamily="calibri"
                width={width}
                shadowBlur={shadowBlur}
              ></animated.Rect>
              <animated.Text
                opacity={opacity}
                text={`El sistema estima una probabilidad de abandono de`}
                lineHeight={1.2}
                fontSize={20}
                fontFamily="calibri"
                width={240}
                x={65}
                y={40}
              ></animated.Text>
              <animated.Text
                opacity={opacity}
                fontFamily="calibri"
                text={`(acierto del modelo: ${model_accuracy})`}
                width={openWidth}
                fontSize={20}
                x={65}
                y={90}
              ></animated.Text>
              <animated.Text
                opacity={opacity}
                text={`${prob_dropout}%`}
                width={openWidth}
                fontSize={40}
                fontFamily="calibri"
                // fontStyle="bold"
                x={330}
                y={42}
              ></animated.Text>
              {false && (
                <animated.Text
                  opacity={opacity}
                  fontSize={20}
                  fontFamily="calibri"
                  text={`Los semestres mas críticos para la estimación de esta probabilidad tienen bordes mas oscuros en la gráfica`}
                  width={350}
                  x={140}
                  y={160}
                ></animated.Text>
              )}

              <animated.Rect
                fill="white"
                height={height}
                width={500}
                x={antiWidth}
              ></animated.Rect>
            </Layer>
          )}
        </Spring>

        <Layer
          onTouchStart={() => {
            setOpen(!open);
            setTrackingData("showingPrediction", !open);
            if (open) {
              Track("click", "close-dropout", "dropout");
            } else {
              Track("click", "open-dropout", "dropout");
            }
          }}
          onClick={() => {
            setOpen(!open);
            setTrackingData("showingPrediction", !open);
            if (open) {
              Track("click", "close-dropout", "dropout");
            } else {
              Track("click", "open-dropout", "dropout");
            }
          }}
          onMouseEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          onMouseLeave={() => {
            document.body.style.cursor = "default";
          }}
        >
          <Spring
            native
            from={{
              opacity: open ? 0 : 1,
              antiOpacity: open ? 0 : 1,
            }}
            to={{
              opacity: open ? 0 : 1,
              antiOpacity: open ? 0 : 1,
            }}
          >
            {({ opacity }) => (
              <animated.Group
                onMouseEnter={() => {
                  document.body.style.cursor = "pointer";
                }}
                onMouseLeave={() => {
                  document.body.style.cursor = "default";
                }}
              >
                <Solapa
                  opacity={opacity}
                  x={8}
                  y={8}
                  height={height - 10}
                  width={85}
                  fill="#a3a3a3"
                ></Solapa>

                <Solapa
                  x={7}
                  y={5}
                  height={height - 10}
                  width={85}
                  fill="#FCF9A5"
                />
              </animated.Group>
            )}
          </Spring>

          <Text
            fontSize={20}
            text="Predicción de abandono"
            width={height}
            fontFamily="calibri"
            fill="black"
            align="center"
            fontStyle="bold"
            rotation={-90}
            padding={54}
            x={-38}
            y={height}
          ></Text>
        </Layer>
      </Stage>
    </DropoutContainer>
  );
};

export default Dropout;
