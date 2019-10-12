import { Loader } from "semantic-ui-react";

export default ({ active = false }) => {
  return (
    <>
      {active && (
        <div
          style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <Loader active />
        </div>
      )}
    </>
  );
};
