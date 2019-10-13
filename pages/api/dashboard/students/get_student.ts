import * as d3 from "d3";
import { RequestHandler } from "express";
import { check, sanitize, validationResult } from "express-validator";
import _ from "lodash";

import serverApp from "@AppServer";
import getHistoryAcademicStudentByCurriculum, {
    HistoryAcademicMixin
} from "@CRUD/getHistoryAcademicStudentByCurriculum";
import getLoadingDate from "@CRUD/getLoadingDate";
import getProgramStudent from "@CRUD/getProgramStudent";
import getStudentsAcademics, { StudentMixin } from "@CRUD/getStudentsAcademics";
import { requireAuth } from "@Middleware/auth";
import { StudentCurriculum } from "@Models/api";
import { getAnonymousId } from "@ServerUtils";

const app = serverApp();

const requireProgramGetStudent: RequestHandler = async (req, res, next) => {
  if (_.get(req, "user.type") === "student") {
    const program = await getProgramStudent(_.get(req, "user.id"));
    if (program) {
      req.query.id = program.student_id;
      req.query.program = program.program_id;
      req.query.anon = true;
      return next();
    }
  } else if (
    _.includes(
      _.map(_.get(req, "user.programs"), "program"),
      _.get(req, "query.program")
    )
  ) {
    return next();
  }
  res.sendStatus(403);
};

const errorsTypes = {
  INVALID_PARAMETER: "InvalidParameter",
  MISSING_PARAMETER: "MissingParameter",
};

const errorFormatter = ({ location, msg, param }: any) => {
  return { type: msg.type, msg: `${location}[${param}]: ${msg.msg}` };
};

const createStudentAcademicResponse = (
  { student_dropout, ...student }: StudentMixin,
  historyAcademics: HistoryAcademicMixin[],
  loadingDate: Date | null
) => {
  const returnValue = {
    lastDataUpdate: loadingDate,
    id: student.id,
    program:
      student.student_curriculums.length !== 0
        ? student.student_curriculums[0].curriculum.program.name
        : null,
    cohortYear:
      student.student_curriculums.length !== 0
        ? student.student_curriculums[0].year
        : null,
    plan:
      student.student_curriculums.length !== 0
        ? student.student_curriculums[0].curriculum.id
        : null,
    planYear:
      student.student_curriculums.length !== 0
        ? student.student_curriculums[0].curriculum.year
        : null,
    previousPlans:
      student.student_curriculums && student.student_curriculums.length === 0
        ? []
        : // Because the array is sort, just return the previous Curricuums
          student.student_curriculums
            .slice(1) // [2016,2015,2014] => [2015,2014]
            // Just return the id and the year the previous Curriculums
            .map(studentPlan => {
              return {
                id: studentPlan.curriculum.id,
                year: studentPlan.curriculum.year,
              };
            }),
    student_dropout: {
      ...(student_dropout && {
        model_accuracy: student_dropout.model_accuracy,
        prob_dropout: student_dropout.prob_dropout,
        weight_per_semester: student_dropout.weight_per_semester,
        active: student_dropout.active,
      }),
    },
    terms: undefined as any,
  };

  // Process to nest the history academic data in terms
  let termsParsed: any[] = [];
  let nestedTerms: any = d3
    .nest()
    .key(function(d: any) {
      return d.year;
    })
    .key(function(d: any) {
      return d.semester;
    })
    .entries(historyAcademics as any);

  Object.keys(nestedTerms).forEach(function(k) {
    let entries = nestedTerms[k].values;
    Object.keys(entries).forEach(function(k) {
      termsParsed.push(entries[k].values);
    });
  });

  let terms = termsParsed.map(function(history_academic_courses) {
    return {
      year: history_academic_courses[0].year,
      semester: history_academic_courses[0].semester,
      termAvg: history_academic_courses[0].statistic_student_term
        ? history_academic_courses[0].statistic_student_term.termAvg
        : null,
      accAvg: history_academic_courses[0].statistic_student_term
        ? history_academic_courses[0].statistic_student_term.accAvg
        : null,
      programAccAvg: history_academic_courses[0].statistic_student_term
        ? history_academic_courses[0].statistic_student_term.programAccAvg
        : null,
      situation: history_academic_courses[0].statistic_student_term
        ? history_academic_courses[0].statistic_student_term.situation
        : null,
      coursesTaken: history_academic_courses.map(
        (history_academic_course: any) => {
          return {
            code: history_academic_course.course.code,
            name: history_academic_course.course.name,
            grade: history_academic_course.grade,
            registration: history_academic_course.registration,
            state: history_academic_course.state,
            classGroup:
              history_academic_course.course.statisticTerms.length !== 0
                ? history_academic_course.course.statisticTerms[0]
                : null,
            historicGroup: history_academic_course.course.statistic,
          };
        }
      ),
    };
  });

  returnValue.terms = terms;

  return returnValue;
};

