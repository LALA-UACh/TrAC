import axios from "axios";
import sha1 from "crypto-js/sha1";
import _ from "lodash";
import { NextPage } from "next";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { toast } from "react-toastify";
import { Form as FormSemantic, Grid, Icon, Input, Message, Segment } from "semantic-ui-react";
import validator from "validator";

import { AuthPath } from "@Utils";

const validatePassword = (password: string, confirmPassword: string) => {
  const conditions = {
    password: {
      length: validator.isLength(password, { min: 8, max: 100 }),
      specialSymbol: validator.matches(
        password,
        /[~¡!$&+,:;=¿?@#|'<>.^*(){}"%\-_]/
      ),
      lowercase: validator.matches(password, /[a-z]/),
      uppercase: validator.matches(password, /[A-Z]/),
      number: validator.matches(password, /[0-9]/),
    },

    confirmPassword: password === confirmPassword,
  };

  password = _.join(
    _.compact(
      _.map(conditions.password, (v, k) => {
        if (!v)
          switch (k) {
            case "length":
              return "El largo de la contraseña tiene que ser de al menos 8 caracteres y máximo de 100 caracteres.";
            case "specialSymbol":
              return `La contraseña debe contener al menos un caracter especial (~¡!$&+,:;=¿?@#|'<>.^*(){}"%-_).`;
            case "lowercase":
              return "La contraseña debe contener al menos una letra minúscula.";
            case "uppercase":
              return "La contraseña debe contener al menos una letra mayúscula.";
            case "number":
              return "La contraseña debe contener al menos un número.";
          }
      })
    ),
    "\n"
  );
  confirmPassword = !conditions.confirmPassword
    ? "Debe repetir su contraseña correctamente."
    : "";

  return password || confirmPassword ? { password, confirmPassword } : {};
};

const Unlock: NextPage<{
  email: string;
  unlockKey: string;
}> = ({ email, unlockKey }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Grid centered padded>
      <Grid.Row>
        <Message>{email}</Message>
      </Grid.Row>
      <Form
        onSubmit={async ({
          password,
        }: {
          password: string;
          confirmPassword: string;
        }) => {
          try {
            setLoading(true);
            const resp = await axios.post(`${AuthPath}/unlock`, {
              email,
              password: sha1(password).toString(),
              unlockKey,
            });
            switch (resp.status) {
              case 200:
                toast.success(
                  "Nueva contraseña cambiada satisfactoriamente! va a ser redireccionado a la aplicación",
                  {
                    onClose: () => {
                      window.location.replace("/");
                    },
                  }
                );
                break;
              case 210:
                setLoading(false);
                setError(resp.data);
                break;
            }
          } catch (err) {
            setLoading(false);
            toast.error(err.message);
          }
        }}
        validate={({ password = "", confirmPassword = "" }) => {
          return validatePassword(password, confirmPassword);
        }}
      >
        {({ handleSubmit, dirty, errors, valid, invalid, touched }) => (
          <>
            <Grid.Row>
              <FormSemantic onSubmit={handleSubmit}>
                <Segment size="big" basic>
                  <Field name="password" initialValue="">
                    {({ input, meta: { invalid, touched } }) => (
                      <FormSemantic.Field
                        error={dirty || touched ? invalid : false}
                      >
                        <label>Nueva contraseña</label>
                        <Input
                          {...input}
                          type="password"
                          placeholder="contraseña"
                        />
                      </FormSemantic.Field>
                    )}
                  </Field>
                </Segment>

                <Segment size="big" basic>
                  <Field name="confirmPassword" initialValue="">
                    {({ input, meta: { invalid, touched } }) => (
                      <FormSemantic.Field
                        error={dirty || touched ? invalid : false}
                      >
                        <label>Repita su contraseña</label>
                        <Input
                          {...input}
                          type="password"
                          placeholder="contraseña"
                        />
                      </FormSemantic.Field>
                    )}
                  </Field>
                </Segment>

                <Segment size="big" basic>
                  <FormSemantic.Button
                    type="submit"
                    icon
                    primary
                    labelPosition="left"
                    disabled={invalid || loading}
                    size="big"
                    loading={loading}
                  >
                    <Icon name="lock open" />
                    Activar cuenta
                  </FormSemantic.Button>
                </Segment>
              </FormSemantic>
            </Grid.Row>
            <Grid.Row>
              <Message warning hidden={dirty || _.some(touched) ? valid : true}>
                <Message.Header>Error!</Message.Header>
                <Message.List>
                  {_.map(_.values(errors) as string[], (v, k) => {
                    return _.map(
                      _.compact(_.split(v, "\n")),
                      (content, key) => {
                        return <Message.Item key={k + key} content={content} />;
                      }
                    );
                  })}
                </Message.List>
              </Message>
            </Grid.Row>
          </>
        )}
      </Form>
      <Grid.Row>
        <Message error hidden={_.isEmpty(error)}>
          <Message.Header>Error!</Message.Header>
          <Message.List>
            {_.map(_.split(error, "\n"), (content, key) => (
              <Message.Item key={key} content={content} />
            ))}
          </Message.List>
        </Message>
      </Grid.Row>
    </Grid>
  );
};

Unlock.getInitialProps = async ({ req, res, query }) => {
  if (req && res) {
    const { email, unlockKey } = query;

    if (_.isString(email) && _.isString(unlockKey)) {
      return {
        email,
        unlockKey,
      };
    }
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
  }
  return {
    email: "",
    unlockKey: "",
  };
};

export default Unlock;
