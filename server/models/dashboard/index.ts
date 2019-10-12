import { DataTypes, Model, BuildOptions } from "sequelize";
import { sequelizeLalauach as sequelize } from "@Models";

export class TrackingModel extends Model {
  app_id: string;
  user_id: string;
  datetime: Date;
  datetime_client: Date;
  data: string;
  id: number;
}

export type TrackingStatic = typeof TrackingModel & {
  new (values?: object, options?: BuildOptions): TrackingModel;
};

export const Tracking = <TrackingStatic>sequelize.define(
  "tracking",
  {
    app_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: () => new Date(),
    },
    datetime_client: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: "tracking",
    timestamps: false,
  }
);
