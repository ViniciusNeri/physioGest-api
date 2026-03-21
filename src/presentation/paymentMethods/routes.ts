import { Router } from "express";
import { PaymentMethodController } from "./PaymentMethodController.js";

const routes = Router();
const controller = new PaymentMethodController();

routes.get("/", controller.getAllPaymentMethods.bind(controller));
routes.get("/user/:userId", controller.getPaymentMethodsByUser.bind(controller));
routes.get("/:id", controller.getPaymentMethodById.bind(controller));
routes.post("/", controller.createPaymentMethod.bind(controller));
routes.put("/:id", controller.updatePaymentMethod.bind(controller));
routes.delete("/:id", controller.deletePaymentMethod.bind(controller));

export default routes;
