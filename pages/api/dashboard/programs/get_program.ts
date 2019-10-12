import { RequestHandler } from "express";
import { check, validationResult } from "express-validator";
import _ from "lodash";

import getLoadingDate from "@CRUD/getLoadingDate";
import getProgram, { ProgramsMixin } from "@CRUD/getProgram";
import getProgramStudent from "@CRUD/getProgramStudent";
import getProgramTerms, { ProgramTermsMixin } from "@CRUD/getProgramTerms";
import { requireAuth } from "@Middleware/auth";
import serverApp from "@Server/app";

const app = serverApp();

const requireProgramGetProgram: RequestHandler = async (req, res, next) => {
  if (_.get(req, "user.type") === "student") {
    const program = await getProgramStudent(_.get(req, "user.id"));
    if (program) {
      req.query.id = program.program_id;
      req.query.year = program.year;
      return next();
    }
  } else if (
    _.includes(
      _.map(_.get(req, "user.programs"), "program"),
      _.get(req, "query.id")
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

const createResponseProgram = (
  program: ProgramsMixin,
  terms: ProgramTermsMixin[],
  loadingDate: Date | null
) => {
  const returnValue = {
    lastDataUpdate: loadingDate,
    id: program.program.id,
    name: program.program.name,
    desc: program.program.desc,
    plan: program.id,
    year: program.year,
    tags: program.tags ? program.tags.split(",") : [],
    terms: undefined as any,
  };
  if (terms.length !== 0) {
    const returnTerms = terms.map((term: ProgramTermsMixin) => {
      return {
        position: term.position,
        name: term.name,
        tags: term.tags ? term.tags.split(",") : [],
        courses: term.program_courses.map(programCourse => {
          return {
            code: programCourse.course.code,
            name: programCourse.course.name,
            area: programCourse.area,
            tags: programCourse.course.tags
              ? programCourse.course.tags.split(",")
              : [],
            requisites: programCourse.requisites
              ? programCourse.requisites.replace(/\s/g, "").split(",")
              : [],
            credits: programCourse.course.credits,
            historicGroup: programCourse.course.statistic,
          };
        }),
      };
    });

    terms = returnTerms as any;
  }
  returnValue.terms = terms;

  return returnValue;
};

const errorFormatter = ({ location, msg, param }: any) => {
  return { type: msg.type, msg: `${location}[${param}]: ${msg.msg}` };
};

app.use(
  requireAuth,
  requireProgramGetProgram,
  check("id", {
    type: errorsTypes.INVALID_PARAMETER,
    msg: "Must be an Integer",
  }).isInt(),

  check("year", {
    type: errorsTypes.MISSING_PARAMETER,
    msg: "Must be provided",
  }).exists(),

  check("year", {
    type: errorsTypes.INVALID_PARAMETER,
    msg: "Must be an Integer",
  }).isInt(),
  (req, res, _next) => {
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
          const data = await getProgram(req.query.id, req.query.year);

          // If the data is not found
          if (!data)
            res.status(400).json({
              errors: [
                {
                  status: 404,
                  error: "ProgramNotFound",
                  detail: "El programa no pudo ser encontrado.",
                },
              ],
            });
          else {
            // Get the terms along with the courses

            const terms = await getProgramTerms(data.id);

            const loadingDate = await getLoadingDate();

            res.json(createResponseProgram(data, terms, loadingDate));
          }
        } catch (e) {
          console.log(e);
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
