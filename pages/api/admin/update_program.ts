import serverApp from "@AppServer";
import { requireAdmin } from "@Middleware/auth";
import { UserProgram } from "@Models/auth";
import validation from "@Services/validation";

const app = serverApp();

app.post(
  "*",
  requireAdmin,
  validation({
    "old.email": {
      isString: true,
    },
    "old.program": {
      isString: true,
    },
    email: {
      isEmail: true,
      errorMessage: "Debe ser un email válido",
    },
    program: {
      isString: true,
    },
  }),
  async (req, res) => {
    try {
      const { old, email, program } = req.body;
      await UserProgram.update(
        { email, program },
        {
          where: {
            email: old.email,
            program: old.program,
          },
        }
      );

      console.log(
        `Programa ${old.email}-${old.program} modificado a ${email}-${program} por ${req.user.email}`
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
