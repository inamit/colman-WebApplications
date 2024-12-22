const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/", usersController.getAllUsers);
router.post("/", usersController.registerNewUser);

module.exports = router;