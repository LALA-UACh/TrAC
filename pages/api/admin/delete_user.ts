import serverApp from "@AppServer";
import { requireAdmin } from "@Middleware/auth";
import { Users } from "@Models/auth";
import { validation } from "@Services/validation";

const app = serverApp();

app.post(
  "*",
  requireAdmin,
  validation({
    email: {
      isString: true,
    },
  }),
  async (req, res) => {
    try {
      const { email } = req.body;
      await Users.destroy({
        where: {
          email,
        },
      });

      console.log(
        `Usuario ${email} eliminado desde panel por ${req.user.email}`
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
