import connectSequelize from "connect-session-sequelize";
import { Router } from "express";
import ExpressSession from "express-session";
import stringify from "json-stringify-safe";
import _ from "lodash";
import passport from "passport";
import { Strategy } from "passport-local";
import randomString from "randomstring";
import requireEnv from "require-env-variable";

import equivalenciasProgramas from "@Data/equivalenciasProgramas.json";
import { sequelizeAuth as sequelize } from "@Models";
import { UserProgram, Users, UsersModel } from "@Models/auth";
import { LOCKED_USER, WRONG_EMAIL, WRONG_PASSWORD } from "@Server/consts";
import { Mail, sendMail } from "@Services/mail";

const { COOKIE_KEY } = requireEnv(["COOKIE_KEY"]);

const SequelizeStore = connectSequelize(ExpressSession.Store);
const store = new SequelizeStore({
  db: sequelize,
});
store.sync();

const auth = Router();

auth.use(
  ExpressSession({
    secret: COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 86400000, secure: false },
    store,
  })
);

auth.use(passport.initialize());
auth.use(passport.session());

const getNameEquivalent = (prog: string) => {
  const program = _.find(equivalenciasProgramas, v => v[0] === prog);

  if (!program || !_.has(program, 1)) return "Programa no encontrado";
  return `${program[0]} - ${_.truncate(program[1], { length: 50 })}`;
};

const getPrograms = async ({
  email,
}: {
  email: string;
}): Promise<{ program: string; name: string }[]> => {
  const rawPrograms: (UsersModel & { program: string })[] = await Users.findAll<
    any
  >({
    raw: true,
    attributes: ["user-programs.program"],
    include: [
      {
        model: UserProgram,
        where: { email },
      },
    ],
  });

  return _.map(rawPrograms, ({ program }): {
    program: string;
    name: string;
  } => ({
    program,
    name: getNameEquivalent(program),
  }));
};

passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      try {
        const user = await Users.findByPk(email, {});

        if (!user) {
          return cb(WRONG_EMAIL, false);
        }
        if (user.locked) {
          return cb(LOCKED_USER, false);
        }
        if (user.password !== password) {
          if (!user.admin) {
            await user.update({
              tries: user.tries + 1,
            });

            if (user.tries >= 3) {
              const unlockKey = randomString.generate();

              await user.update({
                tries: 0,
                locked: true,
                unlockKey,
              });

              sendMail({
                to: email,
                html: Mail({ email, unlockKey }),
                subject: "Activación cuenta LALA",
              });

              console.log("Usuario bloqueado: " + stringify(user));
              return cb(LOCKED_USER, false);
            }
          } else {
            console.log(
              'ADMIN ACCOUNT: "' + email + '" WRONG PASSWORD ENTERED'
            );
          }

          return cb(WRONG_PASSWORD, false);
        }

        await user.update({
          tries: 0,
        });

        const programs = await getPrograms({ email });

        return cb(null, { ...user.toJSON(), programs });
      } catch (err) {
        console.error(err);
      }
    }
  )
);
passport.serializeUser<
  {
    email: string;
    name: string;
    admin: boolean;
    programs: { name: string; program: string }[];
    type: string;
    id: string;
    show_dropout: boolean;
  },
  string
>((user, cb) => {
  cb(null, user.email);
});

passport.deserializeUser<
  {
    email?: string;
    name?: string;
    admin?: boolean;
    programs: { program: string; name: string }[];
    type: string;
    id: string;
    show_dropout: boolean;
  },
  string
>(async (email, cb) => {
  try {
    const user = await Users.findByPk(email, {
      attributes: [
        "email",
        "name",
        "admin",
        "locked",
        "type",
        "id",
        "show_dropout",
      ],
      raw: true,
    });

    if (user && user.locked) {
      cb(null, {
        email: "",
        name: "",
        admin: false,
        programs: [],
        type: "",
        id: "",
        show_dropout: false,
      });
    } else if (user) {
      const programs = await getPrograms({ email });

      cb(null, { ...user, programs });
    } else {
      cb(WRONG_EMAIL);
    }
  } catch (err) {
    console.error(err);
  }
});

const requireAuth = Router();
requireAuth.use(auth, (req, res, next) => {
  if (_.get(req, "user.email")) {
    return next();
  }
  return res.sendStatus(403);
});

const requireAdmin = Router();

requireAdmin.use(auth, (req, res, next) => {
  if (_.get(req, "user.admin")) {
    return next();
  }
  return res.sendStatus(403);
});

export { requireAuth, requireAdmin };

export default auth;
