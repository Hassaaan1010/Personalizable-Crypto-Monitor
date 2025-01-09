import authRoutes from "./authRoutes.js";
import forgotPasswordRouter from "./forgotPasswordRoutes.js";

const routerNode = (app) => {
  app.use("/auth", authRoutes);
  app.use("/forgotPassword", forgotPasswordRouter);
};

export default routerNode;
