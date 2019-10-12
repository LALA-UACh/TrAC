import { Users } from "@Models/auth";
import serverApp from "@Server/app";
import { requireAdmin } from "@Middleware/auth";
const app = serverApp();

app.post("*", requireAdmin, async (req, res) => {
  try {
    console.log(`Admin ${req.user.email} requested users`);

    const users = await Users.findAll({
      raw: true,
      attributes: [
        "email",
        "name",
        "locked",
        "tries",
        "admin",
        "type",
        "id",
        "show_dropout",
      ],
    });

    return res.send(users);
  } catch (err) {
    console.error(err);
    res.status(210).send(err.message);
  }
});

export default app;
