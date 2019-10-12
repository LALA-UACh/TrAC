declare module "connect-session-sequelize" {
import ExpressSession, { Store } from "express-session";
import { Sequelize } from "sequelize/types";

    class ConnectSequelize extends Store {
    constructor(params: {
      db: Sequelize;
      checkExpirationInterval?: number;
      expiration?: number;
    });
    sync: () => void;
    stopExpiringSessions: () => void;
  }
  export default (store: typeof Store) => ConnectSequelize;
}
