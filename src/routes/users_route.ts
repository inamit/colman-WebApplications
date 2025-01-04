import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";

router.get("/", usersController.getAllUsers);
router.post("/", usersController.registerNewUser);
router.get("/:user_id", usersController.getUserById);
router.patch("/:user_id", usersController.updateUserById);
router.delete("/:user_id", usersController.deleteUserById);
router.post("/login", usersController.login);
router.post("/logout", usersController.logout);

export default router;
