import axios from "axios";
import sha1 from "crypto-js/sha1";
import { Handler } from "express";
import _ from "lodash";

export const getAnonymousId = async (rut: string) => {
  const route = process.env.ANONYMOUS_ID_SERVICE;

  const processedRut = _.replace(
    _.head(_.split(rut, "-")) || "",
    /\s|\.|^0+/g,
    ""
  );

  if (route && processedRut) {
    try {
      const {
        data: { getAnonymousIdResult },
      } = await axios.post<{ getAnonymousIdResult: string }>(
        route,
        {
          Clave: sha1(processedRut).toString(),
        },
        {
          timeout: 1000,
        }
      );

      if (getAnonymousIdResult === "") {
        return null;
      }
      return getAnonymousIdResult;
    } catch (err) {
      if (!err.message.match(/timeout/g)) {
        console.error("Error con servidor de anonimizacion", err);
      }
      return null;
    }
  }

  return null;
};

export const requireAuth: Handler = (req, res, next) => {
  if (_.get(req, "user.email", false)) {
    next();
  } else {
    res.sendStatus(403);
  }
};

export const requireAdmin: Handler = (req, res, next) => {
  if (_.get(req, "user.admin", false)) {
    next();
  } else {
    res.sendStatus(403);
  }
};
