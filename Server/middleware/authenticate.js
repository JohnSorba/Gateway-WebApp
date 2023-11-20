require("dotenv").config();
const jwt = require("jsonwebtoken");

// Middleware to authenticate and set user from token

// function authenticateRole(role) {
//   return function (req, res, next) {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token)
//       return res.sendStatus(401).send("Access Denied: No Token Provided");

//     try {
//       const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
//       req.user = verified;

//       if (req.user.role !== role) {
//         return res.sendStatus(403).send("Access Denied: Incorrect Role!");
//       }

//       next();
//     } catch (err) {
//       res.sendStatus(400).send("Invalid Token");
//     }
//   };
// }

function authenticateToken(req, res, next) {
  const authHeader = req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("authHeader: ", authHeader);
  console.log("token: ", token);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });

  // try {
  //   const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //   req.user = verified;

  //   if (req.user.role !== role) {
  //     return res.sendStatus(403);
  //   }

  //   next();
  // } catch (err) {
  //   res.sendStatus(400);
  // }
}

module.exports = {
  authenticateToken,
};
