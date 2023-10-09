const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart");

// GET
router.get("/", cartController.getCart);
router.get("/quantity/:product_id", cartController.GetQuantityInCart);
// POST
router.put("/add", cartController.addProductToCart); // CreateProduct function ada di controller


// PUT
router.put("/update/:product_id", cartController.UpdateProductQuantityInCart);

// DELETE
router.delete("/remove/:product_id", cartController.RemoveProductInCart);
router.delete("/remove", cartController.RemoveCart);

// supaya router bisa dikonsumsi dari mana saja
module.exports = router;
