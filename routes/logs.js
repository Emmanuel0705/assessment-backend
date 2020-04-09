const express = require("express");
const router = express.Router();
const {logResponse} = require('../controllers/logs')

router.route("/").get(logResponse)

module.exports = router;