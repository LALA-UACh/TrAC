import passport from "passport";

import serverApp from "@AppServer";
import auth from "@Middleware/auth";
import { LOCKED_USER, WRONG_EMAIL, WRONG_PASSWORD } from "@Server/consts";

const app = serverApp();

app.post("*", auth, (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      switch (err) {
        case LOCKED_USER:
          return res
            .status(210)
            .send(
              "Usuario bloqueado. Por favor revisar correo para recuperar su cuenta."
            );
        case WRONG_PASSWORD:
        case WRONG_EMAIL:
          return res
            .status(210)
            .send(
              "Información ingresada erronea. Verificar datos o su cuenta puede ser bloqueda por seguridad."
            );
        default:
          return next(err);
      }
    }
    if (!user) {
      return res
        .status(210)
        .send("Información invalida. Revisar como fue enviada la solicitud.");
    }

    req.logIn(user, async e => {
      if (e) {
        return next(e);
      }
      if (req.session) req.session.cookie.maxAge = 86400000;

      const { name, email, admin, programs, type, id, show_dropout } = user;

      console.log("Autenticación correcta! usuario: " + name);

      return res.send({
        name,
        email,
        programs,
        admin,
        type,
        id,
        show_dropout,
      });
    });
  })(req, res, next);
});

export default app;
