import sha1 from "crypto-js/sha1";
import _ from "lodash";
import isHash from "validator/lib/isHash";

import serverApp from "@AppServer";
import auth from "@Middleware/auth";
import { Users } from "@Models/auth";
import validation from "@Services/validation";

const app = serverApp();

const validatePassword = (password: string) => {
  const conditions = {
    length: () => validator.isLength(password, { min: 8, max: 100 }),
    specialSymbol: () =>
      validator.matches(password, /[~¡!$&+,:;=¿?@#|'<>.^*(){}"%\-_]/),
    lowercase: () => validator.matches(password, /[a-z]/),
    uppercase: () => validator.matches(password, /[A-Z]/),
    number: () => validator.matches(password, /[0-9]/),
  };

  return _.reduce(
    conditions,
    (acum, value) => {
      const val = value();
      return acum && val;
    },
    true
  );
};

app.post(
  "*",
  validation({
    email: {
      isEmail: true,
      errorMessage: "Debe ser un email válido",
    },
    password: {
      isString: true,
    },
    unlockKey: {
      isString: true,
    },
  }),
  auth,
  async (req, res, next) => {
    try {
      let { email, password, unlockKey } = req.body;

      let user = await Users.findOne({
        where: {
          email,
          unlockKey,
        },
      });

      if (!user) {
        return res
          .status(210)
          .send(
            "Usuario ingresado no está bloqueado o el código ingresado es erróneo."
          );
      }

      if (!isHash(password, "sha1")) {
        if (validatePassword(password)) {
          password = sha1(password).toString();
        } else {
          return res
            .status(210)
            .send(
              "Contraseña invalida. Asegurese de cumplir las condiciones dadas."
            );
        }
      }

      switch (password) {
        case user.password:
        case user.oldPassword1:
        case user.oldPassword2:
        case user.oldPassword3: {
          console.log(
            `Usuario ${user.email} ocupa denuevo una contraseña antigua!`
          );
          return res
            .status(210)
            .send("No puede ingresar una contraseña usada anteriormente.");
        }
        default: {
          user = await user.update({
            password,
            oldPassword1: user.password,
            oldPassword2: user.oldPassword1,
            oldPassword3: user.oldPassword2,
            locked: false,
            unlockKey: "",
          });

          req.logIn(user.toJSON(), e => {
            if (e) {
              return next(e);
            }
            if (req.session) req.session.cookie.maxAge = 1800000;

            user &&
              console.log("Autenticación correcta! usuario: " + user.name);

            return res.sendStatus(200);
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
);

export default app;
