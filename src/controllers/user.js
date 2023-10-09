const pool = require("../database/connection");

exports.getProfile = (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(req.user);
        const user_id = req.user.user_id
        connection.query("SELECT fullname, email from user where user_id = ?", [user_id], (err, rows) => {
            if (!err) {
                if (rows.length === 0) {
                    // Jika produk tidak ditemukan
                    res.status(404).json({ message: "No Account found." });
                } else {
                    // Jika produk ditemukan
                    res.json({
                        data: rows[0],
                    });
                }
            } else {
            console.log(err);
            }
        })
        connection.release();
    })
}
