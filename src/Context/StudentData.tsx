import axios from "axios";
import _ from "lodash";
import { createContext, FunctionComponent, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import useSetState from "react-use/lib/useSetState";
import { useRememberState } from "use-remember-state";

import { AuthContext } from "@Context/Auth";
import Track, { setTrackingData, useTrackingData } from "@Context/Tracking";

const getProgram = (programId: string, year: string) => {
  let URL = `/api/dashboard/programs/get_program?id=${programId}&year=${year}`;
  return axios.get(URL);
};

const getStudentacademics = (studentId: string, programId: string) => {
  let URL = `/api/dashboard/students/get_student?id=${studentId}&program=${programId}`;
  return axios.get(URL);
};

const getDate = (date: any) => {
  if (!date) return "mm/dd/yyyy";
  date = new Date(date);
  return date.toDateString();
};

export interface StudentDataInterface {
  programStructure: any;
  studentAcademic: any;
  PGA: any[] | null;
  PSP: any[] | null;
  ProgramPGA: any[] | null;
  plan: any;
  prediction_data: {
    prob_dropout?: number;
    model_accuracy?: number;
    weight_per_semester?: string;
    active?: boolean;
  };
  lastDate: string;
  programDataSelected: {
    programa: string;
    programaId: any;
  };
  searchStudent: Function;
  handlePressHelpButton: Function;
  handleLogout: Function;
  handleChangeCombo: Function;
}

export const StudentDataContext = createContext<StudentDataInterface>({
  programStructure: null,
  studentAcademic: null,
  PGA: [],
  PSP: [],
  ProgramPGA: [],
  plan: null,
  prediction_data: {},
  lastDate: "mm/dd/yyyy",
  programDataSelected: {
    programa: "El usuario no tiene asignado un programa",
    programaId: -1,
  },
  searchStudent: () => {},
  handlePressHelpButton: () => {},
  handleLogout: () => {},
  handleChangeCombo: () => {},
});
export const withStudentDataContext = (Component: any) => {
  return (props: any) => {
    return (
      <StudentDataContext.Consumer>
        {context => {
          return <Component {...props} context={context} />;
        }}
      </StudentDataContext.Consumer>
    );
  };
};

const StudentData: FunctionComponent = ({ children }) => {
  const { programs, name, type } = useContext(AuthContext);

  const [state, setState] = useSetState<StudentDataInterface>({
    programStructure: null,
    studentAcademic: null,
    PGA: [],
    PSP: [],
    ProgramPGA: [],
    plan: null,
    prediction_data: {},
    lastDate: "mm/dd/yyyy",
    programDataSelected: {
      programa: "",
      programaId: -1,
    },
    searchStudent: () => {},
    handlePressHelpButton: () => {},
    handleLogout: () => {},
    handleChangeCombo: () => {},
  });

  useTrackingData(
    "showingProgress",
    !!(state.studentAcademic && state.programStructure)
  );

  const [programDataSelected, setProgramDataSelected] = useRememberState(
    "TracDashboardProgramSelected",
    {
      programa:
        programs.length !== 0
          ? programs[0].name
          : "El usuario no tiene asignado un programa",
      programaId: (programs.length !== 0 ? programs[0].program : -1) as any,
    }
  );

  useTrackingData("program", programDataSelected.programaId);

  useTrackingData("curriculum", _.get(state.studentAcademic, "plan", null));

  useEffect(() => {
    Track("loadPage", "null", "homePage");
  }, []);

  const searchStudent = async (studentId: any) => {
    try {
      setState({
        programStructure: null,
        studentAcademic: null,
        PSP: null,
        PGA: null,
      });
      let response = await getStudentacademics(
        studentId,
        programDataSelected.programaId
      );
      let studentAcademic = response.data;
      let plan = studentAcademic.planYear;
      let PSP = studentAcademic.terms.map(function(d: any, _i: any) {
        return d.termAvg;
      });
      let PGA = studentAcademic.terms.map(function(d: any, _i: any) {
        return d.accAvg;
      });
      let ProgramPGA = studentAcademic.terms.map(function(d: any, _i: any) {
        return d.programAccAvg;
      });

      let prediction_data = {
        ...studentAcademic.student_dropout,
      };
      setState({
        studentAcademic: studentAcademic,
        PSP,
        PGA,
        ProgramPGA,
        prediction_data,
        plan,
      });

      response = await getProgram(programDataSelected.programaId, plan);

      let programStructure = response.data;
      let date = getDate(programStructure.lastDataUpdate);
      setState({
        programStructure: programStructure,
        lastDate: date,
      });

      if (type === "director") {
        toast.success(`Estudiante ${studentId}`);
      } else {
        toast.success(`Bienvenido ${name}`);
      }

      setTrackingData("showingProgress", true);

      Track("click", "load-student", "searchButton");
      return true;
    } catch (error) {
      console.error("error180: ", error);
      toast.error(
        _.get(
          error,
          "response.data.errors[0].detail",
          "Existe un problema con su cuenta..."
        )
      );

      setState({
        programStructure: null,
        studentAcademic: null,
        PSP: null,
        PGA: null,
        ProgramPGA: null,
        prediction_data: {},
        plan: null,
      });

      Track("click", "load-student", "searchButton");
      return false;
    }
  };

  const handlePressHelpButton = (eventName: string) => {
    Track("click", eventName, "helpButton");
  };

  const handleLogout = (event: any) => {
    event.preventDefault();

    Track("click", "logout", "logoutButton", () => {
      window.location.href = "/logout";
    });
  };

  const handleChangeCombo = (event: any) => {
    setProgramDataSelected({
      programa: event.label,
      programaId: event.value,
    });
  };

  return (
    <StudentDataContext.Provider
      value={{
        ...state,
        programDataSelected,
        searchStudent,
        handlePressHelpButton,
        handleLogout,
        handleChangeCombo,
      }}
    >
      {children}
    </StudentDataContext.Provider>
  );
};

export default StudentData;
