const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

// POST
router.post("/register", authController.register);
router.post("/login", authController.login);
// supaya router bisa dikonsumsi dari mana saja
module.exports = router;
