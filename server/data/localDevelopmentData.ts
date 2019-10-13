import SHA1 from "crypto-js/sha1";

import equivalenciasProgramas from "@Data/equivalenciasProgramas.json";
import { UserProgram, Users } from "@Models/auth";

export const localUsers = async () => {
  try {
    if (process.env.NODE_ENV !== "production") {
      const email = "admin@admin.dev";

      await Users.findOrCreate({
        where: {
          email,
        },
        defaults: {
          password: SHA1("admin").toString(),
          name: "admin",
          locked: false,
          admin: true,
          show_dropout: true,
          type: "director",
        },
      });

      await UserProgram.bulkCreate(
        equivalenciasProgramas.map(([program]) => ({
          email,
          program,
        })),
        {
          updateOnDuplicate: ["email", "program"],
        }
      );
    }
  } catch (err) {
    console.error("Error in local development user-programs creations", err);
  }
};
