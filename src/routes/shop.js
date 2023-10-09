const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

// GET
router.get("/product", shopController.getProduct);
router.get("/product/search", shopController.searchProduct);
router.get("/product/:product_id", shopController.getProductDetail);
// supaya router bisa dikonsumsi dari mana saja
module.exports = router;
