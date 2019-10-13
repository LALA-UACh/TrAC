import _ from "lodash";

import serverApp from "@AppServer";
import auth from "@Middleware/auth";

const app = serverApp();

app.use(auth, (req, res) => {
  if (_.has(req, "user.email")) {
    console.log("Desconexión exitosa! usuario: " + req.user.name);
  }
  req.logout();
  req.session && req.session.destroy(() => {});
  res.clearCookie("connect.sid");
  if (req.method === "GET") {
    return res.redirect("/");
  }
  res.sendStatus(200);
});

export default app;
