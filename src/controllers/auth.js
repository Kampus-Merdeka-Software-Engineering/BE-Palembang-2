const bcrypt = require("bcrypt"); // Enkripsi Password
// MySql Database Connection
const pool = require("../database/connection");
const jwt = require("jsonwebtoken");

// Mengumpulkan semua endpoint shop

// [1]
exports.register = (req, res, next) => {
  pool.getConnection(async (err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");

    const { fullname, email, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user data into the database
      const insertUserQuery = "INSERT INTO user (fullname, email, password) VALUES (?, ?, ?)";
      const insertUserValues = [fullname, email, hashedPassword];

      connection.query(insertUserQuery, insertUserValues, (error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
        } else {
          const user = {
            user_id: results.insertId,
            fullname,
            email,
          };
          res.json({ message: "User registered successfully", user });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred during registration" });
    }
    connection.release();
  });
};

// [2]
exports.login = (req, res, next) => {
  pool.getConnection(async (err, connection) => {
    if (err) throw err;
    console.log("connected as id ${connection.threadId}");
    const { email, password } = req.body;

    try {
      // Check if the user exists
      const userQuery = "SELECT * FROM user WHERE email = ?";
      connection.query(userQuery, [email], async (error, results) => {
        if (error) {
          res.status(500).json({ error: error.message });
        } else if (results.length === 0) {
          res.status(404).json({ message: "User not found" });
        } else {
          const user = results[0];

          // Verify the password
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            // Create a JWT token
            const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.json({ message: "Login successful", token });
          } else {
            res.status(401).json({ message: "Invalid password" });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: "An error occurred during login" });
    }
    connection.release();
  });
};

// .env
