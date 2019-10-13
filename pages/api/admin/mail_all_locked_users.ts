import stringify from "json-stringify-safe";
import _ from "lodash";
import randomString from "randomstring";

import serverApp from "@AppServer";
import { requireAdmin } from "@Middleware/auth";
import { Users } from "@Models/auth";
import { sendMail } from "@Services/mail";
import Mail from "@Services/mail/mail";

const app = serverApp();

app.post("*", requireAdmin, async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["email"],
      where: {
        locked: true,
      },
    });

    _.forEach(users, async user => {
      try {
        const unlockKey = randomString.generate();

        await user.update({
          unlockKey,
        });

        sendMail({
          to: user.email,
          html: Mail({ email: user.email, unlockKey }),
          subject: "Activación cuenta LALA",
        });

        console.log(
          `Correo de activación enviado desde panel a ${stringify(user)} por ${
            req.user.email
          }`
        );
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(210).send(err.message);
  }
});

export default app;
