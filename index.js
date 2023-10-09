// Create server with express
require("dotenv").config();
const jwtcheck = require("./src/middlewares/jwtcheck");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const guarded = express.Router(); // router khusus untuk check jwt ; cek akses yg perlu login
guarded.use(jwtcheck);
// Routers
const authRoutes = require("./src/routes/auth");
const homeRoutes = require("./src/routes/home");
const shopRoutes = require("./src/routes/shop");
const cartRoutes = require("./src/routes/cart");
const userRoute = require("./src/routes/user");

app.use(bodyParser.json());
// Allow all origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/v1/auth", authRoutes);
app.use("/v1/home", homeRoutes);
guarded.use("/v1/shop", shopRoutes);
guarded.use("/v1/cart", cartRoutes);
guarded.use("/v1/user", userRoute);

app.use(guarded);

// index --> router --> conroller
app.listen(process.env.PORT);

// npm start : to start the server
// ctrl + c : to quit server
