const jwt = require("jsonwebtoken");
const config = require("../ config");

module.exports = {
  verifyToken(req, res, next) {
    // If there's no token return 403
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token)
      return res.status(403).send("A token is required for authentication");

    // Decode the token
    try {
      const decoded = jwt.verify(token, config.jwtKey);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invlid token");
    }
    return next();
  },
};
