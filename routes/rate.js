const router = require("express").Router();

// middleware
const { authorize } = require("../middleware/auth");

// controllers
const { getUserToRateProduct } = require("../controller/rate");

// utils

// routes
router.get("/unrated", authorize, getUserToRateProduct);

module.exports = router;
