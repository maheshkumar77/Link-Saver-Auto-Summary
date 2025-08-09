const express = require("express");
const { signup, googleSignup, getUsers } = require("../controllers/authController");

const router = express.Router();

// Routes
router.post("/signup", signup);
router.post("/google-signup", googleSignup);
router.get("/users", getUsers);

module.exports = router;
