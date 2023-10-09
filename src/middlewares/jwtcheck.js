const jwt = require("jsonwebtoken");

const checkJwt = (req, res, next) => {
  if (req.method === 'OPTIONS') next();
  else {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - Bearer token missing" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' from the token

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized - Invalid token" });
      }

      // Add the decoded user information to the request object
      req.user = decoded;

      next();
    });
  }
};

module.exports = checkJwt;
