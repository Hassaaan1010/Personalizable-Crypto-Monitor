import authRoutes from "./authRoutes.js";
import homeRoutes from "./homeRoutes.js";
import forgotPasswordRoutes from "./forgotPasswordRoutes.js";
import cryptoRoutes from "./cryptoRoutes.js"

const routerNode = (app) => {
  app.use("/home", homeRoutes);
  app.use("/auth", authRoutes);
  app.use("/crypto", cryptoRoutes )
  app.use("/forgotPassword", forgotPasswordRoutes);
  // app.use("*", (req, res) => {
  //   res.redirect("/login");
  // });
};

export default routerNode;
