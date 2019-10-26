import serverApp from "@AppServer";
import { requireAdmin } from "@Middleware/auth";
import { UserProgram } from "@Models/auth";

const app = serverApp();

app.post("*", requireAdmin, async (req, res) => {
  try {
    console.log(`Admin ${req.user?.email} requested programs`);
    const users = await UserProgram.findAll({
      raw: true,
      attributes: ["email", "program"],
    });

    return res.send(users);
  } catch (err) {
    console.error(err);
    res.status(210).send(err.message);
  }
});

export default app;
