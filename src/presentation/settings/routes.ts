import { Router } from "express";
import { SettingController } from "./SettingController.js";

const routes = Router();
const controller = new SettingController();

routes.get("/", controller.getAllSettings.bind(controller));
routes.get("/user/:userId", controller.getSettingByUserId.bind(controller));
routes.get("/:id", controller.getSettingById.bind(controller));
routes.post("/", controller.createSetting.bind(controller));
routes.put("/:id", controller.updateSetting.bind(controller));
routes.delete("/:id", controller.deleteSetting.bind(controller));

export default routes;
