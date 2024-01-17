const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      role: user.role,
    },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = { createToken };
