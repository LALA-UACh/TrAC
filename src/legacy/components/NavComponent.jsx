import { Component, useState, useContext, useEffect } from "react";
import moment from "moment-timezone";
import Select from "react-select";
import _ from "lodash";
import { Icon, Button } from "semantic-ui-react";
//ReactGA.initialize('UA-133535891-1'); // Here we should use our GA id
import "./css/Nav.css";
import Tippy from "@tippy.js/react";
import { useRememberState } from "use-remember-state";
import StudentData, {
  withStudentDataContext,
  StudentDataContext,
} from "@Context/StudentData";
import { AuthContext } from "@Context/Auth";
import Loader from "@Components/Loader";
import { setTrackingData } from "@Context/Tracking";

const NavComponent = () => {
  const [textInput, setTextInput] = useRememberState("TracNavTextInput", "");
  const [showingStudent, setShowingStudent] = useState("");
  const [showOnInitHelp, setShowOnInitHelp] = useRememberState(
    "TracShowOnInitHelp",
    true
  );
  const [searchOptions, setSearchOptions] = useRememberState(
    "TracSearchOptions",
    []
  );
  const [searching, setSearching] = useState(false);
  const {
    lastDate,
    plan,
    programDataSelected: { programa, programaId },
    searchStudent,
    handlePressHelpButton,
    handleLogout,
    handleChangeCombo,
    studentAcademic,
  } = useContext(StudentDataContext);
  const { programs: allprograms, type, id } = useContext(AuthContext);

  useEffect(() => {
    if (type === "student") {
      setSearching(true);
      searchStudent("").then(() => {
        setSearching(false);
      });
    }
  }, [type]);

  const handleChange = ({ target: { value } }) => {
    setTextInput(value);
  };
  const handleSubmit = event => {
    event.preventDefault();
    setSearching(true);
    setTrackingData("student", textInput);
    searchStudent(textInput).then(ok => {
      setSearching(false);
      if (ok) {
        setShowingStudent(textInput);
        setSearchOptions(_.uniq(_.concat(searchOptions, textInput)));
        setTextInput("");
      } else {
        setShowingStudent("");
      }
    });
  };

  const renderSearchButton = () => {
    if (!searching) {
      return (
        <button
          className="btn btn-secondary my-2 my-sm-1"
          type="submit"
          disabled={textInput === ""}
        >
          Buscar
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-secondary my-2 my-sm-1"
          type="submit"
          disabled
        >
          <span
            className="spinner-border spinner-border-sm mr-3"
            role="status"
            aria-hidden="true"
          />
          Buscando...
        </button>
      );
    }
  };

  const renderInfo = () => {
    // For just one Program
    if (type === "student") {
      if (studentAcademic) {
        return (
          <span className="navbar-text mr-sm-3 text-white">
            {`${_.get(studentAcademic, "program", "ERROR")} | Plan ${_.get(
              studentAcademic,
              "planYear",
              "ERROR"
            )} | ${id}`}
          </span>
        );
      }
      return <Icon name="sync" loading inverted />;
    } else if (allprograms.length <= 1) {
      if (plan) {
        return (
          <span className="navbar-text mr-sm-3 text-white">
            {programa} | Plan: {plan}{" "}
            {showingStudent ? `| estudiante: ${showingStudent}` : ""}
          </span>
        );
      } else {
        return (
          <span className="navbar-text mr-sm-3 text-white">
            {programa} {showingStudent ? `| estudiante: ${showingStudent}` : ""}
          </span>
        );
      }
    } else {
      let programs = allprograms.map(element => {
        return { value: element.program, label: element.name };
      });
      let selectedOption = {
        value: programaId,
        label: programa,
      };
      if (plan) {
        return (
          <span className="mr-sm-3 inherit-display">
            <Select
              className="comboPrograms"
              value={selectedOption}
              onChange={handleChangeCombo}
              options={programs}
            />
            <span className="navbar-text ml-sm-3 text-white">
              | Plan: {plan}{" "}
              {showingStudent ? `| estudiante: ${showingStudent}` : ""}
            </span>
          </span>
        );
      } else {
        return (
          <span className="mr-sm-3 inherit-display">
            <Select
              className="comboPrograms"
              value={selectedOption}
              onChange={handleChangeCombo}
              options={programs}
            />
            <span className="navbar-text ml-sm-3 text-white">
              {showingStudent ? `| estudiante: ${showingStudent}` : ""}
            </span>
          </span>
        );
      }
    }
  };

  return (
    <>
      <Loader active={searching} />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        {renderInfo()}

        {type === "director" && (
          <form className="form-inline" onSubmit={handleSubmit}>
            <input
              className="form-control mr-sm-3"
              type="search"
              placeholder="ID del estudiante"
              aria-label="Search"
              list="searchOptions"
              value={textInput}
              onChange={handleChange}
            />
            <datalist id="searchOptions">
              {searchOptions.map((value, key) => (
                <option key={key} value={value} />
              ))}
            </datalist>
            {renderSearchButton()}
          </form>
        )}

        <ul className="navbar-nav mr-auto" />

        <Tippy
          size="large"
          theme="light"
          interactive
          trigger="mouseenter focus click"
          arrow
          showOnInit={showOnInitHelp}
          onHide={() => {
            if (showOnInitHelp) setShowOnInitHelp(false);
          }}
          hideOnClick={false}
          maxWidth={900}
          content={<img className="helpImage" src="/static/img/feedback.png" />}
        >
          <div className="unselectable" className="infoButton">
            <Icon name="help circle" size="large" fitted inverted />
          </div>
        </Tippy>
        <span className="navbar-text mr-3 text-white">
          {(() => {
            if (lastDate !== "mm/dd/yyyy") {
              return `Última actualización de datos: ${moment
                .tz(new Date(lastDate), "America/Santiago")
                .format("DD-MM-YYYY")}`;
            }
          })()}
        </span>

        <Button
          negative
          size="big"
          style={{
            position: "relative",
            right: 0,
          }}
          onClick={handleLogout}
        >
          Salir
        </Button>
      </nav>
    </>
  );
};

export default withStudentDataContext(NavComponent);
