const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// /api/users/........
router.post("/signup", userController.user_register);
router.post("/login", userController.user_login);
router.get("/logout", userController.logout);
router.get("/monitorAuth", userController.monitor_AuthState);
module.exports = router;
