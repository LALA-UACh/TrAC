import { Router } from "express";
import { checkSchema, Location, Schema, validationResult } from "express-validator";
import _ from "lodash";

export const validation = (
  schema: Schema,
  location: Location | Location[] = "body"
) => {
  const router = Router();
  if (location) {
    _.forEach(schema, (_v, key) => {
      _.set(schema, [key, "in"], location);
    });
  }
  router.use(checkSchema(schema));

  router.use((req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const e = _.join(
      _.map(errors.array(), v => JSON.stringify(v, null, 2)),
      "\n-\n"
    );
    console.error(e);
    res.status(210).send(`| ${e} |`);
  });

  return router;
};
export default validation;
