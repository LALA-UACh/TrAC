import { FC } from "react";
import { renderToString } from "react-dom/server";
import requireEnv from "require-env-variable";

const GMAIL_USERNAME = process.env.GMAIL_USERNAME;

const DOMAIN =
  process.env.NODE_ENV === "production"
    ? requireEnv(["DOMAIN"]).DOMAIN
    : "http://localhost:3000";

const Mail: FC<{ email: string; unlockKey: string }> = ({
  email,
  unlockKey,
}) => {
  const link = `${DOMAIN}/unlock/${email}/${unlockKey}`;
  if (!GMAIL_USERNAME) {
    throw new Error("Put the environment variable GMAIL_USERNAME");
  }

  return (
    <div>
      <h2>Bienvenido/a a la herramienta TrAC!</h2>
      <br />
      <p>
        El equipo LALA ha preparado para usted una cuenta de usuario para
        utilizar la herramienta TrAC. Por seguridad, la cuenta de usuario sólo
        será activada cuando haya establecido una contraseña segura.
      </p>
      <br />
      <p>
        Haga click{" "}
        <b>
          <a href={link}>aquí</a>
        </b>{" "}
        para ingresar una contraseña nueva y activar su cuenta
      </p>
      <br />
      <p>
        O abra este link en su navegador: {"   "}
        <b>{link}</b>
      </p>
      <br />
      <p>
        Si tiene algún problema o alguna pregunta, puede contactarnos al correo{" "}
        {GMAIL_USERNAME}
      </p>
    </div>
  );
};

export default ({ email, unlockKey }: { email: string; unlockKey: string }) => {
  return renderToString(<Mail email={email} unlockKey={unlockKey} />);
};
