import randomString from "randomstring";
import { BuildOptions, DataTypes, Model } from "sequelize";

import { localUsers } from "@Data/localDevelopmentData";
import { sequelizeAuth as sequelize } from "@Models";

export class UsersModel extends Model {
  email: string;
  password: string;
  name: string;
  oldPassword1: string;
  oldPassword2: string;
  oldPassword3: string;
  locked: boolean;
  tries: number;
  unlockKey: string;
  admin: boolean;
  type: string;
  id: string;
  show_dropout: boolean;
}

export type UsersStatic = typeof UsersModel & {
  new (values?: object, options?: BuildOptions): UsersModel;
};

export const Users = <UsersStatic>sequelize.define(
  "users",
  {
    email: { type: DataTypes.STRING, primaryKey: true },
    password: { type: DataTypes.STRING, defaultValue: "" },
    name: { type: DataTypes.STRING, defaultValue: "default" },
    oldPassword1: { type: DataTypes.STRING, defaultValue: "" },
    oldPassword2: { type: DataTypes.STRING, defaultValue: "" },
    oldPassword3: { type: DataTypes.STRING, defaultValue: "" },
    locked: { type: DataTypes.BOOLEAN, defaultValue: true },
    tries: { type: DataTypes.INTEGER, defaultValue: 0 },
    unlockKey: {
      type: DataTypes.STRING,
      defaultValue: () => randomString.generate(),
    },
    admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    type: { type: DataTypes.TEXT, defaultValue: "student" },
    id: { type: DataTypes.TEXT, defaultValue: "" },
    show_dropout: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "users",
  }
);

export class UserProgramModel extends Model {
  email: string;
  program: string;
}

export type UserProgramStatic = typeof UserProgramModel & {
  new (values?: object, options?: BuildOptions): UserProgramModel;
};

export const UserProgram = <UserProgramStatic>sequelize.define(
  "user-programs",
  {
    email: { type: DataTypes.STRING, primaryKey: true },
    program: { type: DataTypes.STRING, primaryKey: true },
  },
  {
    tableName: "user-programs",
  }
);

Users.hasMany(UserProgram, { foreignKey: "email" });
UserProgram.belongsTo(Users, { foreignKey: "email" });

localUsers();

if (process.env.NODE_ENV !== "production") {
  Users.sync({ alter: true });
  UserProgram.sync({ alter: true });
}
