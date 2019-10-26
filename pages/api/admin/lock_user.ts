import randomString from "randomstring";

import serverApp from "@AppServer";
import { requireAdmin } from "@Middleware/auth";
import { Users } from "@Models/auth";
import { sendMail } from "@Services/mail";
import Mail from "@Services/mail/mail";
import validation from "@Services/validation";

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

      const unlockKey = randomString.generate();

      await Users.update(
        { locked: true, tries: 0, unlockKey },
        {
          where: {
            email,
          },
        }
      );

      sendMail({
        to: email,
        html: Mail({ email, unlockKey }),
        subject: "Activación cuenta LALA",
      });

      console.log(
        `Usuario ${email} bloqueado desde panel por ${req.user?.email}`
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
