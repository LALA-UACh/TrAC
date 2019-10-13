import dotenv from "dotenv";
import express from "express";

import common from "@Middleware/common";

if (process.env.NODE_ENV !== "production") dotenv.config();

const serverApp = () => {
  const serverApp = express();

  serverApp.use(common);

  return serverApp;
};

export default serverApp;
