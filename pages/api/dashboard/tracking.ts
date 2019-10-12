import express from "express";
import moment from "moment-timezone";

import { requireAuth } from "@Middleware/auth";
import { Tracking } from "@Models/dashboard";
import { getAnonymousId } from "@ServerUtils";
import validation from "@Services/validation";

const app = express();

app.post(
  "*",
  requireAuth,
  validation({
    app_id: {
      isString: true,
    },
    user_id: {
      isString: true,
    },
    data: {
      isString: true,
    },
    datetime: {
      isString: true,
    },
  }),
  async (req, res) => {
    let {
      app_id,
      user_id,
      data,
      datetime: datetime_client,
    }: {
      app_id: string;
      user_id: string;
      data: string;
      datetime: string;
    } = req.body;

    await (async () => {
      const pattern = /(.*student=)(?<rut>.*)(,showing-progress=.*)/;
      const match = data.match(pattern);
      if (match && match.groups && match.groups.rut) {
        const anonymoudId = await getAnonymousId(match.groups.rut);
        if (anonymoudId) {
          data = data.replace(pattern, (_fullMatch, p1, _rut, p3) => {
            return [p1, anonymoudId, p3].join("");
          });
        }
      }
    })();

    await Tracking.create({
      app_id,
      user_id,
      datetime: `${moment()
        .tz("America/Santiago")
        .format("YYYY-MM-DD HH:mm:ss.SSS")}Z`,
      datetime_client,
      data,
    });

    res.sendStatus(200);
  }
);

export default app;
