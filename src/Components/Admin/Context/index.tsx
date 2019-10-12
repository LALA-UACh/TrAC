import axios from "axios";
import { createContext, FunctionComponent, useState } from "react";
import { toast } from "react-toastify";
import { useRememberState } from "use-remember-state";

export type IProgram = { email: string; program: string };
export type IPrograms = IProgram[];

export type IUser = {
  email: string;
  name: string;
  locked: boolean;
  tries: number;
  type: string;
  id: string;
  show_dropout: boolean;
};
export type IUsers = IUser[];

type Context = {
  programs: IPrograms;
  users: IUsers;
  getPrograms: () => void;
  getUsers: () => void;
  importUsers: (users: IUsers) => void;
  importPrograms: (programs: IPrograms) => void;
  updateUser: (oldUser: IUser, user: IUser) => void;
  updateProgram: (oldProgram: IProgram, program: IProgram) => void;
  lockUser: (email: string) => void;
  mailLockedUsers: () => void;
  deleteUser: (email: string) => void;
  deleteProgram: (program: IProgram) => void;
  active: string;
  setActive: (active: string) => void;
  loading: boolean;
};

export const AdminContext = createContext<Context>({
  programs: [],
  users: [],
  getPrograms: () => {},
  getUsers: () => {},
  importUsers: () => {},
  importPrograms: () => {},
  updateUser: () => {},
  updateProgram: () => {},
  lockUser: () => {},
  mailLockedUsers: () => {},
  deleteUser: () => {},
  deleteProgram: () => {},
  active: "",
  setActive: () => {},
  loading: false,
});

const AdminProvider: FunctionComponent = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useRememberState(
    "AdminPrograms",
    [] as IPrograms
  );
  const [users, setUsers] = useRememberState("AdminUsers", [] as IUsers);
  const [active, setActive] = useRememberState("AdminMenu", "users");

  axios.interceptors.request.use(req => {
    setLoading(true);
    return req;
  });
  axios.interceptors.response.use(resp => {
    setLoading(false);
    return resp;
  });
  return (
    <AdminContext.Provider
      value={{
        programs,
        users,
        getPrograms: async () => {
          const resp = await axios.post<IPrograms>("/api/admin/get_programs");
          if (resp.status === 210) return toast.error(resp.data);
          setPrograms(resp.data);
        },
        getUsers: async () => {
          const resp = await axios.post<IUsers>("/api/admin/get_users");
          if (resp.status === 210) return toast.error(resp.data);
          setUsers(resp.data);
        },
        importUsers: async data => {
          const resp = await axios.post<IUsers>("/api/admin/users_import", {
            data,
          });
          if (resp.status === 210) return toast.error(resp.data);
          setUsers(resp.data);
        },
        importPrograms: async data => {
          const resp = await axios.post<IPrograms>(
            "/api/admin/programs_import",
            { data }
          );
          if (resp.status === 210) return toast.error(resp.data);
          setPrograms(resp.data);
        },
        updateUser: async (old, user) => {
          const resp = await axios.post<IUsers>("/api/admin/update_user", {
            old,
            ...user,
          });
          if (resp.status === 210) return toast.error(resp.data);
          setUsers(resp.data);
        },
        updateProgram: async (old, program) => {
          const resp = await axios.post<IPrograms>(
            "/api/admin/update_program",
            {
              old,
              ...program,
            }
          );
          if (resp.status === 210) return toast.error(resp.data);
          setPrograms(resp.data);
        },
        lockUser: async email => {
          const resp = await axios.post<IUsers>("/api/admin/lock_user", {
            email,
          });
          if (resp.status === 210) return toast.error(resp.data);
          setUsers(resp.data);
        },
        mailLockedUsers: async () => {
          const resp = await axios.post<string>(
            "/api/admin/mail_all_locked_users"
          );
          if (resp.status === 210) return toast.error(resp.data);
        },
        deleteUser: async email => {
          const resp = await axios.post<IUsers>("/api/admin/delete_user", {
            email,
          });
          if (resp.status === 210) return toast.error(resp.data);
          setUsers(resp.data);
        },
        deleteProgram: async (program: IProgram) => {
          const resp = await axios.post<IPrograms>(
            "/api/admin/delete_program",
            program
          );
          if (resp.status === 210) return toast.error(resp.data);
          setPrograms(resp.data);
        },
        active,
        setActive,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
