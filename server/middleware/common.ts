import { Router } from "express";
import morgan from "morgan";

const common = Router();

common.use(
  morgan("combined", {
    skip: req => {
      if (req.url === "/api/dashboard/tracking") {
        return true;
      }
      return false;
    },
  })
);

export default common;
