import stringify from "json-stringify-safe";
import { Users } from "@Models/auth";
import serverApp from "@Server/app";
import { requireAdmin } from "@Middleware/auth";
import validation from "@Services/validation";

const app = serverApp();

app.post(
  "*",
  requireAdmin,
  validation({
    "old.email": {
      isString: true,
    },
    email: {
      isEmail: true,
      errorMessage: "Debe ser un email válido",
    },
    name: {
      isString: true,
    },
    locked: {
      isBoolean: true,
    },
    tries: {
      isInt: true,
      toInt: true,
    },
    type: {
      custom: {
        options: value => value === "student" || value === "director",
      },
    },
    id: {
      isString: true,
    },
    show_dropout: {
      isBoolean: true,
      toBoolean: true,
    },
  }),
  async (req, res) => {
    try {
      const {
        old,
        email,
        name,
        locked,
        tries,
        type,
        id = "",
        show_dropout,
      } = req.body;
      await Users.update(
        { email, name, locked, tries, type, id, show_dropout },
        {
          where: {
            email: old.email,
          },
        }
      );

      console.log(
        `Usuario  ${stringify(req.body)} modificado por ${req.user.email}`
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
