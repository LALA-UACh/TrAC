import stringify from "json-stringify-safe";
import serverApp from "@Server/app";
import { requireAdmin } from "@Middleware/auth";
import { Users } from "@Models/auth";
import validation from "@Services/validation";

const app = serverApp();

app.post(
  "*",
  requireAdmin,
  validation({
    data: {
      isArray: true,
    },
    "data.*.email": {
      isEmail: true,
      errorMessage: "Debe ser un email válido",
    },
    "data.*.name": {
      isString: true,
      optional: true,
    },
    "data.*.locked": {
      isBoolean: true,
      toBoolean: true,
      optional: true,
    },
    "data.*.tries": {
      isInt: true,
      toInt: true,
      optional: true,
    },
    "data.*.admin": {
      isBoolean: true,
      toBoolean: true,
      optional: true,
    },
    "data.*.type": {
      optional: true,
      errorMessage: "Debe ser 'student' o 'director'",
      custom: {
        options: v => v === "student" || v === "director",
      },
    },
    "data.*.id": {
      optional: true,
    },
    "data.*.show_dropout": {
      optional: true,
      isBoolean: true,
      toBoolean: true,
    },
  }),
  async (req, res) => {
    try {
      const { data } = req.body;
      for (const user of data) {
        await Users.upsert(user);
      }

      console.log(
        `Usuarios ${stringify(data)} upsertados por ${req.user.email}`
      );

      const users = await Users.findAll({
        raw: true,
        attributes: [
          "email",
          "name",
          "locked",
          "tries",
          "admin",
          "type",
          "id",
          "show_dropout",
        ],
      });

      return res.send(users);
    } catch (err) {
      console.error(err);
      res.status(210).send(err.message);
    }
  }
);

export default app;
