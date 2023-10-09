const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home");
// GET
router.get("/product", homeController.getProduct);
// supaya router bisa dikonsumsi dari mana saja
module.exports = router;
