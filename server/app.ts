import dotenv from "dotenv";
import app from "express";

import common from "@Middleware/common";

if (process.env.NODE_ENV !== "production") dotenv.config();

const serverApp = () => {
  const serverApp = app();

  serverApp.use(common);

  return serverApp;
};

export default serverApp;
