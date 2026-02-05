const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have access to protected data",
    userId: req.userId,
  });
});

module.exports = router;
