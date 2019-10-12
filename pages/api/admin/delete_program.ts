import serverApp from "@Server/app";
import { requireAdmin } from "@Middleware/auth";
import { UserProgram } from "@Models/auth";
import validation from "@Services/validation";

const app = serverApp();

app.post(
  "*",
  requireAdmin,
  validation({
    email: {
      isString: true,
    },
    program: {
      isString: true,
    },
  }),
  async (req, res) => {
    try {
      const { email, program } = req.body;
      await UserProgram.destroy({
        where: {
          email,
          program,
        },
      });

      console.log(
        `Usuario-Programa eliminado desde panel: ${email}-${program} por ${req.user.email}`
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
