const express = require("express");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyToken"); // Replace with your middleware import
const admin = require("../config/firebaseAdmin"); // Replace with your import if necessary

const router = express.Router();

router.post("/register", userController.register); // This route should not be token-verified

router.use(verifyToken(admin)); // Apply the verifyToken middleware to the routes below
router.get("/search", userController.getUserSearch);
router.post("/search", userController.saveUserSearch);

module.exports = router;
