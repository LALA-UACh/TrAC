import serverApp from "@Server/app";
import auth from "@Middleware/auth";
import _ from "lodash";

const app = serverApp();

app.use(auth, (req, res) => {
  if (_.has(req, "user.email")) {
    console.log("Desconexión exitosa! usuario: " + req.user.name);
  }
  req.logout();
  req.session && req.session.destroy(() => {});
  if (req.method === "GET") {
    return res.redirect("/");
  }
  res.sendStatus(200);
});

export default app;
