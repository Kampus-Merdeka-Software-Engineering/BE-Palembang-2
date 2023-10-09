// MySql Database Connection
const pool = require("../database/connection");

// Mengumpulkan semua endpoint shop

// [5]
exports.getProduct = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    // query()
    connection.query("SELECT * from product", (err, rows) => {
      if (!err) {
        res.json({
          products: rows,
        });
        // res.send(rows);
      } else {
        console.log(err);
      }
    });
    connection.release();
  });
};

// [6]
exports.searchProduct = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    // query()

    // request parameter
    const { name } = req.query;

    // res
    connection.query("SELECT * from product WHERE name LIKE ?", [`%${name}%`], (err, rows) => {
      if (!err) {
        if (rows.length === 0) {
          // Jika produk tidak ditemukan
          res.status(404).json({ message: "No products found for the given name." });
        } else {
          // Jika produk ditemukan
          res.json({
            products: rows,
          });
        }
      } else {
        console.log(err);
      }
    });
    connection.release();
  });
};

// [7]
exports.getProductDetail = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    // query()

    // req parameter
    const productId = req.params.product_id;

    // res
    connection.query("SELECT * FROM product WHERE product_id = ?", [productId], (err, rows) => {
      if (!err) {
        if (rows.length === 0) {
          // Jika produk tidak ditemukan
          res.status(404).json({ message: "No products found." });
        } else {
          // Jika produk ditemukan
          res.json({
            products: rows,
          });
        }
      } else {
        console.log(err);
      }
    });
    connection.release();
  });
};
