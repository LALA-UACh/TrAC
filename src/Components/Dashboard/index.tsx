import "bootstrap/dist/css/bootstrap.min.css";

import { FC, useContext } from "react";

import StudentData, { StudentDataContext } from "@Context/StudentData";
import D3DashboardComponent from "@Legacy/components/D3DashboardReact.jsx";
import D3TimeLine from "@Legacy/components/D3TimeLineReact.jsx";
import Nav from "@Legacy/components/NavComponent.jsx";

const DashboardComponents = () => {
  const { programStructure, studentAcademic } = useContext(StudentDataContext);

  return (
    programStructure &&
    studentAcademic && (
      <div>
        <D3TimeLine />
        <D3DashboardComponent />
      </div>
    )
  );
};

const App: FC = () => {
  return (
    <StudentData>
      <Nav />

      <DashboardComponents />
    </StudentData>
  );
};

export default App;
