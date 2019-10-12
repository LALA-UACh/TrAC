import { ValidationErrors } from "final-form";
import { NextPage } from "next";
import { Field, Form } from "react-final-form";
import {
    Button, Checkbox, Form as FormSemantic, Grid, Icon, Input, Segment
} from "semantic-ui-react";
import { useRememberState } from "use-remember-state";
import { isEmail, isLength } from "validator";

import { AuthContext } from "@Context/Auth";

const Login: NextPage = () => {
  const [session, setSession] = useRememberState("LoginSession", true);

  return (
    <AuthContext.Consumer>
      {({ login, loginNoSession }) => (
        <Grid centered padded>
          <Grid.Row>
            <img
              alt="LALA"
              src="/static/lalalink.png"
              className="lalalink-image"
            />
          </Grid.Row>

          <Form
            onSubmit={({
              email,
              password,
            }: {
              email: string;
              password: string;
            }) => {
              if (session) {
                login({ email, password });
              } else {
                loginNoSession({ email, password });
              }
            }}
            validate={({ email, password }) => {
              const errors: ValidationErrors = {};
              if (!email || !isEmail(email)) {
                errors["email"] = "Ingrese un Email Válido";
              }
              if (!password || !isLength(password, { min: 3, max: 100 })) {
                errors["password"] = "Ingrese una contraseña de largo válido";
              }
              return errors;
            }}
          >
            {({ handleSubmit, pristine, invalid }) => {
              return (
                <FormSemantic size="big" onSubmit={handleSubmit}>
                  <Segment size="big" basic>
                    <Field name="email" type="email" initialValue="">
                      {({ input, meta: { touched, error } }) => (
                        <FormSemantic.Field error={error && touched}>
                          <label>Correo Electrónico</label>
                          <Input {...input} placeholder="email@uach.cl" />
                          <label>{touched && error}</label>
                        </FormSemantic.Field>
                      )}
                    </Field>

                    <Field name="password" initialValue="" type="password">
                      {({ input, meta: { touched, error } }) => (
                        <FormSemantic.Field error={error && touched}>
                          <label>Contraseña</label>
                          <Input {...input} placeholder="contraseña" />
                          {<label>{touched && error}</label>}
                        </FormSemantic.Field>
                      )}
                    </Field>
                  </Segment>
                  <Segment basic>
                    <Checkbox
                      toggle
                      label="Mantenerse conectado"
                      onChange={() => {
                        setSession(!session);
                      }}
                      checked={session}
                    />
                  </Segment>
                  <Segment basic>
                    <Button
                      as="button"
                      type="submit"
                      size="big"
                      color="blue"
                      disabled={pristine || invalid}
                      icon
                      labelPosition="left"
                    >
                      <Icon name="sign-in" />
                      Ingresar
                    </Button>
                  </Segment>
                </FormSemantic>
              );
            }}
          </Form>
        </Grid>
      )}
    </AuthContext.Consumer>
  );
};

export default Login;
