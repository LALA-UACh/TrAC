import stringify from "json-stringify-safe";
import serverApp from "@Server/app";
import { requireAdmin } from "@Middleware/auth";
import { UserProgram } from "@Models/auth";
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
    "data.*.program": {
      isString: true,
    },
  }),
  async (req, res) => {
    try {
      const { data } = req.body;

      await UserProgram.bulkCreate(data);

      console.log(
        `Programas ${stringify(data)} insertados por ${req.user.email}`
      );
      const usersPrograms = await UserProgram.findAll({
        raw: true,
        attributes: ["email", "program"],
      });

      return res.send(usersPrograms);
    } catch (err) {
      console.error(err);
      res.status(210).send(err.message);
    }
  }
);

export default app;
