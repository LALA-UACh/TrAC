import axios from "axios";
import sha1 from "crypto-js/sha1";
import { get as getCookie } from "js-cookie";
import { createContext, FunctionComponent, useEffect, useState } from "react";
import { toast } from "react-toastify";

import Login from "@Components/Auth/Login";
import Loader from "@Components/Loader";
import { AuthPath, setTrackingData, useTrackingData } from "@Utils";

export type AuthenticatedInfo = {
  email: string;
  name: string;
  admin: boolean;
  programs: { name: string; program: string }[];
  type: string;
  show_dropout: boolean;
  id: string;
};

export type login = (data: {
  email: string;
  password: string;
  no_session?: true;
}) => Promise<void>;
export type Context = AuthenticatedInfo & {
  login: login;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<Context>({
  login: async () => {},
  logout: async () => {
    await axios.post(`${AuthPath}/logout`);
  },
  email: "",
  name: "",
  admin: false,
  programs: [],
  type: "",
  show_dropout: false,
  id: "",
});

const Auth: FunctionComponent<{ admin?: boolean }> = ({ children, admin }) => {
  const [auth, setAuth] = useState<AuthenticatedInfo>({
    email: "",
    name: "",
    admin: false,
    programs: [],
    type: "",
    show_dropout: false,
    id: "",
  });
  const [loading, setLoading] = useState(true);
  axios.interceptors.response.use(resp => {
    setLoading(false);
    return resp;
  });
  useEffect(() => {
    (async () => {
      if (getCookie("connect.sid")) {
        try {
          const resp = await axios.post<AuthenticatedInfo>(
            `${AuthPath}/current_user`
          );
          setLoading(false);

          switch (resp.status) {
            case 200: {
              setTrackingData("user_id", resp.data.email);
              setAuth(resp.data);

              break;
            }
          }
        } catch (err) {
          toast.error(err.message);
        }
      }
      setLoading(false);
    })();
  }, []);

  useTrackingData("type", auth.type);

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login: async ({ email, password, no_session }) => {
          try {
            setLoading(true);
            const resp = await axios.post<AuthenticatedInfo>(
              `${AuthPath}/login`,
              {
                email,
                password: sha1(password).toString(),
                no_session,
              }
            );
            switch (resp.status) {
              case 200: {
                setTrackingData("user_id", resp.data.email);
                setAuth(resp.data);
                setLoading(false);
                break;
              }
              case 210: {
                toast.error(resp.data);
                setAuth({
                  email: "",
                  name: "",
                  admin: false,
                  programs: [],
                  type: "",
                  show_dropout: false,
                  id: "",
                });
                setLoading(false);

                break;
              }
            }
          } catch (error) {
            setLoading(false);

            toast.error(error.message);
          }
        },
        logout: async () => {
          try {
            setLoading(true);

            await axios.post(`${AuthPath}/logout`);
          } catch (error) {
            toast.error(error.message);
          }
          setAuth({
            email: "",
            name: "",
            admin: false,
            programs: [],
            type: "",
            show_dropout: false,
            id: "",
          });
          setLoading(false);
        },
      }}
    >
      {(admin ? (
        auth.admin
      ) : (
        auth.email
      )) ? (
        children
      ) : loading ? (
        <Loader active={loading} />
      ) : (
        <Login />
      )}
    </AuthContext.Provider>
  );
};

export default Auth;
