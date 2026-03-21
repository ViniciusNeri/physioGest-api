import { Router } from "express";
import { CategoryController } from "./CategoryController.js";

const routes = Router();
const controller = new CategoryController();

routes.get("/", controller.getAllCategories.bind(controller));
routes.get("/user/:userId", controller.getCategoriesByUser.bind(controller));
routes.get("/:id", controller.getCategoryById.bind(controller));
routes.post("/", controller.createCategory.bind(controller));
routes.put("/:id", controller.updateCategory.bind(controller));
routes.delete("/:id", controller.deleteCategory.bind(controller));

export default routes;
