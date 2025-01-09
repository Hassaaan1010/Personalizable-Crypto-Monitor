import authRoutes from "./authRoutes.js";
import homeRoutes from "./homeRoutes.js";
import forgotPasswordRouter from "./forgotPasswordRoutes.js";

const routerNode = (app) => {
  app.use("/home", homeRoutes);
  app.use("/auth", authRoutes);
  app.use("/forgotPassword", forgotPasswordRouter);
  app.use("*", (req, res) => {
    res.redirect("/login");
  });
};

export default routerNode;
