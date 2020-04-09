const express = require("express");
const router = express.Router();
const {jsonResponse} = require('../controllers/json')

router.route("/").post(jsonResponse)
router.route("/json").post(jsonResponse)

module.exports = router;  