app.use(
  requireAuth,
  requireProgramGetStudent,
  sanitize("id")
    .trim()
    .escape(),

  check("program", {
    type: errorsTypes.MISSING_PARAMETER,
    msg: "Must be provided",
  }).exists(),

  check("program", {
    type: errorsTypes.INVALID_PARAMETER,
    msg: "Must be an Integer",
  }).isInt(),
  async (req, res, _next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array().map(function(error) {
          return { status: 422, error: error.type, detail: error.msg };
        }),
      });
    } else {
      const processRequest = async () => {
        try {
          let student: string = req.query.id;
          let program: number = req.query.program;

          if (process.env.NODE_ENV !== "production") {
            if (student.toLowerCase() === "random") {
              const allStudents: {
                student_id: string;
                curriculum_id: number;
              }[] = await StudentCurriculum.findAll({
                attributes: ["student_id", "curriculum_id"],
              });
              const sampleStudent = _.sample(
                _.filter(
                  allStudents,
                  ({ curriculum_id }) =>
                    _.toString(curriculum_id).slice(0, 4) ===
                    _.toString(program)
                )
              );
              if (sampleStudent) {
                const { student_id, curriculum_id } = sampleStudent;
                student = student_id;
                program = _.toInteger(_.toString(curriculum_id).slice(0, 4));
                console.log("randomStudent:", { student_id, curriculum_id });
              }
            }
          } else {
            const anonimizado = await getAnonymousId(student);

            if (anonimizado) {
              student = anonimizado;
            }
          }

          // Get the curriculum and the program object

          const data = await getStudentsAcademics(student, program);

          // If the data is not found
          if (!data)
            res.status(400).json({
              errors: [
                {
                  status: 404,
                  error: "StudentNotFound",
                  detail: "Estudiante no encontrado.",
                },
              ],
            });
          else if (data.student_curriculums.length === 0)
            res.status(400).json({
              errors: [
                {
                  status: 404,
                  error: "StudentNotAssociated",
                  detail: "El estudiante no esta asociado a su programa.",
                },
              ],
            });
          else {
            const curriculum_id =
              data.student_curriculums.length !== 0
                ? data.student_curriculums[0].curriculum.id
                : -1;
            const cohortYear =
              data.student_curriculums.length !== 0
                ? data.student_curriculums[0].year
                : -1;

            const historyAcademics =
              curriculum_id !== -1 && cohortYear !== -1
                ? await getHistoryAcademicStudentByCurriculum(
                    curriculum_id,
                    student,
                    cohortYear
                  )
                : [];

            const loadingDate = await getLoadingDate();

            const dataResponse = createStudentAcademicResponse(
              data,
              historyAcademics,
              loadingDate
            );

            res.json(dataResponse);
          }
        } catch (e) {
          console.error(e);
          res.status(500).json({
            errors: [{ status: 500, error: "InternalServerError" }],
          });
        }
      };
      processRequest();
    }
  }
);

export default app;
