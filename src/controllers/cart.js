// MySql Database Connection
const pool = require("../database/connection");

// Mengumpulkan semua endpoint cart

//[8]
exports.addProductToCart = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    // query()

    // req
    const { product_id, quantity } = req.body;
    const user_id = req.user.user_id;
    // Check if the product is already in the cart for the given user
    const checkProductQuery = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
    connection.query(checkProductQuery, [user_id, product_id], (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        if (results.length === 0) {
          // If the product is not in the cart, insert a new entry
          const addToCartQuery = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
          connection.query(addToCartQuery, [user_id, product_id, quantity], (error, insertResult) => {
            if (error) {
              res.status(500).json({ error: error.message });
            } else {
              res.json({ message: "Product added to the cart successfully", cart_id: insertResult.insertId });
            }
          });
        } else {
          // If the product is already in the cart, update the quantity
          const updateQuantityQuery = "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
          connection.query(updateQuantityQuery, [quantity, user_id, product_id], (error, updateResult) => {
            if (error) {
              res.status(500).json({ error: error.message });
            } else {
              res.json({ message: "Product quantity updated in the cart successfully", cart_id: results[0].cart_id });
            }
          });
        }
      }
    });
    connection.release();
  });
};

// [9]
exports.getCart = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    // query()

    // req
    const user_id = req.user.user_id;
    // Query to get cart details for the user
    const getCartQuery = `
    SELECT
      cart.product_id,
      product.name,
      cart.quantity,
      product.price,
      product.image_url
    FROM cart
    JOIN product ON cart.product_id = product.product_id
    WHERE cart.user_id = ?`;

    connection.query(getCartQuery, [user_id], (error, cartResults) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        const items = cartResults.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image_url: item.image_url
        }));
        const total_items = items.reduce((total, item) => total + item.quantity, 0);
        const total_price = items.reduce((total, item) => total + item.quantity * item.price, 0);

        const response = {
          user_id: user_id,
          items: items,
          total_items: total_items,
          total_price: total_price,
        };

        res.json(response);
      }
    });
    connection.release();
  });
};

// [10]

exports.UpdateProductQuantityInCart = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    // query()

    // req
    const user_id = req.user.user_id;
    const product_id = req.params.product_id;
    const newQuantity = req.body.quantity;

    // Update the quantity of the product in the cart
    const updateQuantityQuery = `
    UPDATE cart
    SET quantity = ?
    WHERE user_id = ? AND product_id = ?`;

    connection.query(updateQuantityQuery, [newQuantity, user_id, product_id], (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: "Product not found in the cart" });
        } else {
          // Retrieve updated cart details
          const getCartQuery = `
          SELECT
            product.product_id,
            product.name,
            cart.quantity,
            product.price
          FROM cart
          JOIN product ON cart.product_id = product.product_id
          WHERE cart.user_id = ?`;

          connection.query(getCartQuery, [user_id], (error, cartResults) => {
            if (error) {
              res.status(500).json({ error: error.message });
            } else {
              const items = cartResults.map((item) => ({
                product_id: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              }));

              const total_items = items.reduce((total, item) => total + item.quantity, 0);
              const total_price = items.reduce((total, item) => total + item.quantity * item.price, 0);

              const response = {
                message: "Product quantity updated in the cart successfully.",
                cart: {
                  user_id: user_id,
                  items: items,
                  total_items: total_items,
                  total_price: total_price,
                },
              };

              res.json(response);
            }
          });
        }
      }
    });
    connection.release();
  });
};

// [11]

exports.RemoveProductInCart = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    // query()

    // req
    const user_id = req.user.user_id;
    const product_id = req.params.product_id;

    // Delete the product from the cart
    const deleteProductQuery = `
    DELETE FROM cart
    WHERE user_id = ? AND product_id = ?`;

    connection.query(deleteProductQuery, [user_id, product_id], (error, results) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: "Product not found in the cart" });
        } else {
          // Retrieve updated cart details
          const getCartQuery = `
          SELECT
            product.product_id,
            product.name,
            cart.quantity,
            product.price
          FROM cart
          JOIN product ON cart.product_id = product.product_id
          WHERE cart.user_id = ?`;

          connection.query(getCartQuery, [user_id], (error, cartResults) => {
            if (error) {
              res.status(500).json({ error: error.message });
            } else {
              const items = cartResults.map((item) => ({
                product_id: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              }));

              const total_items = items.reduce((total, item) => total + item.quantity, 0);
              const total_price = items.reduce((total, item) => total + item.quantity * item.price, 0);

              const response = {
                message: "Product removed from the cart successfully.",
                cart: {
                  user_id: user_id,
                  items: items,
                  total_items: total_items,
                  total_price: total_price,
                },
              };

              res.json(response);
            }
          });
        }
      }
    });
    connection.release();
  });
};
exports.RemoveCart = (req, res, next) => {
  pool.getConnection((err, connection) => {
    const user_id = req.user.user_id;
    if (err) throw err;

    const deleteProductQuery = `
    DELETE FROM cart
    WHERE user_id = ?`;
    connection.query(deleteProductQuery, [user_id], (err, rows) => {
      if (err) throw err;
      if (rows.affectedRows === 0) {
        res.status(404).json({ message: "cart not found" });
      } else {
        res.json({message : "cart deleted"});
      }
    })
    connection.release();

  })
}
exports.GetQuantityInCart = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    const user_id = req.user.user_id;
    const product_id = req.params.product_id;
    const checkProductQuantitiyQuery = "SELECT product_id, quantity FROM cart WHERE user_id = ? AND product_id = ? LIMIT 1";
    connection.query(checkProductQuantitiyQuery, [user_id, product_id], (err, rows) => {
      if (err) {
        res.status(500).json({ error: error.message });
      }
      else if(rows.length > 0){
        res.json({data: rows[0]});
      } else {
        res.json({data: {product_id: product_id, quantity: 0}})
      }
    })
    connection.release();
  })
}