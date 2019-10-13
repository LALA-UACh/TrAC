import _ from "lodash";

import serverApp from "@AppServer";
import auth from "@Middleware/auth";

const app = serverApp();

app.use(auth, async (req, res) => {
  try {
    if (_.get(req, "user.email")) {
      const { name, email, admin, programs, type, id, show_dropout } = req.user;
      console.log("User already logged in: " + name);

      return res.send({
        name,
        email,
        programs,
        admin,
        type,
        id,
        show_dropout,
      });
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
  }
});

export default app;
