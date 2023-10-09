// MySql Database Connection
const pool = require("../database/connection");

// Mengumpulkan semua fungsi product

// [4]
exports.getProduct = (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    // query()
    connection.query("SELECT * from product LIMIT 5", (err, rows) => {
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
